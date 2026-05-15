export interface PaymentRequest {
  organization_id: string;
  reservation_id: string;
  amount: number;
  currency: 'KZT' | 'USD';
  customer_phone?: string;
  description?: string;
  return_url?: string;
}

export interface PaymentResult {
  provider: string;
  payment_id: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_url?: string;
  raw?: unknown;
}

export interface PaymentProvider {
  name: string;
  createPayment(input: PaymentRequest): Promise<PaymentResult>;
  getPaymentStatus(paymentId: string): Promise<PaymentResult>;
  handleWebhook(payload: unknown, signature?: string): Promise<PaymentResult>;
}
