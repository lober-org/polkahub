-- Create payouts table
CREATE TABLE IF NOT EXISTS public.payouts (
  id SERIAL PRIMARY KEY,
  contribution_id INTEGER NOT NULL REFERENCES public.contributions(id) ON DELETE CASCADE,
  recipient_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(20, 10) NOT NULL,
  wallet_address TEXT NOT NULL,
  tx_hash TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payouts_contribution ON public.payouts(contribution_id);
CREATE INDEX IF NOT EXISTS idx_payouts_recipient ON public.payouts(recipient_user_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON public.payouts(status);
CREATE INDEX IF NOT EXISTS idx_payouts_tx_hash ON public.payouts(tx_hash);

-- Enable Row Level Security
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- Users can view their own payouts
CREATE POLICY "Users can view own payouts" ON public.payouts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = recipient_user_id);

-- System can insert payouts (handled by service role)
CREATE POLICY "Service role can insert payouts" ON public.payouts
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- System can update payouts (handled by service role)
CREATE POLICY "Service role can update payouts" ON public.payouts
  FOR UPDATE
  TO service_role
  USING (true);

COMMENT ON TABLE public.payouts IS 'Cryptocurrency payouts to contributors';
