import { CURRENT_SEASON_YEAR } from "../../../server/src/capThresholds.js";
import { getTeamSalary } from "../../../server/src/espn.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const seasonYear = Number(req.query.season) || CURRENT_SEASON_YEAR;
    const data = await getTeamSalary(req.query.id, seasonYear);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    res.status(status).json({
      error: status === 404 ? "Team not found" : "Failed to fetch team salary data",
    });
  }
}
