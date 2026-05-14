import type { AIProvider, ExtractedEntities, Intent } from './types';

function env(name: string): string | undefined {
  if (typeof process !== 'undefined') return process.env?.[name];
  return undefined;
}

function keywordIntent(message: string): { intent: Intent; confidence: number } {
  const text = message.toLowerCase();
  if (/(оператор|админ|менеджер|позовите|с человеком|manager|human)/i.test(text)) return { intent: 'human_request', confidence: 0.9 };
  if (/(жалоб|плохо|ужас|недовол|complaint)/i.test(text)) return { intent: 'complaint', confidence: 0.88 };
  if (/(отмен|cancel)/i.test(text)) return { intent: 'cancel_reservation', confidence: 0.86 };
  if (/(перенес|измен|modify|change)/i.test(text)) return { intent: 'modify_reservation', confidence: 0.84 };
  if (/(брон|стол|номер|гост|сегодня|завтра|вечер|reservation|book)/i.test(text)) return { intent: 'booking_request', confidence: 0.94 };
  if (/(оплат|kaspi|halyk|депозит|предоплат|pay)/i.test(text)) return { intent: 'payment_question', confidence: 0.87 };
  if (/(меню|блюд|еда|напит|menu)/i.test(text)) return { intent: 'menu_question', confidence: 0.82 };
  if (/(цена|стоим|прайс|сколько|price)/i.test(text)) return { intent: 'price_question', confidence: 0.8 };
  return { intent: 'unknown', confidence: 0.55 };
}

function extractMockEntities(message: string): ExtractedEntities {
  const text = message.toLowerCase();
  const guestsMatch = text.match(/(\d+)\s*(гост|человек|персон|people|guests)/);
  const timeMatch = text.match(/([01]?\d|2[0-3])[:. ]?([0-5]\d)?/);
  const provider = text.includes('halyk') ? 'halyk' : text.includes('freedom') ? 'freedom_pay' : text.includes('kaspi') ? 'kaspi' : undefined;

  return {
    guests: guestsMatch ? Number(guestsMatch[1]) : undefined,
    time: timeMatch ? `${timeMatch[1].padStart(2, '0')}:${timeMatch[2] || '00'}` : undefined,
    date: text.includes('завтра') ? 'tomorrow' : text.includes('сегодня') ? 'today' : undefined,
    payment_provider: provider,
  };
}

export class MockAIProvider implements AIProvider {
  name = 'mock' as const;

  async generate(prompt: string): Promise<string> {
    if (/booking_request/.test(prompt)) {
      return 'Проверяю доступность и могу сразу создать бронь. Подскажите имя, количество гостей и удобный способ предоплаты.';
    }
    if (/payment_question/.test(prompt)) {
      return 'Можно оплатить через Kaspi, Halyk или FreedomPay. Я подготовлю ссылку и обновлю статус брони после webhook.';
    }
    if (/complaint|human_request/.test(prompt)) {
      return 'Передаю диалог менеджеру и сохраню краткое резюме для быстрого ответа.';
    }
    return 'Принял сообщение. Уточняю детали и продолжу диалог в рамках правил организации.';
  }

  async classifyIntent(message: string) {
    return keywordIntent(message);
  }

  async extractEntities(message: string) {
    return extractMockEntities(message);
  }
}

abstract class HttpAIProvider implements AIProvider {
  abstract name: AIProvider['name'];
  protected abstract apiKeyEnv: string;

  protected get apiKey() {
    return env(this.apiKeyEnv);
  }

  async generate(prompt: string): Promise<string> {
    if (!this.apiKey) return new MockAIProvider().generate(prompt);
    return `Provider ${this.name} configured. Replace generate() with provider-specific production call.`;
  }

  async classifyIntent(message: string) {
    if (!this.apiKey) return new MockAIProvider().classifyIntent(message);
    return keywordIntent(message);
  }

  async extractEntities(message: string) {
    if (!this.apiKey) return new MockAIProvider().extractEntities(message);
    return extractMockEntities(message);
  }
}

export class OpenAIProvider extends HttpAIProvider {
  name = 'openai' as const;
  protected apiKeyEnv = 'OPENAI_API_KEY';
}

export class ClaudeProvider extends HttpAIProvider {
  name = 'claude' as const;
  protected apiKeyEnv = 'ANTHROPIC_API_KEY';
}

export class GeminiProvider extends HttpAIProvider {
  name = 'gemini' as const;
  protected apiKeyEnv = 'GOOGLE_GENERATIVE_AI_API_KEY';
}

export function createAIProvider(providerName = env('AI_PROVIDER') || 'mock'): AIProvider {
  if (providerName === 'openai') return new OpenAIProvider();
  if (providerName === 'claude') return new ClaudeProvider();
  if (providerName === 'gemini') return new GeminiProvider();
  return new MockAIProvider();
}
