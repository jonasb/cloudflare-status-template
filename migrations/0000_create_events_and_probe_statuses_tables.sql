-- Migration number: 0000

CREATE TABLE events (
    id INTEGER PRIMARY KEY,
    created_at TEXT NOT NULL,
    probe_id TEXT,
    webhook_id TEXT,
    duration INTEGER,
    result TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT
) STRICT;

CREATE TABLE probe_statuses (
    id TEXT PRIMARY KEY,
    last_result TEXT NOT NULL,
    last_started_at TEXT NOT NULL,
    last_success_at TEXT,
    last_failure_at TEXT,
    same_result_since TEXT
) STRICT;

