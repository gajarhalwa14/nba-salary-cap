import type { CapThresholds, PlayerSalary } from "../types";

interface SalaryCapBarProps {
  players: PlayerSalary[];
  thresholds: CapThresholds;
  chartMax: number;
  totalSalary: number;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatAxis(value: number) {
  if (value === 0) return "$0";
  return `$${Math.round(value / 1_000_000)}M`;
}

const THRESHOLD_META: {
  key: keyof CapThresholds;
  label: string;
}[] = [
  { key: "salaryFloor", label: "Salary Floor" },
  { key: "salaryCap", label: "Salary Cap" },
  { key: "luxuryTax", label: "Luxury Tax" },
  { key: "firstApron", label: "1st Apron" },
  { key: "secondApron", label: "2nd Apron" },
];

export function SalaryCapBar({
  players,
  thresholds,
  chartMax,
  totalSalary,
}: SalaryCapBarProps) {
  const axisSteps = Array.from(
    { length: Math.floor(chartMax / 10_000_000) + 1 },
    (_, i) => i * 10_000_000
  ).filter((value) => value <= chartMax);

  const showInlineLabel = (salary: number) => (salary / chartMax) * 100 >= 3.2;

  return (
    <div
      className="cap-chart"
      role="img"
      aria-label="Stacked player salary bar with NBA cap thresholds"
    >
      <div className="cap-chart__y-axis" aria-hidden="true">
        {[...axisSteps].reverse().map((value) => (
          <div
            key={value}
            className="cap-chart__tick"
            style={{ bottom: `${(value / chartMax) * 100}%` }}
          >
            <span>{formatAxis(value)}</span>
          </div>
        ))}
      </div>

      <div className="cap-chart__plot">
        <div className="cap-chart__stage">
          <div className="cap-chart__grid" aria-hidden="true">
            {axisSteps.map((value) => (
              <div
                key={value}
                className="cap-chart__grid-line"
                style={{ bottom: `${(value / chartMax) * 100}%` }}
              />
            ))}
          </div>

          <div
            className="cap-chart__stack"
            style={{ height: `${(totalSalary / chartMax) * 100}%` }}
          >
            {players.map((player) => {
              const heightPct = (player.salary / totalSalary) * 100;
              const labeled = showInlineLabel(player.salary);

              return (
                <div
                  key={player.id}
                  className={`cap-chart__segment${labeled ? "" : " cap-chart__segment--compact"}`}
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: player.color,
                  }}
                  title={`${player.name}: ${formatMoney(player.salary)}`}
                >
                  {labeled ? (
                    <div className="cap-chart__player">
                      {player.headshot ? (
                        <img
                          className="cap-chart__headshot"
                          src={player.headshot}
                          alt=""
                          loading="lazy"
                        />
                      ) : (
                        <div className="cap-chart__headshot cap-chart__headshot--fallback" />
                      )}
                      <div className="cap-chart__player-text">
                        <span className="cap-chart__player-name">{player.name}</span>
                        <span className="cap-chart__player-salary">
                          {formatMoney(player.salary)}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {THRESHOLD_META.map(({ key }) => {
            const value = thresholds[key];
            return (
              <div
                key={`line-${key}`}
                className="cap-chart__threshold-line"
                style={{ bottom: `${(value / chartMax) * 100}%` }}
              />
            );
          })}
        </div>

        <div className="cap-chart__labels">
          {THRESHOLD_META.map(({ key, label }) => {
            const value = thresholds[key];
            return (
              <div
                key={key}
                className="cap-chart__threshold-label"
                style={{ bottom: `${(value / chartMax) * 100}%` }}
              >
                <strong>{label}</strong>
                <em>{formatMoney(value)}</em>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
