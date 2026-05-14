import { handleAgentMessage } from '../../src/agents/runtime.js';

function setCors(response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-N8N-Signature');
}

export default async function handler(request, response) {
  setCors(response);

  if (request.method === 'OPTIONS') return response.status(204).end();
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });

  try {
    const body = request.body || {};
    if (!body.organization_id || !body.channel || !body.customer || !body.message) {
      return response.status(400).json({ error: 'organization_id, channel, customer and message are required' });
    }

    const result = await handleAgentMessage(body);
    return response.status(200).json(result);
  } catch (error) {
    console.error('Agent message endpoint failed', error);
    return response.status(500).json({ error: 'Agent processing failed' });
  }
}
