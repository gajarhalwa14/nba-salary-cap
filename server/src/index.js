import cors from "cors";
import express from "express";
import { CURRENT_SEASON_YEAR } from "./capThresholds.js";
import { getLeagueCap, getTeamSalary, getTeams } from "./espn.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, seasonYear: CURRENT_SEASON_YEAR });
});

app.get("/api/cap", (req, res) => {
  try {
    const seasonYear = Number(req.query.season) || CURRENT_SEASON_YEAR;
    res.json(getLeagueCap(seasonYear));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/teams", async (_req, res) => {
  try {
    const teams = await getTeams();
    res.json({ seasonYear: CURRENT_SEASON_YEAR, teams });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

app.get("/api/teams/:id/salary", async (req, res) => {
  try {
    const seasonYear = Number(req.query.season) || CURRENT_SEASON_YEAR;
    const data = await getTeamSalary(req.params.id, seasonYear);
    res.json(data);
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    res.status(status).json({
      error: status === 404 ? "Team not found" : "Failed to fetch team salary data",
    });
  }
});

app.listen(PORT, () => {
  console.log(`NBA Salary Cap API listening on http://localhost:${PORT}`);
});
