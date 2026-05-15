import type { AgentAction, AgentResult, AIProvider, IncomingAgentMessage, ToolCall } from './types';
import { AvailabilityAgent } from './availability-agent';
import { BookingAgent } from './booking-agent';
import { IntentAgent } from './intent-agent';
import { IntegrationAgent } from './integration-agent';
import { PaymentAgent } from './payment-agent';
import { createAIProvider } from './providers';

export class AgentOrchestrator {
  private intentAgent: IntentAgent;
  private availabilityAgent = new AvailabilityAgent();
  private bookingAgent = new BookingAgent();
  private paymentAgent = new PaymentAgent();
  private integrationAgent = new IntegrationAgent();

  constructor(private provider: AIProvider = createAIProvider()) {
    this.intentAgent = new IntentAgent(provider);
  }

  async handleMessage(input: IncomingAgentMessage): Promise<AgentResult> {
    const toolCalls: ToolCall[] = [];
    const actions: AgentAction[] = ['detect_intent'];
    const { intent, confidence, entities } = await this.intentAgent.run(input);

    toolCalls.push({
      name: 'detect_intent',
      status: this.provider.name === 'mock' ? 'mock' : 'success',
      input: { message: input.message },
      output: { intent, confidence, entities },
    });

    let response = await this.provider.generate(`${intent}: ${input.message}`);
    let shouldEscalate = confidence < 0.65 || intent === 'complaint' || intent === 'human_request';
    let conversation_id = input.conversation_id || `conv_${Date.now()}`;

    if (intent === 'booking_request' && !shouldEscalate) {
      actions.push('check_availability', 'create_reservation', 'create_payment', 'send_notification', 'sync_iiko', 'sync_1c', 'propose_upsell');

      const availability = await this.availabilityAgent.run(entities);
      toolCalls.push(availability.toolCall);

      if (availability.available) {
        const booking = await this.bookingAgent.run(input, entities, availability.table_id);
        toolCalls.push(booking.toolCall);

        const payment = await this.paymentAgent.run(booking.reservation_id, entities);
        toolCalls.push(payment.toolCall);

        toolCalls.push(...await this.integrationAgent.syncReservation(booking.reservation_id));
        toolCalls.push({
          name: 'send_notification',
          status: 'mock',
          input: { customer: input.customer, payment_url: payment.payment_url },
          output: { delivered: true },
        });

        response = `Нашел доступный слот и создал бронь. Ссылка на предоплату: ${payment.payment_url}. После оплаты бронь будет подтверждена и отправлена в iiko.`;
      }
    }

    if (shouldEscalate) {
      actions.push('escalate_to_human', 'send_notification');
      toolCalls.push({
        name: 'send_notification',
        status: 'mock',
        input: { channel: 'manager', reason: intent },
        output: { delivered: true },
      });
      response = 'Передаю диалог менеджеру. Я сохранил резюме и все параметры запроса.';
    }

    actions.push('write_analytics_event');

    return {
      intent,
      confidence,
      response,
      actions,
      toolCalls,
      shouldEscalate,
      conversation_id,
      entities,
    };
  }
}
