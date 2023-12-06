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
    <div class="card-container">
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
    </div>
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
        ? `Last success ${formatDateTime(probeStatus.lastSuccessAt, timezone)}`
        : 'Never succeeded';
      break;
    case 'success':
      lastOppositeResult = probeStatus.lastFailureAt
        ? `Last failure ${formatDateTime(probeStatus.lastFailureAt, timezone)}`
        : 'Never failed';
      break;
    default:
      break;
  }
  return (
    <div class="card probe-card">
      <div>
        <h3>&nbsp;</h3>
        <p>
          <Indicator result={probeStatus?.lastResult ?? ''} />
        </p>
      </div>
      <div>
        <h3>
          {probeConfig.url ? (
            <a href={probeConfig.url}>{probeConfig.title}</a>
          ) : (
            probeConfig.title
          )}
        </h3>
        <p>
          {probeStatus?.sameResultSince &&
            'Since ' + formatDateTime(probeStatus.sameResultSince, timezone)}
        </p>
        {lastOppositeResult && <p>{lastOppositeResult}</p>}
      </div>
    </div>
  );
}
