// 스크롤 시 요소가 화면에 들어오면 부드럽게 등장시키는 효과 (IntersectionObserver)
document.addEventListener("DOMContentLoaded", function () {
  const targets = document.querySelectorAll(
    ".section-card, .game-section, aside, nav, .stats-strip, fieldset"
  );
  if (!targets.length) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // 모션 최소화 설정이거나 옵저버 미지원 시 애니메이션 없이 그대로 표시
  if (prefersReduced || !("IntersectionObserver" in window)) {
    return;
  }

  targets.forEach(function (el) {
    el.classList.add("reveal");
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
});
