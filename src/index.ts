import { createD1SqlTag, logQueryResults } from 'd1-sql-tag';
import { Hono, type Context } from 'hono';
import { endTime, setMetric, startTime, timing } from 'hono/timing';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

function createSqlTag(c: Context<{ Bindings: Bindings }>) {
  return createD1SqlTag(c.env.DB, {
    beforeQuery(batchId, queries) {
      startTime(c, `db-${batchId}`);
    },
    afterQuery(batchId, queries, results, duration) {
      endTime(c, `db-${batchId}`);
      results.forEach((result, i) => {
        setMetric(c, `db-${batchId}-query-${i + 1}`, result.meta.duration);
      });
      logQueryResults(queries, results, duration);
    },
  });
}

app.use('*', timing());

app.get('/', async (c) => {
  const sql = createSqlTag(c);
  const result = await sql`SELECT ${'hello world'} AS message`.all<{
    message: string;
  }>();
  return c.text(`Message: ${result.results[0].message}`);
});

export default app;
