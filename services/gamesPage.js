/* global quizApi */

document.addEventListener("DOMContentLoaded", () => {
  const startRun = async (card) => {
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
  };

  document.querySelectorAll("[data-continent]").forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      startRun(card);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        startRun(card);
      }
    });
  });
});
