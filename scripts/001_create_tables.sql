-- PolkaHub Database Schema
-- Creates all tables for the platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table: stores GitHub repositories registered on the platform
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  github_repo_url TEXT NOT NULL UNIQUE,
  github_repo_name TEXT NOT NULL,
  github_owner TEXT NOT NULL,
  description TEXT,
  website_url TEXT,
  logo_url TEXT,
  maintainer_user_id UUID NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_maintainer FOREIGN KEY (maintainer_user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tasks table: stores GitHub Issues published as bounties
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL,
  github_issue_number INTEGER NOT NULL,
  github_issue_url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  reward_amount_dot DECIMAL(18, 8) NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'under_review', 'completed', 'cancelled')),
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  tags TEXT[],
  escrow_address TEXT,
  escrow_status TEXT DEFAULT 'pending' CHECK (escrow_status IN ('pending', 'locked', 'released', 'refunded')),
  assigned_to_user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_assigned_user FOREIGN KEY (assigned_to_user_id) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT unique_project_issue UNIQUE (project_id, github_issue_number)
);

-- Contributions table: tracks developer work on tasks
CREATE TABLE IF NOT EXISTS public.contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL,
  contributor_user_id UUID NOT NULL,
  github_pr_number INTEGER NOT NULL,
  github_pr_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'merged', 'rejected')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  merged_at TIMESTAMPTZ,
  CONSTRAINT fk_task FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE,
  CONSTRAINT fk_contributor FOREIGN KEY (contributor_user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT unique_task_pr UNIQUE (task_id, github_pr_number)
);

-- Payouts table: records completed payments to contributors
CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contribution_id UUID NOT NULL,
  recipient_user_id UUID NOT NULL,
  amount_dot DECIMAL(18, 8) NOT NULL,
  recipient_wallet_address TEXT NOT NULL,
  transaction_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  CONSTRAINT fk_contribution FOREIGN KEY (contribution_id) REFERENCES public.contributions(id) ON DELETE CASCADE,
  CONSTRAINT fk_recipient FOREIGN KEY (recipient_user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- User profiles table: extends auth.users with platform-specific data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  github_username TEXT UNIQUE,
  github_id TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  wallet_address TEXT,
  role TEXT DEFAULT 'developer' CHECK (role IN ('developer', 'maintainer', 'both')),
  total_earned_dot DECIMAL(18, 8) DEFAULT 0,
  total_contributions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Escrow transactions table: tracks on-chain escrow operations
CREATE TABLE IF NOT EXISTS public.escrow_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('lock', 'release', 'refund')),
  amount_dot DECIMAL(18, 8) NOT NULL,
  from_address TEXT,
  to_address TEXT,
  transaction_hash TEXT,
  block_number BIGINT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  CONSTRAINT fk_escrow_task FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE
);

-- Webhook events table: logs GitHub webhook deliveries
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  github_delivery_id TEXT UNIQUE,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_maintainer ON public.projects(maintainer_user_id);
CREATE INDEX IF NOT EXISTS idx_projects_active ON public.projects(is_active);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON public.tasks(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_task ON public.contributions(task_id);
CREATE INDEX IF NOT EXISTS idx_contributions_contributor ON public.contributions(contributor_user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON public.contributions(status);
CREATE INDEX IF NOT EXISTS idx_payouts_recipient ON public.payouts(recipient_user_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON public.payouts(status);
CREATE INDEX IF NOT EXISTS idx_profiles_github ON public.profiles(github_username);
CREATE INDEX IF NOT EXISTS idx_escrow_task ON public.escrow_transactions(task_id);
CREATE INDEX IF NOT EXISTS idx_webhook_processed ON public.webhook_events(processed);
