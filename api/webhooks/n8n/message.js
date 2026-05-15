import { handleAgentMessage } from '../../../src/agents/runtime.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });

  const expected = process.env.N8N_WEBHOOK_SECRET;
  const received = request.headers['x-n8n-secret'] || request.headers.authorization?.replace('Bearer ', '');
  if (expected && received !== expected) {
    return response.status(401).json({ error: 'Invalid n8n webhook secret' });
  }

  try {
    const result = await handleAgentMessage(request.body || {});
    return response.status(200).json(result);
  } catch (error) {
    console.error('n8n webhook failed', error);
    return response.status(500).json({ error: 'Webhook processing failed' });
  }
}
