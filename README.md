# Cloudflare Status template

This is a starter template for a status page using Cloudflare Workers and D1.
An example is running [here](https://cloudflare-status-template.dossierhq.workers.dev).

Cloudflare Workers and D1 have plenty of free usage, so a basic status page can
be run for free.

This is not expected to be a fully featured status page, but a starting point
for creating custom status pages.

## Features

- Probes that are run periodically to check the status of a service or component
- Webhooks that record events from external services
- Persistent logs when there are unexpected errors in the configuration or
  execution of a probe or webhook

## Getting started

- `npm init using jonasb/cloudflare-status-template my-status-page` (or clone this repo)
- `cd my-status-page`
- `npm install`
- `npx wrangler login` to login to your Cloudflare account
- `npx wrangler d1 create <DATABASE_NAME>` to create a new database
- `cp wrangler.toml.example wrangler.toml` and change the `name` to your
  project name and add the `database_name` and `database_id` from the database
  you created in the previous step to `wrangler.toml`
- `npx wrangler d1 migrations apply --local <DATABASE_NAME>` to set up the local
  database
- `npm start` to start the development server

## Deploying

- `npx wrangler d1 migrations apply <DATABASE_NAME>` to ensure the database is migrated
- `npm run build && npm run deploy` to deploy the status page to Cloudflare

## Probes

Probes are functions (defined in `src/probes/probe-configs.ts`) that run
periodically to check the status of a service or component. The results of a
prove is:

- created at: the time the probe was run
- result: `success` or `failure`
- category: a short description of the type of result, e.g. `200` for a HTTP call
- description: an optional description of the result
- duration: the time in milliseconds it took to run the probe (requires calling
  `startTimer()` and `stopTimer()` in the probe)

There are example helpers for running HTTP and Atlassian Statuspage probes in
`src/probes/`, but it's just JavaScript, so you can do whatever you want.

## Webhooks

Webhooks are functions (defined in `src/webhooks/webhook-configs.ts`) that run
when a webhook is called from an external service. The endpoint for a webhook is
`/api/webhook/:webhookId`. The results of a webhook shows up as a new event in
the status page, and doesn't change the status of any probes. The results of a
webhook is:

- created at: the time the webhook was called
- result: `success` or `failure`
- category: a short description of the type of result, e.g. `push` for a GitHub
  webhook
- description: an optional description of the result

If a webhook function returns `null`, no event is created.

There are example helpers for GitHub and Vercel webhooks in `src/webhooks`, but
you probably want to tweak them to record events that are relevant to your
status page.

## Design goals

- Simple
- Low cost
- Few dependencies
- Easy to customize
- Standalone

## Wishlist

Things that could be nice to add:

- Examples for notifications to email, Slack, Discord, etc.
- Filtering and paging of events
- Support for environments (e.g. production, staging)
