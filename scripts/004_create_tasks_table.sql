-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  github_issue_url TEXT NOT NULL UNIQUE,
  github_issue_number INTEGER NOT NULL,
  reward_amount DECIMAL(20, 10) NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  tags TEXT[],
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  escrow_status TEXT DEFAULT 'pending' CHECK (escrow_status IN ('pending', 'funded', 'released', 'refunded')),
  escrow_tx_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tasks_project ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_difficulty ON public.tasks(difficulty);
CREATE INDEX IF NOT EXISTS idx_tasks_escrow_status ON public.tasks(escrow_status);

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Everyone can view open tasks
CREATE POLICY "Open tasks are viewable by everyone" ON public.tasks
  FOR SELECT
  USING (true);

-- Project maintainers can insert tasks
CREATE POLICY "Maintainers can insert tasks" ON public.tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = tasks.project_id
      AND projects.maintainer_user_id = auth.uid()
    )
  );

-- Project maintainers can update their tasks
CREATE POLICY "Maintainers can update own tasks" ON public.tasks
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = tasks.project_id
      AND projects.maintainer_user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

COMMENT ON TABLE public.tasks IS 'Bounty tasks linked to GitHub issues';
