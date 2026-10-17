# Campusly

Campusly is a campus places directory and rating app. It has a React frontend, an Express REST API, and a MySQL database.

Members can discover and rate places. Store owners can add a place and review its ratings. Administrators can review platform activity and manage accounts and places.

## Features

| Role | What the app supports |
| --- | --- |
| `USER` | Browse, search, filter, and sort places; view place details; submit ratings; view personal ratings; change password |
| `STORE_OWNER` | Create a store for their account; view the owner dashboard and ratings; change password |
| `ADMIN` | View platform statistics; search and filter accounts; create accounts; view user details; search and create stores; assign stores to owners |

The frontend includes responsive layouts, role-protected routes, pagination, and loading, error, and empty states.

## Tech stack

- **Frontend:** React, React Router, Vite, Tailwind CSS, Axios, Lucide React, Framer Motion
- **Backend:** Node.js, Express, MySQL2, JSON Web Tokens, bcryptjs, express-validator, express-rate-limit
- **Database:** MySQL

## Project structure

```text
Campusly/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── ownerController.js
│   │   │   ├── ratingController.js
│   │   │   └── storeController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   └── roleMiddleware.js
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── ownerRoutes.js
│   │   │   ├── ratingRoutes.js
│   │   │   └── storeRoutes.js
│   │   ├── validators/
│   │   │   ├── authValidator.js
│   │   │   ├── listingValidator.js
│   │   │   ├── ratingValidator.js
│   │   │   ├── storeValidator.js
│   │   │   └── validationMiddleware.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
├── database/
│   └── schema.sql
├── frontend/
│   ├── public/
│   │   ├── images/
│   │   │   ├── .gitkeep
│   │   │   ├── auth/
│   │   │   │   ├── cafe-table.jpg
│   │   │   │   └── coffee-morning.jpg
│   │   │   ├── hero/
│   │   │   │   ├── cafeteria-table.jpg
│   │   │   │   └── campus-cafe-night.jpg
│   │   │   ├── stores/
│   │   │   │   ├── amber-bar.jpg
│   │   │   │   ├── bookstore.jpg
│   │   │   │   ├── cafe-books.jpg
│   │   │   │   ├── cafe-work.jpg
│   │   │   │   ├── coffee-counter.jpg
│   │   │   │   ├── coffee-pour.jpg
│   │   │   │   ├── friends-table.jpg
│   │   │   │   ├── healthy-bowl.jpg
│   │   │   │   ├── library-shelves.jpg
│   │   │   │   ├── pancake-stack.jpg
│   │   │   │   └── study-lounge.jpg
│   │   │   └── README.md
│   │   └── logo.svg
│   ├── src/
│   │   ├── api/
│   │   │   ├── adminApi.js
│   │   │   ├── authApi.js
│   │   │   ├── axios.js
│   │   │   ├── ownerApi.js
│   │   │   ├── ratingApi.js
│   │   │   └── storeApi.js
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Avatar.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── ErrorState.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Pagination.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   └── StatCard.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── ActivityList.jsx
│   │   │   │   ├── Hero.jsx
│   │   │   │   └── SectionHeader.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── MobileMenu.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── PageContainer.jsx
│   │   │   ├── store/
│   │   │   │   ├── RatingModal.jsx
│   │   │   │   ├── RatingStars.jsx
│   │   │   │   ├── StoreCard.jsx
│   │   │   │   ├── StoreFormModal.jsx
│   │   │   │   ├── StoreGrid.jsx
│   │   │   │   └── StoreSearch.jsx
│   │   │   └── tables/
│   │   │       ├── StoreTable.jsx
│   │   │       ├── TablePagination.jsx
│   │   │       └── UserTable.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useDebounce.js
│   │   ├── layouts/
│   │   │   ├── AuthLayout.jsx
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── Stores.jsx
│   │   │   │   ├── UserDetails.jsx
│   │   │   │   └── Users.jsx
│   │   │   ├── auth/
│   │   │   │   ├── ChangePassword.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── owner/
│   │   │   │   ├── OwnerDashboard.jsx
│   │   │   │   └── OwnerRatings.jsx
│   │   │   ├── user/
│   │   │   │   ├── MyRatings.jsx
│   │   │   │   ├── StoreDetails.jsx
│   │   │   │   ├── Stores.jsx
│   │   │   │   └── UserDashboard.jsx
│   │   │   └── NotFound.jsx
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RoleRoute.jsx
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   ├── storage.js
│   │   │   └── storeImages.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── vite.config.js
├── .gitignore
└── README.md
```

Local-only `.env` files, `node_modules/`, and Vite's generated `frontend/dist/` output are ignored by Git. Image credits are listed in [frontend/public/images/README.md](frontend/public/images/README.md).

