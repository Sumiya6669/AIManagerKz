import type { ExtractedEntities, ToolCall } from './types';

export class AvailabilityAgent {
  async run(entities: ExtractedEntities): Promise<{ available: boolean; table_id?: string; room_id?: string; toolCall: ToolCall }> {
    const started = Date.now();
    const guests = entities.guests || 2;
    const table_id = guests > 8 ? 'banquet-room-a' : 'vip-table-7';

    return {
      available: true,
      table_id,
      room_id: guests > 8 ? 'room-banquet' : undefined,
      toolCall: {
        name: 'get_available_slots',
        status: 'mock',
        input: { ...entities },
        output: { available: true, table_id },
        latency_ms: Date.now() - started,
      },
    };
  }
}
