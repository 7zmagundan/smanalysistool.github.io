/* =========================================================
   質問データ
========================================================= */
const questions = [
  {
    text: "誰かにからかわれたとき、どんな反応をする？",
    optionA: "すぐ言い返したくなる",
    optionB: "なんか嬉しくなって笑ってしまう"
  },
  {
    text: "グループでの話し合いでは？",
    optionA: "自然とまとめ役になる",
    optionB: "誰かの意見を聞いて流れに乗る"
  },
  {
    text: "友達のミスを見たとき",
    optionA: "軽くツッコむタイプ",
    optionB: "フォローしたくなるタイプ"
  },
  {
    text: "好きな人にはどう接する？",
    optionA: "ついからかって反応を見たくなる",
    optionB: "相手のペースに合わせて寄り添う"
  },
  {
    text: "ケンカしたときの自分は？",
    optionA: "勝ち負けをはっきりさせたい",
    optionB: "とりあえず仲直りしたい"
  },
  {
    text: "相手に褒められると？",
    optionA: "「でしょ？」ってちょっと得意げになる",
    optionB: "「そんなことないよ」って言いながら嬉しい"
  },
  {
    text: "驚かされたりドッキリされたら？",
    optionA: "「やったな！」ってやり返したくなる",
    optionB: "驚きつつも笑って受け止める"
  },
  {
    text: "ストレスが溜まったときは？",
    optionA: "スポーツとかで発散",
    optionB: "癒されるものに逃げる"
  },
  {
    text: "目立つ場面では？",
    optionA: "つい引っ張っていく",
    optionB: "支える側でいたい"
  },
  {
    text: "自分の性格を一言で言うと？",
    optionA: "仕掛ける側",
    optionB: "受け取る側"
  }
];

/* =========================================================
   5段階 → S/Mスコア変換
========================================================= */
function getScore(value) {
  switch (value) {
    case 0: return { S: 2, M: 0 };
    case 1: return { S: 1, M: 0 };
    case 2: return { S: 0, M: 0 };
    case 3: return { S: 0, M: 1 };
    case 4: return { S: 0, M: 2 };
  }
  return { S: 0, M: 0 };
}

/* =========================================================
   タイプ判定
========================================================= */
function judgeType(S, M) {
  const diff = S - M;
  if (diff >= 6) return "ドSタイプ";
  if (diff >= 3) return "ちょいSタイプ";
  if (diff <= -6) return "ドMタイプ";
  if (diff <= -3) return "ちょいMタイプ";
  return "バランスタイプ";
}

/* =========================================================
   タイプごとの説明文
========================================================= */
function getTypeInfo(type) {
  switch (type) {
    case "ドSタイプ":
      return {
        comment: "主導権は渡さない、頼れるドSタイプ。",
        desc: "決断力があり、場を引っ張るのが得意なタイプ。ツッコミやいじりも多めですが、本気で嫌がるラインはちゃんと分かっているはず…たぶん。"
      };
    case "ちょいSタイプ":
      return {
        comment: "やるときはやる、ちょいSバランス。",
        desc: "普段は穏やかだけれど、ここぞというときは主導権を取れるタイプ。いじるのもいじられるのも、どちらもこなせる器用さがあります。"
      };
    case "ドMタイプ":
      return {
        comment: "愛されいじられキャラなドMタイプ。",
        desc: "相手に合わせるのが得意で、空気を読む力が高いタイプ。いじられても、なんだかんだ楽しんでいるところも。周りからは「優しい」「話しやすい」と思われがちです。"
      };
    case "ちょいMタイプ":
      return {
        comment: "平和主義な、ちょいMバランス。",
        desc: "自分からグイグイ行くより、相手に合わせる方が楽なタイプ。でも、ちゃんと自分の意見も持っている柔らかいバランス型です。"
      };
    default:
      return {
        comment: "バランス感覚のいいニュートラルタイプ。",
        desc: "SっぽさもMっぽさもほどよく持ち合わせたバランス型。相手や場面に合わせて、自然に立ち位置を変えられる柔軟さがあります。"
      };
  }
}

/* =========================================================
   localStorage 保存
========================================================= */
function saveResult(name, Spercent, Mpercent, type) {
  const record = {
    name,
    Spercent,
    Mpercent,
    type,
    date: new Date().toISOString()
  };

  const history = JSON.parse(localStorage.getItem("sm_history") || "[]");
  history.push(record);
  localStorage.setItem("sm_history", JSON.stringify(history));
}

/* =========================================================
   ランキング取得
========================================================= */
function getRanking() {
  const history = JSON.parse(localStorage.getItem("sm_history") || "[]");
  const sRank = [...history].sort((a, b) => b.Spercent - a.Spercent);
  const mRank = [...history].sort((a, b) => b.Mpercent - a.Mpercent);
  return { sRank, mRank };
}

