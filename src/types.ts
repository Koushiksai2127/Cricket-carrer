export interface Player {
  id: string;
  userId: string;
  name: string;
  country: string;
  role: 'Batter' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper';
  batting_style: 'Aggressive' | 'Balanced' | 'Defensive';
  bowling_style: 'Fast' | 'Medium' | 'Spin';
  age: number;
  status: 'active' | 'retired' | 'injured';
  current_team: string;
  net_worth: number;
  popularity: number;
  form_score: number;
  
  // Attributes
  technique: number;
  timing: number;
  power: number;
  temperament: number;
  spin_skill: number;
  pace_skill: number;
  shot_selection: number;
  speed: number;
  accuracy: number;
  swing_turn: number;
  variations: number;
  death_bowling: number;
  stamina: number;
  catching: number;
  throw_accuracy: number;
  reflex: number;
  agility: number;
  
  // Mental & Physical
  confidence: number;
  work_ethic: number;
  leadership: number;
  big_match_temperament: number;
  fitness: number;
  injury_resistance: number;
  recovery_speed: number;
  
  // New Systems
  media_pressure: number;
  slump_active: boolean;
  slump_duration: number;
  slump_penalty: number;
  workload_red: number;
  workload_white: number;
  team_morale: number;
  dressing_room_trust: number;
  archetype: string;
  greatness_index: number;
  
  created: string;
  updated: string;
}

export interface WorldRecord {
  id: string;
  category: 'batting' | 'bowling' | 'fielding';
  record_name: string;
  holder_name: string;
  value: number;
  unit: string;
  format: 'Test' | 'ODI' | 'T20I' | 'All';
  date_set: string;
}

export interface CareerDecision {
  id: string;
  player_id: string;
  decision_id: string;
  decision_type: string;
  decision_text: string;
  options_chosen: string;
  consequences: string;
  impact_on_career: string;
  date_made: string;
}

export interface Franchise {
  id: string;
  name: string;
  country: string;
  budget: number;
  reputation: number;
  squad_needs: string[]; // JSON string in DB
}
