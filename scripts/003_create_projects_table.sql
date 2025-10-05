-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  github_org TEXT NOT NULL,
  github_repo TEXT NOT NULL,
  website_url TEXT,
  logo_url TEXT,
  maintainer_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  total_tasks INTEGER DEFAULT 0,
  total_rewards DECIMAL(20, 10) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(github_org, github_repo)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_maintainer ON public.projects(maintainer_user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_github ON public.projects(github_org, github_repo);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Everyone can view active projects
CREATE POLICY "Active projects are viewable by everyone" ON public.projects
  FOR SELECT
  USING (status = 'active' OR auth.uid() = maintainer_user_id);

-- Maintainers can insert their own projects
CREATE POLICY "Maintainers can insert projects" ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = maintainer_user_id);

-- Maintainers can update their own projects
CREATE POLICY "Maintainers can update own projects" ON public.projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = maintainer_user_id)
  WITH CHECK (auth.uid() = maintainer_user_id);

-- Trigger for updated_at
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

COMMENT ON TABLE public.projects IS 'Open source projects offering bounties';
