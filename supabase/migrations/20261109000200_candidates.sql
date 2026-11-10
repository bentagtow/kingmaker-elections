-- People, races, contests and candidacies.

create table public.people (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  wikidata_id text unique,
  birth_date date,
  photo_url text,
  wikipedia_title text,
  summary_text text,
  summary_url text,
  summary_fetched_at timestamptz,
  verified boolean not null default false,
  home_party text references public.parties (code),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.races (
  id uuid primary key default gen_random_uuid(),
  office_id uuid not null references public.offices (id),
  cycle int not null,
  state text,
  district text,
  name text not null unique,
  general_date date not null
);

create table public.contests (
  id uuid primary key default gen_random_uuid(),
  race_id uuid not null references public.races (id) on delete cascade,
  kind text not null check (kind in ('primary', 'caucus', 'general')),
  party_code text references public.parties (code),
  state text,
  contest_date date not null,
  delegates_available int,
  name text not null,
  check ((kind = 'general') = (party_code is null))
);

create index contests_race_id_idx on public.contests (race_id);

create table public.candidacies (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people (id) on delete cascade,
  race_id uuid not null references public.races (id) on delete cascade,
  party_code text not null references public.parties (code),
  -- status, declared_at and ended_at are a cache of the event log.
  -- Only refresh_candidacy_status writes them.
  status text not null default 'speculative' check (
    status in ('speculative', 'declared', 'nominee', 'won', 'lost', 'eliminated', 'withdrawn')
  ),
  declared_at timestamptz,
  ended_at timestamptz,
  fec_candidate_id text,
  is_public boolean not null default true,
  manual_rank int,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (person_id, race_id, party_code)
);

create index candidacies_race_id_idx on public.candidacies (race_id);
