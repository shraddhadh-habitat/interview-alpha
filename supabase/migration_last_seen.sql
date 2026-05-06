-- Migration: track last accessed timestamp
-- Run this in the Supabase SQL editor or via supabase db push

-- ─── Add last_seen_at column to profiles ───
alter table public.profiles
  add column if not exists last_seen_at timestamptz;

-- ─── Create index for sorting ───
create index if not exists idx_profiles_last_seen_at on public.profiles(last_seen_at desc nulls last);
