-- ============================================================
-- ABUSE PREVENTION — browser fingerprinting + IP rate limiting
-- Run in Supabase SQL editor
-- ============================================================

-- 1. Fingerprint column on profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS browser_fingerprint text;
CREATE INDEX IF NOT EXISTS idx_profiles_fingerprint ON public.profiles(browser_fingerprint);

-- 2. Signup attempts table (managed exclusively by server-side API; no RLS policies needed)
CREATE TABLE IF NOT EXISTS public.signup_attempts (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address   text        NOT NULL,
  attempted_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_signup_attempts_ip ON public.signup_attempts(ip_address, attempted_at);
ALTER TABLE public.signup_attempts ENABLE ROW LEVEL SECURITY;
-- No client-side access — service role key used in API only

-- 3. RPC: check if fingerprint already has an account (callable by anon, no auth needed)
CREATE OR REPLACE FUNCTION public.check_fingerprint_exists(fp text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.profiles
    WHERE browser_fingerprint = fp
      AND browser_fingerprint IS NOT NULL
      AND fp != ''
  );
$$;
GRANT EXECUTE ON FUNCTION public.check_fingerprint_exists(text) TO anon;

-- 4. RPC: save fingerprint after signup without requiring a session (email is lookup key)
--    Only sets fingerprint if profile has none — idempotent and safe
CREATE OR REPLACE FUNCTION public.set_pending_fingerprint(p_email text, fp text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.profiles
  SET browser_fingerprint = fp
  WHERE email = p_email
    AND browser_fingerprint IS NULL;
$$;
GRANT EXECUTE ON FUNCTION public.set_pending_fingerprint(text, text) TO anon;
