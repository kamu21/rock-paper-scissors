let mode = 0;
let question = 0;
let correct = 0;
let cpu = "";
let target = "";
let canClick = true;

let audioUnlocked = false;

const hands = ["グー", "チョキ", "パー"];
const handImages = {
  "グー": "✊",
  "チョキ": "✌️",
  "パー": "✋"
};

function unlockAudio() {
  if (audioUnlocked) return;

  const sounds = [
    document.getElementById("soundCorrect"),
    document.getElementById("soundResult")
  ];

  sounds.forEach(s => {
    s.play().then(() => { s.pause(); s.currentTime = 0; }).catch(() => {});
  });

  audioUnlocked = true;
}

function startGame(selectedMode) {
  unlockAudio();
  mode = selectedMode;
  question = 0;
  correct = 0;

  document.getElementById("modeScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");

  nextRound();
}

function nextRound() {
  if (question >= 10) {
    document.getElementById("gameScreen").classList.add("hidden");
    document.getElementById("resultScreen").classList.remove("hidden");

    const finalMessage = document.getElementById("finalMessage");

    document.getElementById("finalScore").innerText = `正解数：${correct}/10`;

    setTimeout(() => play("soundResult"), 200);

    if (correct === 10) {
      finalMessage.innerText = "完璧です！！🔥";
      document.body.classList.add("glow");
    } else if (correct < 5) {
      finalMessage.innerText = "ナイストライ👍";
    } else {
      finalMessage.innerText = "いい感じ！👍";
    }

    setTimeout(() => {
      finalMessage.classList.add("glow");
    }, 200);

    return;
  }

  question++;
  cpu = hands[Math.floor(Math.random() * 3)];

  if (mode === 1) target = "勝ち";
  else if (mode === 2) target = "負け";
  else target = Math.random() > 0.5 ? "勝ち" : "負け";

  const cpuDiv = document.getElementById("cpuHandImg");
  cpuDiv.innerText = handImages[cpu];

  cpuDiv.classList.remove("cpu-animate");
  void cpuDiv.offsetWidth;
  cpuDiv.classList.add("cpu-animate");

  document.getElementById("result").innerText =
    `第${question}問：${target === "勝ち" ? "勝て！" : "負けろ！"}`;

  canClick = true;
}

function play(id) {
  const s = document.getElementById(id);
  s.currentTime = 0;
  s.play().catch(() => {});
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

  // 👇 あいこ改善
  if (result === "あいこ") {
    document.getElementById("result").innerText = "あいこ！もう一度！";

    setTimeout(() => {
      canClick = true;
    }, 500);

    return;
  }

  if (result === target) {
    correct++;
    document.getElementById("result").innerText = "正解！🎉";
    play("soundCorrect");

    const cpuDiv = document.getElementById("cpuHandImg");
    cpuDiv.classList.add("glow");
    setTimeout(() => cpuDiv.classList.remove("glow"), 600);

  } else {
    document.getElementById("result").innerText = "不正解！💥";

    const cpuDiv = document.getElementById("cpuHandImg");
    cpuDiv.style.transform = "scale(0.85)";
    setTimeout(() => {
      cpuDiv.style.transform = "scale(1)";
    }, 120);
  }

  setTimeout(nextRound, 1000);
}

function restartGame() {
  document.getElementById("resultScreen").classList.add("hidden");
  document.getElementById("modeScreen").classList.remove("hidden");
  cpu = "";
  canClick = true;
}

document.querySelectorAll(".player-buttons button").forEach(btn => {
  btn.addEventListener("click", e => {
    unlockAudio();
    playerChoice(e.currentTarget.dataset.hand);
  });
});
