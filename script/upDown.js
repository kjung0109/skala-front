function startUpDownGame() {
  const computerNum = Math.floor(Math.random() * 50) + 1;
  let tryCount = 0;

  while (true) {
    const input = prompt("1부터 50 사이의 숫자 중 컴퓨터가 생각한 숫자는 무엇일까요?");

    if (input === null) {
      return;
    }

    const guess = Number(input);
    tryCount++;

    if (guess > computerNum) {
      alert("Down!");
    } else if (guess < computerNum) {
      alert("Up!");
    } else {
      alert(`축하합니다! ${tryCount}번 만에 맞추셨습니다.`);
      break;
    }
  }
}
