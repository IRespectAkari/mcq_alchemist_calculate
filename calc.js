/*************************
 * 設定一覧
 *************************/
// 豪運持ちリスト
const greadLuck = [
  "豪運持ち",
  "リーコン",
  "フック"
];
// 幸運持ちリスト
const luck = [
  "幸運持ち",
  "ブレード",
  "プラグ",
  "デスペラード",
  "インビジブル"
];

const luckRate = 165;//      幸運の倍率
const greadLuckRate = 180;// 豪運の倍率
const guidanceRate = 1.3;//  錬金の手引きの倍率
const conditionRate = 1.2;// 状態異常：幸運の倍率
const luckAbilityRate = (i)=>{return 1 + i * 0.1};// 幸運のお守りの倍率

// 能力値の取りうる値の配列
const abilityList = (function f(m, M) {
  const s = [];
  for (let i = m; i <= M; i++) {
    const ss = {
      txt: i,
      val: 2 ** -i * 100
    };
    s.push(ss);
  }
  return s;
})(1, 8);

// 錬金術で使用できるアイテムの配列
const itemList = [
  {
    txt: `砥石`,
    val: 80
  },
  {
    txt: `ダイヤ`,
    val: 95
  },
  {
    txt: `プラチナ`,
    val: 90
  },
  {
    txt: `アダマンタイト`,
    val: 85
  },
  {
    txt: `オリハルコン`,
    val: 80
  },
  {
    txt: `クリスタル`,
    val: 75
  },
  {
    txt: `ヒヒイロカネ`,
    val: 70
  },
  {
    txt: `強化石`,
    val: 55
  },
];
// const dataJson = {
//   "Accessory": abilityList,
//   "Item": itemList
// };
const dataJson = {
  Accessory: {
    list: abilityList,
    explanation: `強化前の能力値`
  },
  Item: {
    list: itemList,
    explanation: `錬金するアイテム`
  }
};

// ##################################################################
/*************************
 * 変数取得
 *************************/
const result = document.getElementById(`probability`);
const chara = document.getElementById(`chara`);
const targetSelectbox = document.getElementById(`targetSelectbox`);
const haveGuidance = document.getElementById(`guidance`);
const luckAbility = document.getElementById(`luckAbility`);
const conditionLUCK = document.getElementById(`condition`);

// intermediate results
const chara_r = document.getElementById(`charaResult`);
const targetSelectbox_r = document.getElementById(`targetSelectboxResult`);
const haveGuidance_r = document.getElementById(`guidanceResult`);
const luckAbility_r = document.getElementById(`luckAbilityResult`);
const conditionLUCK_r = document.getElementById(`conditionResult`);

const targetExplanationTxt = document.getElementById(`targetExplanation`);

// ##################################################################
/*************************
 * 関数
 *************************/
function orgFloor(value, base) {
  return Math.floor(value * base) / base;
}
function charaRate(name) {
  if (greadLuck.includes(name)) {
    return greadLuckRate;
  }else if (luck.includes(name)) {
    return luckRate;
  }else {
    return 100;
  }
}
function changeMode(e) {
  targetSelectbox.innerHTML = "";
  const key = (typeof e === "string" ? e : e.target.value);
  for (let e of dataJson[key].list) {
    // option作成
    const op = document.createElement(`option`);
    op.innerText = e.txt;
    op.value = e.val;
    targetSelectbox.appendChild(op);
  }
  targetExplanationTxt.innerText = dataJson[key].explanation;
  calcProbability();
}

// ##################################################################
/*************************
 * 本処理
 *************************/
function calcProbability(e) {
  let resultValue = 1;

  const targetValue = targetSelectbox.selectedOptions[0].value;
  const charaValue = chara.selectedOptions[0].value;
  const guidanceValue = haveGuidance.checked;
  const luckValue = luckAbility.selectedOptions[0].value;
  const conditionValue = conditionLUCK.checked;

  const array = [
    targetValue,// 基礎成功確率
    charaRate(charaValue),// スキルによる倍率
    guidanceValue ? guidanceRate : 1,// 錬金の手引きの倍率
    luckAbilityRate(luckValue),// 幸運のお守り(装飾)スキルによる倍率
    conditionValue ? conditionRate : 1// 状態異常：幸運による倍率
  ];

  targetSelectbox_r.value = `${array[0]}%`;
  chara_r.value = `×${array[1] / 100}`;
  haveGuidance_r.value = `×${array[2]}`;
  luckAbility_r.value = `×${array[3]}`;
  conditionLUCK_r.value = `×${array[4]}`;

  for (let i of array) {
    const txt = [
      `${i}`,
      `${orgFloor(i, 100)}`,
      `${resultValue}`,
    ].join("\n");
    // console.log(txt);
    // resultValue *= orgFloor(i, 100);
    resultValue *= i;
  }
  resultValue /= 100;
  console.log(resultValue);

  result.value = `${orgFloor(resultValue, 100)}%`;
  const txt = [
    `calcProbability`,
    `キャラ : ${chara.selectedOptions[0].value}`,
    `能力値 : ${targetSelectbox.selectedOptions[0].value}`,
    `手引き : ${haveGuidance.checked ? "有り" : "無し"}`,
    `お守り : ${luckAbility.selectedOptions[0].value}`,
    `状態   : ${conditionLUCK.checked ? "幸運" : "無し"}`,
    `成功確率 : ${resultValue}`,
    `charaRate   : ${charaRate(charaValue)}`,
    `targetValue : ${targetValue}`,
  ].join("\n");
  // console.log(txt);
  return;
}

// ##################################################################
/*************************
 * 初期化処理
 *************************/

// モードを装飾モードに設定
changeMode("Accessory");

// 全ての入力欄にイベント設定
for (let e of document.querySelectorAll(`.Input`)) {
  e.addEventListener("change", calcProbability);
}

// 対象選択ラジオボタンにイベント設定
for (let e of document.getElementsByName("targetRadio")) {
  e.addEventListener("change", changeMode);
}

// 一度だけ実行
calcProbability();