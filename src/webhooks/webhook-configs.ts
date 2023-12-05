import { parseGithubWebhook } from './webhook-helper-github';
import { parseVercelWebhook } from './webhook-helper-vercel';
import type { WebhookConfig } from './webhook-types';

export const webhooksConfigs: WebhookConfig[] = [
  {
    id: 'github-webhook',
    title: 'GitHub',
    parseRequest(req) {
      return parseGithubWebhook(req);
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
