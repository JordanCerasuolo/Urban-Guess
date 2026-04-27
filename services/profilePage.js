/* global quizApi */

document.addEventListener("DOMContentLoaded", async () => {
  const root = document.getElementById("profileRoot");
  if (!root) return;

  try {
    const data = await window.quizApi.getProfile();
    const u = data.user;
    const s = data.stats;
    const runItems = (s.allRuns || []).map((r) => {
      const date = new Date(r.startedAt).toLocaleDateString();
      const status = r.endedAt ? "Completed" : "In progress";
      return `<li>${date} — ${escapeHtml(r.continent)}, Score: ${r.scoreTotal} (${status})</li>`;
    }).join("");

    root.innerHTML = `
      <div class="profile-box">
        <h2>${escapeHtml(u.username)}</h2>
        <p>Email: ${escapeHtml(u.email)}</p>
        <p>Best score (completed run): ${s.bestScore ?? "—"}</p>
        <p>Completed runs: ${s.completedRuns ?? 0}</p>
        <a href="/change-password" class="profile-change-pw">CHANGE PASSWORD</a>
        <h3>Past runs</h3>
        ${
          runItems
            ? `<ul class="profile-runs-list">${runItems}</ul>`
            : "<p>No runs yet.</p>"
        }
      </div>
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
