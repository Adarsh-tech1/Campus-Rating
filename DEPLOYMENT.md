# Free Vercel deployment

Campusly uses two Vercel projects from this GitHub repository: a static Vite frontend and a serverless Express API. TiDB Cloud Starter provides the MySQL-compatible database. Vercel Hobby is free for personal projects; TiDB Starter has a monthly free quota. Provider quotas and usage limits apply.

## 1. Create the database

1. Create a MySQL-compatible TiDB Cloud Starter instance.
2. In its **Connect** panel, choose the public endpoint and copy the host, port, username, password, and database name. The public endpoint requires TLS; set `DB_SSL=true` in Vercel.
3. Connect to the database with MySQL Workbench or another MySQL client, select the provided database, and run `database/schema.sql` from this repository.

TiDB Starter currently includes, per eligible instance, 5 GiB row storage, 5 GiB columnar storage, and 50 million request units per month. A free instance restricts new operations after its quota is reached until the quota resets. Check the current [TiDB Starter plan details](https://docs.pingcap.com/tidbcloud/select-cluster-tier/) before deployment.

## 2. Deploy the API

1. In Vercel, import the GitHub repository as a new project. Set **Root Directory** to `backend` and leave the detected Express framework settings in place. Vercel runs the exported Express app as a Function; local development still uses `npm run dev`.
2. Add these **Production** environment variables in the API project's settings:

   ```dotenv
   DB_HOST=your-tidb-host
   DB_PORT=4000
   DB_USER=your-tidb-user
   DB_PASSWORD=your-tidb-password
   DB_NAME=your-tidb-database
   DB_SSL=true
   JWT_SECRET=use-a-long-random-secret
   CORS_ORIGINS=http://localhost:5173
   ```

   Use the host, port, username, and database name shown by TiDB. Keep the database password and JWT secret in Vercel environment settings; do not commit them. The initial CORS value is for local development and can be replaced after the frontend is deployed.
3. Deploy and copy the API project's production domain, for example `https://campusly-api.vercel.app`.

## 3. Deploy the frontend

1. Import the same GitHub repository again as a second Vercel project. Set **Root Directory** to `frontend`; Vercel detects Vite. `frontend/vercel.json` routes browser deep links back to the SPA entry page.
2. Add this **Production** environment variable, replacing the example with the API domain from the previous step:

   ```dotenv
   VITE_API_URL=https://campusly-api.vercel.app/api
   ```

3. Deploy the frontend and copy its production domain, for example `https://campusly.vercel.app`.

## 4. Allow the frontend to call the API

In the API project's Vercel settings, set `CORS_ORIGINS` to the exact frontend production origin (scheme and hostname, with no path), such as `https://campusly.vercel.app`. Include additional comma-separated origins only if you want them to access the API. Redeploy the API after changing the variable.

Both projects can deploy automatically from GitHub. Vercel supports multiple projects connected to one repository with a different root directory for each project. See [Vercel's monorepo guide](https://vercel.com/docs/monorepos), [Express deployment guide](https://vercel.com/docs/frameworks/backend/express), and [Vite SPA routing guide](https://vercel.com/docs/frameworks/frontend/vite).

## Create the first administrator

Public registration creates `USER` and `STORE_OWNER` accounts only. To create the first administrator, configure `backend/.env` locally with the TiDB `DB_*` values, `DB_SSL=true`, and temporary `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` values, then run this from `backend/`:

```sh
npm ci
npm run create-admin
```

Remove the temporary `ADMIN_*` values from the local `.env` afterward. Do not publish administrator credentials; create ordinary demo accounts through the app.

## Free plan notes

Vercel Hobby is free for personal projects and includes Vercel Functions, but has usage limits. TiDB Starter is free within its monthly quota. See [Vercel plan details](https://vercel.com/docs/plans) and the TiDB quota details above. If a quota is exhausted, the service may be restricted until it resets.
