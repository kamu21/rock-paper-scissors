let mode = 0;
let question = 0;
let correct = 0;
let cpu = "";
let target = "";

const hands = ["グー", "チョキ", "パー"];
const handImages = {
  "グー": "img/rock.png",
  "チョキ": "img/scissors.png",
  "パー": "img/paper.png"
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
    // 結果画面へ
    document.getElementById("gameScreen").classList.add("hidden");
    document.getElementById("resultScreen").classList.remove("hidden");

    document.getElementById("finalMessage").innerText = correct >= 9 ? "バッチリです！" : "OKです！";
    document.getElementById("finalScore").innerText = `正解数：${correct}/10`;
    return;
  }

  question++;
  cpu = hands[Math.floor(Math.random() * 3)];

  if (mode === 1) target = "勝ち";
  else if (mode === 2) target = "負け";
  else target = Math.random() > 0.5 ? "勝ち" : "負け";

  document.getElementById("cpuHandImg").querySelector("img").src = handImages[cpu];
  document.getElementById("result").innerText = `第${question}問：${target}を選べ！`;
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
  if (!cpu) return;

  const cpuImg = document.getElementById("cpuHandImg").querySelector("img");
  const result = judge(player, cpu);

  if (result === target) {
    correct++;
    document.getElementById("result").innerText = "正解！🎉";
    document.getElementById("soundCorrect").play();

    // 正解時に光らせるアニメーション
    cpuImg.classList.add("glow");
    setTimeout(() => cpuImg.classList.remove("glow"), 600);
  } else {
    document.getElementById("result").innerText = `不正解！（あなた:${result}）💥`;
    document.getElementById("soundWrong").play();
  }

  setTimeout(nextRound, 1000);
}

function restartGame() {
  document.getElementById("resultScreen").classList.add("hidden");
  document.getElementById("modeScreen").classList.remove("hidden");
}
