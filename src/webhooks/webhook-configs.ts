import { parseVercelWebhook } from './webhook-helper-vercel';
import type { WebhookConfig } from './webhook-types';

export const webhooksConfigs: WebhookConfig[] = [
  {
    id: 'vercel',
    title: 'Vercel',
    parseRequest(req) {
      return parseVercelWebhook(req);
    },
  },
];
