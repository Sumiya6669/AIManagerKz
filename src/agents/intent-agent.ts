import type { AIProvider, IncomingAgentMessage } from './types';

export class IntentAgent {
  constructor(private provider: AIProvider) {}

  async run(input: IncomingAgentMessage) {
    const [{ intent, confidence }, entities] = await Promise.all([
      this.provider.classifyIntent(input.message),
      this.provider.extractEntities(input.message),
    ]);

    return { intent, confidence, entities };
  }
}
