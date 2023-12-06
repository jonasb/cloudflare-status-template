import type { RowType } from 'd1-sql-tag';
import type { selectProbeStatuses } from '../db/database-statements';
import { probeConfigs } from '../probes/probe-configs';
import type { ProbeConfig } from '../probes/probe-types';
import { formatDateTime } from '../utils/date-display';
import { Indicator } from './indicator';

export function ProbeOverview({
  probeStatuses,
  timezone,
}: {
  probeStatuses: RowType<typeof selectProbeStatuses>[];
  timezone: string;
}) {
  return (
    <ul>
      {probeConfigs.map((probeConfig) => {
        const status =
          probeStatuses.find((it) => it.id === probeConfig.id) ?? null;
        return (
          <ProbeCard
            probeConfig={probeConfig}
            probeStatus={status}
            timezone={timezone}
          />
        );
      })}
    </ul>
  );
}

function ProbeCard({
  probeConfig,
  probeStatus,
  timezone,
}: {
  probeConfig: ProbeConfig;
  probeStatus: RowType<typeof selectProbeStatuses> | null;
  timezone: string;
}) {
  let lastOppositeResult;
  switch (probeStatus?.lastResult) {
    case 'failure':
      lastOppositeResult = probeStatus.lastSuccessAt
        ? `last success ${formatDateTime(probeStatus.lastSuccessAt, timezone)}`
        : 'never succeeded';
      break;
    case 'success':
      lastOppositeResult = probeStatus.lastFailureAt
        ? `last failure ${formatDateTime(probeStatus.lastFailureAt, timezone)}`
        : 'never failed';
      break;
    default:
      break;
  }
  return (
    <li>
      <Indicator result={probeStatus?.lastResult ?? ''} /> {probeConfig.title}{' '}
      {probeStatus?.sameResultSince &&
        'since ' + formatDateTime(probeStatus.sameResultSince, timezone)}
      {lastOppositeResult && ` (${lastOppositeResult})`}
    </li>
  );
}
