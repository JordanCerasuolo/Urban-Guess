/* global quizApi */

document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.getElementById("leaderboardBody");
  if (!tbody) return;

  try {
    const data = await window.quizApi.getLeaderboard(50);
    const rows = data.rows || [];
    if (rows.length === 0) {
      tbody.innerHTML =
        '<div class="leaderboard-row"><div colspan="3">No completed runs yet.</div></div>';
      return;
    }
    tbody.innerHTML = rows
      .map(
        (r) => `
      <div class="leaderboard-row">
        <div class="rank">${r.rank}</div>
        <div class="username">${escapeHtml(r.username)}</div>
        <div class="score">${r.score}</div>
      </div>
    `
      )
      .join("");
  } catch {
    tbody.innerHTML =
      '<div class="leaderboard-row"><div>Could not load leaderboard.</div></div>';
  }
});

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}
