# Deployment

## Vercel

Project type: Vite.

Build command:

```bash
npm run build
```

Output directory:

```bash
dist
```

`vercel.json` rewrites all non-API paths to `index.html`, so React Router routes work in production.

## Required Vercel ENV

Client:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Server-only:

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

Never put service role or secret keys into `VITE_*` variables.

## Production Verification

After deploy, check:

- `/`
- `/login`
- `/register`
- `/onboarding`
- `/dashboard`
- `/ai-dialogs`
- `/integrations`
- `/settings`
- `/api/health`

Expected behavior: public pages render immediately; protected pages show either dashboard for authenticated users or a visible auth-required screen, never a white screen.
