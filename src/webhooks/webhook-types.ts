import type { HonoRequest } from 'hono';

export interface WebhookConfig {
  id: string;
  title: string;
  parseRequest(req: HonoRequest): Promise<WebhookResult | null>;
}

export interface WebhookResult {
  result: 'success' | 'failure';
  category: string;
  description: string | null;
}
