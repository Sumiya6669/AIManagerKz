# Reserva Flow AI Integrations

All integrations are provider-based. Until production keys are added, providers run in mock mode and still write UI status, logs and agent tool calls.

## Communication

| Provider | Endpoint | Required ENV |
| --- | --- | --- |
| Telegram Bot | `POST /api/webhooks/telegram` | `TELEGRAM_BOT_TOKEN` |
| WhatsApp Business API | `POST /api/webhooks/whatsapp` | `WHATSAPP_API_TOKEN` |
| Instagram Direct | placeholder | `INSTAGRAM_API_TOKEN` |
| Web Chat | `POST /api/agents/message` | `VITE_WEBCHAT_PUBLIC_KEY` optional |

## Payments

| Provider | Webhook | Required ENV |
| --- | --- | --- |
| Kaspi Pay | `POST /api/webhooks/payments/kaspi` | `KASPI_API_KEY` |
| Halyk | `POST /api/webhooks/payments/halyk` | `HALYK_API_KEY` |
| Freedom Pay | `POST /api/webhooks/payments/freedom_pay` | `FREEDOM_PAY_API_KEY` |
| Manual payment | UI/manual status update | none |

## POS and Accounting

| Provider | Purpose | Required ENV |
| --- | --- | --- |
| iiko | reservation sync, table/slot sync | `IIKO_API_KEY` |
| 1C | payment/accounting export | `ONE_C_API_URL`, `ONE_C_API_TOKEN` |

## Automation

`n8n` posts incoming messages to `POST /api/webhooks/n8n/message` with `x-n8n-secret`.

Required ENV:

```bash
N8N_WEBHOOK_SECRET=
```

## Production Rule

Frontend may use only:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Server-only keys must stay in Vercel environment variables without the `VITE_` prefix.
