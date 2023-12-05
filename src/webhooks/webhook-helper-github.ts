import type { HonoRequest } from 'hono';
import type { WebhookResult } from './webhook-types';

export async function parseGithubWebhook(
  req: HonoRequest
): Promise<WebhookResult | null> {
  const type = req.header('x-github-event')!;

  await req.text();

  return {
    result: 'success',
    category: type,
    description: null,
  };
}
