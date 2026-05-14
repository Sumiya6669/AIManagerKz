export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });

  const { provider } = request.query;
  const event = {
    provider,
    payment_id: request.body?.payment_id || `${provider}_${Date.now()}`,
    status: request.body?.status || 'paid',
    received_at: new Date().toISOString(),
    raw: request.body || {},
  };

  return response.status(200).json({
    ok: true,
    event,
    next_actions: ['update payments', 'confirm reservation', 'sync_iiko', 'sync_1c', 'send_notification'],
  });
}
