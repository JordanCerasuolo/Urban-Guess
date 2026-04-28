/* global quizApi */

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function renderRows(container, rows) {
  if (!rows || rows.length === 0) {
    container.innerHTML =
      '<div class="leaderboard-row"><div>No completed runs yet.</div></div>';
    return;
  }
  container.innerHTML = rows
    .map(
      (r) => `
      <div class="leaderboard-row">
        <div class="rank">${r.rank}</div>
        <div class="username">${escapeHtml(r.username)}</div>
        <div class="score">${r.score}</div>
      </div>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  const now = new Date();
  const monthName = MONTH_NAMES[now.getMonth()];

  /* ── Overall leaderboard ── */
  const overallBody = document.getElementById("leaderboardBody");
  if (overallBody) {
    try {
      const data = await window.quizApi.getLeaderboard(50);
      renderRows(overallBody, data.rows || []);
    } catch {
      overallBody.innerHTML =
        '<div class="leaderboard-row"><div>Could not load leaderboard.</div></div>';
    }
  }

  /* ── Monthly leaderboard (current month only) ── */
  const monthlyTitle = document.getElementById("monthlyTitle");
  const monthlyScore = document.getElementById("monthlyScoreHeader");
  const monthlyBody  = document.getElementById("monthlyLeaderboardBody");

  if (monthlyTitle) monthlyTitle.textContent = `${monthName} Leaderboard`;
  if (monthlyScore) monthlyScore.textContent = `${monthName.toUpperCase()} SCORE`;

  if (monthlyBody) {
    try {
      const data = await window.quizApi.getMonthlyLeaderboard(
        now.getFullYear(),
        now.getMonth() + 1,
        50
      );
      renderRows(monthlyBody, data.rows || []);
    } catch {
      monthlyBody.innerHTML =
        '<div class="leaderboard-row"><div>Could not load monthly leaderboard.</div></div>';
    }
  }
});
