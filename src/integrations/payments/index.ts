import type { PaymentProvider, PaymentRequest, PaymentResult } from './types';

abstract class MockablePaymentProvider implements PaymentProvider {
  abstract name: string;

  async createPayment(input: PaymentRequest): Promise<PaymentResult> {
    const payment_id = `${this.name}_${Date.now()}`;
    return {
      provider: this.name,
      payment_id,
      status: 'pending',
      payment_url: `https://pay.mock/${this.name}/${payment_id}?amount=${input.amount}`,
      raw: { mock: true, input },
    };
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentResult> {
    return { provider: this.name, payment_id: paymentId, status: 'pending', raw: { mock: true } };
  }

  async handleWebhook(payload: unknown): Promise<PaymentResult> {
    const payment_id = typeof payload === 'object' && payload && 'payment_id' in payload ? String(payload.payment_id) : `${this.name}_unknown`;
    return { provider: this.name, payment_id, status: 'paid', raw: payload };
  }
}

export class KaspiPaymentProvider extends MockablePaymentProvider {
  name = 'kaspi';
}

export class HalykPaymentProvider extends MockablePaymentProvider {
  name = 'halyk';
}

export class FreedomPayProvider extends MockablePaymentProvider {
  name = 'freedom_pay';
}

export class MockPaymentProvider extends MockablePaymentProvider {
  name = 'mock';
}

export function createPaymentProvider(provider = 'mock'): PaymentProvider {
  if (provider === 'kaspi') return new KaspiPaymentProvider();
  if (provider === 'halyk') return new HalykPaymentProvider();
  if (provider === 'freedom_pay') return new FreedomPayProvider();
  return new MockPaymentProvider();
}

export type { PaymentProvider, PaymentRequest, PaymentResult };
