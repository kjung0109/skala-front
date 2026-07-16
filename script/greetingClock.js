document.addEventListener("DOMContentLoaded", function () {
  const greetingEl = document.getElementById("greeting");
  const clockEl = document.getElementById("clock");

  function getGreeting(hour) {
    if (hour >= 5 && hour < 12) return "좋은 아침입니다 ☀️";
    if (hour >= 12 && hour < 18) return "좋은 오후입니다 🌤️";
    if (hour >= 18 && hour < 22) return "좋은 저녁입니다 🌆";
    return "좋은 밤입니다 🌙";
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function update() {
    const now = new Date();
    greetingEl.textContent = getGreeting(now.getHours());
    clockEl.textContent =
      pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
  }

  update();
  setInterval(update, 1000);
});
