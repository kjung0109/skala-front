document.addEventListener("DOMContentLoaded", function () {
  // 페이지의 실제 요소 개수를 세어 요약에 반영
  const navCount = document.querySelectorAll(".nav-card").length;
  const gameCount = document.querySelectorAll(".game-section button").length;
  const cityCount = document.querySelectorAll('#citySelect option[value]:not([value=""])').length;

  document.getElementById("stat-nav").textContent = navCount;
  document.getElementById("stat-game").textContent = gameCount;
  document.getElementById("stat-city").textContent = cityCount;
});
