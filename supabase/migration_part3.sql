-- Add subscription fields to profiles
alter table public.profiles
  add column if not exists subscription_status text default 'free',
  add column if not exists free_sessions_used  integer default 0;
