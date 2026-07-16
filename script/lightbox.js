// 여행 사진 라이트박스: 사진 클릭 시 확대 모달로 보기 (좌우 이동·키보드 지원)
document.addEventListener("DOMContentLoaded", function () {
  const images = Array.from(document.querySelectorAll(".trip-card img"));
  if (!images.length) return;

  // 라이트박스 DOM 생성
  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "여행 사진 크게 보기");
  overlay.innerHTML =
    '<button class="lightbox-close" type="button" aria-label="닫기">✕</button>' +
    '<button class="lightbox-nav lightbox-prev" type="button" aria-label="이전 사진">‹</button>' +
    '<figure class="lightbox-content">' +
    '<img class="lightbox-img" alt="">' +
    '<figcaption class="lightbox-caption"></figcaption>' +
    "</figure>" +
    '<button class="lightbox-nav lightbox-next" type="button" aria-label="다음 사진">›</button>';
  document.body.appendChild(overlay);

  const lbImg = overlay.querySelector(".lightbox-img");
  const lbCaption = overlay.querySelector(".lightbox-caption");
  const btnClose = overlay.querySelector(".lightbox-close");
  const btnPrev = overlay.querySelector(".lightbox-prev");
  const btnNext = overlay.querySelector(".lightbox-next");
  const focusables = [btnPrev, btnNext, btnClose];

  let current = 0;
  let lastFocused = null;

  function captionFor(img) {
    const fig = img.closest("figure");
    const cap = fig ? fig.querySelector("figcaption") : null;
    if (!cap) return img.alt;
    const strong = cap.querySelector("strong");
    const year = cap.querySelector(".trip-year");
    return (
      (strong ? strong.textContent : img.alt) +
      (year ? " · " + year.textContent : "")
    );
  }

  function show(index) {
    current = (index + images.length) % images.length;
    const img = images[current];
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = captionFor(img);
  }

  function open(index) {
    lastFocused = document.activeElement;
    show(index);
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    btnClose.focus();
    document.addEventListener("keydown", onKey);
  }

  function close() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
    if (lastFocused) lastFocused.focus();
  }

  function onKey(e) {
    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowLeft") {
      show(current - 1);
    } else if (e.key === "ArrowRight") {
      show(current + 1);
    } else if (e.key === "Tab") {
      // 포커스를 모달 내부 버튼으로 가둠
      e.preventDefault();
      const idx = focusables.indexOf(document.activeElement);
      let next;
      if (e.shiftKey) {
        next = idx <= 0 ? focusables.length - 1 : idx - 1;
      } else {
        next = idx === focusables.length - 1 ? 0 : idx + 1;
      }
      focusables[next].focus();
    }
  }

  images.forEach(function (img, i) {
    img.classList.add("lightbox-trigger");
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", img.alt + " 크게 보기");
    img.addEventListener("click", function () {
      open(i);
    });
    img.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(i);
      }
    });
  });

  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", function () {
    show(current - 1);
  });
  btnNext.addEventListener("click", function () {
    show(current + 1);
  });
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) close();
  });
});
