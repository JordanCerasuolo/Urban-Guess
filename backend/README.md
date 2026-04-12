# Geo Typing Game Database Schema

PostgreSQL schema for a GeoGuessr-style 2D satellite image game where users type city names.

## Overview

The database supports:

- **Continent-based quiz runs** selected by the user.
- **Five cities per run** (`quiz_rounds` with `round_order` 1–5), one satellite image at a time.
- **Up to 3 tries per city** enforced in the DB via `round_submissions` (`try_number` 1–3, unique per round).
- **`description`** for general city copy; **`hint_1` / `hint_2`** for in-game hints (e.g. after wrong tries).
- **Scoring and leaderboard** on `quiz_runs.score_total`.
- **Answer checking**: raw input vs `cities.name`, then normalized input vs `cities.normalized_answer`.

## Core Gameplay Data Flow

1. User starts a `quiz_run` with a selected `continent`.
2. App picks 5 unique active cities from that continent and creates 5 `quiz_rounds`.
3. For each city round, the user has **at most 3** submissions (or a give-up row). Each guess is a row in `round_submissions`.
4. After **wrong try 1**, the API can return `cities.hint_1`. After **wrong try 2**, return `cities.hint_2`. Try 3 is the last attempt. Use `description` separately (e.g. profile/UI), not as a substitute for hints unless you choose to.
5. Round points roll up into `quiz_runs.score_total` for the leaderboard.

## Matching Logic

For each user submission:

1. Compare raw user input to `cities.name` exactly.
2. If it does not match, normalize input (see below) and compare to `cities.normalized_answer`.

Normalization expected by `typed_answer_normalized` and `cities.normalized_answer`:

- lowercase  
- trim outer whitespace  
- remove diacritics  
- remove punctuation  
- collapse multiple spaces  

## Scoring Rules (3 tries per city)

On the **first correct** try for that city:

- Try 1: **5** points  
- Try 2: **3** points  
- Try 3: **2** points  

Wrong on all 3 tries, or **give up** before a correct answer: **0** points for that round.

`quiz_rounds.points_earned` is capped at **5** in the schema (max single-round score on try 1).

## Schema Entities

### `users`

Account data.

### `cities`

Canonical city rows:

- `continent`, `country`, `name`, `normalized_answer`  
- `satellite_image_data` (`BYTEA`), `satellite_image_mime_type`  
- `description` — general text about the city  
- `hint_1`, `hint_2` — strings to serve in-game (e.g. after 1st / 2nd wrong guess)  
- `is_active`  

### `quiz_runs`

One full game (5 cities) for a user:

- `user_id`, `continent`, `score_total`, `num_rounds` (default 5), timestamps  

### `quiz_rounds`

One row per **city slot** in that run (5 rows per run):

- `quiz_run_id`, `city_id`, `round_order` (1–5)  
- `points_earned`, `is_correct`, `resolved_try_number` (1–3), `gave_up`  

### `round_submissions`

One row per **guess** or give-up:

- `round_id`, `try_number` (**1–3**), unique per round → enforces max 3 tries  
- `typed_answer_raw`, `typed_answer_normalized`, `is_correct`, `is_given_up`  

## Setup

### Apply migration

```bash
psql -U your_user -d your_database -f database/migrations/001_initial_schema.sql
```

### Prisma workflow

```bash
npx prisma migrate dev
npx prisma generate
```

### Seed baseline city data

```bash
psql -U your_user -d your_database -f database/seeds/seed_data_structure.sql
```

## Common Queries

### Pick 5 random cities for a continent-run (include hints)

```sql
SELECT id, name, country, normalized_answer,
       description, hint_1, hint_2,
       satellite_image_mime_type
FROM cities
WHERE continent = $1
  AND is_active = TRUE
ORDER BY RANDOM()
LIMIT 5;
```

### Get rounds for an active quiz run

```sql
SELECT qr.id, qr.round_order, c.name, c.country,
       c.description, c.hint_1, c.hint_2,
       c.satellite_image_mime_type
FROM quiz_rounds qr
JOIN cities c ON c.id = qr.city_id
WHERE qr.quiz_run_id = $1
ORDER BY qr.round_order;
```

### Store a try submission (`try_number` must be 1, 2, or 3)

```sql
INSERT INTO round_submissions (
  round_id,
  try_number,
  typed_answer_raw,
  typed_answer_normalized,
  is_correct,
  is_given_up
)
VALUES ($1, $2, $3, $4, $5, FALSE);
```

### Continent leaderboard

```sql
SELECT u.username, qr.score_total, qr.ended_at
FROM quiz_runs qr
JOIN users u ON u.id = qr.user_id
WHERE qr.continent = $1
  AND qr.ended_at IS NOT NULL
ORDER BY qr.score_total DESC, qr.ended_at ASC
LIMIT 100;
```

### User recent run history

```sql
SELECT continent, score_total, num_rounds, ended_at
FROM quiz_runs
WHERE user_id = $1
ORDER BY ended_at DESC
LIMIT 20;
```

## HTTP API (Express, JavaScript)

The Node server lives under `src/`. Install dependencies, set environment variables (see `.env.example`), run migrations or `prisma db push`, then `npm run prisma:seed` and `npm run dev`.

- **Base URL**: `http://localhost:3000` (or `PORT`). JSON routes are under **`/api`** (e.g. `POST /api/auth/login`).
- **Health**: `GET /health` — `{ "ok": true }`.
- **CORS**: Set `FRONTEND_ORIGIN` to your SPA origin (e.g. `http://localhost:5173`). Use `credentials: 'include'` on fetch and send cookies on cross-origin requests.
- **Auth cookie**: After `POST /api/auth/register` or `POST /api/auth/login`, the API sets an **http-only** cookie named `access_token` (override with `COOKIE_NAME`). For other clients, you can also send `Authorization: Bearer <jwt>`.
- **Continents**: `GET /api/continents` — enum values and labels for the region picker.
- **Quiz**: `POST /api/quiz-runs` (body `{ "continent": "EUROPE" }`, requires auth), then `GET /api/quiz-runs/:runId`, round state `GET /api/quiz-runs/:runId/rounds/:roundOrder`, image `GET /api/quiz-runs/:runId/rounds/:roundOrder/image`, `POST .../submit` with `{ "answer": "..." }`, `POST .../give-up`.
- **Profile**: `GET /api/users/me/profile` — current user plus user-scoped stats (not a global leaderboard).

## Notes on Image Storage

Image bytes live in Postgres (`BYTEA`) for simplicity. For large scale, consider object storage and storing URLs/keys on `cities` instead.

## Migrating an existing database

If you already applied an older schema, use a follow-up migration (e.g. `002_rename_hint_columns.sql`) instead of re-running `001`. Fresh installs should use the current `001_initial_schema.sql` only.
