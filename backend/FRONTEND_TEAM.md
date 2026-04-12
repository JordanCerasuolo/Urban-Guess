# GUIDE FOR UING BACKEND

Your app sends **JSON** to our server. The server talks to Postgres and sends JSON back (plus **raw image bytes** for the satellite picture). After you log in, the browser keeps a **session cookie** so you don’t pass a token manually on every request.

---

## Base URL and paths

- **API root (typical dev):** `http://localhost:3000`  
  (Whatever port the backend uses — check `PORT` in `.env`.)

- **Almost everything lives under `/api`.**  
  Example: login is `POST http://localhost:3000/api/auth/login`

- **Health check (no `/api` prefix):**  
  `GET /health` → `{ "ok": true }` — useful to see if the server is up.

Use **`Content-Type: application/json`** on requests that have a body.

---

## Important: cookies + CORS

After **register** or **login**, the API sets an **http-only** cookie (default name: **`access_token`**). That cookie is what proves you’re logged in.

For the browser to send that cookie on your `fetch` calls:

1. Use **`credentials: 'include'`** on every request that needs auth.

2. The backend must allow your frontend origin. Whoever runs the API should set **`FRONTEND_ORIGIN`** in `.env` to your dev URL, e.g. `http://localhost:5173`.  
   If that’s wrong, you’ll see CORS errors and cookies won’t behave.

**We do not put the JWT in the JSON body** on login/register responses — the cookie is the main browser flow. The server *also* accepts **`Authorization: Bearer <token>`** if you ever need it for Postman or a non-browser client, but for the React/Vite app, think **cookies + credentials**.

---

## Tiny `fetch` helper (optional but nice)

```js
const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export function api(path, options = {}) {
  return fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });
}
```

Use `API + "/api/..."` for routes below.

---

## 1. Login / register pages

**Register**  
`POST /api/auth/register`

Body:

```json
{
  "email": "you@example.com",
  "password": "at least 8 characters",
  "username": "yourname"
}
```

- **201** — account created; cookie is set; body has `{ "user": { "id", "email", "username", "createdAt" } }`.
- **400** — validation error (Zod will return `issues` in the JSON).
- **409** — email or username already taken (unique constraint).

**Login**  
`POST /api/auth/login`

Body:

```json
{
  "email": "you@example.com",
  "password": "your password"
}
```

- **200** — cookie set; `{ "user": { ... } }`.
- **401** — wrong email/password.

**Logout**  
`POST /api/auth/logout`  
- **204** — empty body; cookie cleared.

**“Am I logged in?” (good for app shell / route guards)**  
`GET /api/auth/me`  
- **200** — `{ "user": { "id", "email", "username", "createdAt" } }`.  
- **401** — not logged in or bad/expired cookie → send them to login.

---

## 2. Region picker page

**List continents**  
`GET /api/continents`

Returns something like:

```json
{
  "continents": [
    { "value": "EUROPE", "label": "Europe" },
    ...
  ]
}
```

Use **`value`** in the next step (`POST /api/quiz-runs`). Values are uppercase enum strings:  
`AFRICA`, `ANTARCTICA`, `ASIA`, `EUROPE`, `NORTH_AMERICA`, `OCEANIA`, `SOUTH_AMERICA`.

**Note:** Starting a game needs **at least 5 active cities** in that continent in the database. If someone picks a continent that isn’t seeded enough, the API returns **400** with a clear message — you can show that on the UI.

---

## 3. Quiz flow (the main game)

### Start a new game

When the user picks a continent:

`POST /api/quiz-runs`  
Body:

```json
{ "continent": "EUROPE" }
```

**Auth required.**  
**201** response example:

```json
{
  "runId": "uuid-here",
  "continent": "EUROPE",
  "numRounds": 5,
  "currentRoundOrder": 1
}
```

Save **`runId`** in memory, URL state, or wherever you track the active game.

### “Where are we in the game?”

`GET /api/quiz-runs/:runId`

Returns overall progress, total score, whether the run is finished, and which round they should play:

