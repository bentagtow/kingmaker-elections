-- Users and lookup tables.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'New player',
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.parties (
  code text primary key,
  name text not null
);

create table public.offices (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  level text not null check (level in ('federal', 'state', 'local'))
);

create table public.positions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null
);

-- Which offices can fill which roster position.
create table public.position_offices (
  position_id uuid not null references public.positions (id) on delete cascade,
  office_id uuid not null references public.offices (id) on delete cascade,
  primary key (position_id, office_id)
);

create table public.event_types (
  code text primary key,
  name text not null,
  unit text check (unit in ('delegates', 'usd'))
);

insert into public.parties (code, name) values
  ('D', 'Democratic'),
  ('R', 'Republican'),
  ('I', 'Independent'),
  ('L', 'Libertarian'),
  ('G', 'Green');

insert into public.offices (name, level) values ('President', 'federal');

insert into public.positions (code, name) values ('PRES', 'President');

insert into public.position_offices (position_id, office_id)
select p.id, o.id
from public.positions p, public.offices o
where p.code = 'PRES' and o.name = 'President';

insert into public.event_types (code, name, unit) values
  ('declared', 'Officially declared', null),
  ('debate_qualified', 'Qualified for a debate', null),
  ('fundraising_quarter', 'Quarterly fundraising', 'usd'),
  ('contest_win', 'Won a contest', null),
  ('contest_place', 'Placed in a contest', null),
  ('delegates_won', 'Delegates won', 'delegates'),
  ('nomination_won', 'Won the nomination', null),
  ('general_won', 'Won the general election', null),
  ('general_lost', 'Lost the general election', null),
  ('withdrew', 'Withdrew', null),
  ('eliminated', 'Eliminated', null),
  ('survival_month', 'Survived a month', null),
  ('survival_contest', 'Survived a contest', null);
