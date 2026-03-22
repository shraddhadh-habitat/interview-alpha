-- ─────────────────────────────────────────────────────────
-- Part 2 Migration: practice_attempts + has_seen_demo
-- Run this in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────

-- 1. Add has_seen_demo to profiles
alter table public.profiles
  add column if not exists has_seen_demo boolean default false;

-- 2. Create practice_attempts table
create table if not exists public.practice_attempts (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  question_id          text not null,
  designation          text not null,
  category             text not null,
  attempt_number       integer not null default 1,
  user_answer          text not null,
  score                integer,
  competency_breakdown jsonb,
  strengths            jsonb,
  weaknesses           jsonb,
  filler_words         jsonb,
  high_signal_keywords jsonb,
  missing_concepts     jsonb,
  expert_rewrite       text,
  improvement_tips     jsonb,
  feedback_text        text,
  from_voice           boolean default false,
  created_at           timestamptz default now()
);

-- 3. Index for fast lookups
create index if not exists practice_attempts_user_id_idx
  on public.practice_attempts(user_id);

create index if not exists practice_attempts_question_idx
  on public.practice_attempts(user_id, question_id);

-- 4. RLS
alter table public.practice_attempts enable row level security;

create policy "Users can read own practice attempts"
  on public.practice_attempts for select
  using (auth.uid() = user_id);

create policy "Users can insert own practice attempts"
  on public.practice_attempts for insert
  with check (auth.uid() = user_id);
