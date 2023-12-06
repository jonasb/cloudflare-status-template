import { probeAtlassianStatus } from './probe-helper-atlassian-status';
import { probeHttp } from './probe-helper-http';
import type { ProbeConfig } from './probe-types';

// Must match the cron expressions in wrangler.toml
const cronHourly = '0 * * * *';

export const probeConfigs: ProbeConfig[] = [
  {
    id: 'wikipedia',
    title: 'Wikipedia',
    matchCron: (cron) => cron === cronHourly,
    execute: (context) => probeHttp(context, 'https://www.wikipedia.org/'),
  },
  {
    id: 'cloudflare-status',
    title: 'Cloudflare Status',
    url: 'https://www.cloudflarestatus.com',
    matchCron: (cron) => cron === cronHourly,
    execute: (context) =>
      probeAtlassianStatus(context, 'https://www.cloudflarestatus.com'),
  },
  {
    id: 'github-status',
    title: 'GitHub Status',
    url: 'https://www.githubstatus.com',
    matchCron: (cron) => cron === cronHourly,
    execute: (context) =>
      probeAtlassianStatus(context, 'https://www.githubstatus.com'),
  },
];
