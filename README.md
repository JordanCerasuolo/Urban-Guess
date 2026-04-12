# UrbanGuess

Web-based city guessing game by their satellite images.

## Full app (UI + API)

The **canonical** server is **`backend/`**: it serves the EJS pages (`views/`), static assets (`public/`, `services/*.js`), and the JSON API under `/api`.

From the repo root:

```bash
npm run dev:api
```

Then open **http://localhost:3000** (same port as the API).

First-time setup from `backend/`:

```bash
cd backend
npm install
```

Create `backend/.env` by copying `backend/.env.example` and editing the values (on Windows CMD: `copy .env.example .env`).

Edit **`backend/.env`**: set `JWT_SECRET`, and optionally `PORT` (default `3000`), `COOKIE_NAME`. **`DATABASE_URL`** defaults to a local SQLite file (`file:./dev.db` in `.env.example`). For this single-server setup, **`FRONTEND_ORIGIN`** should match where the browser loads the app (default in `.env.example` is `http://localhost:3000`).

Apply the schema (still inside `backend/`):

```bash
npx prisma generate
npx prisma db push
```

(Optional seed so each continent has at least five cities:)

```bash
npm run prisma:seed
```

Smoke checks:

- `GET http://localhost:3000/health` → `{ "ok": true }`
- `GET http://localhost:3000/api/continents` → continent list
- Open `/` in the browser: register, log in, **Play** a continent, complete a run.

Browser API helpers live in [`services/quizApi.js`](services/quizApi.js) (loaded as `/services/quizApi.js`). Gameplay logic uses [`services/quizGame.js`](services/quizGame.js).

Database schema and gameplay rules are documented in [backend/README.md](backend/README.md).

## Legacy `old_app.js` (optional, not recommended)

[`old_app.js`](old_app.js) is an older Express + session prototype on port **3000** that **conflicts** with running the backend on the same port. It used `pg` directly via [`backend/db/pool.js`](backend/db/pool.js) and [`services/userService.js`](services/userService.js). Use the **backend** server above for the integrated UI and Prisma API.

If you still need the legacy app for comparison, run it on a **different** `PORT` and do not run `npm run dev:api` at the same time.
