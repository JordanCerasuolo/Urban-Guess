/* global quizApi */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("changePasswordForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const email = String(fd.get("email") || "").trim();
    const errEl = document.getElementById("formError");
    const successEl = document.getElementById("formSuccess");

    try {
      const data = await window.quizApi.requestPasswordReset({ email });
      if (errEl) errEl.textContent = "";
      if (successEl) {
        successEl.textContent = data.message || "If that email is registered, a reset link has been sent.";
        successEl.style.display = "block";
      }
      form.reset();
    } catch (err) {
      const msg = err.body?.message || err.message || "Something went wrong.";
      if (successEl) successEl.style.display = "none";
      if (errEl) {
        errEl.textContent = msg;
      } else {
        alert(msg);
      }
    }
  });
});
