import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { Team } from "../types";

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Link
      to={`/teams/${team.id}`}
      className="team-card"
      style={
        {
          "--team-color": team.color,
          "--team-alt": team.alternateColor,
        } as CSSProperties
      }
    >
      {team.logo ? (
        <img className="team-card__logo" src={team.logo} alt="" loading="lazy" />
      ) : (
        <div className="team-card__logo team-card__logo--fallback">
          {team.abbreviation}
        </div>
      )}
      <div className="team-card__meta">
        <span className="team-card__abbr">{team.abbreviation}</span>
        <span className="team-card__name">{team.displayName}</span>
      </div>
    </Link>
  );
}
