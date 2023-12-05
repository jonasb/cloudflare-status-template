import type { ProbeContext, ProbeResult } from './probe-types';

export async function probeHttp(
  context: ProbeContext,
  requestInfo: RequestInfo,
  requestInit?: RequestInit
): Promise<ProbeResult> {
  context.startTimer();
  try {
    const response = await fetch(requestInfo, requestInit);
    await response.text();
    context.stopTimer();
    return {
      result: response.ok ? 'success' : 'failure',
      category: String(response.status),
      description: null,
    };
  } catch (error) {
    context.stopTimer();
    console.warn(`Error probing`, error);
    return { result: 'failure', category: 'error', description: null };
  }
}
