import NodeCache from "node-cache";
import { CURRENT_SEASON_YEAR, getThresholds } from "./capThresholds.js";

const cache = new NodeCache({ stdTTL: 60 * 30, checkperiod: 120 });

const SITE_API = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba";

const PLAYER_COLORS = [
  "#E63946",
  "#457B9D",
  "#F4A261",
  "#2A9D8F",
  "#9B5DE5",
  "#F72585",
  "#4CC9F0",
  "#FFB703",
  "#06D6A0",
  "#EF476F",
  "#118AB2",
  "#FF6B35",
  "#7B2CBF",
  "#00BBF9",
  "#FEE440",
  "#9D4EDD",
  "#80ED99",
  "#FF85A1",
  "#48CAE4",
  "#F77F00",
];

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "nba-salary-cap/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`ESPN request failed (${response.status}): ${url}`);
  }

  return response.json();
}

function pickLogo(logos = []) {
  const preferred =
    logos.find((logo) => logo.rel?.includes("full") && !logo.rel?.includes("scoreboard")) ||
    logos[0];
  return preferred?.href ?? null;
}

export async function getTeams() {
  const cacheKey = "teams";
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const data = await fetchJson(`${SITE_API}/teams?limit=32`);
  const teams = (data.sports?.[0]?.leagues?.[0]?.teams ?? [])
    .map((entry) => entry.team)
    .filter((team) => team?.isActive)
    .map((team) => ({
      id: team.id,
      slug: team.slug,
      abbreviation: team.abbreviation,
      displayName: team.displayName,
      shortDisplayName: team.shortDisplayName,
      location: team.location,
      name: team.name,
      color: `#${team.color}`,
      alternateColor: `#${team.alternateColor}`,
      logo: pickLogo(team.logos),
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  cache.set(cacheKey, teams);
  return teams;
}

function mapPlayer(athlete, index) {
  const salary = athlete.contract?.salary ?? 0;
  return {
    id: athlete.id,
    name: athlete.displayName,
    shortName: athlete.shortName,
    jersey: athlete.jersey ?? null,
    position: athlete.position?.abbreviation ?? null,
    headshot: athlete.headshot?.href ?? null,
    salary,
    yearsRemaining: athlete.contract?.yearsRemaining ?? null,
    color: PLAYER_COLORS[index % PLAYER_COLORS.length],
  };
}

function summarizeCapSituation(totalSalary, thresholds) {
  const {
    salaryFloor,
    salaryCap,
    luxuryTax,
    firstApron,
    secondApron,
  } = thresholds;

  let status = "Under Cap";
  if (totalSalary >= secondApron) status = "Above 2nd Apron";
  else if (totalSalary >= firstApron) status = "Above 1st Apron";
  else if (totalSalary >= luxuryTax) status = "Luxury Tax";
  else if (totalSalary >= salaryCap) status = "Over Cap";
  else if (totalSalary < salaryFloor) status = "Below Floor";

  return {
    status,
    capSpace: salaryCap - totalSalary,
    taxSpace: luxuryTax - totalSalary,
    firstApronSpace: firstApron - totalSalary,
    secondApronSpace: secondApron - totalSalary,
    floorSpace: totalSalary - salaryFloor,
  };
}

export async function getTeamSalary(teamId, seasonYear = CURRENT_SEASON_YEAR) {
  const cacheKey = `team-salary:${teamId}:${seasonYear}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const thresholds = getThresholds(seasonYear);
  const [teams, rosterData] = await Promise.all([
    getTeams(),
    fetchJson(`${SITE_API}/teams/${teamId}?enable=roster`),
  ]);

  const teamMeta = teams.find((team) => team.id === String(teamId));
  const team = rosterData.team;
  if (!team) {
    throw Object.assign(new Error("Team not found"), { status: 404 });
  }

  const players = (team.athletes ?? [])
    .map(mapPlayer)
    .filter((player) => player.salary > 0)
    .sort((a, b) => b.salary - a.salary)
    .map((player, index) => ({
      ...player,
      color: PLAYER_COLORS[index % PLAYER_COLORS.length],
    }));

  const totalSalary = players.reduce((sum, player) => sum + player.salary, 0);
  const chartMax = Math.max(
    thresholds.secondApron * 1.12,
    totalSalary * 1.08,
    230_000_000
  );

  const result = {
    team: teamMeta ?? {
      id: team.id,
      slug: team.slug,
      abbreviation: team.abbreviation,
      displayName: team.displayName,
      shortDisplayName: team.shortDisplayName,
      location: team.location,
      name: team.name,
      color: `#${team.color}`,
      alternateColor: `#${team.alternateColor}`,
      logo: pickLogo(team.logos),
    },
    season: thresholds.season,
    seasonYear,
    players,
    totalSalary,
    playerCount: players.length,
    thresholds: {
      salaryFloor: thresholds.salaryFloor,
      salaryCap: thresholds.salaryCap,
      luxuryTax: thresholds.luxuryTax,
      firstApron: thresholds.firstApron,
      secondApron: thresholds.secondApron,
    },
    chartMax,
    summary: summarizeCapSituation(totalSalary, thresholds),
    updatedAt: new Date().toISOString(),
  };

  cache.set(cacheKey, result);
  return result;
}

export function getLeagueCap(seasonYear = CURRENT_SEASON_YEAR) {
  return getThresholds(seasonYear);
}
