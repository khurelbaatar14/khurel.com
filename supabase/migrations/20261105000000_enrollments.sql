-- Who may watch which course. One row per (user, course); `course` is the folder name
-- under content/courses. Rows are written only with the secret key (QPay callback, or
-- by hand in the Table Editor to give someone free access); users can only read their own.
-- Safe to run more than once.

create table if not exists public.enrollments (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  course     text        not null,
  source     text        not null default 'manual', -- 'manual' | 'qpay'
  created_at timestamptz not null default now(),
  primary key (user_id, course)
);

alter table public.enrollments enable row level security;

drop policy if exists "Users read their own enrollments" on public.enrollments;
create policy "Users read their own enrollments"
  on public.enrollments for select
  to authenticated
  using ((select auth.uid()) = user_id);
