function orgFloor(value, base) {
  return Math.floor(value * base) / base;
}
// ##################################################################
const result = document.getElementById(`probability`);
const chara = document.getElementById(`chara`);
const targetAbility = document.getElementById(`targetAbility`);
const haveGuidance = document.getElementById(`guidance`);
const luckAbility = document.getElementById(`luckAbility`);
const conditionLUCK = document.getElementById(`condition`);

for (let e of document.querySelectorAll(`.Input`)) {
  e.addEventListener("change", calcProbability);
  e.addEventListener("change", ()=>{console.log("change");});
}

// 豪運持ちリスト
const greadLuck = ["豪運持ち", "リーコン", "フック"];
// 幸運持ちリスト
const luck = ["幸運持ち", "疾風迅雷", "ブレード", "プラグ", "デスペラード", "インビジブル"];
const greadLuckRate = 180;// 豪運の倍率
const luckRate = 165;//      幸運の倍率
const guidanceRate = 1.3;//  錬金の手引きの倍率
const conditionRate = 2;//   状態異常：幸運の倍率
const luckAbilityRate = (i)=>{return 1 + i * 0.1};// 幸運のお守りの倍率

function charaRate(name) {
  if (greadLuck.includes(name)) {
    return greadLuckRate;
  }else if (luck.includes(name)) {
    return luckRate;
  }else {
    return 100;
  }
}

function calcProbability(e) {
  let resultValue = 1;

  const charaValue = chara.selectedOptions[0].value;
  const targetValue = targetAbility.selectedOptions[0].value;
  const guidanceValue = haveGuidance.checked;
  const luckValue = luckAbility.selectedOptions[0].value;
  const conditionValue = conditionLUCK.checked;

  const array = [
    2 ** -targetValue,// 基礎成功確率
    charaRate(charaValue),// スキルによる倍率
    guidanceValue ? guidanceRate : 1,// 錬金の手引きの倍率
    luckAbilityRate(luckValue) / 100,// 幸運のお守り(装飾)スキルによる倍率
    conditionValue ? conditionRate : 1// 状態異常：幸運による倍率
  ];

  for (let i of array) {
    const txt = [
      // `${i}`,
      // `${orgFloor(i, 100)}`,
      `${resultValue}`,
    ].join("\n");
  //   console.log(txt);
    resultValue *= orgFloor(i, 100);
  }

  result.value = `${orgFloor(resultValue * 100, 100)}%`;
  const txt = [
    `calcProbability`,
    // `e      : ${e}`,
    // `target : ${e.target}`,
    // `id     : ${e.target.id}`,
    `キャラ : ${chara.selectedOptions[0].value}`,
    `能力値 : ${targetAbility.selectedOptions[0].value}`,
    `手引き : ${haveGuidance.checked ? "有り" : "無し"}`,
    `お守り : ${luckAbility.selectedOptions[0].value}`,
    `状態   : ${conditionLUCK.checked ? "幸運" : "無し"}`,
    `成功確率 : ${resultValue}`,
    `charaRate   : ${charaRate(charaValue)}`,
    `targetValue : ${targetValue}`,
    // ` : ${}`,
    // ` : ${}`,
    // ` : ${}`,
  ].join("\n");
  // console.log(txt);
  return;
}

calcProbability();
