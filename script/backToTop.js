// 스크롤을 내리면 나타나는 '맨 위로' 버튼 (JS로 주입하여 모든 페이지 공통 사용)
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.createElement("button");
  btn.className = "back-to-top";
  btn.type = "button";
  btn.setAttribute("aria-label", "맨 위로 이동");
  btn.textContent = "↑";
  document.body.appendChild(btn);

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function onScroll() {
    if (window.scrollY > 300) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  }

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});
