import type { Team, TeamSalaryData } from "../types";

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${response.status})`);
  }
  return response.json();
}

export function fetchTeams() {
  return getJson<{ seasonYear: number; teams: Team[] }>("/api/teams");
}

export function fetchTeamSalary(teamId: string) {
  return getJson<TeamSalaryData>(`/api/teams/${teamId}/salary`);
}
