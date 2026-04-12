# UrbanGuess

Web-based city guessing game by their satellite images.

## Backend API (canonical)

The Express + Prisma API lives in **`backend/`** (geo-typing-api). Run it from the repo root:

```bash
npm run dev:api
```

Or from `backend/`:

```bash
cd backend
npm install
```

Create `backend/.env` by copying `backend/.env.example` and editing the values (on Windows CMD: `copy .env.example .env`).

Edit **`.env`**: set `DATABASE_URL` (PostgreSQL), `JWT_SECRET`, and optionally `PORT` (default `3000`), `FRONTEND_ORIGIN`, `COOKIE_NAME`.

Then:

```bash
npx prisma generate
npx prisma db push
```

(Use `npx prisma migrate deploy` if your team uses migration history.)

Optional seed data:

```bash
npm run prisma:seed
```

Start the server:

```bash
npm run dev
```

Smoke checks (no auth):

- `GET http://localhost:3000/health` → `{ "ok": true }`
- `GET http://localhost:3000/api/continents` → continent list

Database schema and gameplay rules are documented in [backend/README.md](backend/README.md).

## Legacy EJS server (optional)

The older Express + EJS prototype is preserved as [`app.legacy.js`](app.legacy.js). It is **not** the API used by `backend/`. To run it (requires root `npm install` for `express`, `ejs`, etc.):

```bash
node app.legacy.js
```

Then open `http://localhost:3000` in the browser.