## Requirements

- Node.js and npm
- MySQL Server

## Run locally

### 1. Create the database

Create the local database, then load the schema in MySQL Workbench or with the MySQL command-line client:

```sh
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS campus_rating;"
mysql -u root -p campus_rating < database/schema.sql
```

This creates the `users`, `stores`, and `ratings` tables in `campus_rating`.

### 2. Configure and start the backend

Copy the example environment file:

```sh
cp backend/.env.example backend/.env
```

In Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

Set the database connection and JWT secret in `backend/.env`:

```dotenv
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=campus_rating
JWT_SECRET=replace_with_a_long_random_secret
```

`PORT` is optional and defaults to `5000`. `CORS_ORIGINS` is an optional comma-separated list of allowed frontend origins. By default, the API allows `http://localhost:3000` and `http://localhost:5173`.

Public registration creates `USER` and `STORE_OWNER` accounts. To create your first administrator locally, set `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `backend/.env`, then run `npm run create-admin` from `backend/`. Remove those three values from `.env` afterward. Admins can create additional accounts through the protected admin dashboard.

```sh
cd backend
npm install
npm run dev
```

The API runs at [http://localhost:5000](http://localhost:5000). Its root route returns a status message. Use `npm start` from `backend/` to run the non-watch server command.

### 3. Configure and start the frontend

In a second terminal, copy the frontend environment example:

```sh
cp frontend/.env.example frontend/.env
```

In Windows PowerShell:

```powershell
Copy-Item frontend/.env.example frontend/.env
```

The default API URL is `http://localhost:5000/api`. Set `VITE_API_URL` in `frontend/.env` if your API uses a different URL.

```sh
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually [http://localhost:5173](http://localhost:5173).

### Build the frontend

From `frontend/`:

```sh
npm run build
npm run preview
```

The production build is written to `frontend/dist/`. It can be regenerated and is ignored by Git.

The package manifests do not currently define an automated test command.

## Application routes

| Role | Routes |
| --- | --- |
| Public | `/login`, `/register` |
| USER | `/user`, `/user/stores`, `/user/top-rated`, `/user/stores/:id`, `/user/ratings`, `/user/change-password` |
| STORE_OWNER | `/owner`, `/owner/ratings`, `/owner/change-password` |
| ADMIN | `/admin`, `/admin/users`, `/admin/users/:id`, `/admin/stores`, `/admin/change-password` |

The root route `/` redirects signed-in users to their role's home page. Protected routes send signed-out visitors to login and redirect signed-in users away from routes for other roles. Unknown routes show the not-found page.

## API overview

All API routes are prefixed with `/api`. Protected endpoints require a bearer token:

```http
Authorization: Bearer <token>
```

Login tokens expire after one day. Logging out clears the token in the browser; the API does not maintain a token revocation list.

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | `/api/auth/register` | Public; creates `USER` or `STORE_OWNER` |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/profile` | Authenticated |
| PUT | `/api/auth/change-password` | Authenticated |
| GET | `/api/admin/stats` | ADMIN |
| GET, POST | `/api/admin/users` | ADMIN |
| GET | `/api/admin/users/:id` | ADMIN |
| GET | `/api/admin/stores` | ADMIN |
| GET, POST | `/api/stores` | Authenticated for listing; ADMIN or STORE_OWNER for creation |
| GET | `/api/stores/:id` | Authenticated |
| POST | `/api/ratings` | USER |
| PUT | `/api/ratings/:id` | USER; only the caller's rating |
| GET | `/api/owner/store` | STORE_OWNER |
| GET | `/api/owner/ratings` | STORE_OWNER |

Store listings and admin store listings accept `page`, `limit` (1–100), `search`, `address`, `sortBy=id|name|email|address|rating`, and `sortOrder=asc|desc`.

Admin user listings accept `page`, `limit` (1–100), `search`, `name`, `email`, `address`, `role`, `sortBy=id|name|email|role|created_at`, and `sortOrder=asc|desc`.

## Database overview

- `users` stores account identity, password hashes, and the `ADMIN`, `USER`, or `STORE_OWNER` role.
- `stores` stores place details and an optional owner relationship.
- `ratings` links users and stores, validates scores from 1 to 5, and allows one rating per user per store.

Foreign keys maintain store ownership and remove ratings when the related user or store is deleted.

## Security note

Public registration does not grant `ADMIN`. The API enforces the role allowlist, and the initial administrator is created with the one-time `create-admin` command. See [DEPLOYMENT.md](DEPLOYMENT.md) for the free Vercel and TiDB setup.

Never commit `backend/.env` or `frontend/.env`. Keep database credentials and the JWT secret private.
