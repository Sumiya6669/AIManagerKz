export interface AccountingProvider {
  name: string;
  syncPayment(input: { organization_id: string; payment_id: string; amount: number; currency: string }): Promise<{ external_id: string; status: 'synced' | 'queued' | 'failed'; raw?: unknown }>;
}
