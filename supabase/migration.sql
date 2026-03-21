-- ─────────────────────────────────────────────────────────────────
-- InterviewAlpha — full database migration
-- Run this in Supabase SQL Editor (Project → SQL Editor → New Query)
-- ─────────────────────────────────────────────────────────────────


-- ─── 1. PROFILES ────────────────────────────────────────────────

create table if not exists public.profiles (
  id               uuid        references auth.users on delete cascade primary key,
  email            text,
  resume           text,
  job_description  text,
  target_company   text,
  updated_at       timestamptz default now()
);

-- Index for fast lookups
create index if not exists profiles_id_idx on public.profiles(id);

-- RLS
alter table public.profiles enable row level security;

create policy "profiles: users read own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: users insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles: users update own"
  on public.profiles for update
  using (auth.uid() = id);


-- ─── 2. AUTO-CREATE PROFILE ON SIGNUP ───────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ─── 3. SESSIONS ────────────────────────────────────────────────

create table if not exists public.sessions (
  id                    uuid        default gen_random_uuid() primary key,
  user_id               uuid        references auth.users on delete cascade not null,
  track                 text        not null,
  overall_score         integer,
  competency_breakdown  jsonb,
  detected_filler_words jsonb,
  high_signal_keywords  jsonb,
  alpha_rewrite         text,
  next_drill            text,
  messages              jsonb,
  created_at            timestamptz default now()
);

-- Indexes
create index if not exists sessions_user_id_idx   on public.sessions(user_id);
create index if not exists sessions_created_at_idx on public.sessions(created_at desc);
create index if not exists sessions_score_idx      on public.sessions(overall_score desc);

-- RLS
alter table public.sessions enable row level security;

create policy "sessions: users read own"
  on public.sessions for select
  using (auth.uid() = user_id);

create policy "sessions: users insert own"
  on public.sessions for insert
  with check (auth.uid() = user_id);


-- ─── 4. LEADERBOARD FUNCTION (security definer bypasses RLS) ────
-- Called via supabase.rpc('get_leaderboard')

create or replace function public.get_leaderboard()
returns table (
  email          text,
  best_score     integer,
  avg_score      integer,
  total_sessions bigint,
  rank           bigint
)
language sql
security definer
set search_path = public
as $$
  select
    p.email,
    max(s.overall_score)::integer                  as best_score,
    round(avg(s.overall_score))::integer           as avg_score,
    count(s.id)                                    as total_sessions,
    rank() over (order by max(s.overall_score) desc) as rank
  from public.sessions s
  join public.profiles p on p.id = s.user_id
  where s.overall_score is not null
  group by p.id, p.email
  having count(s.id) >= 1
  order by best_score desc;
$$;

-- Grant execute to authenticated users
grant execute on function public.get_leaderboard() to authenticated;
