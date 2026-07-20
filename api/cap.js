import { CURRENT_SEASON_YEAR } from "../server/src/capThresholds.js";
import { getLeagueCap } from "../server/src/espn.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const seasonYear = Number(req.query.season) || CURRENT_SEASON_YEAR;
    res.status(200).json(getLeagueCap(seasonYear));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
