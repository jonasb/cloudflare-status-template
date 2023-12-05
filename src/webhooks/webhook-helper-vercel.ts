import type { HonoRequest } from 'hono';
import type { WebhookResult } from './webhook-types';

// https://vercel.com/docs/observability/webhooks-overview/webhooks-api
// This is a best attempt at the Vercel webhook payload. It is not complete.

type VercelWebhookPayload = {
  id: string;
  createdAt: number;
} & (
  | {
      type: 'deployment.created';
      payload: VercelSharedDeploymentPayload & {
        alias: string[];
      };
    }
  | {
      type: 'deployment.succeeded';
      payload: VercelSharedDeploymentPayload;
    }
  | {
      type: 'deployment.ready';
      payload: VercelSharedDeploymentPayload;
    }
  | { type: 'deployment.canceled'; payload: VercelSharedDeploymentPayload }
  | {
      type: 'deployment.error';
      payload: VercelSharedDeploymentPayload;
    }
  | {
      type: 'deployment.check-rerequested';
      payload: {
        team: { id: string };
        user: { id: string };
        deployment: { id: string };
        check: { id: string };
      };
    }
  | {
      type: 'project.created';
      payload: {
        team: { id: string };
        user: { id: string };
        project: { id: string; name: string };
      };
    }
  | {
      type: 'project.removed';
      payload: {
        team: { id: string };
        user: { id: string };
        project: { id: string; name: string };
      };
    }
);

interface VercelSharedDeploymentPayload {
  name: string;
  user: { id: string };
  team: { id: string };
  project: { id: string };
  plan: 'pro';
  regions: string[];
  target: 'production' | 'staging' | null;
  type: 'LAMBDAS';
  url: string;
  deployment: {
    id: string;
    meta: {
      githubCommitAuthorName: string;
      githubCommitMessage: string;
      githubCommitOrg: string;
      githubCommitRef: string;
      githubCommitRepo: string;
      githubCommitSha: string;
      githubDeployment: string;
      githubOrg: string;
      githubRepo: string;
      githubRepoOwnerType: string;
      githubCommitRepoId: string;
      githubRepoId: string;
      githubRepoVisibility: 'public';
      githubCommitAuthorLogin: string;
      branchAlias: string;
    };
    name: string;
    url: string;
    inspectorUrl: string;
  };
  links: {
    deployment: string;
    project: string;
  };
}

export async function parseVercelWebhook(
  req: HonoRequest
): Promise<WebhookResult | null> {
  const body = await req.text();
  const json = JSON.parse(body) as VercelWebhookPayload;

  let description: string | null = null;
  const category = json.type;
  if (category.startsWith('deployment.')) {
    const name = 'name' in json.payload ? json.payload.name : null;
    const target = 'target' in json.payload ? json.payload.target : null;
    description = name;

    if (target !== 'production') {
      console.log(`Ignoring ${category} ${name} for ${target}`);
      return null;
    }
  }

  const failure = ['.canceled', '.error'].some((suffix) =>
    category.endsWith(suffix)
  );
  return {
    result: failure ? 'failure' : 'success',
    category,
    description,
  };
}
