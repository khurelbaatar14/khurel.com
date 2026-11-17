-- Texts on khurel.com/founders that are edited in the browser at /founders/edit, without a deploy.
-- The page falls back to the texts in lib/copy.ts for any key that has no row here.
create table public.site_copy (
  key text primary key,
  value text not null check (length(value) between 1 and 4000),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

-- Who may edit: a signed-in user with a row here.
create table public.copy_editors (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.site_copy enable row level security;
alter table public.copy_editors enable row level security;

create policy "Anyone can read the site copy"
  on public.site_copy for select
  using (true);

create policy "Editors can add copy"
  on public.site_copy for insert
  to authenticated
  with check (exists (select 1 from public.copy_editors e where e.user_id = auth.uid()));

create policy "Editors can change copy"
  on public.site_copy for update
  to authenticated
  using (exists (select 1 from public.copy_editors e where e.user_id = auth.uid()))
  with check (exists (select 1 from public.copy_editors e where e.user_id = auth.uid()));

-- An editor can see their own row, which is how /founders/edit checks access.
create policy "Editors can see themselves"
  on public.copy_editors for select
  to authenticated
  using (user_id = auth.uid());

-- To make someone an editor (they must have signed in on khurel.com once):
--   insert into public.copy_editors (user_id) select id from auth.users where email = '<their email>';
