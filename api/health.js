import { CURRENT_SEASON_YEAR } from "../server/src/capThresholds.js";

export default function handler(_req, res) {
  res.status(200).json({ ok: true, seasonYear: CURRENT_SEASON_YEAR });
}
