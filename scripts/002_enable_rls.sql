-- Enable Row Level Security on all tables
-- This ensures users can only access data they're authorized to see

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Anyone can view active projects"
  ON public.projects FOR SELECT
  USING (is_active = true);

CREATE POLICY "Maintainers can insert their own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = maintainer_user_id);

CREATE POLICY "Maintainers can update their own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = maintainer_user_id);

CREATE POLICY "Maintainers can delete their own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = maintainer_user_id);

-- Tasks policies
CREATE POLICY "Anyone can view open tasks"
  ON public.tasks FOR SELECT
  USING (true);

CREATE POLICY "Project maintainers can insert tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = tasks.project_id
      AND projects.maintainer_user_id = auth.uid()
    )
  );

CREATE POLICY "Project maintainers can update their tasks"
  ON public.tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = tasks.project_id
      AND projects.maintainer_user_id = auth.uid()
    )
  );

-- Contributions policies
CREATE POLICY "Anyone can view contributions"
  ON public.contributions FOR SELECT
  USING (true);

CREATE POLICY "Contributors can insert their own contributions"
  ON public.contributions FOR INSERT
  WITH CHECK (auth.uid() = contributor_user_id);

CREATE POLICY "Contributors can view their own contributions"
  ON public.contributions FOR SELECT
  USING (auth.uid() = contributor_user_id);

-- Payouts policies
CREATE POLICY "Users can view their own payouts"
  ON public.payouts FOR SELECT
  USING (auth.uid() = recipient_user_id);

-- Profiles policies
CREATE POLICY "Anyone can view profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Escrow transactions policies
CREATE POLICY "Anyone can view escrow transactions"
  ON public.escrow_transactions FOR SELECT
  USING (true);

-- Webhook events policies (admin only - no public access)
CREATE POLICY "No public access to webhooks"
  ON public.webhook_events FOR SELECT
  USING (false);
