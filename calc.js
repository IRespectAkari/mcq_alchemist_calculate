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
const guidanceRate = 13;//   錬金の手引きの倍率(1.3)
const notesRate = 25;//      賢者の手記の倍率(2.5)
const conditionRate = 12;//  状態異常：幸運の倍率(1.2)
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
const modeJson = {
  Accessory: {
    list: abilityList,
    explanation: `強化前の能力値`,
    chengeover: {
      target: [`guidance`, `notes`],
      disable: false,
    }
  },
  Item: {
    list: itemList,
    explanation: `錬金するアイテム`,
    chengeover: {
      target: [`guidance`, `notes`],
      disable: true,
    }
  }
};

// ####################################################################################################################################
/*************************
 * 変数取得
 *************************/
const result = document.getElementById(`probability`);
const totalMultiplier = document.getElementById(`totalMultiplier`);

const chara = document.getElementById(`chara`);
const targetSelectbox = document.getElementById(`targetSelectbox`);
const haveGuidance = document.getElementById(`guidance`);
const haveNotes = document.getElementById(`notes`);
const luckAbility = document.getElementById(`luckAbility`);
const conditionLUCK = document.getElementById(`condition`);

// intermediate results
const chara_r = document.getElementById(`charaResult`);
const targetSelectbox_r = document.getElementById(`targetSelectboxResult`);
const haveGuidance_r = document.getElementById(`guidanceResult`);
const haveNotes_r = document.getElementById(`notesResult`);
const luckAbility_r = document.getElementById(`luckAbilityResult`);
const conditionLUCK_r = document.getElementById(`conditionResult`);

const targetExplanationTxt = document.getElementById(`targetExplanation`);

// ##################################################################
/*************************
 * 関数
 *************************/
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
  for (let e of modeJson[key].list) {
    const op = document.createElement(`option`);
    op.innerText = e.txt;
    op.value = e.val;
    targetSelectbox.appendChild(op);
  }
  targetExplanationTxt.innerText = modeJson[key].explanation;

  const isDisabled = modeJson[key].chengeover.disable;
  for (let e of modeJson[key].chengeover.target) {
    const elm = document.getElementById(e);
    const elm_r = document.getElementById(`${e}Result`);
    elm.checked = false;// チェックを外す
    elm.disabled = isDisabled;// 有効化、無効化
    elm_r.disabled = isDisabled;// 有効化、無効化
    elm.dispatchEvent(new Event(`change`));// イベント発火

    const parent = elm.parentNode;
    parent.style.color = isDisabled ? "gray" : "black";
  }

  calcProbability();
}

// ##################################################################
/*************************
 * 確率計算関数
 *************************/
function calcProbability(e) {
  let resultValue = 1;//          合計確率
  let totalMultiplierValue = 1;// 合計倍率

  const targetValue = targetSelectbox.selectedOptions[0].value;
  const charaValue = chara.selectedOptions[0].value;
  const guidanceValue = haveGuidance.checked;
  const notesValue = haveNotes.checked;
  const luckValue = luckAbility.selectedOptions[0].value;
  const conditionValue = conditionLUCK.checked;

  const array = [
    targetValue,// 基礎成功確率
    charaRate(charaValue),// スキルによる倍率
    guidanceValue ? guidanceRate : 10,// 錬金の手引きの倍率
    notesValue ? notesRate : 10,// 賢者の手記の倍率
    luckAbilityRate(luckValue),// 幸運のお守り(装飾)スキルによる倍率
    conditionValue ? conditionRate : 10// 状態異常：幸運による倍率
  ];

  targetSelectbox_r.value = `${array[0]}%`;
  chara_r.value = `×${array[1] / 100}`;
  haveGuidance_r.value = `×${array[2] / 10}`;
  haveNotes_r.value = `×${array[3] / 10}`;
  luckAbility_r.value = `×${array[4] / 10}`;
  conditionLUCK_r.value = `×${array[5] / 10}`;

  for (let i of array) {
    resultValue *= i;
  }
  resultValue /= 1000000;// = chara(100) * guidance(10) * notes(10) * luckAbility(10) * condition(10)
  console.log(`resultValue : ${resultValue}`);

  for (let i = 1; i < array.length; i++) {
    totalMultiplierValue *= array[i];
  }
  totalMultiplierValue /= 1000000;// = guidance(10) * notes(10) * luckAbility(10) * condition(10)
  console.log(`totalMultiplierValue : ${totalMultiplierValue}`);

  result.value = `${resultValue}%`;
  totalMultiplier.value = `${totalMultiplierValue}倍`;

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

// ##################################################################
/* *********************** *
 * リンク有効化
 * *********************** */
document.querySelectorAll(`a`).forEach(e=>{e.addEventListener(`click`, e=>{
  chrome.tabs.create({url:e.target.href});
})});