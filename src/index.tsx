import { Hono } from 'hono';
import { timing } from 'hono/timing';
import { defaultTimezone } from './components/timezone-switcher';
import { createCronSqlTag, createSqlTag } from './db/sql-tag';
import { Layout } from './pages/layout';
import { StatusPage } from './pages/status-page';
import { executeAllProbes, executeCronProbes } from './probes/probe-executor';
import { executeWebhook } from './webhooks/webhook-executor';

export type Bindings = {
  DB: D1Database;
  ENABLE_RUNNING_ALL_PROBES: '1' | undefined;
};

type CloudflareHono = Hono<{ Bindings: Bindings }> & {
  scheduled?: ExportedHandlerScheduledHandler<Bindings>;
};

const app: CloudflareHono = new Hono();

app.use('*', timing());

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
  await executeAllProbes({ sql });
  return c.text('done');
});

app.post('/webhook/:id', async (c) => {
  const sql = createSqlTag(c);
  const id = c.req.param('id');
  await executeWebhook({ sql }, id, c.req);
  return c.text('ok');
});

app.scheduled = async (event, env, c) => {
  const sql = createCronSqlTag(env);
  await executeCronProbes({ sql }, event.cron);
};

export default app;
