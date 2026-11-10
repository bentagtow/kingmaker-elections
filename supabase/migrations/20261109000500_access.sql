-- Row-level security.

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

create function public.is_commissioner(p_league_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.leagues where id = p_league_id and commissioner_id = auth.uid()
  );
$$;

create function public.is_league_member(p_league_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_commissioner(p_league_id) or exists (
    select 1 from public.teams where league_id = p_league_id and user_id = auth.uid()
  );
$$;

create function public.can_read_league(p_league_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_admin() or public.is_league_member(p_league_id);
$$;

-- Settings can be edited only until the draft starts.
create function public.can_edit_league_setup(p_league_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (public.is_admin() or public.is_commissioner(p_league_id)) and exists (
    select 1 from public.leagues where id = p_league_id and status = 'setup'
  );
$$;

create function public.can_see_candidacy(p_candidacy_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.candidacies c
    where c.id = p_candidacy_id
      and (
        c.is_public
        or public.is_admin()
        or exists (
          select 1
          from public.league_candidacies lc
          where lc.candidacy_id = c.id and public.is_league_member(lc.league_id)
        )
      )
  );
$$;

create function public.can_see_person(p_person_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_admin() or exists (
    select 1
    from public.candidacies c
    where c.person_id = p_person_id and public.can_see_candidacy(c.id)
  );
$$;

create function public.shares_league(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.teams mine
    join public.teams theirs on theirs.league_id = mine.league_id
    where mine.user_id = auth.uid() and theirs.user_id = p_user_id
  );
$$;

-- What someone holding an invite code can see before joining.
create function public.league_preview(p_invite_code text)
returns table (league_name text, commissioner_name text, open_seats int)
language sql
stable
security definer
set search_path = ''
as $$
  select
    l.name,
    p.display_name,
    l.max_teams - (select count(*)::int from public.teams t where t.league_id = l.id)
  from public.leagues l
  join public.profiles p on p.id = l.commissioner_id
  where l.invite_code = p_invite_code;
$$;

create function public.set_admin(p_user_id uuid, p_is_admin boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'only admins can change admin status';
  end if;

  update public.profiles set is_admin = p_is_admin where id = p_user_id;
end;
$$;

revoke execute on function public.refresh_candidacy_status(uuid) from public, anon, authenticated;
revoke execute on function public.set_admin(uuid, boolean) from public, anon;

-- Grants start empty; each table opens only what the policies below allow.
revoke all on all tables in schema public from anon, authenticated;

alter table public.profiles enable row level security;
alter table public.parties enable row level security;
alter table public.offices enable row level security;
alter table public.positions enable row level security;
alter table public.position_offices enable row level security;
alter table public.event_types enable row level security;
alter table public.people enable row level security;
alter table public.races enable row level security;
alter table public.contests enable row level security;
alter table public.candidacies enable row level security;
alter table public.seasons enable row level security;
alter table public.leagues enable row level security;
alter table public.league_roster_slots enable row level security;
alter table public.league_party_requirements enable row level security;
alter table public.league_candidacies enable row level security;
alter table public.teams enable row level security;
alter table public.drafts enable row level security;
alter table public.draft_picks enable row level security;
alter table public.roster_entries enable row level security;
alter table public.events enable row level security;
alter table public.scoring_presets enable row level security;
alter table public.scoring_rules enable row level security;
alter table public.league_activity enable row level security;
alter table public.league_score_adjustments enable row level security;
alter table public.league_event_overrides enable row level security;
alter table public.odds_snapshots enable row level security;

-- Profiles: is_admin is changed only through set_admin.
grant select on public.profiles to authenticated;
grant update (display_name, avatar_url) on public.profiles to authenticated;

create policy profiles_read on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin() or public.shares_league(id));

create policy profiles_update_own on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Lookup tables: readable by everyone, changed only by migrations.
grant select on public.parties, public.offices, public.positions, public.position_offices, public.event_types
  to anon, authenticated;

create policy parties_read on public.parties for select to anon, authenticated using (true);
create policy offices_read on public.offices for select to anon, authenticated using (true);
create policy positions_read on public.positions for select to anon, authenticated using (true);
create policy position_offices_read on public.position_offices for select to anon, authenticated using (true);
create policy event_types_read on public.event_types for select to anon, authenticated using (true);

-- Races, contests, seasons, presets: public read, admin write.
grant select on public.races, public.contests, public.seasons, public.scoring_presets to anon, authenticated;
grant insert, update on public.races, public.contests, public.seasons, public.scoring_presets to authenticated;

create policy races_read on public.races for select to anon, authenticated using (true);
create policy races_admin_insert on public.races for insert to authenticated with check (public.is_admin());
create policy races_admin_update on public.races for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy contests_read on public.contests for select to anon, authenticated using (true);
create policy contests_admin_insert on public.contests for insert to authenticated with check (public.is_admin());
create policy contests_admin_update on public.contests for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy seasons_read on public.seasons for select to anon, authenticated using (true);
create policy seasons_admin_insert on public.seasons for insert to authenticated with check (public.is_admin());
create policy seasons_admin_update on public.seasons for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy scoring_presets_read on public.scoring_presets for select to anon, authenticated using (true);
create policy scoring_presets_admin_insert on public.scoring_presets for insert to authenticated
  with check (public.is_admin());
create policy scoring_presets_admin_update on public.scoring_presets for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- People and candidacies: wildcard picks are hidden outside the leagues that unlocked them.
grant select on public.people, public.candidacies to anon, authenticated;
grant insert, update on public.people to authenticated;
grant insert (person_id, race_id, party_code, is_public, manual_rank, fec_candidate_id, created_by)
  on public.candidacies to authenticated;
grant update (is_public, manual_rank, fec_candidate_id) on public.candidacies to authenticated;

create policy people_read on public.people for select to anon, authenticated
  using (public.can_see_person(id));
create policy people_admin_insert on public.people for insert to authenticated with check (public.is_admin());
create policy people_admin_update on public.people for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy candidacies_read on public.candidacies for select to anon, authenticated
  using (public.can_see_candidacy(id));
create policy candidacies_admin_insert on public.candidacies for insert to authenticated
  with check (public.is_admin());
create policy candidacies_admin_update on public.candidacies for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Events: admins and jobs record them; approval and supersession are the only edits; never deleted.
grant select on public.events to anon, authenticated;
grant insert (candidacy_id, event_type, contest_id, value, occurred_at, source, source_ref, review_status, created_by)
  on public.events to authenticated;
grant update (review_status, superseded_by) on public.events to authenticated;

create policy events_read on public.events for select to anon, authenticated
  using (public.is_admin() or (review_status = 'approved' and public.can_see_candidacy(candidacy_id)));
create policy events_admin_insert on public.events for insert to authenticated with check (public.is_admin());
create policy events_admin_update on public.events for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

grant select on public.odds_snapshots to anon, authenticated;

create policy odds_snapshots_read on public.odds_snapshots for select to anon, authenticated
  using (public.can_see_candidacy(candidacy_id));

-- Leagues: settings lock when the draft starts. Status is changed only by server functions.
grant select on public.leagues to authenticated;
grant insert (name, commissioner_id, season_id, max_teams) on public.leagues to authenticated;
grant update (name, season_id, max_teams) on public.leagues to authenticated;

create policy leagues_read on public.leagues for select to authenticated
  using (public.can_read_league(id));
create policy leagues_insert on public.leagues for insert to authenticated
  with check (commissioner_id = auth.uid());
create policy leagues_update on public.leagues for update to authenticated
  using (public.can_edit_league_setup(id))
  with check (public.can_edit_league_setup(id));

grant select, insert, update, delete on public.league_roster_slots, public.league_party_requirements to authenticated;

create policy league_roster_slots_read on public.league_roster_slots for select to authenticated
  using (public.can_read_league(league_id));
create policy league_roster_slots_insert on public.league_roster_slots for insert to authenticated
  with check (public.can_edit_league_setup(league_id));
create policy league_roster_slots_update on public.league_roster_slots for update to authenticated
  using (public.can_edit_league_setup(league_id))
  with check (public.can_edit_league_setup(league_id));
create policy league_roster_slots_delete on public.league_roster_slots for delete to authenticated
  using (public.can_edit_league_setup(league_id));

create policy league_party_requirements_read on public.league_party_requirements for select to authenticated
  using (public.can_read_league(league_id));
create policy league_party_requirements_insert on public.league_party_requirements for insert to authenticated
  with check (public.can_edit_league_setup(league_id));
create policy league_party_requirements_update on public.league_party_requirements for update to authenticated
  using (public.can_edit_league_setup(league_id))
  with check (public.can_edit_league_setup(league_id));
create policy league_party_requirements_delete on public.league_party_requirements for delete to authenticated
  using (public.can_edit_league_setup(league_id));

grant select on public.league_candidacies to authenticated;

create policy league_candidacies_read on public.league_candidacies for select to authenticated
  using (public.can_read_league(league_id));

-- Teams: commissioners manage CPU seats during setup. Humans join through a server function.
grant select on public.teams to authenticated;
grant insert (league_id, cpu_strategy, cpu_party_lean, name, draft_slot) on public.teams to authenticated;
grant update (cpu_strategy, cpu_party_lean, name, draft_slot) on public.teams to authenticated;
grant delete on public.teams to authenticated;

create policy teams_read on public.teams for select to authenticated
  using (public.can_read_league(league_id));
create policy teams_cpu_insert on public.teams for insert to authenticated
  with check (user_id is null and public.can_edit_league_setup(league_id));
create policy teams_cpu_update on public.teams for update to authenticated
  using (user_id is null and public.can_edit_league_setup(league_id))
  with check (user_id is null and public.can_edit_league_setup(league_id));
create policy teams_cpu_delete on public.teams for delete to authenticated
  using (user_id is null and public.can_edit_league_setup(league_id));

-- Drafts and rosters are written only by server functions.
grant select on public.drafts, public.draft_picks, public.roster_entries to authenticated;

create policy drafts_read on public.drafts for select to authenticated
  using (public.can_read_league(league_id));
create policy draft_picks_read on public.draft_picks for select to authenticated
  using (exists (select 1 from public.drafts d where d.id = draft_id and public.can_read_league(d.league_id)));
create policy roster_entries_read on public.roster_entries for select to authenticated
  using (public.can_read_league(league_id));

-- Scoring rules stay editable after the draft; changes post to the activity board.
grant select on public.scoring_rules to anon, authenticated;
grant insert, update, delete on public.scoring_rules to authenticated;

create policy scoring_rules_read on public.scoring_rules for select to anon, authenticated
  using (preset_id is not null or public.can_read_league(league_id));
create policy scoring_rules_insert on public.scoring_rules for insert to authenticated
  with check (
    case when preset_id is not null then public.is_admin()
      else public.is_admin() or public.is_commissioner(league_id) end
  );
create policy scoring_rules_update on public.scoring_rules for update to authenticated
  using (
    case when preset_id is not null then public.is_admin()
      else public.is_admin() or public.is_commissioner(league_id) end
  )
  with check (
    case when preset_id is not null then public.is_admin()
      else public.is_admin() or public.is_commissioner(league_id) end
  );
create policy scoring_rules_delete on public.scoring_rules for delete to authenticated
  using (
    case when preset_id is not null then public.is_admin()
      else public.is_admin() or public.is_commissioner(league_id) end
  );

-- Activity board: written only by triggers.
grant select on public.league_activity to authenticated;

create policy league_activity_read on public.league_activity for select to authenticated
  using (public.can_read_league(league_id));

grant select on public.league_score_adjustments, public.league_event_overrides to authenticated;
grant insert (league_id, team_id, points, reason, created_by) on public.league_score_adjustments to authenticated;
grant insert (league_id, event_id, action, override_value, reason, created_by)
  on public.league_event_overrides to authenticated;

create policy league_score_adjustments_read on public.league_score_adjustments for select to authenticated
  using (public.can_read_league(league_id));
create policy league_score_adjustments_insert on public.league_score_adjustments for insert to authenticated
  with check (created_by = auth.uid() and (public.is_admin() or public.is_commissioner(league_id)));

create policy league_event_overrides_read on public.league_event_overrides for select to authenticated
  using (public.can_read_league(league_id));
create policy league_event_overrides_insert on public.league_event_overrides for insert to authenticated
  with check (created_by = auth.uid() and (public.is_admin() or public.is_commissioner(league_id)));

grant select on public.team_event_points, public.team_scores to authenticated;
