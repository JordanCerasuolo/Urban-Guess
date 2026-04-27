/* global quizApi */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const username = String(fd.get("username") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    const confirmPassword = String(fd.get("confirmPassword") || "");
    const errEl = document.getElementById("formError");

    if (password !== confirmPassword) {
      if (errEl) errEl.textContent = "Passwords do not match.";
      return;
    }

    try {
      await window.quizApi.register({ username, email, password });
      window.location.href = `/verify-email?email=${encodeURIComponent(email)}`;
    } catch (err) {
      const msg = err.body?.message || err.message || "Sign up failed.";
      if (errEl) {
        errEl.textContent = msg;
      } else {
        alert(msg);
      }
    }
  });
});
