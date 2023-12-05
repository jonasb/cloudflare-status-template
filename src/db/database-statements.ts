import type { SqlTag } from 'd1-sql-tag';
import type { StatusEvent } from '../probes/probe-types';
import { convertDate } from './conversion';
import type { DatabaseSchema as DB } from './database-schema';

export function selectProbeStatuses(sql: SqlTag) {
  type Row = Pick<
    DB['probe_statuses'],
    | 'id'
    | 'last_result'
    | 'last_success_at'
    | 'last_failure_at'
    | 'same_result_since'
  >;
  return sql`SELECT id, last_result, last_success_at, last_failure_at, same_result_since FROM probe_statuses`
    .build<Row>()
    .map((row) => ({
      id: row.id,
      lastResult: row.last_result,
      lastSuccessAt: convertDate(row.last_success_at),
      lastFailureAt: convertDate(row.last_failure_at),
      sameResultSince: convertDate(row.same_result_since),
    }));
}

export function selectLatestEvents(sql: SqlTag) {
  type Row = Pick<
    DB['events'],
    | 'category'
    | 'created_at'
    | 'duration'
    | 'probe_id'
    | 'webhook_id'
    | 'result'
    | 'description'
  >;
  return sql`SELECT category, created_at, duration, probe_id, webhook_id, result, description FROM events ORDER BY id DESC LIMIT 30`
    .build<Row>()
    .map((row) => ({
      createdAt: convertDate(row.created_at),
      category: row.category,
      duration: row.duration,
      probeId: row.probe_id,
      webhookId: row.webhook_id,
      result: row.result,
      description: row.description,
    }));
}

export function updateProbeLastStarted(sql: SqlTag, probeId: string) {
  const now = new Date().toISOString();
  return sql`INSERT INTO probe_statuses (id, last_result, last_started_at) VALUES (${probeId}, '', ${now})
    ON CONFLICT (id) DO UPDATE SET last_started_at = ${now}`.build();
}

export function updateProbeStatus(
  sql: SqlTag,
  result: { probeId: string; result: 'success' | 'failure' }
) {
  const now = new Date().toISOString();

  const resultColumn =
    result.result === 'success' ? sql`last_success_at` : sql`last_failure_at`;

  return sql`UPDATE probe_statuses
    SET last_result = ${result.result},
      ${resultColumn} = ${now},
      same_result_since = CASE WHEN last_result = ${result.result} THEN same_result_since ELSE ${now} END
    WHERE id = ${result.probeId}`.build();
}

export function insertEvent(
  sql: SqlTag,
  event: Omit<StatusEvent, 'createdAt'>
) {
  const now = new Date().toISOString();

  return sql`INSERT INTO events (created_at, probe_id, webhook_id, duration, result, category, description)
    VALUES (${now}, ${event.probeId}, ${event.webhookId}, ${event.duration},
            ${event.result}, ${event.category}, ${event.description})`.build();
}

export function insertLogLine(
  sql: SqlTag,
  level: DB['log_lines']['level'],
  message: string
) {
  const now = new Date().toISOString();

  return sql`INSERT INTO log_lines (created_at, level, message) VALUES (${now}, ${level}, ${message})`.build();
}

export function selectLatestLogLines(sql: SqlTag) {
  type Row = Pick<DB['log_lines'], 'created_at' | 'level' | 'message'>;
  return sql`SELECT created_at, level, message FROM log_lines ORDER BY id DESC LIMIT 30`
    .build<Row>()
    .map((row) => ({
      createdAt: convertDate(row.created_at),
      level: row.level,
      message: row.message,
    }));
}
