
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "candidacies": {
                  Row: {
                    "created_at": string,"created_by": string | null,"declared_at": string | null,"ended_at": string | null,"fec_candidate_id": string | null,"id": string,"is_public": boolean,"manual_rank": number | null,"party_code": string,"person_id": string,"race_id": string,"status": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"created_by"?: string | null,"declared_at"?: string | null,"ended_at"?: string | null,"fec_candidate_id"?: string | null,"id"?: string,"is_public"?: boolean,"manual_rank"?: number | null,"party_code": string,"person_id": string,"race_id": string,"status"?: string
                  }
                  Update: {
                    "created_at"?: string,"created_by"?: string | null,"declared_at"?: string | null,"ended_at"?: string | null,"fec_candidate_id"?: string | null,"id"?: string,"is_public"?: boolean,"manual_rank"?: number | null,"party_code"?: string,"person_id"?: string,"race_id"?: string,"status"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "candidacies_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "candidacies_party_code_fkey"
      columns: ["party_code"]
isOneToOne: false
      referencedRelation: "parties"
      referencedColumns: ["code"]
    },{
      foreignKeyName: "candidacies_person_id_fkey"
      columns: ["person_id"]
isOneToOne: false
      referencedRelation: "people"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "candidacies_race_id_fkey"
      columns: ["race_id"]
isOneToOne: false
      referencedRelation: "races"
      referencedColumns: ["id"]
    }
                  ]
                },"contests": {
                  Row: {
                    "contest_date": string,"delegates_available": number | null,"id": string,"kind": string,"name": string,"party_code": string | null,"race_id": string,"state": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "contest_date": string,"delegates_available"?: number | null,"id"?: string,"kind": string,"name": string,"party_code"?: string | null,"race_id": string,"state"?: string | null
                  }
                  Update: {
                    "contest_date"?: string,"delegates_available"?: number | null,"id"?: string,"kind"?: string,"name"?: string,"party_code"?: string | null,"race_id"?: string,"state"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "contests_party_code_fkey"
      columns: ["party_code"]
isOneToOne: false
      referencedRelation: "parties"
      referencedColumns: ["code"]
    },{
      foreignKeyName: "contests_race_id_fkey"
      columns: ["race_id"]
isOneToOne: false
      referencedRelation: "races"
      referencedColumns: ["id"]
    }
                  ]
                },"draft_picks": {
                  Row: {
                    "candidacy_id": string,"draft_id": string,"id": string,"overall_pick": number,"pick_source": string,"picked_at": string,"position_id": string,"round": number,"team_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "candidacy_id": string,"draft_id": string,"id"?: string,"overall_pick": number,"pick_source": string,"picked_at"?: string,"position_id": string,"round": number,"team_id": string
                  }
                  Update: {
                    "candidacy_id"?: string,"draft_id"?: string,"id"?: string,"overall_pick"?: number,"pick_source"?: string,"picked_at"?: string,"position_id"?: string,"round"?: number,"team_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "draft_picks_candidacy_id_fkey"
      columns: ["candidacy_id"]
isOneToOne: false
      referencedRelation: "candidacies"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "draft_picks_draft_id_fkey"
      columns: ["draft_id"]
isOneToOne: false
      referencedRelation: "drafts"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "draft_picks_position_id_fkey"
      columns: ["position_id"]
isOneToOne: false
      referencedRelation: "positions"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "draft_picks_team_id_fkey"
      columns: ["team_id"]
isOneToOne: false
      referencedRelation: "team_scores"
      referencedColumns: ["team_id"]
    },{
      foreignKeyName: "draft_picks_team_id_fkey"
      columns: ["team_id"]
isOneToOne: false
      referencedRelation: "teams"
      referencedColumns: ["id"]
    }
                  ]
                },"drafts": {
                  Row: {
                    "completed_at": string | null,"id": string,"league_id": string,"pick_seconds": number,"scheduled_at": string | null,"started_at": string | null,"status": string,"type": string
                  }
                  ComputedFields: never
                  Insert: {
                    "completed_at"?: string | null,"id"?: string,"league_id": string,"pick_seconds"?: number,"scheduled_at"?: string | null,"started_at"?: string | null,"status"?: string,"type"?: string
                  }
                  Update: {
                    "completed_at"?: string | null,"id"?: string,"league_id"?: string,"pick_seconds"?: number,"scheduled_at"?: string | null,"started_at"?: string | null,"status"?: string,"type"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "drafts_league_id_fkey"
      columns: ["league_id"]
isOneToOne: true
      referencedRelation: "leagues"
      referencedColumns: ["id"]
    }
                  ]
                },"event_types": {
                  Row: {
                    "code": string,"name": string,"unit": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "code": string,"name": string,"unit"?: string | null
                  }
                  Update: {
                    "code"?: string,"name"?: string,"unit"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"events": {
                  Row: {
                    "candidacy_id": string,"contest_id": string | null,"created_at": string,"created_by": string | null,"event_type": string,"id": string,"occurred_at": string,"review_status": string,"source": string,"source_ref": string | null,"superseded_by": string | null,"value": number | null
                  }
                  ComputedFields: never
                  Insert: {
                    "candidacy_id": string,"contest_id"?: string | null,"created_at"?: string,"created_by"?: string | null,"event_type": string,"id"?: string,"occurred_at": string,"review_status"?: string,"source": string,"source_ref"?: string | null,"superseded_by"?: string | null,"value"?: number | null
                  }
                  Update: {
                    "candidacy_id"?: string,"contest_id"?: string | null,"created_at"?: string,"created_by"?: string | null,"event_type"?: string,"id"?: string,"occurred_at"?: string,"review_status"?: string,"source"?: string,"source_ref"?: string | null,"superseded_by"?: string | null,"value"?: number | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "events_candidacy_id_fkey"
      columns: ["candidacy_id"]
isOneToOne: false
      referencedRelation: "candidacies"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "events_contest_id_fkey"
      columns: ["contest_id"]
isOneToOne: false
      referencedRelation: "contests"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "events_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "events_event_type_fkey"
      columns: ["event_type"]
isOneToOne: false
      referencedRelation: "event_types"
      referencedColumns: ["code"]
    },{
      foreignKeyName: "events_superseded_by_fkey"
      columns: ["superseded_by"]
isOneToOne: false
      referencedRelation: "events"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "events_superseded_by_fkey"
      columns: ["superseded_by"]
isOneToOne: false
      referencedRelation: "team_event_points"
      referencedColumns: ["event_id"]
    }
                  ]
                },"league_activity": {
                  Row: {
                    "activity_type": string,"actor_id": string | null,"created_at": string,"details": NonNullable<Json>,"id": string,"league_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "activity_type": string,"actor_id"?: string | null,"created_at"?: string,"details"?: NonNullable<Json>,"id"?: string,"league_id": string
                  }
                  Update: {
                    "activity_type"?: string,"actor_id"?: string | null,"created_at"?: string,"details"?: NonNullable<Json>,"id"?: string,"league_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "league_activity_actor_id_fkey"
      columns: ["actor_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "league_activity_league_id_fkey"
      columns: ["league_id"]
isOneToOne: false
      referencedRelation: "leagues"
      referencedColumns: ["id"]
    }
                  ]
                },"league_candidacies": {
                  Row: {
                    "added_by": string | null,"candidacy_id": string,"league_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "added_by"?: string | null,"candidacy_id": string,"league_id": string
                  }
                  Update: {
                    "added_by"?: string | null,"candidacy_id"?: string,"league_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "league_candidacies_added_by_fkey"
      columns: ["added_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "league_candidacies_candidacy_id_fkey"
      columns: ["candidacy_id"]
isOneToOne: false
      referencedRelation: "candidacies"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "league_candidacies_league_id_fkey"
      columns: ["league_id"]
isOneToOne: false
      referencedRelation: "leagues"
      referencedColumns: ["id"]
    }
                  ]
                },"league_event_overrides": {
                  Row: {
                    "action": string,"created_at": string,"created_by": string | null,"event_id": string,"id": string,"league_id": string,"override_value": number | null,"reason": string
                  }
                  ComputedFields: never
                  Insert: {
                    "action": string,"created_at"?: string,"created_by"?: string | null,"event_id": string,"id"?: string,"league_id": string,"override_value"?: number | null,"reason": string
                  }
                  Update: {
                    "action"?: string,"created_at"?: string,"created_by"?: string | null,"event_id"?: string,"id"?: string,"league_id"?: string,"override_value"?: number | null,"reason"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "league_event_overrides_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "league_event_overrides_event_id_fkey"
      columns: ["event_id"]
isOneToOne: false
      referencedRelation: "events"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "league_event_overrides_event_id_fkey"
      columns: ["event_id"]
isOneToOne: false
      referencedRelation: "team_event_points"
      referencedColumns: ["event_id"]
    },{
      foreignKeyName: "league_event_overrides_league_id_fkey"
      columns: ["league_id"]
isOneToOne: false
      referencedRelation: "leagues"
      referencedColumns: ["id"]
    }
                  ]
                },"league_party_requirements": {
                  Row: {
                    "league_id": string,"max_picks": number | null,"min_picks": number,"party_code": string
                  }
                  ComputedFields: never
                  Insert: {
                    "league_id": string,"max_picks"?: number | null,"min_picks"?: number,"party_code": string
                  }
                  Update: {
                    "league_id"?: string,"max_picks"?: number | null,"min_picks"?: number,"party_code"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "league_party_requirements_league_id_fkey"
      columns: ["league_id"]
isOneToOne: false
      referencedRelation: "leagues"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "league_party_requirements_party_code_fkey"
      columns: ["party_code"]
isOneToOne: false
      referencedRelation: "parties"
      referencedColumns: ["code"]
    }
                  ]
                },"league_roster_slots": {
                  Row: {
                    "league_id": string,"position_id": string,"slot_count": number
                  }
                  ComputedFields: never
                  Insert: {
                    "league_id": string,"position_id": string,"slot_count": number
                  }
                  Update: {
                    "league_id"?: string,"position_id"?: string,"slot_count"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "league_roster_slots_league_id_fkey"
      columns: ["league_id"]
isOneToOne: false
      referencedRelation: "leagues"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "league_roster_slots_position_id_fkey"
      columns: ["position_id"]
isOneToOne: false
      referencedRelation: "positions"
      referencedColumns: ["id"]
    }
                  ]
                },"league_score_adjustments": {
                  Row: {
                    "created_at": string,"created_by": string | null,"id": string,"league_id": string,"points": number,"reason": string,"team_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"created_by"?: string | null,"id"?: string,"league_id": string,"points": number,"reason": string,"team_id": string
                  }
                  Update: {
                    "created_at"?: string,"created_by"?: string | null,"id"?: string,"league_id"?: string,"points"?: number,"reason"?: string,"team_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "league_score_adjustments_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "league_score_adjustments_league_id_fkey"
      columns: ["league_id"]
isOneToOne: false
      referencedRelation: "leagues"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "league_score_adjustments_team_id_fkey"
      columns: ["team_id"]
isOneToOne: false
      referencedRelation: "team_scores"
      referencedColumns: ["team_id"]
    },{
      foreignKeyName: "league_score_adjustments_team_id_fkey"
      columns: ["team_id"]
isOneToOne: false
      referencedRelation: "teams"
      referencedColumns: ["id"]
    }
                  ]
                },"leagues": {
                  Row: {
                    "commissioner_id": string,"created_at": string,"id": string,"invite_code": string,"max_teams": number,"name": string,"season_id": string,"status": string,"visibility": string
                  }
                  ComputedFields: never
                  Insert: {
                    "commissioner_id": string,"created_at"?: string,"id"?: string,"invite_code"?: string,"max_teams": number,"name": string,"season_id": string,"status"?: string,"visibility"?: string
                  }
                  Update: {
                    "commissioner_id"?: string,"created_at"?: string,"id"?: string,"invite_code"?: string,"max_teams"?: number,"name"?: string,"season_id"?: string,"status"?: string,"visibility"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "leagues_commissioner_id_fkey"
      columns: ["commissioner_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "leagues_season_id_fkey"
      columns: ["season_id"]
isOneToOne: false
      referencedRelation: "seasons"
      referencedColumns: ["id"]
    }
                  ]
                },"odds_snapshots": {
                  Row: {
                    "candidacy_id": string,"captured_at": string,"id": string,"market_ref": string,"probability": number,"source": string
                  }
                  ComputedFields: never
                  Insert: {
                    "candidacy_id": string,"captured_at"?: string,"id"?: string,"market_ref": string,"probability": number,"source": string
                  }
                  Update: {
                    "candidacy_id"?: string,"captured_at"?: string,"id"?: string,"market_ref"?: string,"probability"?: number,"source"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "odds_snapshots_candidacy_id_fkey"
      columns: ["candidacy_id"]
isOneToOne: false
      referencedRelation: "candidacies"
      referencedColumns: ["id"]
    }
                  ]
                },"offices": {
                  Row: {
                    "id": string,"level": string,"name": string
                  }
                  ComputedFields: never
                  Insert: {
                    "id"?: string,"level": string,"name": string
                  }
                  Update: {
                    "id"?: string,"level"?: string,"name"?: string
                  }
                  Relationships: [
                    
                  ]
                },"parties": {
                  Row: {
                    "code": string,"name": string
                  }
                  ComputedFields: never
                  Insert: {
                    "code": string,"name": string
                  }
                  Update: {
                    "code"?: string,"name"?: string
                  }
                  Relationships: [
                    
                  ]
                },"people": {
                  Row: {
                    "birth_date": string | null,"created_at": string,"created_by": string | null,"full_name": string,"home_party": string | null,"id": string,"photo_url": string | null,"summary_fetched_at": string | null,"summary_text": string | null,"summary_url": string | null,"verified": boolean,"wikidata_id": string | null,"wikipedia_title": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "birth_date"?: string | null,"created_at"?: string,"created_by"?: string | null,"full_name": string,"home_party"?: string | null,"id"?: string,"photo_url"?: string | null,"summary_fetched_at"?: string | null,"summary_text"?: string | null,"summary_url"?: string | null,"verified"?: boolean,"wikidata_id"?: string | null,"wikipedia_title"?: string | null
                  }
                  Update: {
                    "birth_date"?: string | null,"created_at"?: string,"created_by"?: string | null,"full_name"?: string,"home_party"?: string | null,"id"?: string,"photo_url"?: string | null,"summary_fetched_at"?: string | null,"summary_text"?: string | null,"summary_url"?: string | null,"verified"?: boolean,"wikidata_id"?: string | null,"wikipedia_title"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "people_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "people_home_party_fkey"
      columns: ["home_party"]
isOneToOne: false
      referencedRelation: "parties"
      referencedColumns: ["code"]
    }
                  ]
                },"position_offices": {
                  Row: {
                    "office_id": string,"position_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "office_id": string,"position_id": string
                  }
                  Update: {
                    "office_id"?: string,"position_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "position_offices_office_id_fkey"
      columns: ["office_id"]
isOneToOne: false
      referencedRelation: "offices"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "position_offices_position_id_fkey"
      columns: ["position_id"]
isOneToOne: false
      referencedRelation: "positions"
      referencedColumns: ["id"]
    }
                  ]
                },"positions": {
                  Row: {
                    "code": string,"id": string,"name": string
                  }
                  ComputedFields: never
                  Insert: {
                    "code": string,"id"?: string,"name": string
                  }
                  Update: {
                    "code"?: string,"id"?: string,"name"?: string
                  }
                  Relationships: [
                    
                  ]
                },"profiles": {
                  Row: {
                    "avatar_url": string | null,"created_at": string,"display_name": string,"id": string,"is_admin": boolean
                  }
                  ComputedFields: never
                  Insert: {
                    "avatar_url"?: string | null,"created_at"?: string,"display_name"?: string,"id": string,"is_admin"?: boolean
                  }
                  Update: {
                    "avatar_url"?: string | null,"created_at"?: string,"display_name"?: string,"id"?: string,"is_admin"?: boolean
                  }
                  Relationships: [
                    
                  ]
                },"races": {
                  Row: {
                    "cycle": number,"district": string | null,"general_date": string,"id": string,"name": string,"office_id": string,"state": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "cycle": number,"district"?: string | null,"general_date": string,"id"?: string,"name": string,"office_id": string,"state"?: string | null
                  }
                  Update: {
                    "cycle"?: number,"district"?: string | null,"general_date"?: string,"id"?: string,"name"?: string,"office_id"?: string,"state"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "races_office_id_fkey"
      columns: ["office_id"]
isOneToOne: false
      referencedRelation: "offices"
      referencedColumns: ["id"]
    }
                  ]
                },"roster_entries": {
                  Row: {
                    "acquired_at": string,"acquired_via": string,"candidacy_id": string,"id": string,"league_id": string,"position_id": string,"released_at": string | null,"team_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "acquired_at": string,"acquired_via"?: string,"candidacy_id": string,"id"?: string,"league_id": string,"position_id": string,"released_at"?: string | null,"team_id": string
                  }
                  Update: {
                    "acquired_at"?: string,"acquired_via"?: string,"candidacy_id"?: string,"id"?: string,"league_id"?: string,"position_id"?: string,"released_at"?: string | null,"team_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "roster_entries_candidacy_id_fkey"
      columns: ["candidacy_id"]
isOneToOne: false
      referencedRelation: "candidacies"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "roster_entries_league_id_fkey"
      columns: ["league_id"]
isOneToOne: false
      referencedRelation: "leagues"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "roster_entries_position_id_fkey"
      columns: ["position_id"]
isOneToOne: false
      referencedRelation: "positions"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "roster_entries_team_id_fkey"
      columns: ["team_id"]
isOneToOne: false
      referencedRelation: "team_scores"
      referencedColumns: ["team_id"]
    },{
      foreignKeyName: "roster_entries_team_id_fkey"
      columns: ["team_id"]
isOneToOne: false
      referencedRelation: "teams"
      referencedColumns: ["id"]
    }
                  ]
                },"scoring_presets": {
                  Row: {
                    "description": string | null,"id": string,"name": string
                  }
                  ComputedFields: never
                  Insert: {
                    "description"?: string | null,"id"?: string,"name": string
                  }
                  Update: {
                    "description"?: string | null,"id"?: string,"name"?: string
                  }
                  Relationships: [
                    
                  ]
                },"scoring_rules": {
                  Row: {
                    "event_type": string,"id": string,"league_id": string | null,"points": number,"preset_id": string | null,"rule_kind": string,"unit_size": number | null
                  }
                  ComputedFields: never
                  Insert: {
                    "event_type": string,"id"?: string,"league_id"?: string | null,"points": number,"preset_id"?: string | null,"rule_kind": string,"unit_size"?: number | null
                  }
                  Update: {
                    "event_type"?: string,"id"?: string,"league_id"?: string | null,"points"?: number,"preset_id"?: string | null,"rule_kind"?: string,"unit_size"?: number | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "scoring_rules_event_type_fkey"
      columns: ["event_type"]
isOneToOne: false
      referencedRelation: "event_types"
      referencedColumns: ["code"]
    },{
      foreignKeyName: "scoring_rules_league_id_fkey"
      columns: ["league_id"]
isOneToOne: false
      referencedRelation: "leagues"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "scoring_rules_preset_id_fkey"
      columns: ["preset_id"]
isOneToOne: false
      referencedRelation: "scoring_presets"
      referencedColumns: ["id"]
    }
                  ]
                },"seasons": {
                  Row: {
                    "ends_at": string,"id": string,"name": string,"phase": string,"race_id": string,"starts_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "ends_at": string,"id"?: string,"name": string,"phase": string,"race_id": string,"starts_at": string
                  }
                  Update: {
                    "ends_at"?: string,"id"?: string,"name"?: string,"phase"?: string,"race_id"?: string,"starts_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "seasons_race_id_fkey"
      columns: ["race_id"]
isOneToOne: false
      referencedRelation: "races"
      referencedColumns: ["id"]
    }
                  ]
                },"teams": {
                  Row: {
                    "cpu_party_lean": string | null,"cpu_strategy": string | null,"created_at": string,"draft_slot": number | null,"id": string,"league_id": string,"name": string,"user_id": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "cpu_party_lean"?: string | null,"cpu_strategy"?: string | null,"created_at"?: string,"draft_slot"?: number | null,"id"?: string,"league_id": string,"name": string,"user_id"?: string | null
                  }
                  Update: {
                    "cpu_party_lean"?: string | null,"cpu_strategy"?: string | null,"created_at"?: string,"draft_slot"?: number | null,"id"?: string,"league_id"?: string,"name"?: string,"user_id"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "teams_cpu_party_lean_fkey"
      columns: ["cpu_party_lean"]
isOneToOne: false
      referencedRelation: "parties"
      referencedColumns: ["code"]
    },{
      foreignKeyName: "teams_league_id_fkey"
      columns: ["league_id"]
isOneToOne: false
      referencedRelation: "leagues"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "teams_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            "team_event_points": {
                  Row: {
                    "candidacy_id": string,"event_id": string,"event_type": string,"league_id": string,"occurred_at": string,"points": number | null,"team_id": string
                  }
                  ComputedFields: never
                  Relationships: [
                    {
      foreignKeyName: "events_event_type_fkey"
      columns: ["event_type"]
isOneToOne: false
      referencedRelation: "event_types"
      referencedColumns: ["code"]
    },{
      foreignKeyName: "roster_entries_candidacy_id_fkey"
      columns: ["candidacy_id"]
isOneToOne: false
      referencedRelation: "candidacies"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "roster_entries_league_id_fkey"
      columns: ["league_id"]
isOneToOne: false
      referencedRelation: "leagues"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "roster_entries_team_id_fkey"
      columns: ["team_id"]
isOneToOne: false
      referencedRelation: "team_scores"
      referencedColumns: ["team_id"]
    },{
      foreignKeyName: "roster_entries_team_id_fkey"
      columns: ["team_id"]
isOneToOne: false
      referencedRelation: "teams"
      referencedColumns: ["id"]
    }
                  ]
                },"team_scores": {
                  Row: {
                    "league_id": string,"team_id": string,"total_points": number | null
                  }
                  ComputedFields: never
                  Insert: {
                           "league_id"?: string | null,"team_id"?: string | null,"total_points"?: never
                         }
                        Update: {
                           "league_id"?: string | null,"team_id"?: string | null,"total_points"?: never
                         }
                        Relationships: [
                    {
      foreignKeyName: "teams_league_id_fkey"
      columns: ["league_id"]
isOneToOne: false
      referencedRelation: "leagues"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Functions: {
            "can_edit_league_setup":
{ Args: { "p_league_id": string }; Returns: boolean
                           },
"can_read_league":
{ Args: { "p_league_id": string }; Returns: boolean
                           },
"can_see_candidacy":
{ Args: { "p_candidacy_id": string }; Returns: boolean
                           },
"can_see_person":
{ Args: { "p_person_id": string }; Returns: boolean
                           },
"is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"is_commissioner":
{ Args: { "p_league_id": string }; Returns: boolean
                           },
"is_league_member":
{ Args: { "p_league_id": string }; Returns: boolean
                           },
"league_preview":
{ Args: { "p_invite_code": string }; Returns: {
              "commissioner_name": string,"league_name": string,"open_seats": number
            }[]
                           },
"refresh_candidacy_status":
{ Args: { "p_candidacy_id": string }; Returns: undefined
                           },
"set_admin":
{ Args: { "p_is_admin": boolean,"p_user_id": string }; Returns: undefined
                           },
"shares_league":
{ Args: { "p_user_id": string }; Returns: boolean
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            
          }
        }
} as const
