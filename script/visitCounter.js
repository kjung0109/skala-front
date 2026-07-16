// 방문 카운터: localStorage로 방문 횟수와 지난 방문 시각을 표시
document.addEventListener("DOMContentLoaded", function () {
  const el = document.getElementById("hero-visit");
  if (!el) return;

  const KEY_COUNT = "visitCount";
  const KEY_LAST = "lastVisit";

  const prevCount = parseInt(localStorage.getItem(KEY_COUNT), 10) || 0;
  const prevLast = localStorage.getItem(KEY_LAST);
  const count = prevCount + 1;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function format(d) {
    return (
      d.getFullYear() + "." + pad(d.getMonth() + 1) + "." + pad(d.getDate()) +
      " " + pad(d.getHours()) + ":" + pad(d.getMinutes())
    );
  }

  if (prevCount === 0 || !prevLast) {
    el.textContent = "첫 방문을 환영합니다 🎉";
  } else {
    el.textContent = count + "번째 방문 · 지난 방문 " + prevLast;
  }

  localStorage.setItem(KEY_COUNT, String(count));
  localStorage.setItem(KEY_LAST, format(new Date()));
});
