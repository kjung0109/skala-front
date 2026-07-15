function startGradeCalculator() {
  const subjects = ["HTML", "CSS", "JavaScript"];
  let total = 0;

  for (let i = 0; i < subjects.length; i++) {
    const score = Number(prompt(subjects[i] + " 점수를 입력하세요."));
    total += score;
  }

  const average = total / subjects.length;
  const resultText = average >= 60 ? "합격입니다! 우수자로 선정되었습니다." : "불합격입니다.";

  alert(
    "===== 성적 결과 =====\n" +
    "- 총점: " + total + "점\n" +
    "- 평균: " + average.toFixed(1) + "점\n" +
    "---------------------\n" +
    "- 결과: " + resultText
  );
}
