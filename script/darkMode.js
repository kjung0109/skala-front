document.addEventListener("DOMContentLoaded", function () {
  const root = document.documentElement;
  const toggleBtn = document.getElementById("theme-toggle");

  function updateIcon() {
    const isDark = root.getAttribute("data-theme") === "dark";
    toggleBtn.textContent = isDark ? "☀️" : "🌙";
  }

  toggleBtn.addEventListener("click", function () {
    const isDark = root.getAttribute("data-theme") === "dark";

    if (isDark) {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }

    updateIcon();
  });

  updateIcon();
});
