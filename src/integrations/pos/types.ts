export interface PosReservationPayload {
  organization_id: string;
  branch_id: string;
  reservation_id: string;
  customer_name?: string;
  guests: number;
  starts_at: string;
  table_id?: string;
}

export interface PosProvider {
  name: string;
  syncReservation(input: PosReservationPayload): Promise<{ external_id: string; status: 'synced' | 'queued' | 'failed'; raw?: unknown }>;
  cancelReservation(reservationId: string): Promise<{ status: 'cancelled' | 'queued' | 'failed'; raw?: unknown }>;
}
