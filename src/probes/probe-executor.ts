import type { SqlTag } from 'd1-sql-tag';
import {
  insertEvent,
  updateProbeLastStarted,
  updateProbeStatus,
} from '../db/database-statements';
import { probeConfigs } from './probe-configs';
import type { ProbeConfig } from './probe-types';

interface DatabaseContext {
  sql: SqlTag;
}

export async function executeAllProbes(context: DatabaseContext) {
  for (const probe of probeConfigs) {
    await executeProbe(context, probe);
  }
}

export async function executeCronProbes(
  context: DatabaseContext,
  cron: string
) {
  const matchingProbes = probeConfigs.filter((probe) => probe.matchCron(cron));
  console.log(`Executing ${matchingProbes.length} probes (cron: ${cron})...`);
  for (const probe of matchingProbes) {
    await executeProbe(context, probe);
  }
  console.log('Done executing probes.');
}

async function executeProbe({ sql }: DatabaseContext, probe: ProbeConfig) {
  let startTime = null;
  let endTime = null;
  const probeContext = {
    startTimer() {
      startTime = Date.now();
    },
    stopTimer() {
      endTime = Date.now();
    },
  };

  updateProbeLastStarted(sql, probe.id).run().catch(console.warn); // fire and forget

  console.log(`Executing probe ${probe.id}...`);
  const result = await probe.execute(probeContext);
  console.log('Result', result);
  const duration = endTime && startTime ? endTime - startTime : null;

  await sql.batch([
    insertEvent(sql, {
      probeId: probe.id,
      webhookId: null,
      duration,
      ...result,
    }),
    updateProbeStatus(sql, { probeId: probe.id, result: result.result }),
  ] as const);
}
