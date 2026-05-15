export type Channel = 'telegram' | 'whatsapp' | 'webchat' | 'instagram' | 'phone';

export type Intent =
  | 'booking_request'
  | 'price_question'
  | 'menu_question'
  | 'payment_question'
  | 'cancel_reservation'
  | 'modify_reservation'
  | 'complaint'
  | 'human_request'
  | 'unknown';

export type AgentAction =
  | 'detect_intent'
  | 'check_availability'
  | 'create_reservation'
  | 'create_payment'
  | 'send_notification'
  | 'sync_iiko'
  | 'sync_1c'
  | 'escalate_to_human'
  | 'propose_upsell'
  | 'write_analytics_event';

export interface CustomerRef {
  name?: string;
  phone?: string;
  external_id?: string;
}

export interface IncomingAgentMessage {
  organization_id: string;
  branch_id?: string;
  channel: Channel;
  customer: CustomerRef;
  message: string;
  conversation_id?: string;
}

export interface ExtractedEntities {
  date?: string;
  time?: string;
  guests?: number;
  budget?: number;
  payment_provider?: 'kaspi' | 'halyk' | 'freedom_pay';
  reservation_id?: string;
}

export interface ToolCall {
  name: string;
  status: 'queued' | 'running' | 'success' | 'error' | 'mock';
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  latency_ms?: number;
}

export interface AgentResult {
  intent: Intent;
  confidence: number;
  response: string;
  actions: AgentAction[];
  toolCalls: ToolCall[];
  shouldEscalate: boolean;
  conversation_id: string;
  entities?: ExtractedEntities;
}

export interface AIProvider {
  name: 'mock' | 'openai' | 'claude' | 'gemini';
  generate(prompt: string): Promise<string>;
  classifyIntent(message: string): Promise<{ intent: Intent; confidence: number }>;
  extractEntities(message: string): Promise<ExtractedEntities>;
}
