-- Migration: freemium paywall system
-- Run this in the Supabase SQL editor or via supabase db push

-- ─── Add columns to profiles ───
alter table public.profiles
  add column if not exists free_sessions_used        integer      default 0,
  add column if not exists monthly_sessions_used     integer      default 0,
  add column if not exists monthly_sessions_reset_at timestamptz  null,
  add column if not exists subscription_status       text         default 'free',
  add column if not exists subscription_plan         text         null,
  add column if not exists subscription_expires_at   timestamptz  null,
  add column if not exists payment_upi_ref           text         null,
  add column if not exists payment_submitted_at      timestamptz  null;

-- ─── Create payment_requests table ───
create table if not exists public.payment_requests (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        references auth.users not null,
  user_email   text        not null,
  plan         text        not null,       -- 'monthly' | 'yearly'
  amount_inr   integer     not null,
  upi_ref      text        not null,
  status       text        not null default 'pending',  -- 'pending' | 'approved' | 'rejected'
  submitted_at timestamptz default now(),
  reviewed_at  timestamptz null,
  reviewed_by  text        null,
  admin_note   text        null
);

alter table public.payment_requests enable row level security;

create policy "Users can insert payment requests"
  on public.payment_requests
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can view their own payment requests"
  on public.payment_requests
  for select
  to authenticated
  using (auth.uid() = user_id);

-- ─── Indexes ───
create index if not exists idx_payment_requests_user_id on public.payment_requests(user_id);
create index if not exists idx_payment_requests_status  on public.payment_requests(status);

-- ─── Admin: approve payment ───
create or replace function public.approve_payment(request_id uuid, admin_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  req    public.payment_requests%rowtype;
  expiry timestamptz;
begin
  if (select email from auth.users where id = auth.uid()) != admin_email then
    raise exception 'Unauthorized';
  end if;

  select * into req from public.payment_requests where id = request_id;
  if not found then raise exception 'Request not found'; end if;

  expiry := case when req.plan = 'yearly'
                 then now() + interval '1 year'
                 else now() + interval '1 month' end;

  update public.payment_requests
    set status = 'approved', reviewed_at = now(), reviewed_by = admin_email
  where id = request_id;

  update public.profiles
    set subscription_status       = 'active',
        subscription_plan         = req.plan,
        subscription_expires_at   = expiry,
        payment_upi_ref           = req.upi_ref,
        monthly_sessions_used     = 0,
        monthly_sessions_reset_at = now()
  where id = req.user_id;
end;
$$;

-- ─── Admin: reject payment ───
create or replace function public.reject_payment(
  request_id uuid,
  admin_email text,
  note       text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  req public.payment_requests%rowtype;
begin
  if (select email from auth.users where id = auth.uid()) != admin_email then
    raise exception 'Unauthorized';
  end if;

  select * into req from public.payment_requests where id = request_id;
  if not found then raise exception 'Request not found'; end if;

  update public.payment_requests
    set status = 'rejected', reviewed_at = now(), reviewed_by = admin_email, admin_note = note
  where id = request_id;

  update public.profiles
    set subscription_status = 'free'
  where id = req.user_id;
end;
$$;
