function calculateHeistScore({ selectedObjects, carryLimit, timeTakenSeconds, timeLimitSeconds }) {
  const totalValue = selectedObjects.reduce((sum, object) => sum + object.value, 0);
  const totalWeight = selectedObjects.reduce((sum, object) => sum + object.weight, 0);
  const decoyCount = selectedObjects.filter((object) => object.is_decoy).length;
  const baseScore = totalValue;
  const overCarryLimit = totalWeight > carryLimit;

  if (overCarryLimit) {
    return {
      success: false,
      totalValue,
      totalWeight,
      baseScore,
      timeBonusMultiplier: 1,
      decoyPenaltyPercent: decoyCount * 20,
      decoyCount,
      score: 0
    };
  }

  const timeBonusMultiplier = timeTakenSeconds < timeLimitSeconds / 2 ? 1.5 : 1;
  const decoyPenaltyPercent = decoyCount * 20;
  const afterTimeBonus = baseScore * timeBonusMultiplier;
  const penaltyMultiplier = Math.max(0, 1 - decoyPenaltyPercent / 100);
  const score = Math.max(0, Math.floor(afterTimeBonus * penaltyMultiplier));

  return {
    success: true,
    totalValue,
    totalWeight,
    baseScore,
    timeBonusMultiplier,
    decoyPenaltyPercent,
    decoyCount,
    score
  };
}

module.exports = {
  calculateHeistScore
};
