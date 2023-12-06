import type { RowType } from 'd1-sql-tag';
import type { selectLatestEvents } from '../db/database-statements';
import { probeConfigs } from '../probes/probe-configs';
import { formatDate, formatTime } from '../utils/date-display';
import { webhooksConfigs } from '../webhooks/webhook-configs';
import { Indicator } from './indicator';

export function EventHistory({
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
                        <Indicator result={event.result} /> {source?.title}
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
