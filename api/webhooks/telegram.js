import { handleAgentMessage } from '../../src/agents/runtime.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });

  const update = request.body || {};
  const message = update.message?.text || update.edited_message?.text || '';
  const chat = update.message?.chat || update.edited_message?.chat || {};
  const from = update.message?.from || update.edited_message?.from || {};

  if (!message) return response.status(200).json({ ok: true, skipped: 'empty message' });

  const result = await handleAgentMessage({
    organization_id: request.query.organization_id || 'telegram_default_org',
    channel: 'telegram',
    customer: {
      name: [from.first_name, from.last_name].filter(Boolean).join(' ') || from.username || 'Telegram customer',
      phone: '',
      external_id: String(chat.id || from.id || ''),
    },
    message,
  });

  response.status(200).json({ ok: true, reply: result.reply, intent: result.intent, toolCalls: result.toolCalls });
}
