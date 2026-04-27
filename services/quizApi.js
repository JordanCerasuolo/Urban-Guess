/**
 * Browser client for Urban-Guess JSON API (same origin, httpOnly cookie).
 */

const PREFIX = "/api";

async function parseJsonResponse(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

/**
 * @param {string} path
 * @param {RequestInit & { json?: unknown }} [options]
 */
async function apiFetch(path, options = {}) {
  const { json, ...rest } = options;
  const headers = { ...rest.headers };
  if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    rest.body = JSON.stringify(json);
  }
  const res = await fetch(`${PREFIX}${path}`, {
    ...rest,
    credentials: "include",
    headers,
  });
  if (res.status === 204) {
    if (!res.ok) {
      const err = new Error("Request failed");
      err.status = res.status;
      throw err;
    }
    return null;
  }
  const data = await parseJsonResponse(res);
  if (!res.ok) {
    const err = new Error(
      data?.message || `Request failed (${res.status})`
    );
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

function getContinents() {
  return apiFetch("/continents");
}

function register(body) {
  return apiFetch("/auth/register", { method: "POST", json: body });
}

function login(body) {
  return apiFetch("/auth/login", { method: "POST", json: body });
}

function logout() {
  return apiFetch("/auth/logout", { method: "POST" });
}

function getMe() {
  return apiFetch("/auth/me");
}

function startQuizRun(continent) {
  return apiFetch("/quiz-runs", { method: "POST", json: { continent } });
}

function getQuizRun(runId) {
  return apiFetch(`/quiz-runs/${encodeURIComponent(runId)}`);
}

function getRoundState(runId, roundOrder) {
  return apiFetch(
    `/quiz-runs/${encodeURIComponent(runId)}/rounds/${roundOrder}`
  );
}

async function fetchRoundImageBlob(runId, roundOrder) {
  const res = await fetch(
    `${PREFIX}/quiz-runs/${encodeURIComponent(runId)}/rounds/${roundOrder}/image`,
    { credentials: "include" }
  );
  if (!res.ok) {
    const data = await parseJsonResponse(res);
    const err = new Error(data?.message || "Failed to load image");
    err.status = res.status;
    throw err;
  }
  return res.blob();
}

function submitAnswer(runId, roundOrder, answer) {
  return apiFetch(
    `/quiz-runs/${encodeURIComponent(runId)}/rounds/${roundOrder}/submit`,
    { method: "POST", json: { answer } }
  );
}

function giveUpRound(runId, roundOrder) {
  return apiFetch(
    `/quiz-runs/${encodeURIComponent(runId)}/rounds/${roundOrder}/give-up`,
    { method: "POST" }
  );
}

function getProfile() {
  return apiFetch("/users/me/profile");
}

function requestPasswordReset(body) {
  return apiFetch("/auth/request-password-reset", { method: "POST", json: body });
}

function resetPassword(body) {
  return apiFetch("/auth/reset-password", { method: "POST", json: body });
}

function getLeaderboard(limit = 50) {
  const q = limit ? `?limit=${encodeURIComponent(String(limit))}` : "";
  return apiFetch(`/leaderboard${q}`);
}

if (typeof window !== "undefined") {
  window.quizApi = {
    getContinents,
    register,
    login,
    logout,
    getMe,
    startQuizRun,
    getQuizRun,
    getRoundState,
    fetchRoundImageBlob,
    submitAnswer,
    giveUpRound,
    getProfile,
    getLeaderboard,
    requestPasswordReset,
    resetPassword,
  };
}
