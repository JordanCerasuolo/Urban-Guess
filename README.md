# UrbanGuess

Web-based city guessing game by their satellite images.

## Backend API (canonical)

The Express + Prisma API lives in **`backend/`** (geo-typing-api). Run it from the repo root:

```bash
npm run dev:api
```

First-time setup from `backend/`:

```bash
cd backend
npm install
```

Create `backend/.env` by copying `backend/.env.example` and editing the values (on Windows CMD: `copy .env.example .env`).

Edit **`backend/.env`**: set `DATABASE_URL` (PostgreSQL), `JWT_SECRET`, and optionally `PORT` (default `3000`), `FRONTEND_ORIGIN`, `COOKIE_NAME`.

Then apply the schema (still inside `backend/`):

```bash
npx prisma generate
npx prisma db push
```

(Use `npx prisma migrate deploy` if your team uses migration history.)

Optional seed data:

```bash
npm run prisma:seed
```

Start the API (from `backend/`, or use `npm run dev:api` at the repo root):

```bash
npm run dev
```

Smoke checks (no auth):

- `GET http://localhost:3000/health` → `{ "ok": true }`
- `GET http://localhost:3000/api/continents` → continent list

Database schema and gameplay rules are documented in [backend/README.md](backend/README.md).

## Legacy EJS server (optional)

The older Express + EJS prototype is [`old_app.js`](old_app.js). It is **not** the JSON API in `backend/`; it uses `pg` via [`backend/db/pool.js`](backend/db/pool.js) and [`services/userService.js`](services/userService.js).

### Environment (legacy)

With PostgreSQL running, add a **project root** `.env` (loaded when you start Node from the repo root) with:

```env
DATABASE_HOST=localhost
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=your_db_name
DATABASE_PORT=5432
```

You need a `users` table with at least `id`, `username`, `email`, `password_hash` (see the Prisma schema / SQL migrations under `backend/database/` for the canonical shape).

### Run the legacy app

From the repo root (after `npm install` — includes `bcrypt`, `pg`, `dotenv`, `express`, `ejs`, etc.):

```bash
node old_app.js
```

Then open `http://localhost:3000` in the browser.
