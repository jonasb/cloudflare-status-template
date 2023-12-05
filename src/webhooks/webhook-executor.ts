import type { SqlTag } from 'd1-sql-tag';
import type { HonoRequest } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { insertEvent } from '../db/database-statements';
import { webhooksConfigs } from './webhook-configs';

interface DatabaseContext {
  sql: SqlTag;
}

export async function executeWebhook(
  { sql }: DatabaseContext,
  id: string,
  req: HonoRequest
) {
  const webhook = webhooksConfigs.find((it) => it.id === id);
  if (!webhook) {
    console.warn('Webhook not found', id);
    throw new HTTPException(404, { message: 'Webhook not found' });
  }
  const result = await webhook.parseRequest(req);
  if (result) {
    await insertEvent(sql, {
      webhookId: id,
      probeId: null,
      duration: null,
      ...result,
    }).run();
  }
}
