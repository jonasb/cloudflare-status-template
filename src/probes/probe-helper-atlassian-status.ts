import type { ProbeContext, ProbeResult } from './probe-types';

export async function probeAtlassianStatus(
  context: ProbeContext,
  url: string
): Promise<ProbeResult> {
  try {
    const response = await fetch(`${url}/api/v2/status.json`);
    const json = (await response.json()) as {
      status: { indicator: string; description: string };
    };
    return {
      result: json.status.indicator === 'none' ? 'success' : 'failure',
      category: json.status.indicator,
      description: json.status.description,
    };
  } catch (error) {
    console.warn(`Error probing`, error);
    return { result: 'failure', category: 'error', description: null };
  }
}
