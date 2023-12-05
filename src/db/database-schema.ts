export interface DatabaseSchema {
  events: {
    id: number;
    created_at: string;
    probe_id: string | null;
    webhook_id: string | null;
    duration: number | null;
    result: 'success' | 'failure';
    category: string;
    description: string | null;
  };

  log_lines: {
    id: number;
    created_at: string;
    level: 'info' | 'warn' | 'error';
    message: string;
  };

  probe_statuses: {
    id: string;
    last_started_at: string;
    last_result: 'success' | 'failure' | '';
    last_success_at: string | null;
    last_failure_at: string | null;
    same_result_since: string | null;
  };
}
