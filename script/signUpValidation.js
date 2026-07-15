document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  const userId = document.getElementById("userId");
  const userPw = document.getElementById("userPw");
  const userName = document.getElementById("userName");
  const userEmail = document.getElementById("userEmail");

  const userIdFeedback = document.getElementById("userId-feedback");
  const userPwFeedback = document.getElementById("userPw-feedback");
  const userNameFeedback = document.getElementById("userName-feedback");
  const userEmailFeedback = document.getElementById("userEmail-feedback");

  const idPattern = /^[A-Za-z0-9]{4,15}$/;
  const emailLocalPattern = /^[A-Za-z0-9._-]+$/;
  const minPasswordLength = 8;

  function setFeedback(input, feedbackEl, isValid, message) {
    feedbackEl.textContent = message;
    feedbackEl.classList.remove("valid", "invalid");
    input.classList.remove("valid", "invalid");

    if (message === "") {
      return;
    }

    if (isValid) {
      feedbackEl.classList.add("valid");
      input.classList.add("valid");
    } else {
      feedbackEl.classList.add("invalid");
      input.classList.add("invalid");
    }
  }

  function validateUserId() {
    const value = userId.value;
    if (value === "") {
      setFeedback(userId, userIdFeedback, false, "");
      return false;
    }
    const isValid = idPattern.test(value);
    setFeedback(
      userId,
      userIdFeedback,
      isValid,
      isValid ? "사용 가능한 아이디입니다. ✅" : "4~15자의 영문/숫자로만 입력해 주세요. ❌"
    );
    return isValid;
  }

  function validateUserPw() {
    const value = userPw.value;
    if (value === "") {
      setFeedback(userPw, userPwFeedback, false, "");
      return false;
    }
    const isValid = value.length >= minPasswordLength;
    setFeedback(
      userPw,
      userPwFeedback,
      isValid,
      isValid ? "안전한 길이의 비밀번호입니다. ✅" : "8자 이상 입력해 주세요. ❌"
    );
    return isValid;
  }

  function validateUserName() {
    const value = userName.value.trim();
    if (value === "") {
      setFeedback(userName, userNameFeedback, false, "");
      return false;
    }
    setFeedback(userName, userNameFeedback, true, "확인했습니다. ✅");
    return true;
  }

  function validateUserEmail() {
    const value = userEmail.value.trim();
    if (value === "") {
      setFeedback(userEmail, userEmailFeedback, false, "");
      return true; // 이메일은 선택 입력 항목
    }
    const isValid = emailLocalPattern.test(value);
    setFeedback(
      userEmail,
      userEmailFeedback,
      isValid,
      isValid ? "사용 가능한 형식입니다. ✅" : "영문, 숫자, . _ - 만 사용 가능합니다. ❌"
    );
    return isValid;
  }

  userId.addEventListener("input", validateUserId);
  userPw.addEventListener("input", validateUserPw);
  userName.addEventListener("input", validateUserName);
  userEmail.addEventListener("input", validateUserEmail);

  form.addEventListener("submit", function (event) {
    if (!validateUserId()) {
      alert("아이디는 4~15자의 영문/숫자로만 입력해 주세요.");
      event.preventDefault();
      userId.focus();
      return;
    }

    if (!validateUserPw()) {
      alert("비밀번호는 8자 이상 입력해 주세요.");
      event.preventDefault();
      userPw.focus();
      return;
    }

    if (!validateUserName()) {
      alert("이름을 입력해 주세요.");
      event.preventDefault();
      userName.focus();
      return;
    }

    if (!validateUserEmail()) {
      alert("이메일 아이디 형식이 올바르지 않습니다. (영문, 숫자, . _ - 만 사용 가능)");
      event.preventDefault();
      userEmail.focus();
      return;
    }
  });
});
