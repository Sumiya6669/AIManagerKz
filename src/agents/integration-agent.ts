import type { ToolCall } from './types';

export class IntegrationAgent {
  async syncReservation(reservationId: string): Promise<ToolCall[]> {
    const started = Date.now();
    return [
      {
        name: 'sync_iiko',
        status: 'mock',
        input: { reservation_id: reservationId },
        output: { external_id: `iiko_${reservationId}` },
        latency_ms: Date.now() - started,
      },
      {
        name: 'sync_1c',
        status: 'mock',
        input: { reservation_id: reservationId },
        output: { queued: true },
        latency_ms: Date.now() - started,
      },
    ];
  }
}
