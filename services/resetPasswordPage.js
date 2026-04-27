/* global quizApi */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resetPasswordForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const token = String(fd.get("token") || "");
    const password = String(fd.get("password") || "");
    const confirmPassword = String(fd.get("confirmPassword") || "");
    const errEl = document.getElementById("formError");
    const successEl = document.getElementById("formSuccess");

    if (password !== confirmPassword) {
      if (successEl) successEl.style.display = "none";
      if (errEl) errEl.textContent = "Passwords do not match.";
      return;
    }

    try {
      const data = await window.quizApi.resetPassword({ token, password });
      if (errEl) errEl.textContent = "";
      if (successEl) {
        successEl.textContent = data.message || "Password reset successfully.";
        successEl.style.display = "block";
      }
      form.reset();
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
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
