// 기술 스택 게이지: 화면에 들어오면 0에서 실제 숙련도까지 채워지는 효과
document.addEventListener("DOMContentLoaded", function () {
  const fills = document.querySelectorAll(".skill-fill");
  if (!fills.length) return;

  function fill(el) {
    el.style.width = el.dataset.level + "%";
  }

  // 옵저버 미지원 시 즉시 채움
  if (!("IntersectionObserver" in window)) {
    fills.forEach(fill);
    return;
  }

  const observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          fill(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  fills.forEach(function (el) {
    observer.observe(el);
  });
});
