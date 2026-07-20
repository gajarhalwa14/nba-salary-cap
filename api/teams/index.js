import { CURRENT_SEASON_YEAR } from "../../server/src/capThresholds.js";
import { getTeams } from "../../server/src/espn.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const teams = await getTeams();
    res.status(200).json({ seasonYear: CURRENT_SEASON_YEAR, teams });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
}
