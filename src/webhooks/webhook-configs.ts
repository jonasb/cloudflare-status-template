import { parseVercelWebhook } from './webhook-helper-vercel';
import type { WebhookConfig } from './webhook-types';

export const webhooksConfigs: WebhookConfig[] = [
  {
    id: 'github-webhook',
    title: 'GitHub',
    parseRequest(req) {
      return parseVercelWebhook(req);
    },
  },
  {
    id: 'vercel-webhook',
    title: 'Vercel',
    parseRequest(req) {
      return parseVercelWebhook(req);
    },
  },
];
