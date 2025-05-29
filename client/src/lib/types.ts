import type { 
  Player, PlayerStats, Team, Match, Venue, Competition, 
  Article, SocialPost, Poll, Quiz, GalleryItem 
} from "@shared/schema";

export interface PlayerWithStats extends Player {
  stats?: PlayerStats;
}

export interface MatchWithDetails extends Match {
  homeTeam: Team;
  awayTeam: Team;
  venue: Venue;
  competition: Competition;
}

export interface LiveMatchData {
  currentBatsmen?: {
    player1: { name: string; runs: number; balls: number };
    player2: { name: string; runs: number; balls: number };
  };
  currentBowler?: {
    name: string;
    overs: string;
    runs: number;
    wickets: number;
  };
  lastOver?: number[];
  requiredRunRate?: number;
  currentRunRate?: number;
}

export interface TeamStats {
  matchesWon: number;
  totalRuns: number;
  wicketsTaken: number;
  nrr: number;
}

export interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface PollOption {
  text: string;
  votes: number;
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface FilterState {
  matches: 'all' | 'upcoming' | 'completed' | 'live' | 'home';
  players: 'all' | 'batsmen' | 'bowlers' | 'allrounders' | 'wicketkeeper';
}

export interface SearchState {
  query: string;
  category: 'all' | 'players' | 'matches' | 'news';
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}
