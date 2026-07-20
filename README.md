# NBA Cap Vision

Track NBA team salary-cap situations with a stacked contract chart inspired by modern cap graphics — player blocks scaled to salary, with floor / cap / tax / apron markers overlaid.

## Stack

- **Frontend:** React + Vite + TypeScript
- **API:** Express locally; Vercel serverless functions in production
- **Data:** Live player salaries from ESPN; official 2025–26 league thresholds from NBA announcements

## Quick start

```bash
# Install dependencies
npm run install:all

# Terminal 1 — API on http://localhost:3001
npm run dev:server

# Terminal 2 — UI on http://localhost:5174
npm run dev:client
```

Open [http://localhost:5174](http://localhost:5174), pick a team, and explore the salary stack.

## API

| Endpoint | Description |
| --- | --- |
| `GET /api/teams` | All active NBA teams |
| `GET /api/teams/:id/salary` | Roster contracts, totals, and cap thresholds |
| `GET /api/cap` | League salary floor / cap / tax / apron figures |
| `GET /api/health` | Health check |

Responses are cached for 30 minutes to stay polite to ESPN.

## Notes

- Season year `2026` means the **2025–26** season (ESPN convention).
- Cap thresholds live in `server/src/capThresholds.js` and should be updated when the NBA publishes new figures.
