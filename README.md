# `cloudflare-status-template`

## Getting started

- `npm install`
- `npx wrangler login` to login to your Cloudflare account
- `npx wrangler d1 create <DATABASE_NAME>` to create a new database
- `cp wrangler.toml.example wrangler.toml` and change the `name` to your
  project name and add the `database_name` and `database_id` from the database
  you created in the previous step to `wrangler.toml`
- `npx wrangler d1 migrations apply --local <DATABASE_NAME>` to set up the local
  database