- **`currentRoundOrder`** — first round that isn’t finished yet, or **`null`** if all 5 are done.
- **`scoreTotal`** — running total points.
- **`endedAt`** — when the full run is done (all 5 rounds resolved), this is set.
- **`rounds`** — short per-round summary (`resolved`, `pointsEarned`, etc.).

Poll this after each submit/give-up if you want a single source of truth.

### State for one round (hints, tries left — no spoilers)

`GET /api/quiz-runs/:runId/rounds/:roundOrder`  
(`roundOrder` is **1–5**.)

Useful fields:

- **`triesUsed`**, **`maxTries`** (3), **`canSubmit`**, **`canGiveUp`**
- **`resolved`** — round is over (correct, gave up, or 3 wrong guesses)
- **`hint1`**, **`hint2`** — filled in after 1st and 2nd **wrong** guesses (while the round is still open). They’re `null` when not applicable.
- **`pointsEarned`** for that round once it’s done

The API **does not** send the city name or answer here — that’s intentional.

### Satellite image

`GET /api/quiz-runs/:runId/rounds/:roundOrder/image`

Returns **binary** image data with the right `Content-Type` (or **404** if that city has no image in the DB).

**Heads up for cross-origin setups** (Vite on `:5173`, API on `:3000`): putting that URL straight in `<img src="...">` often **won’t send cookies**, so the image request may get **401**. Safer pattern:

```js
const res = await fetch(`${API}/api/quiz-runs/${runId}/rounds/${roundOrder}/image`, {
  credentials: "include",
});
const blob = await res.blob();
const url = URL.createObjectURL(blob);
// use url in <img src={url}>; revokeObjectURL when unmounting
```

### Submit a guess

`POST /api/quiz-runs/:runId/rounds/:roundOrder/submit`  
Body:

```json
{ "answer": "Paris" }
```

Response includes things like:

- **`correct`** — boolean  
- **`tryNumber`** — 1, 2, or 3  
- **`pointsAwarded`** — 5 / 3 / 2 on first correct try, else 0  
- **`runScoreTotal`** — total for the whole run after this guess  
- **`hint1` / `hint2`** — same idea as the round state (after wrong guesses)  
- **`roundComplete`** — this city round is done  
- **`runComplete`** — all 5 rounds done  
- **`endedAt`** — set when the full run just finished  

After **`roundComplete`**, move UI to **`GET /quiz-runs/:runId`** and use **`currentRoundOrder`** for the next round (or show an end screen if **`runComplete`**).

### Give up on the current city

`POST /api/quiz-runs/:runId/rounds/:roundOrder/give-up`  
No body required.

0 points for that round; **`roundComplete`: true**. Then same as above — refresh run summary or go to next round.

---

## 4. Profile page

`GET /api/users/me/profile`  
**Auth required.**

Returns:

```json
{
  "user": { "id", "email", "username", "createdAt" },
  "stats": {
    "completedRuns": 0,
    "lastRunAt": null,
    "bestScore": null,
    "mostRecentRun": null
  }
}
```

- **`mostRecentRun`** — latest run by start time (can still be in progress); includes `id`, `continent`, `scoreTotal`, `startedAt`, `endedAt`.
- **`bestScore`** — highest **`scoreTotal`** among **finished** runs for this user only (not a global leaderboard).

---

## Errors (roughly)

- **401** — not authenticated.
- **404** — wrong id / not your run / round not found.
- **400** — bad input or illegal game action (e.g. submit when no tries left).
- **409** — duplicate email/username on register.
- **Validation** — **400** with `{ "message": "Validation failed", "issues": ... }` from Zod.

Errors are JSON with at least a **`message`** string in most cases.

---

## Quick checklist before blaming the backend

- [ ] API running and `GET /health` works  
- [ ] `FRONTEND_ORIGIN` matches your dev server URL  
- [ ] `fetch` uses **`credentials: "include"`**  
- [ ] URLs include the **`/api`** prefix  
- [ ] Quiz routes use a real **`runId`** from **`POST /api/quiz-runs`**  
- [ ] **`roundOrder`** is **1–5**  
- [ ] Database seeded so continents have enough cities (or test with a continent that does)

---
