-- Fix RLS policy for waitlist table to allow anonymous inserts

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public inserts" ON public.waitlist;
DROP POLICY IF EXISTS "Allow authenticated reads" ON public.waitlist;

-- Recreate the insert policy with explicit permissions for anonymous users
CREATE POLICY "Enable insert for anonymous users"
ON public.waitlist
FOR INSERT
TO anon
WITH CHECK (true);

-- Also allow authenticated users to insert
CREATE POLICY "Enable insert for authenticated users"
ON public.waitlist
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow only authenticated users to read (for admin dashboard)
CREATE POLICY "Enable read for authenticated users only"
ON public.waitlist
FOR SELECT
TO authenticated
USING (true);

-- Verify RLS is enabled
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Add helpful comment
COMMENT ON TABLE public.waitlist IS 'Waitlist signups - RLS allows anonymous inserts, authenticated reads only';
