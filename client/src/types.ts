export interface Team {
  id: string;
  slug: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  location: string;
  name: string;
  color: string;
  alternateColor: string;
  logo: string | null;
}

export interface PlayerSalary {
  id: string;
  name: string;
  shortName: string;
  jersey: string | null;
  position: string | null;
  headshot: string | null;
  salary: number;
  yearsRemaining: number | null;
  color: string;
}

export interface CapThresholds {
  salaryFloor: number;
  salaryCap: number;
  luxuryTax: number;
  firstApron: number;
  secondApron: number;
}

export interface CapSummary {
  status: string;
  capSpace: number;
  taxSpace: number;
  firstApronSpace: number;
  secondApronSpace: number;
  floorSpace: number;
}

export interface TeamSalaryData {
  team: Team;
  season: string;
  seasonYear: number;
  players: PlayerSalary[];
  totalSalary: number;
  playerCount: number;
  thresholds: CapThresholds;
  chartMax: number;
  summary: CapSummary;
  updatedAt: string;
}
