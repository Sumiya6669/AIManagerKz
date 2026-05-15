import type { AccountingProvider } from './types';

export class MockOneCProvider implements AccountingProvider {
  name = 'mock_1c';

  async syncPayment(input: { organization_id: string; payment_id: string; amount: number; currency: string }) {
    return { external_id: `mock_1c_${input.payment_id}`, status: 'queued' as const, raw: { mock: true, input } };
  }
}

export class OneCProvider extends MockOneCProvider {
  name = '1c';
}
