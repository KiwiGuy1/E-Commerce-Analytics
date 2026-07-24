# E-Commerce Analytics Dashboard

A full-stack analytics platform for e-commerce data, built with a Next.js web app, Express + Prisma API, a standalone data simulator, and PostgreSQL.

## What this project includes

- Live dashboard KPIs for sales, revenue, top product, and stock
- Analytics, products, orders, customers, sales-entry, and settings pages
- Prisma-backed API with seeded demo data
- One root Docker Compose workflow for the whole stack

## Tech stack

- Web: Next.js 15, React 19, TypeScript, Tailwind CSS, Chart.js
- API: Node.js, Express, TypeScript, Prisma
- Database: PostgreSQL 16
- Tooling: ESLint, Jest, Nodemon, ts-node, concurrently

## Repository structure

```text
.
|-- api/
|   |-- prisma/
|   `-- src/
|-- simulator/
|   |-- prisma/
|   `-- src/
|-- web/
|   |-- public/
|   `-- src/
|-- seed/
|-- docker-compose.yml
`-- package.json
```

Each app lives in its own root folder. Docker is managed only from the root `docker-compose.yml`.

## Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop

## Environment setup

After cloning the repository on any Windows, macOS, or Linux device, run:

```bash
npm run setup
```

This creates all local environment files from the committed examples without
overwriting any values you already have, then installs the root, API, simulator,
and web dependencies. Review the generated `.env` files before starting the
project.

To create only the environment files, without installing dependencies:

```bash
npm run setup:env
```

You can also copy the files manually:

### Windows PowerShell

```powershell
Copy-Item .env.example .env
Copy-Item api/.env.example api/.env
Copy-Item simulator/.env.example simulator/.env
Copy-Item web/.env.example web/.env.local
```

### macOS/Linux

```bash
cp .env.example .env
cp api/.env.example api/.env
cp simulator/.env.example simulator/.env
cp web/.env.example web/.env.local
```

Default important values:

- Root `.env`: Compose interpolation vars (`POSTGRES_*`, `POSTGRES_PORT=5433`)
- `api/.env`: local API DB URL uses `localhost:5433`
- `web/.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

Real `.env` files are intentionally ignored by Git because they may contain
passwords or API keys. The `.env.example` files are the portable, safe versions
that should be committed and shared across devices. If you later add a new
environment variable, add its name and a safe placeholder/default to the
matching `.env.example` file too.

## Docker

Start the full stack:

```bash
npm run docker:up
```

Rebuild containers after code or config changes:

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

### URLs

- Web app: http://localhost:3000
- API: http://localhost:5000/api
- Postgres on host: `localhost:5433`

Inside Docker, the API connects to Postgres through service DNS `db:5432`.

## Local development without app containers

Start only the DB in Docker:

```bash
npm run db:up
```

Start the API and web app locally:

```bash
npm run dev
```

Or run each app separately:

```bash
npm run dev:api
npm run dev:web
```

## Database and Prisma

Open a browser-based view of the database:

```bash
npm run db:studio
```

This starts the Postgres container if needed, then launches Prisma Studio. Open
the URL printed in the terminal (normally http://localhost:5555) to browse and
edit users, products, orders, and other records. Press `Ctrl+C` when finished;
the database container will keep running and can be stopped with
`npm run db:down`.

Run migrations locally:

```bash
npm run prisma:migrate
```

Seed local data:

```bash
npm run prisma:seed
```

Notes:

- Local API uses `api/.env` (`localhost:5433`)
- Docker API uses compose env (`db:5432`)

## Root scripts

- `npm run dev` - run API, simulator, and web app concurrently
- `npm run dev:api` - API only
- `npm run dev:simulator` - simulator only
- `npm run dev:web` - web app only
- `npm run db:up` / `npm run db:down` - start/stop DB container only
- `npm run db:studio` - start the DB and open it in Prisma Studio
- `npm run docker:up` - start db + api + web in Docker
- `npm run docker:rebuild` - rebuild and start Docker services
- `npm run docker:logs` - stream container logs
- `npm run docker:down` - stop/remove services
- `npm run docker:test` - run API tests in Docker
- `npm run prisma:migrate` - Prisma migrate through the API app
- `npm run prisma:seed` - Prisma seed through the API app
- `npm run test` - API tests
- `npm run test:integration` - API integration tests
- `npm run lint` - web app lint

## API summary

- `GET /api/analytics` - aggregated analytics payload
- `GET /api/users` - customer/user list
- `POST /api/sales` - create sale/order

## Troubleshooting

### `npm run dev` shows Prisma `P1001`

- Ensure DB is running: `npm run db:up`
- Confirm the API URL in `api/.env` uses `localhost:5433`
- Confirm the port is free and Docker DB is healthy: `docker compose ps`

### Docker is up but the API cannot reach DB

- Rebuild once: `npm run docker:rebuild`
- Check API logs: `docker compose logs api --tail=200`
- The Prisma datasource should point at `db:5432`

### Web app starts on a different port

If port `3000` is busy, Next.js may fall back to another port such as `3001`.

## Demo flow

1. `npm run docker:up`
2. Open http://localhost:3000
3. Visit Sales and create an order
4. Return to the dashboard and watch metrics update

## License / usage

This repository is intended as a portfolio/demo project. Adjust secrets and hardening before production use.
