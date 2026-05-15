export default function handler(request, response) {
  response.status(200).json({
    ok: true,
    service: 'reserva-flow-ai',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    env: {
      supabaseUrl: Boolean(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL),
      serviceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      n8nSecret: Boolean(process.env.N8N_WEBHOOK_SECRET),
      telegram: Boolean(process.env.TELEGRAM_BOT_TOKEN),
      whatsapp: Boolean(process.env.WHATSAPP_API_TOKEN),
    },
  });
}
