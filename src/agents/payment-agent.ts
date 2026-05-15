import type { ExtractedEntities, ToolCall } from './types';

export class PaymentAgent {
  async run(reservationId: string, entities: ExtractedEntities): Promise<{ payment_id: string; payment_url: string; toolCall: ToolCall }> {
    const started = Date.now();
    const provider = entities.payment_provider || 'kaspi';
    const payment_id = `pay_${Date.now()}`;

    return {
      payment_id,
      payment_url: `https://pay.mock/${provider}/${payment_id}`,
      toolCall: {
        name: 'create_payment',
        status: 'mock',
        input: { reservation_id: reservationId, provider, amount: entities.budget || 10000 },
        output: { payment_id, provider, status: 'pending' },
        latency_ms: Date.now() - started,
      },
    };
  }
}
