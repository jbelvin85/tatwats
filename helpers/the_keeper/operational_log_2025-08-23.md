## Operational Log: Journey to Application Statistics

### 2025-08-23 - Initial Setup and Troubleshooting

**Objective:** Get the TATWATS application fully operational, specifically resolving issues preventing the Admin Control Panel from displaying application statistics.

**Key Issues & Resolutions:**

1.  **Database Connection Refused (`ECONNREFUSED`) during `npm run db:reset`:**
    *   **Diagnosis:** Initial investigation revealed the PostgreSQL Docker container was not accessible from the host, or the `db:reset` script was using incorrect connection parameters.
    *   **Root Cause:** The `PGPASSWORD` used by the `db:reset` script (from `.env`) did not match the password being used by the PostgreSQL Docker container. The `docker-compose.yml` defaulted `POSTGRES_PASSWORD` to `changeme` if not explicitly set in the environment during `docker-compose up`.
    *   **Resolution:**
        *   Stopped and removed all Docker containers and volumes (`docker-compose down -v`).
        *   Re-created and started Docker containers (`docker-compose up -d`), ensuring the `PGPASSWORD` from the `.env` file was correctly propagated to the PostgreSQL service.
        *   Successfully ran `npm run db:reset`.

2.  **Backend Server `ERR_CONNECTION_REFUSED` from Frontend:**
    *   **Diagnosis:** After resolving the database reset issue, the frontend still couldn't connect to the backend API on `localhost:3001`.
    *   **Root Cause:** The `backend` service in `docker-compose.yml` had a hardcoded `PGPASSWORD: mypassword` in its `environment` section. This was overriding the correct password loaded from the `.env` file, causing the backend to fail to connect to the database upon startup, thus preventing it from listening on port 3001.
    *   **Resolution:**
        *   Removed the hardcoded `PGPASSWORD: mypassword` from `webapp/server/docker-compose.yml`.
        *   Rebuilt and restarted the Docker containers (`docker-compose up -d --build`) to apply the `docker-compose.yml` change and ensure the backend picked up the correct password from `.env`.

3.  **Backend `500 Internal Server Error` on `/api/users`:**
    *   **Diagnosis:** After the backend became accessible, fetching `/api/users` resulted in a 500 error, but no specific error was logged in the backend container.
    *   **Root Cause:** The `GET /api/users` route in `webapp/server/routes.js` was attempting to `SELECT id, name, role FROM users`. However, the `users` table schema (defined in `webapp/server/scripts/reset-db.js`) did not include a `role` column.
    *   **Resolution:**
        *   Modified `webapp/server/scripts/reset-db.js` to add a `role TEXT DEFAULT 'user'` column to the `users` table `CREATE TABLE` statement.
        *   Reset the database again (`npm run db:reset`) to apply the new schema.
        *   Restarted the `backend` service (`docker-compose restart backend`).

4.  **Frontend `404 Not Found` for `/api/messages`:**
    *   **Diagnosis:** The Admin Control Panel failed to load application statistics, specifically showing a 404 for `/api/messages`.
    *   **Root Cause:** The backend `routes.js` did not have a `GET /api/messages` endpoint. The frontend was expecting a direct endpoint to fetch message statistics, while the backend only provided `GET /api/conversations/:id/messages` and `POST /api/messages`.
    *   **Resolution:**
        *   Added a new `GET /api/messages/count` endpoint to `webapp/server/routes.js` to return the total count of messages.
        *   Restarted the `backend` service (`docker-compose restart backend`).
        *   Modified `webapp/client/src/AdminDashboard.js` to change the fetch call from `http://localhost:3001/api/messages` to `http://localhost:3001/api/messages/count` and to correctly parse the `count` property from the response.
        *   Rebuilt and restarted the `frontend` service (`docker-compose up -d --build frontend`) to apply the frontend code changes.

**Outcome:** The TATWATS Admin Control Panel now successfully displays Backend Server Status and Application Statistics (Total Users, Total Conversations, Total Messages).