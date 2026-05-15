import { handleAgentMessage } from '../../src/agents/runtime.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });

  const body = request.body || {};
  const entry = body.entry?.[0]?.changes?.[0]?.value;
  const incoming = entry?.messages?.[0] || body.message || {};
  const contact = entry?.contacts?.[0] || body.customer || {};
  const message = incoming.text?.body || incoming.body || body.text || '';

  if (!message) return response.status(200).json({ ok: true, skipped: 'empty message' });

  const result = await handleAgentMessage({
    organization_id: request.query.organization_id || 'whatsapp_default_org',
    channel: 'whatsapp',
    customer: {
      name: contact.profile?.name || contact.name || 'WhatsApp customer',
      phone: incoming.from || contact.wa_id || '',
      external_id: incoming.id || incoming.from || '',
    },
    message,
  });

  response.status(200).json({ ok: true, reply: result.reply, intent: result.intent, toolCalls: result.toolCalls });
}
