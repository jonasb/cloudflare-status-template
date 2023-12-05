import type { RowType, SqlTag } from 'd1-sql-tag';
import { TimezoneSwitcher } from '../components/timezone-switcher';
import {
  selectLatestEvents,
  selectProbeStatuses,
} from '../db/database-statements';
import { probeConfigs } from '../probes/probe-configs';
import { formatDate, formatDateTime, formatTime } from '../utils/date-display';
import { webhooksConfigs } from '../webhooks/webhook-configs';
import { Layout } from './layout';

export async function StatusPage({
  sql,
  timezone,
}: {
  sql: SqlTag;
  timezone: string;
}) {
  const [{ results: probeStatuses }, { results: events }] = await sql.batch([
    selectProbeStatuses(sql),
    selectLatestEvents(sql),
  ] as const);

  return (
    <Layout title="Cloudflare Status Template">
      <h1>Cloudflare Status Template</h1>
      <ProbeOverview probeStatuses={probeStatuses} timezone={timezone} />
      <TimezoneSwitcher timezone={timezone} />
      <EventHistory events={events} timezone={timezone} />
      <button
        type="button"
        onClick="fetch('/execute').then(res => res.text()).then(() => window.location.reload())"
      >
        Execute
      </button>
    </Layout>
  );
}

function ProbeOverview({
  probeStatuses,
  timezone,
}: {
  probeStatuses: RowType<typeof selectProbeStatuses>[];
  timezone: string;
}) {
  return (
    <ul>
      {probeConfigs.map((probe) => {
        const status = probeStatuses.find((it) => it.id === probe.id);
        let lastOppositeResult;
        switch (status?.lastResult) {
          case 'failure':
            lastOppositeResult = status.lastSuccessAt
              ? `last success ${formatDateTime(status.lastSuccessAt, timezone)}`
              : 'never succeeded';
            break;
          case 'success':
            lastOppositeResult = status.lastFailureAt
              ? `last failure ${formatDateTime(status.lastFailureAt, timezone)}`
              : 'never failed';
            break;
          default:
            break;
        }
        return (
          <li>
            <EventResult result={status?.lastResult ?? ''} /> {probe.title}{' '}
            {status?.sameResultSince &&
              'since ' + formatDateTime(status.sameResultSince, timezone)}
            {lastOppositeResult && ` (${lastOppositeResult})`}
          </li>
        );
      })}
    </ul>
  );
}

function EventHistory({
  events,
  timezone,
}: {
  events: RowType<typeof selectLatestEvents>[];
  timezone: string;
}) {
  const groups: Record<string, RowType<typeof selectLatestEvents>[]> = {};
  for (const event of events) {
    const date = formatDate(event.createdAt, timezone);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
  }

  return (
    <>
      <h2>Recent events</h2>
      <div class="full-bleed-scroll-container">
        <table class="table">
          <tbody>
            {Object.entries(groups).map(([date, groupEvents]) => (
              <>
                <tr>
                  <th colspan={5}>
                    <h3>{date}</h3>
                  </th>
                </tr>
                {groupEvents.map((event) => {
                  const source = event.probeId
                    ? probeConfigs.find((it) => it.id === event.probeId)
                    : webhooksConfigs.find((it) => it.id === event.webhookId);
                  return (
                    <tr>
                      <td>
                        <EventResult result={event.result} /> {source?.title}
                      </td>
                      <td>{event.category}</td>
                      <td>{formatTime(event.createdAt, timezone)}</td>
                      <td>
                        {event.duration === null ? '' : event.duration + ' ms'}
                      </td>
                      <td>{event.description}</td>
                    </tr>
                  );
                })}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function EventResult({ result }: { result: string }) {
  return <span>{{ success: '🟩', failure: '🟥' }[result] ?? '❓'}</span>;
}
