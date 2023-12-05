import type { HonoRequest } from 'hono';
import type { WebhookResult } from './webhook-types';

export async function parseGithubWebhook(
  req: HonoRequest
): Promise<WebhookResult | null> {
  const type = req.header('x-github-event')!;
  console.log('type', type);
  const body = await req.text();
  const json = JSON.parse(body);
  console.log('json', json);

  return {
    result: 'success',
    category: type,
    description: null,
  };
}
