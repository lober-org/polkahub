-- Create contributions table
CREATE TABLE IF NOT EXISTS public.contributions (
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  contributor_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  github_pr_url TEXT NOT NULL UNIQUE,
  github_pr_number INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'merged')),
  review_notes TEXT,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contributions_task ON public.contributions(task_id);
CREATE INDEX IF NOT EXISTS idx_contributions_contributor ON public.contributions(contributor_user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON public.contributions(status);

-- Enable Row Level Security
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

-- Everyone can view contributions
CREATE POLICY "Contributions are viewable by everyone" ON public.contributions
  FOR SELECT
  USING (true);

-- Contributors can insert their own contributions
CREATE POLICY "Contributors can insert contributions" ON public.contributions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = contributor_user_id);

-- Maintainers can update contributions for their tasks
CREATE POLICY "Maintainers can update contributions" ON public.contributions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks
      JOIN public.projects ON projects.id = tasks.project_id
      WHERE tasks.id = contributions.task_id
      AND projects.maintainer_user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_contributions_updated_at
  BEFORE UPDATE ON public.contributions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

COMMENT ON TABLE public.contributions IS 'Pull request submissions for tasks';
