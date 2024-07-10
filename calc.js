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
const conditionRate = 1.2;//   状態異常：幸運の倍率
const luckAbilityRate = (i)=>{return 1 + i * 0.1};// 幸運のお守りの倍率

// ##################################################################
function orgFloor(value, base) {
  return Math.floor(value * base) / base;
}
// 小数以下の桁数
function decimal(n) {
  const m = String(n).split(".");
  return m[1] ? m[1].length : 0;
}
// ##################################################################
const result = document.getElementById(`probability`);
const chara = document.getElementById(`chara`);
const targetAbility = document.getElementById(`targetAbility`);
const haveGuidance = document.getElementById(`guidance`);
const luckAbility = document.getElementById(`luckAbility`);
const conditionLUCK = document.getElementById(`condition`);

// intermediate results
const chara_r = document.getElementById(`charaResult`);
const targetAbility_r = document.getElementById(`targetAbilityResult`);
const haveGuidance_r = document.getElementById(`guidanceResult`);
const luckAbility_r = document.getElementById(`luckAbilityResult`);
const conditionLUCK_r = document.getElementById(`conditionResult`);


function charaRate(name) {
  if (greadLuck.includes(name)) {
    return greadLuckRate;
  }else if (luck.includes(name)) {
    return luckRate;
  }else {
    return 100;
  }
}
// ##################################################################
function calcProbability(e) {
  let resultValue = 1;

  const targetValue = targetAbility.selectedOptions[0].value;
  const charaValue = chara.selectedOptions[0].value;
  const guidanceValue = haveGuidance.checked;
  const luckValue = luckAbility.selectedOptions[0].value;
  const conditionValue = conditionLUCK.checked;

  const array = [
    2 ** -targetValue,// 基礎成功確率
    charaRate(charaValue),// スキルによる倍率
    guidanceValue ? guidanceRate : 1,// 錬金の手引きの倍率
    luckAbilityRate(luckValue),// 幸運のお守り(装飾)スキルによる倍率
    conditionValue ? conditionRate : 1// 状態異常：幸運による倍率
  ];

  targetAbility_r.value = `${array[0] * 100}%`;
  chara_r.value = `×${array[1] / 100}`;
  haveGuidance_r.value = `×${array[2]}`;
  luckAbility_r.value = `×${array[3]}`;
  conditionLUCK_r.value = `×${array[4]}`;

  const d = decimal(array[0]);
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
  console.log(resultValue);

  result.value = `${orgFloor(resultValue, 100)}%`;
  // result.value = `${orgFloor(resultValue / d, 100)}%`;
  const txt = [
    `calcProbability`,
    `キャラ : ${chara.selectedOptions[0].value}`,
    `能力値 : ${targetAbility.selectedOptions[0].value}`,
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
for (let e of document.querySelectorAll(`.Input`)) {
  e.addEventListener("change", calcProbability);
  e.addEventListener("change", ()=>{console.log("change");});
}

calcProbability();