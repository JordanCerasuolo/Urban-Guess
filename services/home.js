/* global quizApi */

document.addEventListener("DOMContentLoaded", async () => {
  const guest = document.getElementById("navGuest");
  const user = document.getElementById("navUser");
  if (!guest || !user) return;

  try {
    const data = await window.quizApi.getMe();
    guest.style.display = "none";
    user.style.display = "";
    const nameEl = document.getElementById("navUsername");
    if (nameEl && data.user) {
      nameEl.textContent = `Hi, ${data.user.username}`;
    }
  } catch {
    guest.style.display = "";
    user.style.display = "none";
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await window.quizApi.logout();
      } catch {
        /* ignore */
      }
      localStorage.setItem("loggedOut", "true");
      window.location.href = "/";
    });
  }

  if (localStorage.getItem("loggedOut") === "true") {
    const toast = document.createElement("div");
    toast.classList.add("logout-toast");
    toast.textContent = "Logged out successfully";
  
    document.body.appendChild(toast);
  
    setTimeout(() => {
      toast.remove();
    }, 3000);
  
    localStorage.removeItem("loggedOut");
  }
});