# Contributing

## Development workflow

1. Create a branch from `main`.
2. Copy `.env.example` to `.env.local` and fill only the keys you need.
3. Run `npm install`.
4. Run `npm run dev`.
5. Before opening a PR, run `npm run build`.

## Production rules

- Do not commit secrets, `.env.local`, `.vercel`, build output, or Supabase service keys.
- Tenant data must always include `organization_id`.
- Backend writes that use `SUPABASE_SERVICE_ROLE_KEY` must validate organization ownership first.
- Add integration logs for every external webhook, payment event, POS sync, and AI tool call.
- Real payment/POS/accounting providers should implement the provider interfaces in `src/integrations`.

## Pull request checklist

- UI is responsive on mobile and desktop.
- New data tables include RLS policies and indexes.
- New API endpoints validate required input and return structured errors.
- Mock providers remain usable when production API keys are missing.
