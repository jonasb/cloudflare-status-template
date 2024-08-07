import { Hono } from 'hono';
import { timing } from 'hono/timing';
import { getFavicon } from './assets/favicon';
import { defaultTimezone } from './components/timezone-switcher';
import { createCronSqlTag, createSqlTag } from './db/sql-tag';
import { StatusPage } from './pages/status-page';
import { executeAllProbes, executeCronProbes } from './probes/probe-executor';
import { createPersistentLogger } from './utils/persistent-logger';
import { executeWebhook } from './webhooks/webhook-executor';

export type Bindings = Env & Record<string, string>;

type CloudflareHono = Hono<{ Bindings: Bindings }> & {
  scheduled?: ExportedHandlerScheduledHandler<Bindings>;
};

const app: CloudflareHono = new Hono();

app.use('*', timing());

app.get('/favicon.ico', (c) => {
  c.header('Content-Type', 'image/x-icon');
  return c.body(getFavicon());
});

app.get('/', async (c) => {
  const sql = createSqlTag(c);
  const timezone = c.req.query('tz') ?? defaultTimezone;
  const enableExecuteAllProbes = c.env.ENABLE_RUNNING_ALL_PROBES === '1';
  return c.html(
    <StatusPage
      sql={sql}
      timezone={timezone}
      enableExecuteAllProbes={enableExecuteAllProbes}
    />
  );
});

app.get('/api/execute-all-probes', async (c) => {
  if (c.env.ENABLE_RUNNING_ALL_PROBES !== '1') {
    return c.text('Not found', 404);
  }
  const sql = createSqlTag(c);
  const logger = createPersistentLogger(sql, c.executionCtx);
  await executeAllProbes({ sql, logger });
  return c.text('done');
});

app.post('/api/webhook/:id', async (c) => {
  const sql = createSqlTag(c);
  const webhookId = c.req.param('id');
  const logger = createPersistentLogger(sql, c.executionCtx);
  await executeWebhook({ sql, logger }, webhookId, c.req);
  return c.text('ok');
});

app.scheduled = async (event, env, context) => {
  const sql = createCronSqlTag(env);
  const logger = createPersistentLogger(sql, context);
  await executeCronProbes({ sql, logger }, event.cron);
};

export default app;
