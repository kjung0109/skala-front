document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  const userId = document.getElementById("userId");
  const userPw = document.getElementById("userPw");
  const userName = document.getElementById("userName");
  const userEmail = document.getElementById("userEmail");
  const emailDomain = document.getElementById("emailDomain");
  const customDomain = document.getElementById("customDomain");

  const pwStrength = document.getElementById("pwStrength");
  const pwStrengthLabel = document.getElementById("pwStrengthLabel");

  const userIdFeedback = document.getElementById("userId-feedback");
  const userPwFeedback = document.getElementById("userPw-feedback");
  const userNameFeedback = document.getElementById("userName-feedback");
  const userEmailFeedback = document.getElementById("userEmail-feedback");

  const idPattern = /^[A-Za-z0-9]{4,15}$/;
  const emailLocalPattern = /^[A-Za-z0-9._-]+$/;
  const domainPattern = /^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const minPasswordLength = 8;

  function toggleCustomDomain() {
    if (emailDomain.value === "direct") {
      customDomain.classList.remove("hidden");
    } else {
      customDomain.classList.add("hidden");
      customDomain.value = "";
    }
  }

  toggleCustomDomain();
  emailDomain.addEventListener("change", function () {
    toggleCustomDomain();
    validateUserEmail();
  });
  customDomain.addEventListener("input", validateUserEmail);

  function setFeedback(input, feedbackEl, isValid, message) {
    feedbackEl.textContent = message;
    feedbackEl.classList.remove("valid", "invalid");
    input.classList.remove("valid", "invalid");

    // 입력창 안쪽 ✓/✗ 상태 아이콘 (존재하는 필드만)
    const statusEl = document.getElementById(input.id + "-status");

    if (message === "") {
      if (statusEl) {
        statusEl.textContent = "";
        statusEl.className = "field-status";
      }
      return;
    }

    if (isValid) {
      feedbackEl.classList.add("valid");
      input.classList.add("valid");
      if (statusEl) {
        statusEl.textContent = "✓";
        statusEl.className = "field-status valid";
      }
    } else {
      feedbackEl.classList.add("invalid");
      input.classList.add("invalid");
      if (statusEl) {
        statusEl.textContent = "✗";
        statusEl.className = "field-status invalid";
      }
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

    if (!emailLocalPattern.test(value)) {
      setFeedback(userEmail, userEmailFeedback, false, "영문, 숫자, . _ - 만 사용 가능합니다. ❌");
      return false;
    }

    if (emailDomain.value === "direct") {
      const domainValue = customDomain.value.trim();
      if (domainValue === "" || !domainPattern.test(domainValue)) {
        setFeedback(userEmail, userEmailFeedback, false, "도메인을 올바르게 입력해 주세요. (예: mycompany.com) ❌");
        return false;
      }
    }

    setFeedback(userEmail, userEmailFeedback, true, "사용 가능한 형식입니다. ✅");
    return true;
  }

  // 비밀번호 강도 미터 (길이 + 문자 종류 다양성으로 점수 계산)
  function updatePwStrength() {
    const value = userPw.value;
    if (value === "") {
      pwStrength.hidden = true;
      return;
    }
    pwStrength.hidden = false;

    let score = 0;
    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    let level, label;
    if (score <= 1) {
      level = 1;
      label = "약함";
    } else if (score === 2) {
      level = 2;
      label = "보통";
    } else if (score <= 4) {
      level = 3;
      label = "강함";
    } else {
      level = 4;
      label = "매우 강함";
    }

    pwStrength.dataset.level = level;
    pwStrengthLabel.textContent = label;
  }

  userId.addEventListener("input", validateUserId);
  userPw.addEventListener("input", validateUserPw);
  userPw.addEventListener("input", updatePwStrength);
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
