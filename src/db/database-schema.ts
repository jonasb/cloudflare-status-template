type Brand<K, T> = K & { __brand: T };

export type EventId = Brand<number, 'EventId'>;
export type LogLineId = Brand<number, 'LogLineId'>;
export type ProbeId = Brand<string, 'ProbeId'>;
export type WebhookId = Brand<string, 'WebhookId'>;

export interface DatabaseSchema {
  events: {
    id: EventId;
    created_at: string;
    probe_id: ProbeId | null;
    webhook_id: WebhookId | null;
    duration: number | null;
    result: 'success' | 'failure';
    category: string;
    description: string | null;
  };

  log_lines: {
    id: LogLineId;
    created_at: string;
    level: 'info' | 'warn' | 'error';
    message: string;
  };

  probe_statuses: {
    id: ProbeId;
    last_started_at: string;
    last_result: 'success' | 'failure' | '';
    last_success_at: string | null;
    last_failure_at: string | null;
    same_result_since: string | null;
  };
}
