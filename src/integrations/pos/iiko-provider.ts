import type { PosProvider, PosReservationPayload } from './types';

export class MockIikoProvider implements PosProvider {
  name = 'mock_iiko';

  async syncReservation(input: PosReservationPayload) {
    return { external_id: `mock_iiko_${input.reservation_id}`, status: 'synced' as const, raw: { mock: true, input } };
  }

  async cancelReservation(reservationId: string) {
    return { status: 'queued' as const, raw: { mock: true, reservationId } };
  }
}

export class IikoProvider extends MockIikoProvider {
  name = 'iiko';
}
