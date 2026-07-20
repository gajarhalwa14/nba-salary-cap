import { useEffect, useState } from "react";
import { fetchTeams } from "../api/client";
import { TeamCard } from "../components/TeamCard";
import type { Team } from "../types";

export function HomePage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [seasonYear, setSeasonYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchTeams()
      .then((data) => {
        if (cancelled) return;
        setTeams(data.teams);
        setSeasonYear(data.seasonYear);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page home-page">
      <header className="home-hero">
        <p className="eyebrow">2025–26 Season</p>
        <h1 className="brand">NBA Cap Vision</h1>
        <p className="lede">
          Visualize every roster&apos;s contracts against the salary floor, cap,
          luxury tax, and aprons.
        </p>
      </header>

      {loading && <p className="status">Loading teams…</p>}
      {error && <p className="status status--error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="section-head">
            <h2>Select a team</h2>
            {seasonYear ? <span>Season ending {seasonYear}</span> : null}
          </div>
          <div className="team-grid">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
