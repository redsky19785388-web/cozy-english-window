export interface Entry {
  id: string;
  text: string;
  xpGained: number;
  timestamp: number;
  keywords: string[];
}

export interface AppState {
  totalXP: number;
  entries: Entry[];
}

export interface EvolutionStage {
  level: number;
  name: string;
  minXP: number;
  nextXP: number;
  glowColor: string;
  textColor: string;
  bgClass: string;
  animClass: string;
  clipPath: string;
  borderRadius?: string;
  description: string;
}
