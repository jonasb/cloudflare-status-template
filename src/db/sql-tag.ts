import { createD1SqlTag, logQueryResults } from 'd1-sql-tag';
import { type Context } from 'hono';
import { endTime, setMetric, startTime } from 'hono/timing';
import type { Bindings } from '..';

export function createSqlTag(c: Context<{ Bindings: Bindings }>) {
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

export function createCronSqlTag(env: Bindings) {
  return createD1SqlTag(env.DB, {
    afterQuery(batchId, queries, results, duration) {
      logQueryResults(queries, results, duration);
    },
  });
}
