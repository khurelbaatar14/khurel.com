-- One row per checkout attempt, each with its own QPay invoice. Written only with the
-- secret key (lib/orders.ts); buyers can read their own rows to see the QR and status.
-- Safe to run more than once.

create table if not exists public.orders (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users (id) on delete cascade,
  course      text        not null,
  amount      integer     not null,                  -- MNT
  status      text        not null default 'pending', -- 'pending' | 'paid'
  invoice_id  text        unique,                    -- QPay invoice
  qr_image    text,                                  -- base64 PNG from QPay
  qr_text     text,
  links       jsonb,                                 -- bank-app deep links from QPay
  payment_id  text,
  checked_at  timestamptz,                           -- last payment/check call to QPay
  created_at  timestamptz not null default now(),
  paid_at     timestamptz
);

create index if not exists orders_user_course on public.orders (user_id, course, created_at desc);

alter table public.orders enable row level security;

drop policy if exists "Users read their own orders" on public.orders;
create policy "Users read their own orders"
  on public.orders for select
  to authenticated
  using ((select auth.uid()) = user_id);
