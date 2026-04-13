/* global quizApi */

function getRunIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("runId");
}

function setImageFromBlob(imgEl, blob) {
  if (!imgEl) return;
  const prev = imgEl.dataset.objectUrl;
  if (prev) {
    URL.revokeObjectURL(prev);
  }
  const url = URL.createObjectURL(blob);
  imgEl.dataset.objectUrl = url;
  imgEl.src = url;
  imgEl.alt = "Satellite image";
}

async function loadRound(runId, roundOrder, ui) {
  hideOverlay(ui);
  if (ui.overlayTitle) ui.overlayTitle.textContent = "";
  if (ui.overlayAnswer) ui.overlayAnswer.textContent = "";

  const state = await quizApi.getRoundState(runId, roundOrder);
  const blob = await quizApi.fetchRoundImageBlob(runId, roundOrder);
  setImageFromBlob(ui.image, blob);

  ui.title.textContent = `Q${roundOrder}`;
  if (ui.hint) {
    const parts = [state.hint1, state.hint2].filter(Boolean);
    ui.hint.textContent = parts.join(" — ");
  }

  ui.input.disabled = !state.canSubmit;
  ui.submitBtn.disabled = !state.canSubmit;
  if (ui.giveUpBtn) {
    ui.giveUpBtn.disabled = !state.canGiveUp;
  }

  return state;
}

function showEnd(ui, message) {
  if (ui.guessForm) ui.guessForm.style.display = "none";
  if (ui.giveUpBtn) ui.giveUpBtn.style.display = "none";
  hideOverlay(ui);
  ui.endMessage.hidden = false;
  ui.endMessage.textContent = message;
}

function hideOverlay(ui) {
  if (ui.overlay) ui.overlay.hidden = true;
  if (ui.overlayButtons) ui.overlayButtons.innerHTML = "";
}

function showRoundResult(ui, { correct, cityName, runComplete, runScoreTotal, onContinue }) {
  ui.input.disabled = true;
  ui.submitBtn.disabled = true;
  if (ui.giveUpBtn) ui.giveUpBtn.disabled = true;

  ui.overlayTitle.textContent = correct ? "Congrats!" : "Incorrect";
  ui.overlayAnswer.textContent = "Answer: " + (cityName || "Unknown");
  ui.overlayButtons.innerHTML = "";

  const wikiUrl = "https://en.wikipedia.org/wiki/" + encodeURIComponent(cityName || "");
  const learnBtn = document.createElement("a");
  learnBtn.href = wikiUrl;
  learnBtn.target = "_blank";
  learnBtn.textContent = "Learn More";
  learnBtn.className = "learn-more-btn";
  ui.overlayButtons.appendChild(learnBtn);

  const contBtn = document.createElement("button");
  contBtn.textContent = runComplete ? "See Results" : "Continue";
  contBtn.className = "continue-btn";
  contBtn.addEventListener("click", onContinue);
  ui.overlayButtons.appendChild(contBtn);

  ui.overlay.hidden = false;
}

document.addEventListener("DOMContentLoaded", async () => {
  const runId = getRunIdFromQuery();
  const ui = {
    image: document.getElementById("gameImage"),
    title: document.getElementById("gameTitle"),
    hint: document.getElementById("hintLine"),
    input: document.getElementById("guessInput"),
    submitBtn: document.getElementById("submitBtn"),
    giveUpBtn: document.getElementById("giveUpBtn"),
    guessForm: document.querySelector(".guess-form"),
    endMessage: document.getElementById("endMessage"),
    overlay: document.getElementById("roundOverlay"),
    overlayTitle: document.getElementById("overlayTitle"),
    overlayAnswer: document.getElementById("overlayAnswer"),
    overlayButtons: document.getElementById("overlayButtons"),
  };

  if (!ui.image || !ui.input || !ui.submitBtn || !ui.endMessage) {
    return;
  }

  if (!runId) {
    window.location.href = "/games";
    return;
  }

  let roundOrder;

  try {
    const run = await quizApi.getQuizRun(runId);
    if (run.runComplete || run.currentRoundOrder === null) {
      showEnd(
        ui,
        `Run finished! Final score: ${run.scoreTotal ?? 0}.`
      );
      return;
    }
    roundOrder = run.currentRoundOrder;
    await loadRound(runId, roundOrder, ui);
  } catch (e) {
    alert(e.message || "Could not load quiz.");
    window.location.href = "/games";
    return;
  }

  ui.submitBtn.addEventListener("click", async () => {
    const answer = ui.input.value.trim();
    if (!answer) return;
    try {
      const result = await quizApi.submitAnswer(runId, roundOrder, answer);
      ui.input.value = "";
      if (ui.hint) {
        const parts = [result.hint1, result.hint2].filter(Boolean);
        if (parts.length) {
          ui.hint.textContent = parts.join(" — ");
        }
      }

      if (result.roundComplete) {
        showRoundResult(ui, {
          correct: result.correct,
          cityName: result.cityName,
          runComplete: result.runComplete,
          runScoreTotal: result.runScoreTotal,
          onContinue: async () => {
            if (result.runComplete) {
              showEnd(ui, `Run finished! Final score: ${result.runScoreTotal ?? 0}.`);
              return;
            }
            hideOverlay(ui);
            const next = await quizApi.getQuizRun(runId);
            if (next.runComplete || next.currentRoundOrder === null) {
              showEnd(ui, `Run finished! Final score: ${next.scoreTotal ?? 0}.`);
              return;
            }
            roundOrder = next.currentRoundOrder;
            if (ui.hint) ui.hint.textContent = "";
            await loadRound(runId, roundOrder, ui);
          },
        });
        return;
      }

      const st = await quizApi.getRoundState(runId, roundOrder);
      ui.input.disabled = !st.canSubmit;
      ui.submitBtn.disabled = !st.canSubmit;
      if (ui.giveUpBtn) {
        ui.giveUpBtn.disabled = !st.canGiveUp;
      }
      if (ui.hint) {
        const parts = [st.hint1, st.hint2].filter(Boolean);
        ui.hint.textContent = parts.join(" — ");
      }
    } catch (e) {
      alert(e.message || "Submit failed.");
    }
  });

  if (ui.giveUpBtn) {
    ui.giveUpBtn.addEventListener("click", async () => {
      try {
        const result = await quizApi.giveUpRound(runId, roundOrder);
        if (result.roundComplete) {
          showRoundResult(ui, {
            correct: false,
            cityName: result.cityName,
            runComplete: result.runComplete,
            runScoreTotal: result.runScoreTotal,
            onContinue: async () => {
              if (result.runComplete) {
                showEnd(ui, `Run finished! Final score: ${result.runScoreTotal ?? 0}.`);
                return;
              }
              hideOverlay(ui);
              const next = await quizApi.getQuizRun(runId);
              if (next.runComplete || next.currentRoundOrder === null) {
                showEnd(ui, `Run finished! Final score: ${next.scoreTotal ?? 0}.`);
                return;
              }
              roundOrder = next.currentRoundOrder;
              if (ui.hint) ui.hint.textContent = "";
              await loadRound(runId, roundOrder, ui);
            },
          });
        }
      } catch (e) {
        alert(e.message || "Could not give up.");
      }
    });
  }
});