/* =========================================================
   ランキング描画
========================================================= */
function renderRanking() {
  const { sRank, mRank } = getRanking();
  const sArea = document.getElementById("s-ranking");
  const mArea = document.getElementById("m-ranking");

  if (sRank.length === 0) {
    sArea.innerHTML = '<p class="ranking-empty">まだ診断結果がありません</p>';
    mArea.innerHTML = '<p class="ranking-empty">まだ診断結果がありません</p>';
    return;
  }

  sArea.innerHTML = sRank.slice(0, 5).map((r, i) =>
    `<p>${i + 1}位　${r.name}　S度 ${r.Spercent}%</p>`
  ).join("");

  mArea.innerHTML = mRank.slice(0, 5).map((r, i) =>
    `<p>${i + 1}位　${r.name}　M度 ${r.Mpercent}%</p>`
  ).join("");
}

/* =========================================================
   ページ切り替え
========================================================= */
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* =========================================================
   診断ロジック
========================================================= */
let currentName = "";
let currentIndex = 0;
let answers = [];

/* -----------------------------
   質問描画（回答ランダム配置）
----------------------------- */
function renderQuestion() {
  const q = questions[currentIndex];
  const total = questions.length;

  document.getElementById("quiz-counter").textContent = `Q${currentIndex + 1} / ${total}`;
  document.getElementById("quiz-name-label").textContent = currentName ? `対象：${currentName}` : "";
  document.getElementById("quiz-question").textContent = q.text;

  const progress = ((currentIndex) / total) * 100;
  document.getElementById("quiz-progress").style.width = progress + "%";

  const row = document.getElementById("scale-row");
  row.innerHTML = "";

  // ラベルと値をセット
  let labels = [
    { text: q.optionA, value: 0 },
    { text: "どちらかといえばA", value: 1 },
    { text: "中立", value: 2 },
    { text: "どちらかといえばB", value: 3 },
    { text: q.optionB, value: 4 }
  ];

  // ランダムシャッフル
  labels.sort(() => Math.random() - 0.5);

  // ボタン生成
  labels.forEach(item => {
    const div = document.createElement("div");
    div.className = "scale-option";
    div.dataset.value = item.value;
    div.textContent = item.text;

    div.addEventListener("click", () => selectAnswer(item.value, div));
    row.appendChild(div);
  });
}

/* -----------------------------
   回答選択
----------------------------- */
function selectAnswer(value, element) {
  document.querySelectorAll(".scale-option").forEach(el => el.classList.remove("selected"));
  element.classList.add("selected");

  answers[currentIndex] = value;

  setTimeout(() => {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      renderQuestion();
    } else {
      finishQuiz();
    }
  }, 160);
}

/* -----------------------------
   診断終了 → 結果計算
----------------------------- */
function finishQuiz() {
  let S = 0, M = 0;

  answers.forEach(v => {
    const s = getScore(v);
    S += s.S;
    M += s.M;
  });

  const total = S + M || 1;
  const Spercent = Math.round((S / total) * 100);
  const Mpercent = Math.round((M / total) * 100);
  const type = judgeType(S, M);
  const info = getTypeInfo(type);

  saveResult(currentName || "名無し", Spercent, Mpercent, type);
  renderRanking();

  document.getElementById("result-name").textContent =
    (currentName || "名無し") + "さんのタイプは…";

  const badge = document.getElementById("result-type-badge");
  badge.textContent = type;
  badge.className = "result-type-badge";
  if (type.includes("S")) badge.classList.add("type-S");
  else if (type.includes("M")) badge.classList.add("type-M");
  else badge.classList.add("type-B");

  document.getElementById("result-comment").textContent = info.comment;
  document.getElementById("result-desc").textContent = info.desc;

  document.getElementById("label-S").textContent = `S度 ${Spercent}%`;
  document.getElementById("label-M").textContent = `M度 ${Mpercent}%`;
  document.getElementById("bar-S").style.width = Spercent + "%";
  document.getElementById("bar-M").style.width = Mpercent + "%";

  showPage("page-result");
}

/* =========================================================
   イベント設定
========================================================= */
window.addEventListener("DOMContentLoaded", () => {
  renderRanking();

  // 診断開始
  document.getElementById("btn-start").addEventListener("click", () => {
    const nameInput = document.getElementById("input-name");
    currentName = nameInput.value.trim();

    if (!currentName) {
      alert("名前を入力してください（ニックネームでもOKです）");
      return;
    }

    currentIndex = 0;
    answers = [];
    document.getElementById("quiz-progress").style.width = "0%";

    renderQuestion();
    showPage("page-quiz");
  });

  // ホームに戻る（途中で）
  document.getElementById("btn-back-home").addEventListener("click", () => {
    if (confirm("診断を中断してホームに戻りますか？")) {
      showPage("page-home");
    }
  });

  // もう一度診断
  document.getElementById("btn-again").addEventListener("click", () => {
    currentIndex = 0;
    answers = [];
    renderQuestion();
    showPage("page-quiz");
  });

  // ホームへ
  document.getElementById("btn-to-home").addEventListener("click", () => {
    showPage("page-home");
  });

  // 履歴削除
  document.getElementById("btn-clear-history").addEventListener("click", () => {
    if (confirm("本当に履歴を削除しますか？\nランキングも消えます。")) {
      localStorage.removeItem("sm_history");
      renderRanking();
      alert("履歴を削除しました");
    }
  });
});
