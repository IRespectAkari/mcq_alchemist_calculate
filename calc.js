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

const luckRate = 165;//      幸運の倍率(1.65)
const greadLuckRate = 180;// 豪運の倍率(1.8)
const guidanceRate = 13;//  錬金の手引きの倍率(1.3)
const conditionRate = 12;// 状態異常：幸運の倍率(1.2)
const luckAbilityRate = (i)=>{return `1${i}`};// 幸運のお守りの倍率(1.0 ~ 1.9)

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
i    val: 95
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
/* ********************************************** *
 * 数値nを小数第range位で切り捨てる。
 * n = 対象の数値
 * range = 切り捨てる小数点の位置(マイナスの場合は不可)
 * isUmeru = true: 指定rangeまでゼロ埋め, false: ゼロ埋めしない
 * ********************************************** */
function f(n, range, isUmeru = true) {
  // 整数と小数で分ける
  const s = String(n).split(".");
  // 小数が存在しない、又は存在するがrange=0の場合、整数部分を返す
  if (s[1] === undefined || range === 0) {
    return s[0];
  }
  // isUmeruが真の場合、小数に0をrange分追加
  if (isUmeru) {
    s[1] += "0".repeat(range);
  }
  // 整数とsliceでrange分ｷﾘﾄﾘした小数を合わせて、それを返す
  return `${s[0]}.${s[1].slice(0, range)}`;
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
 * 確率計算関数
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
    guidanceValue ? guidanceRate : 10,// 錬金の手引きの倍率
    luckAbilityRate(luckValue),// 幸運のお守り(装飾)スキルによる倍率
    conditionValue ? conditionRate : 10// 状態異常：幸運による倍率
  ];

  targetSelectbox_r.value = `${array[0]}%`;
  chara_r.value = `×${array[1] / 100}`;
  haveGuidance_r.value = `×${array[2]}`;
  luckAbility_r.value = `×${array[3] / 10}`;
  conditionLUCK_r.value = `×${array[4]}`;

  for (let i of array) {
    resultValue *= i;
  }
  resultValue /= 100000;// = chara(100) * guidance(10) * luckAbility(10) * condition(10)
  console.log(resultValue);

  result.value = `${f(resultValue, 2, false)}%`;
  return;
}

// ##################################################################
/* *********************** *
 * 初期化処理
 * *********************** */

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
