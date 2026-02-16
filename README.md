# E-Commerce Analytics Dashboard

Full-stack analytics platform for monitoring e-commerce performance in near real time. The project combines a Next.js frontend, an Express + Prisma backend, and PostgreSQL for persistent data.

## Why this project

- Demonstrates end-to-end product thinking across data, API, and UX layers
- Uses typed API contracts and reusable hooks for maintainable frontend data access
- Includes seeded datasets and a simulator for realistic analytics behavior during demos
- Organized as a workspace with isolated frontend/backend concerns and shared run scripts

## Tech stack

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS, Axios, Chart.js
- Backend: Node.js, Express, TypeScript, Prisma ORM
- Database: PostgreSQL 16 (Docker)
- Tooling: ESLint, Jest, ts-node, nodemon, concurrently

## Architecture overview

- `frontend/` hosts the analytics UI (dashboard, analytics, products, orders, customers, settings)
- `backend/` exposes REST endpoints under `/api/*`
- Prisma models: `User`, `Product`, `Sale`
- Frontend data access is centralized in `frontend/src/lib/api.ts` and consumed by custom hooks (`useAnalytics`, `useUsers`)

## Repository structure

```text
.
├─ backend/
│  ├─ src/
│  │  ├─ controllers/
│  │  ├─ routes/
│  │  └─ lib/
│  └─ prisma/
├─ frontend/
│  └─ src/
│     ├─ app/
│     ├─ components/
│     ├─ hooks/
│     └─ lib/
└─ package.json
```

## Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop

## Environment variables

Copy examples instead of creating files manually:

```bash
copy .env.example .env
copy backend\\.env.example backend\\.env
copy frontend\\.env.example frontend\\.env.local
```

If you prefer manual setup, use these values.

`backend/.env`:

```env
PORT=5000
CORS_ORIGIN=http://localhost:3000

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ecommerce_analytics

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce_analytics
```

`frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Root `.env` (used by Docker Compose variable interpolation):

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ecommerce_analytics
```

## Docker quick start (recommended)

Run the full stack (frontend + backend + database):

```bash
npm run docker:up
```

Open:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

Run backend tests in an isolated container (with DB included):

```bash
npm run docker:test
```

Stop containers:

```bash
npm run docker:down
```

## Interviewer quick start

For a reviewer/interviewer, these are the only commands needed:

```bash
npm install
npm run docker:up
npm run docker:test
```

Then open `http://localhost:3000`.

## Getting started

1. Install dependencies:

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

2. Start PostgreSQL:

```bash
npm run db:up
```

3. Run migrations and seed data:

```bash
npm run prisma:migrate
npm run prisma:seed
```

4. Start backend + frontend together:

```bash
npm run dev
```

5. Open the app:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Available scripts (workspace root)

- `npm run dev` — run backend and frontend concurrently
- `npm run dev:backend` — run backend only
- `npm run dev:frontend` — run frontend only
- `npm run db:up` / `npm run db:down` — start/stop only PostgreSQL container
- `npm run docker:up` — start frontend, backend, and database via Docker
- `npm run docker:rebuild` — rebuild and restart Docker services
- `npm run docker:test` — run backend unit + integration tests in Docker
- `npm run docker:logs` — follow Docker service logs
- `npm run docker:down` — stop and remove Docker services
- `npm run prisma:migrate` — create/apply Prisma migration
- `npm run prisma:seed` — seed users, products, and sales
- `npm run test` — backend tests
- `npm run test:integration` — backend integration test suite
- `npm run lint` — frontend linting

## API summary

- `GET /api/analytics` — aggregate KPI and analytics payload
- `GET /api/users` — user/customer list
- `POST /api/sales` — create a sale/order record

## Security note

- This repository uses local development placeholder credentials only.
- No production tokens, private keys, or cloud credentials are required.
- Keep `.env` files local (already gitignored) and share only `*.env.example`.

## Highlights for portfolio/resume

- Built a full-stack analytics dashboard with live refresh and typed API integration
- Implemented custom React hooks for asynchronous polling, loading states, and error handling
- Modeled relational commerce data with Prisma and PostgreSQL
- Added deterministic seed workflows for reliable local demos and testing

## Future enhancements

- Authentication and role-based access controls
- Pagination/filtering for large datasets
- Caching and query optimization for high-volume analytics
- CI pipeline for linting, tests, and deployment
