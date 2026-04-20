let mode = 0;
let question = 0;
let correct = 0;
let cpu = "";
let target = "";
let canClick = true;

let audioUnlocked = false;
let startTime = 0;

const hands = ["グー", "チョキ", "パー"];

const handImages = {
  "グー": "✊",
  "チョキ": "✌️",
  "パー": "✋"
};

/* =========================
   音声解除
========================= */
function unlockAudio() {
  if (audioUnlocked) return;

  const sounds = [
    document.getElementById("soundCorrect"),
    document.getElementById("soundResult")
  ];

  sounds.forEach(s => {
    if (!s) return;
    s.play().then(() => {
      s.pause();
      s.currentTime = 0;
    }).catch(() => {});
  });

  audioUnlocked = true;
}

/* =========================
   ゲーム開始
========================= */
function startGame(selectedMode) {
  unlockAudio();

  mode = selectedMode;
  question = 0;
  correct = 0;
  cpu = "";
  canClick = true;

  startTime = Date.now();

  document.getElementById("modeScreen").classList.add("hidden");
  document.getElementById("resultScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");

  setupUI();
  nextRound();
}

/* =========================
   UI生成
========================= */
function setupUI() {
  const container = document.querySelector(".player-buttons");

  if (mode === 4) {
    const buttons = [
      { type: "win", hand: "winHand" },
      { type: "draw", hand: "drawHand" }
    ];

    // 左右ランダム
    buttons.sort(() => Math.random() - 0.5);

    container.innerHTML = buttons.map(b => `
      <button data-action="${b.type}">
        <div class="hand-icon" id="${b.hand}">✊</div>
        <div class="hand-text"></div>
      </button>
    `).join("");

  } else {
    container.innerHTML = `
      <button data-hand="グー">
        <div class="hand-icon">✊</div>
        <div class="hand-text">グー</div>
      </button>

      <button data-hand="チョキ">
        <div class="hand-icon">✌️</div>
        <div class="hand-text">チョキ</div>
      </button>

      <button data-hand="パー">
        <div class="hand-icon">✋</div>
        <div class="hand-text">パー</div>
      </button>
    `;
  }

  attachButtons();
}

/* =========================
   ボタン登録
========================= */
function attachButtons() {
  document.querySelectorAll(".player-buttons button").forEach(btn => {
    btn.onclick = (e) => {
      unlockAudio();

      const hand = e.currentTarget.dataset.hand;
      const action = e.currentTarget.dataset.action;

      if (mode === 4) {
        handleMode4(action);
      } else {
        playerChoice(hand);
      }
    };
  });
}

/* =========================
   次の問題
========================= */
function nextRound() {
  canClick = true;

  if (question >= 10) {
    finishGame();
    return;
  }

  question++;

  const prev = cpu;

  do {
    cpu = hands[Math.floor(Math.random() * 3)];
  } while (cpu === prev);

  if (mode === 1) target = "勝ち";
  else if (mode === 2) target = "負け";
  else if (mode === 3) target = Math.random() > 0.5 ? "勝ち" : "負け";
  else if (mode === 4) target = "勝ち";

  renderCPU();

  document.getElementById("result").innerText =
    `第${question}問：${target === "勝ち" ? "勝って！" : "負けて！"}`;
}

/* =========================
   CPU表示
========================= */
function renderCPU() {
  const cpuDiv = document.getElementById("cpuHandImg");

  cpuDiv.innerText = handImages[cpu];

  cpuDiv.classList.remove("cpu-animate");
  void cpuDiv.offsetWidth;
  cpuDiv.classList.add("cpu-animate");

  updateMode4UI();
}

/* =========================
   モード4 UI更新（修正済み）
========================= */
function updateMode4UI() {
  if (mode !== 4 || !cpu) return;

  const winHand = document.getElementById("winHand");
  const drawHand = document.getElementById("drawHand");

  if (!winHand || !drawHand) return;

  const winMap = {
    "グー": "パー",
    "チョキ": "グー",
    "パー": "チョキ"
  };

  // 同じ手
  drawHand.innerText = cpu;

  // 勝つ手
  winHand.innerText = winMap[cpu];
}

/* =========================
   通常モード
========================= */
function playerChoice(player) {
  if (mode === 4) return;
  if (!cpu || !canClick) return;

  canClick = false;

  const result = judge(player, cpu);

  if (result === "あいこ") {
    document.getElementById("result").innerText = "あいこ　もう一度！";
    setTimeout(() => canClick = true, 400);
    return;
  }

  if (result === target) {
    correct++;
    document.getElementById("result").innerText = "正解！🎉";
    play("soundCorrect");
  } else {
    document.getElementById("result").innerText = "不正解💥";
  }

  setTimeout(nextRound, 800);
}

/* =========================
   モード4処理
========================= */
function handleMode4(action) {
  if (!cpu || !canClick) return;
  canClick = false;

  let player;

  if (action === "draw") {
    player = cpu;
  }

  if (action === "win") {
    if (cpu === "グー") player = "パー";
    if (cpu === "チョキ") player = "グー";
    if (cpu === "パー") player = "チョキ";
  }

  const result = judge(player, cpu);

  if (result === "あいこ") {
    document.getElementById("result").innerText = "あいこ　もう一度！";
    canClick = true;
    return;
  }

  if (result === "勝ち") {
    correct++;
    document.getElementById("result").innerText = "正解！🎉";
    play("soundCorrect");
  } else {
    document.getElementById("result").innerText = "不正解💥";
  }

  setTimeout(nextRound, 800);
}

/* =========================
   判定
========================= */
function judge(player, cpu) {
  if (player === cpu) return "あいこ";

  if (
    (player === "グー" && cpu === "チョキ") ||
    (player === "チョキ" && cpu === "パー") ||
    (player === "パー" && cpu === "グー")
  ) {
    return "勝ち";
  }

  return "負け";
}

/* =========================
   音
========================= */
function play(id) {
  const s = document.getElementById(id);
  if (!s) return;

  s.currentTime = 0;
  s.play().catch(() => {});
}

/* =========================
   終了
========================= */
function finishGame() {
  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("resultScreen").classList.remove("hidden");

  const time = ((Date.now() - startTime) / 1000).toFixed(1);

  document.getElementById("finalScore").innerText =
    `正解数：${correct}/10`;

  document.getElementById("finalTime").innerText =
    `かかった時間：${time}秒`;

  const msg = document.getElementById("finalMessage");

  if (correct === 10) msg.innerText = "完璧です！！😄";
  else if (correct < 5) msg.innerText = "ナイストライ👍";
  else msg.innerText = "良い感じです😊";

  setTimeout(() => play("soundResult"), 200);
}

/* =========================
   リスタート
========================= */
function restartGame() {
  document.getElementById("resultScreen").classList.add("hidden");
  document.getElementById("modeScreen").classList.remove("hidden");

  mode = 0;
  cpu = "";
  question = 0;
  correct = 0;
  canClick = true;
}
