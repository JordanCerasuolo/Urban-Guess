/* global quizApi */

document.addEventListener("DOMContentLoaded", async () => {
  const root = document.getElementById("profileRoot");
  if (!root) return;

  try {
    const data = await window.quizApi.getProfile();
    const u = data.user;
    const s = data.stats;
    root.innerHTML = `
      <section class="profile">
        <div class="profile-info">
          <h2>${escapeHtml(u.username)}</h2>
          <p>Email: ${escapeHtml(u.email)}</p>
          <p>Best score (completed run): ${s.bestScore ?? "—"}</p>
          <p>Completed runs: ${s.completedRuns ?? 0}</p>
        </div>
        <div class="profile-stats">
          <h3>Recent run</h3>
          ${
            s.mostRecentRun
              ? `<p>Score: ${s.mostRecentRun.scoreTotal}, continent: ${s.mostRecentRun.continent}</p>`
              : "<p>No runs yet.</p>"
          }
        </div>
      </section>
    `;
  } catch (err) {
    if (err.status === 401) {
      window.location.href = "/login";
      return;
    }
    root.innerHTML = `<p class="error-message">Could not load profile.</p>`;
  }
});

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}
