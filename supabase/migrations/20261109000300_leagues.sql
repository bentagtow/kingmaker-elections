-- Seasons, leagues, teams, drafts and rosters.

create table public.seasons (
  id uuid primary key default gen_random_uuid(),
  race_id uuid not null references public.races (id) on delete cascade,
  phase text not null check (phase in ('invisible_primary', 'primary', 'general', 'full_cycle')),
  name text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  unique (race_id, phase),
  check (starts_at < ends_at)
);

create table public.leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  commissioner_id uuid not null references public.profiles (id),
  season_id uuid not null references public.seasons (id),
  visibility text not null default 'private' check (visibility in ('private', 'public')),
  invite_code text not null unique default substr(replace(gen_random_uuid()::text, '-', ''), 1, 10),
  max_teams int not null check (max_teams between 2 and 8),
  status text not null default 'setup' check (status in ('setup', 'drafting', 'active', 'complete')),
  created_at timestamptz not null default now()
);

create index leagues_commissioner_id_idx on public.leagues (commissioner_id);

create table public.league_roster_slots (
  league_id uuid not null references public.leagues (id) on delete cascade,
  position_id uuid not null references public.positions (id),
  slot_count int not null check (slot_count > 0),
  primary key (league_id, position_id)
);

-- No rows for a league means an open draft.
create table public.league_party_requirements (
  league_id uuid not null references public.leagues (id) on delete cascade,
  party_code text not null references public.parties (code),
  min_picks int not null default 0 check (min_picks >= 0),
  max_picks int check (max_picks is null or max_picks >= min_picks),
  primary key (league_id, party_code)
);

-- Candidacies that aren't public but that this league has unlocked.
create table public.league_candidacies (
  league_id uuid not null references public.leagues (id) on delete cascade,
  candidacy_id uuid not null references public.candidacies (id) on delete cascade,
  added_by uuid references public.profiles (id) on delete set null,
  primary key (league_id, candidacy_id)
);

create index league_candidacies_candidacy_id_idx on public.league_candidacies (candidacy_id);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues (id) on delete cascade,
  user_id uuid references public.profiles (id),
  cpu_strategy text check (cpu_strategy in ('chalk', 'contrarian', 'partisan')),
  cpu_party_lean text references public.parties (code),
  name text not null,
  draft_slot int,
  created_at timestamptz not null default now(),
  unique (league_id, user_id),
  unique (league_id, draft_slot),
  check ((user_id is null) <> (cpu_strategy is null)),
  check (cpu_party_lean is null or cpu_strategy = 'partisan')
);

create index teams_user_id_idx on public.teams (user_id);

create table public.drafts (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null unique references public.leagues (id) on delete cascade,
  type text not null default 'snake' check (type in ('snake')),
  status text not null default 'scheduled' check (status in ('scheduled', 'live', 'complete')),
  pick_seconds int not null default 90 check (pick_seconds > 0),
  scheduled_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz
);

create table public.draft_picks (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null references public.drafts (id) on delete cascade,
  team_id uuid not null references public.teams (id) on delete cascade,
  candidacy_id uuid not null references public.candidacies (id),
  position_id uuid not null references public.positions (id),
  round int not null,
  overall_pick int not null,
  pick_source text not null check (pick_source in ('human', 'autodraft', 'cpu')),
  picked_at timestamptz not null default now(),
  unique (draft_id, candidacy_id),
  unique (draft_id, overall_pick)
);

create index draft_picks_team_id_idx on public.draft_picks (team_id);

create table public.roster_entries (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues (id) on delete cascade,
  team_id uuid not null references public.teams (id) on delete cascade,
  candidacy_id uuid not null references public.candidacies (id),
  position_id uuid not null references public.positions (id),
  acquired_at timestamptz not null,
  released_at timestamptz,
  acquired_via text not null default 'draft' check (acquired_via in ('draft', 'waiver', 'free_agent')),
  check (released_at is null or released_at > acquired_at)
);

-- One active holder per candidacy per league.
create unique index roster_entries_active_idx
  on public.roster_entries (league_id, candidacy_id)
  where released_at is null;

create index roster_entries_team_id_idx on public.roster_entries (team_id);
create index roster_entries_candidacy_id_idx on public.roster_entries (candidacy_id);
