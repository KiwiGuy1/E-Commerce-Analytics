# E-Commerce Analytics Dashboard

A full-stack analytics platform for e-commerce data, built with a Next.js frontend, Express + Prisma backend, and PostgreSQL.

## What this project includes

- Live dashboard KPIs (sales, revenue, top product, stock)
- Analytics, products, orders, customers, sales-entry, and settings pages
- Prisma-backed API with seeded demo data
- Docker workflow for one-command startup

## Tech stack

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS, Chart.js
- Backend: Node.js, Express, TypeScript, Prisma
- Database: PostgreSQL 16 (Docker)
- Tooling: ESLint, Jest, Nodemon, ts-node, concurrently

## Repository structure

```text
.
├─ backend/
│  ├─ prisma/
│  └─ src/
├─ frontend/
│  └─ src/
├─ docker-compose.yml
└─ package.json
```

## Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop

## Environment setup

From the repository root, copy the example files:

### Windows (PowerShell)

```powershell
Copy-Item .env.example .env
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env.local
```

### macOS/Linux

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Default important values:

- Root `.env`: Compose interpolation vars (`POSTGRES_*`, `POSTGRES_PORT=5433`)
- `backend/.env`: local backend DB URL uses `localhost:5433`
- `frontend/.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

## Docker (recommended)

Start full stack:

```bash
npm run docker:up
```

Rebuild containers after code/config changes:

```bash
npm run docker:rebuild
```

Follow logs:

```bash
npm run docker:logs
```

Stop everything:

```bash
npm run docker:down
```

### Docker URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Postgres exposed on host: `localhost:5433`

### Docker DB behavior (important)

Inside Docker, backend connects to Postgres using service DNS `db:5432` from `docker-compose.yml`.
Local `.env` and `.env.local` are loaded as fallbacks only, so container-provided `DATABASE_URL` is preserved.

## Local development (without app containers)

Start DB only in Docker:

```bash
npm run db:up
```

Start backend + frontend locally:

```bash
npm run dev
```

Or run each side separately:

```bash
npm run dev:backend
npm run dev:frontend
```

## Database and Prisma

Run migrations locally:

```bash
npm run prisma:migrate
```

Seed local data:

```bash
npm run prisma:seed
```

Notes:

- Local backend uses `backend/.env` (`localhost:5433`)
- Docker backend uses compose env (`db:5432`)

## Root scripts

- `npm run dev` — run backend + frontend concurrently
- `npm run dev:backend` — backend only
- `npm run dev:frontend` — frontend only
- `npm run db:up` / `npm run db:down` — start/stop DB container only
- `npm run docker:up` — start db + backend + frontend in Docker
- `npm run docker:rebuild` — rebuild and start Docker services
- `npm run docker:logs` — stream container logs
- `npm run docker:down` — stop/remove services
- `npm run docker:test` — run backend tests in Docker profile
- `npm run prisma:migrate` — Prisma migrate (backend)
- `npm run prisma:seed` — Prisma seed (backend)
- `npm run test` — backend tests
- `npm run test:integration` — backend integration tests
- `npm run lint` — frontend lint

## API summary

- `GET /api/analytics` — aggregated analytics payload
- `GET /api/users` — customer/user list
- `POST /api/sales` — create sale/order

## Troubleshooting

### `npm run dev` shows Prisma `P1001`

- Ensure DB is running: `npm run db:up`
- Confirm backend URL in `backend/.env` uses `localhost:5433`
- Confirm port is free and Docker DB is healthy: `docker compose ps`

### Docker is up but backend can’t reach DB

- Rebuild once: `npm run docker:rebuild`
- Check backend logs: `docker compose logs backend --tail=200`
- You should see Prisma datasource at `db:5432`

### Frontend starts on a different port

If port `3000` is busy, Next.js auto-falls back (for example `3001`).

## Demo flow

1. `npm run docker:up`
2. Open http://localhost:3000
3. Visit Sales page and create an order
4. Return to dashboard and watch metrics update

## License / usage

This repository is intended as a portfolio/demo project. Adjust secrets and hardening before production use.
