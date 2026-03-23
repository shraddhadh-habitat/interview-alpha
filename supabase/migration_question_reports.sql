-- Migration: create question_reports table
-- Run this in the Supabase SQL editor or via supabase db push

create table public.question_reports (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        references auth.users not null,
  question_id text        not null,
  report_text text        not null,
  created_at  timestamptz default now()
);

alter table public.question_reports enable row level security;

-- Users can insert their own reports only
create policy "Users can insert their own reports"
  on public.question_reports
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- (Optional) Users can view their own reports
create policy "Users can view their own reports"
  on public.question_reports
  for select
  to authenticated
  using (auth.uid() = user_id);
