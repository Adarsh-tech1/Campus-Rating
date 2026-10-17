# Free demo deployment

This setup uses a free Render static site for React, a free Render Node service for the API, and a free TiDB Cloud Starter database. TiDB speaks the MySQL protocol, so the app keeps its existing MySQL driver and schema.

## Create the database

1. Create a TiDB Cloud Starter instance and leave its monthly spending limit at `$0` to stay within the free quota.
2. In TiDB's **Connect** panel, choose the public endpoint and copy the host, port, username, password, and database name. Starter requires TLS; the deployment config enables it.
3. Connect with MySQL Workbench, select the database name TiDB gave you, and run `database/schema.sql`.

TiDB Starter currently includes up to 5 GiB row storage, 5 GiB columnar storage, and 50 million request units per month. If you reach the free quota, database operations are restricted until the quota resets unless you raise the spending limit.

## Deploy the app

The repo includes a `render.yaml` Blueprint for the API and frontend. Push the project to GitHub, then in Render choose **New → Blueprint**, connect the repo, and select the free service plans. During setup, enter the TiDB connection values when Render prompts for the API's `DB_*` variables. The Blueprint generates a JWT secret and wires the frontend URL to the API's CORS setting.

After Render deploys, copy the frontend URL for your resume. The React route fallback is configured in `render.yaml` so deep links such as `/login` continue to work.

## Create the first administrator

Public registration creates campus-member and store-owner accounts only. To create the first administrator, copy the TiDB `DB_*` values into `backend/.env`, set `DB_SSL=true`, and temporarily set `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. Then run this locally from `backend/`:

```sh
npm run create-admin
```

Remove the `ADMIN_*` values from the local `.env` afterward. Do not publish administrator credentials; create ordinary demo accounts through the app.

## Free-tier limits

Render's free API service spins down after 15 minutes without a request. The first request after that can take about a minute while it wakes up. Render provides 750 free instance hours per workspace each month. TiDB's Starter quota is also capped; both providers restrict service when free usage is exhausted if no paid limit is configured.
