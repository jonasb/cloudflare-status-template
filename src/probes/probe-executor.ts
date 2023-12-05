import type { SqlTag } from 'd1-sql-tag';
import {
  insertEvent,
  updateProbeLastStarted,
  updateProbeStatus,
} from '../db/database-statements';
import type { PersistentLogger } from '../utils/persistent-logger';
import { probeConfigs } from './probe-configs';
import type { ProbeConfig } from './probe-types';

interface Context {
  sql: SqlTag;
  logger: PersistentLogger;
}

export async function executeAllProbes(context: Context) {
  for (const probe of probeConfigs) {
    await executeProbe(context, probe);
  }
}

export async function executeCronProbes(context: Context, cron: string) {
  const matchingProbes = probeConfigs.filter((probe) => probe.matchCron(cron));
  if (matchingProbes.length === 0) {
    context.logger('warn', `No probes match cron ${cron}`);
    return;
  }

  console.log(`Executing ${matchingProbes.length} probes (cron: ${cron})...`);
  for (const probe of matchingProbes) {
    await executeProbe(context, probe);
  }
  console.log('Done executing probes.');
}

async function executeProbe({ sql, logger }: Context, probe: ProbeConfig) {
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

  try {
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
    ]);
  } catch (error) {
    logger(
      'error',
      `Error executing probe ${probe.id}: ${
        error instanceof Error ? error.message : typeof error
      }`
    );
  }
}
