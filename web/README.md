# Web App (Next.js)

Web app for the E-Commerce Analytics Dashboard. This app visualizes KPIs, products, orders, and customer activity with live-refresh support.

## Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- Axios for API access
- Chart.js / react-chartjs-2 for visualizations

## App pages

- `/` - dashboard
- `/analytics` - analytics view
- `/products` - product insights
- `/orders` - order history and revenue signals
- `/sales` - create custom sale/order
- `/customers` - customer monitoring
- `/settings` - polling preferences

## Data flow

- API client: `src/lib/api.ts`
- Hooks: `src/hooks/useAnalytics.ts`, `src/hooks/useUsers.ts`
- Types: `src/types/analytics.ts`

This structure keeps transport logic centralized and UI components focused on rendering state.

## Environment setup

Copy the example file:

```bash
copy .env.example .env.local
```

Expected values:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
API_URL=http://localhost:5000/api
```

## Development

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Open http://localhost:3000.

## Scripts

- `npm run dev` - start Next.js dev server
- `npm run build` - production build
- `npm run start` - run built app
- `npm run lint` - lint web app code

## Notes

- Requires the API app running at `NEXT_PUBLIC_API_URL`
- Polling behavior is controlled by hook options and settings state
