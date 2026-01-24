
export interface PlayerStats {
  points: number;
  rebounds: number;
  assists: number;
  steals: number; // Interceptions
  blocks: number; // Contres
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  threePointersMade: number;
  minutesPlayed: number;
}

export interface Player {
  id: string;
  name: string;
  number: string;
  stats: PlayerStats;
  lastUpdated?: number; // Timestamp de la dernière action
}

export interface MatchInfo {
  teamName: string;
  championship: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
}

export enum StatActionType {
  ADD_2PT = 'ADD_2PT',
  ADD_3PT = 'ADD_3PT',
  ADD_FT = 'ADD_FT',
  ADD_REB = 'ADD_REB',
  ADD_AST = 'ADD_AST',
  ADD_STL = 'ADD_STL',
  ADD_MIN = 'ADD_MIN',
  ADD_BLK = 'ADD_BLK',
}

export const INITIAL_STATS: PlayerStats = {
  points: 0,
  rebounds: 0,
  assists: 0,
  steals: 0,
  blocks: 0,
  freeThrowsMade: 0,
  freeThrowsAttempted: 0,
  threePointersMade: 0,
  minutesPlayed: 0,
};

export const INITIAL_MATCH_INFO: MatchInfo = {
  teamName: '',
  championship: '',
  opponent: '',
  date: new Date().toISOString().split('T')[0],
  time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
  location: '',
};
