import type { SqlTag } from 'd1-sql-tag';
import type { HonoRequest } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { insertEvent } from '../db/database-statements';
import type { PersistentLogger } from '../utils/persistent-logger';
import { webhooksConfigs } from './webhook-configs';

interface Context {
  sql: SqlTag;
  logger: PersistentLogger;
}

export async function executeWebhook(
  { sql, logger }: Context,
  webhookId: string,
  req: HonoRequest
) {
  const webhook = webhooksConfigs.find((it) => it.id === webhookId);
  if (!webhook) {
    logger('warn', `Webhook not found (${webhookId})`);
    throw new HTTPException(404, { message: 'Webhook not found' });
  }
  try {
    const result = await webhook.parseRequest(req);
    if (result) {
      await insertEvent(sql, {
        webhookId: webhookId,
        probeId: null,
        duration: null,
        ...result,
      }).run();
    }
  } catch (error) {
    logger(
      'error',
      `Error while executing webhook (${webhookId}): ${
        error instanceof Error ? error.message : error
      }`
    );
    throw error;
  }
}
