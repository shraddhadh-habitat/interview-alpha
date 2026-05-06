-- ============================================================
-- Admin RPC Functions
-- Run in Supabase SQL editor
-- ============================================================

-- Create reviews table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  user_email text NOT NULL,
  display_name text NOT NULL,
  show_name boolean DEFAULT true,
  rating integer NOT NULL,
  review_text text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS: users can read own reviews
CREATE POLICY "Users can read own reviews"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS: users can insert own reviews
CREATE POLICY "Users can insert own reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Get all users (for admin panel)
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE (
  id uuid,
  email text,
  display_name text,
  subscription_status text,
  subscription_plan text,
  subscription_expires_at timestamptz,
  free_sessions_used integer,
  monthly_sessions_used integer,
  last_seen_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    id,
    email,
    display_name,
    subscription_status,
    subscription_plan,
    subscription_expires_at,
    free_sessions_used,
    monthly_sessions_used,
    last_seen_at
  FROM public.profiles
  ORDER BY last_seen_at DESC NULLS LAST;
$$;

-- Get admin stats
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS TABLE (
  pending_payments integer,
  active_pro integer,
  total_users integer
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT COUNT(*) FROM public.payment_requests WHERE status = 'pending')::integer as pending_payments,
    (SELECT COUNT(*) FROM public.profiles WHERE subscription_status = 'active')::integer as active_pro,
    (SELECT COUNT(*) FROM public.profiles)::integer as total_users;
$$;

-- Get all reviews
CREATE OR REPLACE FUNCTION public.get_all_reviews()
RETURNS TABLE (
  id uuid,
  display_name text,
  show_name boolean,
  user_email text,
  rating integer,
  review_text text,
  status text,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    id,
    display_name,
    show_name,
    user_email,
    rating,
    review_text,
    status,
    created_at
  FROM public.reviews
  ORDER BY created_at DESC;
$$;

-- Admin: update review status
CREATE OR REPLACE FUNCTION public.admin_update_review_status(review_id uuid, new_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.reviews
  SET status = new_status
  WHERE id = review_id;
END;
$$;

-- Admin: delete review
CREATE OR REPLACE FUNCTION public.admin_delete_review(review_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.reviews
  WHERE id = review_id;
END;
$$;

-- Grant execute to authenticated users (admin only in practice via email check in app)
GRANT EXECUTE ON FUNCTION public.get_all_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_reviews() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_review_status(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_review(uuid) TO authenticated;
