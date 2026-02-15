/* =========================================================
   質問データ
========================================================= */
const questions = [
  {
    text: "誰かにからかわれたときどんな反応する？",
    optionA: "すぐ言い返してしまう",
    optionB: "なんかうれしくなってしまう"
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
   画像マッピング
========================================================= */
const BADGE_IMAGES = {
  "ドSタイプ": "assets/images/badge/badge-dos.png",
  "ちょいSタイプ": "assets/images/badge/badge-chois.png",
  "バランスタイプ": "assets/images/badge/badge-balance.png",
  "ちょいMタイプ": "assets/images/badge/badge-choim.png",
  "ドMタイプ": "assets/images/badge/badge-dom.png",
};

const RANKING_ICONS = {
  "ドSタイプ": "assets/images/ranking/ranking-icon-dos.png",
  "ちょいSタイプ": "assets/images/ranking/ranking-icon-chois.png",
  "バランスタイプ": "assets/images/ranking/ranking-icon-balance.png",
  "ちょいMタイプ": "assets/images/ranking/ranking-icon-choim.png",
  "ドMタイプ": "assets/images/ranking/ranking-icon-dom.png",
};

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
   ランキング取得・描画
========================================================= */
function getRanking() {
  const history = JSON.parse(localStorage.getItem("sm_history") || "[]");
  const sRank = [...history].sort((a, b) => b.Spercent - a.Spercent);
  const mRank = [...history].sort((a, b) => b.Mpercent - a.Mpercent);
  return { sRank, mRank };
}

function renderRanking() {
  const { sRank, mRank } = getRanking();
  const sArea = document.getElementById("s-ranking");
  const mArea = document.getElementById("m-ranking");

  if (sRank.length === 0) {
    sArea.innerHTML = '<p class="ranking-empty">まだ診断結果がありません</p>';
    mArea.innerHTML = '<p class="ranking-empty">まだ診断結果がありません</p>';
    return;
  }

  // ★ 最大3位まで
  sArea.innerHTML = sRank.slice(0, 3).map((r, i) =>
    `<div class="rank-row">
       <div class="rank-col icon-col">
         <img src="${RANKING_ICONS[r.type]}" class="rank-icon ${i === 0 ? "rank-icon-top" : ""}">
       </div>
       <div class="rank-col pos-col">${i + 1}位</div>
       <div class="rank-col name-col">${r.name}</div>
       <div class="rank-col score-col">${r.Spercent}%</div>
     </div>`
  ).join("");

  mArea.innerHTML = mRank.slice(0, 3).map((r, i) =>
    `<div class="rank-row">
       <div class="rank-col icon-col">
         <img src="${RANKING_ICONS[r.type]}" class="rank-icon ${i === 0 ? "rank-icon-top" : ""}">
       </div>
       <div class="rank-col pos-col">${i + 1}位</div>
       <div class="rank-col name-col">${r.name}</div>
       <div class="rank-col score-col">${r.Mpercent}%</div>
     </div>`
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
   質問描画（丸ボタンUI）
----------------------------- */
function renderQuestion() {
  const q = questions[currentIndex];
  const total = questions.length;

  document.getElementById("quiz-counter").textContent = `Q${currentIndex + 1} / ${total}`;
  document.getElementById("quiz-name-label").textContent = currentName ? `対象：${currentName}` : "";
  document.getElementById("quiz-question").textContent = q.text;

  const progress = ((currentIndex) / total) * 100;
  document.getElementById("quiz-progress").style.width = progress + "%";

  // ラベル左右ランダム
  const isReversed = Math.random() < 0.5;

  const leftLabel = document.getElementById("label-left");
  const rightLabel = document.getElementById("label-right");

  if (isReversed) {
    leftLabel.textContent = q.optionB;
    rightLabel.textContent = q.optionA;
  } else {
    leftLabel.textContent = q.optionA;
    rightLabel.textContent = q.optionB;
  }

  // 丸ボタンの動作
  const circles = document.querySelectorAll(".circle");
  circles.forEach(circle => {
    circle.classList.remove("selected");

    circle.onclick = () => {
      circles.forEach(c => c.classList.remove("selected"));
      circle.classList.add("selected");

      const value = Number(circle.dataset.value);

      // スコア計算
      let S = 0, M = 0;
      if (value === 0) S = 2;
      if (value === 1) S = 1;
      if (value === 3) M = 1;
      if (value === 4) M = 2;

      // ラベルが逆ならスコアも反転
      if (isReversed) {
        [S, M] = [M, S];
      }

      answers[currentIndex] = { S, M };

      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          currentIndex++;
          renderQuestion();
        } else {
          finishQuiz();
        }
      }, 150);
    };
  });
}

/* -----------------------------
   診断終了 → 結果計算
----------------------------- */
function finishQuiz() {
  let S = 0, M = 0;

  answers.forEach(v => {
    S += v.S;
    M += v.M;
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

  document.getElementById("result-badge-img").src = BADGE_IMAGES[type];


  document.getElementById("result-comment").textContent = info.comment;
  document.getElementById("result-desc").textContent = info.desc;

  document.getElementById("label-S").textContent = `S度 ${Spercent}%`;
  document.getElementById("label-M").textContent = `M度 ${Mpercent}%`;
  document.getElementById("bar-S").style.width = Spercent + "%";
  document.getElementById("bar-M").style.width = Mpercent + "%";

  showPage("page-result");

}
/* =========================================================
   平均S/M傾向
========================================================= */
const TYPE_TENDENCY = {
  "ドSタイプ":   { S: 85, M: 15 },
  "ちょいSタイプ": { S: 65, M: 35 },
  "バランスタイプ": { S: 50, M: 50 },
  "ちょいMタイプ": { S: 35, M: 65 },
  "ドMタイプ":   { S: 15, M: 85 }
};


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
   タイプ説明文
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
        comment: "やるときはやる、ちょいSタイプ。",
        desc: "普段は穏やかだけれど、ここぞというときは主導権を取れるタイプ。いじるのもいじられるのも、どちらもこなせる器用さがあります。"
      };
    case "ドMタイプ":
      return {
        comment: "愛されいじられキャラなドMタイプ。",
        desc: "相手に合わせるのが得意で、空気を読む力が高いタイプ。いじられても、なんだかんだ楽しんでいるところも。周りからは「優しい」「話しやすい」と思われがちです。"
      };
    case "ちょいMタイプ":
      return {
        comment: "平和主義な、ちょいMタイプ。",
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
   イベント設定
========================================================= */
window.addEventListener("DOMContentLoaded", () => {
  renderRanking();

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

  document.getElementById("btn-back-home").addEventListener("click", () => {
    if (confirm("診断を中断してホームに戻りますか？")) {
      showPage("page-home");
    }
  });

  document.getElementById("btn-again").addEventListener("click", () => {
    currentIndex = 0;
    answers = [];
    renderQuestion();
    showPage("page-quiz");
  });

  document.getElementById("btn-to-home").addEventListener("click", () => {
    showPage("page-home");
  });

  document.getElementById("btn-clear-history").addEventListener("click", () => {
    if (confirm("本当に履歴を削除しますか？\nランキングも消えます。")) {
      localStorage.removeItem("sm_history");
      renderRanking();
      alert("履歴を削除しました");
    }
  });
});

/* =========================================================
   タイプ説明ページ生成
========================================================= */
function renderTypeInfoPage() {
  const area = document.getElementById("type-info-list");
  const list = buildTypeInfoData();

  area.innerHTML = list.map(t => `
    <div class="card type-info-card">

      <img src="${t.img}" class="type-info-badge" alt="${t.title}">

      <div class="type-info-title">${t.title}</div>
      <div class="type-info-comment">${t.comment}</div>
      <div class="type-info-desc">${t.desc}</div>

      <div class="type-graph">
        <div class="bar-wrap">
          <div class="bar-label">S度 ${t.tendency.S}%</div>
          <div class="bar-bg"><div class="bar-inner-S" style="width:${t.tendency.S}%"></div></div>
        </div>

        <div class="bar-wrap">
          <div class="bar-label">M度 ${t.tendency.M}%</div>
          <div class="bar-bg"><div class="bar-inner-M" style="width:${t.tendency.M}%"></div></div>
        </div>
      </div>

    </div>
  `).join("");
}

/* =========================================================
   タイプ説明ページ生成用データ
========================================================= */
function buildTypeInfoData() {
  const types = ["ドSタイプ", "ちょいSタイプ", "バランスタイプ", "ちょいMタイプ", "ドMタイプ"];

  return types.map(type => {
    const info = getTypeInfo(type);
    return {
      type,
      title: type,
      comment: info.comment,
      desc: info.desc,
      img: BADGE_IMAGES[type],
      tendency: TYPE_TENDENCY[type]
    };
  });
}

/* =========================================================
   丸ボタンの波紋エフェクト
========================================================= */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("circle")) {
    const circle = e.target;
    circle.classList.remove("ripple");
    // 再トリガー用
    void circle.offsetWidth;
    circle.classList.add("ripple");
  }
});
window.addEventListener("DOMContentLoaded", () => {
  // …既存の処理…

  document.getElementById("btn-share-line").addEventListener("click", () => {
    const name = currentName || "名無し";
    const resultText = document.getElementById("result-comment").textContent || "";
    const typeBadge = document.getElementById("result-name").textContent || "";

    const text = `${typeBadge}\n${resultText}\n\nSM分析ツールで診断したよ！`;
    const url = encodeURIComponent(text);

    // LINEのテキスト共有（アプリ or ブラウザ）
    window.open(`https://line.me/R/msg/text/?${url}`, "_blank");
    
  });
  // タイプ説明ページへ
  document.getElementById("result-badge-img").addEventListener("click", () => {
    renderTypeInfoPage();
    showPage("page-type-info");
  });

  // 戻る
  document.getElementById("btn-type-back").addEventListener("click", () => {
    showPage("page-result");
  });

});
