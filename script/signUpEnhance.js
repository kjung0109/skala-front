document.addEventListener("DOMContentLoaded", function () {
  // ===== 비밀번호 표시/숨김 토글 =====
  const userPw = document.getElementById("userPw");
  const pwToggle = document.getElementById("pwToggle");

  pwToggle.addEventListener("click", function () {
    const isHidden = userPw.type === "password";
    userPw.type = isHidden ? "text" : "password";
    pwToggle.textContent = isHidden ? "🙈" : "👁️";
    pwToggle.setAttribute("aria-label", isHidden ? "비밀번호 숨김" : "비밀번호 표시");
  });

  // ===== 자기소개 글자 수 카운터 =====
  const intro = document.getElementById("intro");
  const introCount = document.getElementById("intro-count");

  intro.addEventListener("input", function () {
    introCount.textContent = intro.value.length;
  });
});
