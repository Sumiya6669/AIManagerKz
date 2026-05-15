# n8n workflows

Reserva Flow AI exposes Vercel API endpoints that n8n can call while the app keeps agent logic centralized.

## Endpoint

`POST /api/agents/message`

Input:

```json
{
  "organization_id": "00000000-0000-0000-0000-000000000001",
  "channel": "telegram",
  "customer": {
    "name": "Айдос",
    "phone": "+77011234567",
    "external_id": "tg_123"
  },
  "message": "Хочу столик на 4 человека сегодня в 20:00"
}
```

Output:

```json
{
  "reply": "Нашел доступный слот и создал бронь...",
  "intent": "booking_request",
  "confidence": 0.94,
  "actions": ["detect_intent", "check_availability", "create_reservation"],
  "toolCalls": [],
  "conversation_id": "conv_..."
}
```

`POST /api/webhooks/n8n/message` accepts the same input and validates `N8N_WEBHOOK_SECRET` with either `Authorization: Bearer <secret>` or `x-n8n-secret`.

## 1. Incoming Message Workflow

Telegram, WhatsApp or WebChat trigger sends a normalized payload to n8n.

Flow:

1. Channel trigger receives message.
2. n8n normalizes customer fields.
3. n8n calls `/api/agents/message`.
4. AgentOrchestrator returns reply, intent, actions and tool calls.
5. n8n sends `reply` back to the original channel.
6. App writes conversation, agent run and tool calls in Supabase.

## 2. Booking Workflow

Flow:

1. Incoming message reaches `IntentAgent`.
2. `BookingAgent` asks `AvailabilityAgent` for tables, rooms or slots.
3. Reservation is created in `reservations`.
4. `PaymentAgent` creates deposit link when required.
5. `NotificationAgent` sends confirmation or payment request.

## 3. Payment Workflow

Flow:

1. Payment provider webhook hits `/api/webhooks/payments/[provider]`.
2. App updates `payments.status`.
3. Confirmed payment updates `reservations.status = confirmed`.
4. `IntegrationAgent` syncs reservation to iiko and 1C.
5. Customer and admin receive notifications.

## 4. Integration Workflow

Flow:

1. Confirmed reservation creates integration job.
2. iiko adapter sends booking to POS.
3. 1C adapter queues accounting event.
4. Every request/response is written to `integration_logs`.

## 5. Reminder Workflow

Cron trigger:

1. n8n queries upcoming reservations.
2. Filters reservations with `starts_at` in next 24 hours.
3. Sends reminder through WhatsApp or Telegram.
4. Writes notification status to `notifications`.

## 6. Analytics Workflow

Cron trigger:

1. n8n collects daily reservations, payments and conversations.
2. Calls `AnalyticsAgent` or a future `/api/agents/analytics` endpoint.
3. Writes recommendations to `analytics_events`.
4. Sends summary to manager channel.

## Required n8n environment

- `N8N_WEBHOOK_SECRET`
- `APP_BASE_URL`
- Channel credentials: Telegram, WhatsApp or WebChat credentials
- Optional provider keys: Kaspi, Halyk, iiko, 1C
