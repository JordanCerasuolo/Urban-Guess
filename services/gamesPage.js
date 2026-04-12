/* global quizApi */

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-continent] .js-play").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const card = btn.closest("[data-continent]");
      if (!card) return;
      const continent = card.dataset.continent;
      try {
        const r = await window.quizApi.startQuizRun(continent);
        window.location.href = `/game?runId=${encodeURIComponent(r.runId)}`;
      } catch (err) {
        if (err.status === 401) {
          window.location.href = "/login";
          return;
        }
        alert(err.message || "Could not start game.");
      }
    });
  });
});
