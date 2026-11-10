-- Event log, scoring rules, activity board, overrides, odds and computed points.

create table public.events (
  id uuid primary key default gen_random_uuid(),
  candidacy_id uuid not null references public.candidacies (id) on delete cascade,
  event_type text not null references public.event_types (code),
  contest_id uuid references public.contests (id),
  value numeric,
  occurred_at timestamptz not null,
  source text not null check (source in ('fec', 'admin', 'system', 'ap')),
  source_ref text,
  review_status text not null default 'pending' check (review_status in ('pending', 'approved', 'rejected')),
  superseded_by uuid references public.events (id),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index events_candidacy_id_idx on public.events (candidacy_id);

create table public.scoring_presets (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text
);

create table public.scoring_rules (
  id uuid primary key default gen_random_uuid(),
  league_id uuid references public.leagues (id) on delete cascade,
  preset_id uuid references public.scoring_presets (id) on delete cascade,
  event_type text not null references public.event_types (code),
  rule_kind text not null check (rule_kind in ('flat', 'per_unit')),
  points numeric not null,
  unit_size numeric,
  unique (league_id, event_type),
  unique (preset_id, event_type),
  check ((league_id is null) <> (preset_id is null)),
  check (rule_kind = 'flat' or unit_size > 0)
);

create table public.league_activity (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues (id) on delete cascade,
  actor_id uuid references public.profiles (id) on delete set null,
  activity_type text not null check (
    activity_type in ('rule_changed', 'score_adjusted', 'event_overridden', 'override_lapsed')
  ),
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index league_activity_league_id_idx on public.league_activity (league_id, created_at desc);

create table public.league_score_adjustments (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues (id) on delete cascade,
  team_id uuid not null references public.teams (id) on delete cascade,
  points numeric not null,
  reason text not null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index league_score_adjustments_team_id_idx on public.league_score_adjustments (team_id);

create table public.league_event_overrides (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues (id) on delete cascade,
  event_id uuid not null references public.events (id) on delete cascade,
  action text not null check (action in ('exclude', 'set_value')),
  override_value numeric,
  reason text not null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (league_id, event_id),
  check ((action = 'set_value') = (override_value is not null))
);

create table public.odds_snapshots (
  id uuid primary key default gen_random_uuid(),
  candidacy_id uuid not null references public.candidacies (id) on delete cascade,
  source text not null check (source in ('kalshi', 'polymarket')),
  market_ref text not null,
  probability numeric not null check (probability between 0 and 1),
  captured_at timestamptz not null default now()
);

create index odds_snapshots_candidacy_id_idx on public.odds_snapshots (candidacy_id, captured_at desc);

-- The only writer of the cached status columns on candidacies.
create function public.refresh_candidacy_status(p_candidacy_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  latest record;
  first_declared timestamptz;
begin
  select min(occurred_at) into first_declared
  from public.events
  where candidacy_id = p_candidacy_id
    and event_type = 'declared'
    and review_status = 'approved'
    and superseded_by is null;

  select event_type, occurred_at into latest
  from public.events
  where candidacy_id = p_candidacy_id
    and event_type in ('declared', 'nomination_won', 'general_won', 'general_lost', 'withdrew', 'eliminated')
    and review_status = 'approved'
    and superseded_by is null
  order by occurred_at desc, created_at desc
  limit 1;

  update public.candidacies
  set
    declared_at = first_declared,
    status = case latest.event_type
      when 'declared' then 'declared'
      when 'nomination_won' then 'nominee'
      when 'general_won' then 'won'
      when 'general_lost' then 'lost'
      when 'withdrew' then 'withdrawn'
      when 'eliminated' then 'eliminated'
      else 'speculative'
    end,
    ended_at = case
      when latest.event_type in ('general_won', 'general_lost', 'withdrew', 'eliminated') then latest.occurred_at
    end
  where id = p_candidacy_id;
end;
$$;

create function public.on_event_changed()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.refresh_candidacy_status(new.candidacy_id);

  -- An override stays on the event version it was made on, so it stops applying here.
  if tg_op = 'UPDATE' and old.superseded_by is null and new.superseded_by is not null then
    insert into public.league_activity (league_id, activity_type, details)
    select o.league_id, 'override_lapsed', jsonb_build_object('event_id', new.id, 'override_id', o.id)
    from public.league_event_overrides o
    where o.event_id = new.id;
  end if;

  return new;
end;
$$;

create trigger events_changed
  after insert or update of review_status, superseded_by on public.events
  for each row execute function public.on_event_changed();

create function public.log_rule_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  rule public.scoring_rules;
begin
  rule := coalesce(new, old);

  if rule.league_id is not null and exists (
    select 1 from public.leagues where id = rule.league_id and status <> 'setup'
  ) then
    insert into public.league_activity (league_id, actor_id, activity_type, details)
    values (
      rule.league_id,
      auth.uid(),
      'rule_changed',
      jsonb_build_object(
        'event_type', rule.event_type,
        'old', case when tg_op <> 'INSERT' then to_jsonb(old) end,
        'new', case when tg_op <> 'DELETE' then to_jsonb(new) end,
        'rescores_season', true
      )
    );
  end if;

  return rule;
end;
$$;

create trigger scoring_rules_changed
  after insert or update or delete on public.scoring_rules
  for each row execute function public.log_rule_change();

create function public.log_score_adjustment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.league_activity (league_id, actor_id, activity_type, details)
  values (
    new.league_id,
    new.created_by,
    'score_adjusted',
    jsonb_build_object('team_id', new.team_id, 'points', new.points, 'reason', new.reason)
  );
  return new;
end;
$$;

create trigger league_score_adjustments_logged
  after insert on public.league_score_adjustments
  for each row execute function public.log_score_adjustment();

create function public.log_event_override()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.league_activity (league_id, actor_id, activity_type, details)
  values (
    new.league_id,
    new.created_by,
    'event_overridden',
    jsonb_build_object(
      'event_id', new.event_id,
      'action', new.action,
      'override_value', new.override_value,
      'reason', new.reason
    )
  );
  return new;
end;
$$;

create trigger league_event_overrides_logged
  after insert on public.league_event_overrides
  for each row execute function public.log_event_override();

-- Points are computed from the event log, never stored.
create view public.team_event_points
with (security_invoker = true)
as
select
  re.league_id,
  re.team_id,
  re.candidacy_id,
  e.id as event_id,
  e.event_type,
  e.occurred_at,
  case r.rule_kind
    when 'flat' then r.points
    else coalesce(o.override_value, e.value, 0) / r.unit_size * r.points
  end as points
from public.roster_entries re
join public.leagues l on l.id = re.league_id
join public.seasons s on s.id = l.season_id
join public.events e on e.candidacy_id = re.candidacy_id
join public.scoring_rules r on r.league_id = re.league_id and r.event_type = e.event_type
left join public.league_event_overrides o on o.league_id = re.league_id and o.event_id = e.id
where e.review_status = 'approved'
  and e.superseded_by is null
  and e.occurred_at >= re.acquired_at
  and (re.released_at is null or e.occurred_at < re.released_at)
  and e.occurred_at < s.ends_at
  and o.action is distinct from 'exclude';

create view public.team_scores
with (security_invoker = true)
as
select
  t.league_id,
  t.id as team_id,
  coalesce((select sum(p.points) from public.team_event_points p where p.team_id = t.id), 0)
    + coalesce((select sum(a.points) from public.league_score_adjustments a where a.team_id = t.id), 0) as total_points
from public.teams t;
