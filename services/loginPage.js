/* global quizApi */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    const errEl = document.getElementById("formError");
    try {
      await window.quizApi.login({ email, password });
      window.location.href = "/";
    } catch (err) {
      const msg = err.body?.message || err.message || "Login failed.";
      if (errEl) {
        errEl.textContent = msg;
      } else {
        alert(msg);
      }
    }
  });
});
