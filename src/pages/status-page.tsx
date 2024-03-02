import type { SqlTag } from 'd1-sql-tag';
import { EventHistory } from '../components/event-history';
import { LogLines } from '../components/log-lines';
import { ProbeOverview } from '../components/probe-overview';
import { TimezoneSwitcher } from '../components/timezone-switcher';
import {
  selectLatestEvents,
  selectLatestLogLines,
  selectProbeStatuses,
} from '../db/database-statements';
import { Layout } from './layout';

export async function StatusPage({
  sql,
  timezone,
  enableExecuteAllProbes,
}: {
  sql: SqlTag;
  timezone: string;
  enableExecuteAllProbes: boolean;
}) {
  const [
    { results: probeStatuses },
    { results: events },
    { results: logLines },
  ] = await sql.batch([
    selectProbeStatuses(sql),
    selectLatestEvents(sql),
    selectLatestLogLines(sql),
  ] as const);

  return (
    <Layout title="Cloudflare Status Template">
      <h1>Cloudflare Status Template</h1>
      <ProbeOverview probeStatuses={probeStatuses} timezone={timezone} />
      <TimezoneSwitcher timezone={timezone} />
      <EventHistory events={events} timezone={timezone} />
      <LogLines logLines={logLines} timezone={timezone} />
      {enableExecuteAllProbes && (
        <button
          type="button"
          style="margin-top: 2rem;"
          onClick={
            "fetch('/api/execute-all-probes').then(res => res.text()).then(() => window.location.reload())" as any
          }
        >
          Execute all probes
        </button>
      )}
    </Layout>
  );
}
