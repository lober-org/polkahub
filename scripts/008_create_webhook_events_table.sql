-- Create webhook_events table
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id SERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  github_delivery_id TEXT UNIQUE,
  processed BOOLEAN DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_webhook_event_type ON public.webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_processed ON public.webhook_events(processed);
CREATE INDEX IF NOT EXISTS idx_webhook_created_at ON public.webhook_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_github_delivery ON public.webhook_events(github_delivery_id);

-- Enable Row Level Security
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Only service role can access webhook events
CREATE POLICY "Service role can manage webhook events" ON public.webhook_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE public.webhook_events IS 'GitHub webhook event logs for debugging and processing';
