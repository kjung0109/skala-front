document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("bestCut");
  if (!carousel) return;

  const slides = carousel.querySelectorAll(".carousel-slide");
  const dots = carousel.querySelectorAll(".carousel-dot");
  const interval = 3500;
  let index = 0;
  let timer;

  function show(i) {
    slides[index].classList.remove("active");
    dots[index].classList.remove("active");
    index = (i + slides.length) % slides.length;
    slides[index].classList.add("active");
    dots[index].classList.add("active");
  }

  function next() {
    show(index + 1);
  }

  function start() {
    timer = setInterval(next, interval);
  }

  function stop() {
    clearInterval(timer);
  }

  // 첫 슬라이드 활성화
  slides[0].classList.add("active");
  dots[0].classList.add("active");

  // 점 클릭 시 해당 사진으로 이동하고 타이머 재시작
  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      show(i);
      stop();
      start();
    });
  });

  // 마우스를 올리면 멈추고, 벗어나면 다시 자동 재생
  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);

  start();
});
