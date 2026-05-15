import type { ExtractedEntities, IncomingAgentMessage, ToolCall } from './types';

export class BookingAgent {
  async run(input: IncomingAgentMessage, entities: ExtractedEntities, tableId?: string): Promise<{ reservation_id: string; toolCall: ToolCall }> {
    const started = Date.now();
    const reservation_id = `rsv_${Date.now()}`;

    return {
      reservation_id,
      toolCall: {
        name: 'create_reservation',
        status: 'mock',
        input: {
          organization_id: input.organization_id,
          customer: input.customer,
          entities,
          table_id: tableId,
        },
        output: { reservation_id, status: 'pending_payment' },
        latency_ms: Date.now() - started,
      },
    };
  }
}
