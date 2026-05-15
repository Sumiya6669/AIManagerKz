# Reserva Flow AI

Production-ready AI SaaS for restaurants, cafes, restobars, hotels and hospitality teams. The product automates incoming messages, reservations, payments, reminders, AI operator workflows and integrations with iiko, 1C, Kaspi, Halyk and n8n.

## Stack

- Vite + React
- Tailwind CSS + Radix UI primitives
- Framer Motion
- Recharts
- Supabase Auth/Postgres/RLS
- Vercel Functions for API/webhooks
- Mock-ready AI provider layer for OpenAI, Claude and Gemini

## Features

- Premium SaaS landing page with live dashboard preview and floating AI activity cards.
- AI Command Center dashboard with business metrics, realtime activity, insights and tool-call audit.
- AI Dialogs operator center with intent, confidence, sentiment, notes, escalation and timeline.
- Agent architecture in `src/agents`.
- Payment/POS/accounting adapter architecture in `src/integrations`.
- Supabase schema, RLS policies and seed data.
- Vercel API endpoints for agent messages, n8n and payment webhooks.
- Demo mode works without external keys.

## Install

```bash
npm install
cp .env.example .env.local
npm run dev
```

Production build:

```bash
npm run build
```

## Environment variables

Copy `.env.example` to `.env.local` locally and add the same variables in Vercel:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
N8N_WEBHOOK_SECRET=
TELEGRAM_BOT_TOKEN=
WHATSAPP_API_TOKEN=
KASPI_API_KEY=
HALYK_API_KEY=
FREEDOM_PAY_API_KEY=
IIKO_API_KEY=
ONE_C_API_URL=
ONE_C_API_TOKEN=
```

Without provider keys, the app uses mock providers.

## Supabase setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. Run `supabase/rls.sql`.
5. Run `supabase/seed.sql`.
6. Copy project URL and anon key into `.env.local`.
7. Add `SUPABASE_SERVICE_ROLE_KEY` only to server environments such as Vercel.

Core tenant tables use `organization_id`, RLS and indexes. The app currently runs in demo mode when Supabase env vars are missing.

## GitHub setup

If the repository is not connected yet:

```bash
git init
git add .
git commit -m "Production-ready AI Manager SaaS"
git branch -M main
git remote add origin <repo_url>
git push -u origin main
```

Git is not required to run the app locally, but GitHub is recommended for Vercel preview deployments and pull-request review.

## Vercel deployment

1. Push the repo to GitHub.
2. In Vercel, import the GitHub repository.
3. Framework preset: Vite.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add all production environment variables from `.env.example`.
7. Deploy.
8. Verify:
   - `/` loads landing.
   - `/dashboard` loads Command Center.
   - `POST /api/agents/message` returns an agent response.
   - Supabase tables receive records after real backend persistence is connected.

For custom CI:

```bash
vercel pull --yes --environment=production --token=$VERCEL_TOKEN
vercel build --prod --token=$VERCEL_TOKEN
vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN
```

## n8n setup

See `docs/n8n-workflows.md`.

Primary endpoint:

```http
POST /api/agents/message
```

n8n-secured endpoint:

```http
POST /api/webhooks/n8n/message
Authorization: Bearer <N8N_WEBHOOK_SECRET>
```

## AI agents architecture

Files:

- `src/agents/types.ts`
- `src/agents/providers.ts`
- `src/agents/intent-agent.ts`
- `src/agents/availability-agent.ts`
- `src/agents/booking-agent.ts`
- `src/agents/payment-agent.ts`
- `src/agents/integration-agent.ts`
- `src/agents/orchestrator.ts`

`AgentOrchestrator.handleMessage()` returns:

```ts
{
  intent,
  confidence,
  response,
  actions,
  toolCalls,
  shouldEscalate
}
```

Supported agents:

- IntakeAgent
- IntentAgent
- BookingAgent
- AvailabilityAgent
- PaymentAgent
- IntegrationAgent
- NotificationAgent
- EscalationAgent
- UpsellAgent
- AnalyticsAgent

The current implementation includes working mock orchestration and provider interfaces. Add real provider calls by implementing `AIProvider.generate`, `classifyIntent` and `extractEntities` in `src/agents/providers.ts`.

## Real integrations

Payment adapters:

- `PaymentProvider`
- `KaspiPaymentProvider`
- `HalykPaymentProvider`
- `FreedomPayProvider`
- `MockPaymentProvider`

POS adapters:

- `PosProvider`
- `IikoProvider`
- `MockIikoProvider`

Accounting adapters:

- `AccountingProvider`
- `OneCProvider`
- `MockOneCProvider`

Replace mock methods with real API calls, then write all request/response payloads to `integration_logs`.

## Roadmap

- Persist agent endpoint results to Supabase with service role.
- Add Supabase Auth screens and invitation flow.
- Add Stripe or local billing portal.
- Add real Kaspi/Halyk/FreedomPay API implementations.
- Add iiko and 1C production credentials and retry queues.
- Add Playwright E2E tests for landing, dashboard, dialogs and webhooks.

## Troubleshooting

- Missing Supabase keys: app falls back to demo mode.
- Vercel function returns 401 for n8n: check `N8N_WEBHOOK_SECRET`.
- Build cannot find dependencies: run `npm install` and commit lockfile.
- SPA route returns 404 on Vercel: verify `vercel.json` rewrites.
- Payment webhook is accepted but nothing persists: connect endpoint to Supabase service role writes.
## Production SaaS Update

### Environment

Frontend may use only public browser-safe keys:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Server-only keys must be configured in Vercel without `VITE_` prefix:

```bash
SUPABASE_SERVICE_ROLE_KEY=
N8N_WEBHOOK_SECRET=
TELEGRAM_BOT_TOKEN=
WHATSAPP_API_TOKEN=
KASPI_API_KEY=
HALYK_API_KEY=
FREEDOM_PAY_API_KEY=
IIKO_API_KEY=
ONE_C_API_URL=
ONE_C_API_TOKEN=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
```

Never put `sb_secret`, service-role or provider secret keys into `VITE_*` variables. If this happened, rotate the leaked key in Supabase/Vercel.

### Auth and Registration

The SaaS registration flow lives at `/register`.

It calls `POST /api/auth/register`, which uses `SUPABASE_SERVICE_ROLE_KEY` server-side to create:

- Supabase Auth user
- organization
- branch
- owner profile
- mock integration settings

After registration the frontend signs in with Supabase Auth and redirects to `/onboarding`, then `/dashboard`.

### i18n

The app supports Russian, Kazakh and English through `src/i18n/index.jsx`.

Language is persisted in `localStorage` and controlled by the global language switcher.

### API Endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/agents/message`
- `POST /api/webhooks/n8n/message`
- `POST /api/webhooks/payments/:provider`
- `POST /api/webhooks/telegram`
- `POST /api/webhooks/whatsapp`

### Docs

- `docs/deployment.md`
- `docs/integrations.md`
- `docs/n8n-workflows.md`
