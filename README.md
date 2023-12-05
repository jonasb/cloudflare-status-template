# Cloudflare Status template

This is a starter template for a status page using Cloudflare Workers and D1.
An example is running [here](https://cloudflare-status-template.dossierhq.workers.dev).

## Getting started

- `npm init using jonasb/cloudflare-status-template my-status-page`
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
