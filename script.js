let mode = 0;
let question = 0;
let correct = 0;
let cpu = "";
let target = "";
let canClick = true;

// 絵文字で表示
const hands = ["グー", "チョキ", "パー"];
const handImages = {
  "グー": "✊",
  "チョキ": "✌️",
  "パー": "✋"
};

function startGame(selectedMode) {
  mode = selectedMode;
  question = 0;
  correct = 0;

  document.getElementById("modeScreen").classList.add("hidden");
  document.getElementById("resultScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");

  nextRound();
}

function nextRound() {
  if (question >= 10) {
    document.getElementById("gameScreen").classList.add("hidden");
    document.getElementById("resultScreen").classList.remove("hidden");

    // 評価メッセージ
    let message = "";
    if (correct === 10) message = "完璧！！🔥";
    else if (correct >= 8) message = "すごい！👏";
    else if (correct >= 5) message = "いい感じ！👍";
    else message = "がんばろう！💪";

    document.getElementById("finalMessage").innerText = message;
    document.getElementById("finalScore").innerText = `正解数：${correct}/10`;
    return;
  }

  question++;
  cpu = hands[Math.floor(Math.random() * 3)];

  if (mode === 1) target = "勝ち";
  else if (mode === 2) target = "負け";
  else target = Math.random() > 0.5 ? "勝ち" : "負け";

  // 絵文字で表示
  document.getElementById("cpuHandImg").innerText = handImages[cpu];

  document.getElementById("result").innerText =
    `第${question}問：${target === "勝ち" ? "勝て！" : "負けろ！"}`;

  canClick = true;
}

function judge(player, cpu) {
  if (player === cpu) return "あいこ";
  if (
    (player === "グー" && cpu === "チョキ") ||
    (player === "チョキ" && cpu === "パー") ||
    (player === "パー" && cpu === "グー")
  ) return "勝ち";
  return "負け";
}

function playerChoice(player) {
  if (!cpu || !canClick) return;
  canClick = false;

  const result = judge(player, cpu);

  if (result === "あいこ") {
    document.getElementById("result").innerText = "あいこ！もう一回！";
    setTimeout(() => { canClick = true; }, 500);
    return;
  }

  if (result === target) {
    correct++;
    document.getElementById("result").innerText = "正解！🎉";

    const sound = document.getElementById("soundCorrect");
    sound.currentTime = 0;
    sound.play();

    const cpuDiv = document.getElementById("cpuHandImg");
    cpuDiv.classList.add("glow");
    setTimeout(() => cpuDiv.classList.remove("glow"), 600);
  } else {
    document.getElementById("result").innerText =
      `不正解！（あなた:${result}）💥`;

    const sound = document.getElementById("soundWrong");
    sound.currentTime = 0;
    sound.play();
  }

  setTimeout(nextRound, 700);
}

function restartGame() {
  document.getElementById("resultScreen").classList.add("hidden");
  document.getElementById("modeScreen").classList.remove("hidden");
}
