-- Create escrow_transactions table
CREATE TABLE IF NOT EXISTS public.escrow_transactions (
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  tx_hash TEXT NOT NULL UNIQUE,
  amount DECIMAL(20, 10) NOT NULL,
  from_address TEXT NOT NULL,
  to_address TEXT,
  tx_type TEXT NOT NULL CHECK (tx_type IN ('deposit', 'release', 'refund')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  block_number BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_escrow_task ON public.escrow_transactions(task_id);
CREATE INDEX IF NOT EXISTS idx_escrow_tx_hash ON public.escrow_transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_escrow_status ON public.escrow_transactions(status);
CREATE INDEX IF NOT EXISTS idx_escrow_type ON public.escrow_transactions(tx_type);

-- Enable Row Level Security
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;

-- Everyone can view escrow transactions (transparency)
CREATE POLICY "Escrow transactions are viewable by everyone" ON public.escrow_transactions
  FOR SELECT
  USING (true);

-- System can insert transactions (handled by service role)
CREATE POLICY "Service role can insert transactions" ON public.escrow_transactions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- System can update transactions (handled by service role)
CREATE POLICY "Service role can update transactions" ON public.escrow_transactions
  FOR UPDATE
  TO service_role
  USING (true);

COMMENT ON TABLE public.escrow_transactions IS 'Blockchain escrow transactions for task rewards';
