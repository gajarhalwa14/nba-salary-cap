import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchTeamSalary } from "../api/client";
import { SalaryCapBar } from "../components/SalaryCapBar";
import type { TeamSalaryData } from "../types";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatSignedMoney(value: number) {
  const formatted = formatMoney(Math.abs(value));
  return value >= 0 ? formatted : `-${formatted}`;
}

export function TeamSalaryPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const [data, setData] = useState<TeamSalaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchTeamSalary(teamId)
      .then((result) => {
        if (cancelled) return;
        setData(result);
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
  }, [teamId]);

  if (loading) {
    return (
      <div className="page">
        <p className="status">Loading salary sheet…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="page">
        <Link to="/" className="back-link">
          ← All teams
        </Link>
        <p className="status status--error">{error ?? "Team not found"}</p>
      </div>
    );
  }

  const { team, players, thresholds, chartMax, totalSalary, summary, season } =
    data;

  return (
    <div className="page team-page">
      <Link to="/" className="back-link">
        ← All teams
      </Link>

      <header className="team-header">
        <div className="team-header__identity">
          {team.logo ? (
            <img className="team-header__logo" src={team.logo} alt="" />
          ) : null}
          <div>
            <p className="eyebrow">{season} Payroll</p>
            <h1>{team.displayName}</h1>
            <p className="team-header__status">{summary.status}</p>
          </div>
        </div>

        <div className="stat-strip">
          <div>
            <span>Total Cap Hit</span>
            <strong>{formatMoney(totalSalary)}</strong>
          </div>
          <div>
            <span>Cap Space</span>
            <strong className={summary.capSpace >= 0 ? "positive" : "negative"}>
              {formatSignedMoney(summary.capSpace)}
            </strong>
          </div>
          <div>
            <span>Tax Space</span>
            <strong className={summary.taxSpace >= 0 ? "positive" : "negative"}>
              {formatSignedMoney(summary.taxSpace)}
            </strong>
          </div>
          <div>
            <span>Players</span>
            <strong>{players.length}</strong>
          </div>
        </div>
      </header>

      <section className="chart-section">
        <div className="chart-section__title">
          <h2>Salary Cap</h2>
          <p>
            Each block is a player contract. Dotted lines mark the floor, cap,
            tax, and apron thresholds.
          </p>
        </div>
        <SalaryCapBar
          players={players}
          thresholds={thresholds}
          chartMax={chartMax}
          totalSalary={totalSalary}
        />
      </section>

      <section className="roster-table-section">
        <h2>Roster contracts</h2>
        <div className="roster-table-wrap">
          <table className="roster-table">
            <thead>
              <tr>
                <th>Player</th>
                <th>Pos</th>
                <th>Salary</th>
                <th>% of payroll</th>
                <th>Yrs left</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id}>
                  <td>
                    <div className="roster-player">
                      <span
                        className="roster-swatch"
                        style={{ backgroundColor: player.color }}
                      />
                      {player.headshot ? (
                        <img src={player.headshot} alt="" />
                      ) : null}
                      <span>{player.name}</span>
                    </div>
                  </td>
                  <td>{player.position ?? "—"}</td>
                  <td>{formatMoney(player.salary)}</td>
                  <td>{((player.salary / totalSalary) * 100).toFixed(1)}%</td>
                  <td>{player.yearsRemaining ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
