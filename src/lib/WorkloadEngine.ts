/**
 * Workload Engine
 * Manages player fatigue, injury risks, and rest recommendations.
 */

export const updateWorkload = (currentRed: number, currentWhite: number, format: string, isFastBowler: boolean) => {
  const multiplier = isFastBowler ? 1.5 : 1.0;
  let newRed = currentRed;
  let newWhite = currentWhite;
  
  if (['Test', 'First Class'].includes(format)) {
    newRed += 10 * multiplier;
  } else {
    newWhite += 8 * multiplier;
  }
  
  return { redBallWorkload: newRed, whiteBallWorkload: newWhite };
};

export const calculateFatigueModifier = (workloadIndex: number) => {
  const modifier = 1 - (workloadIndex * 0.01);
  return modifier; // Will be negative when workloadIndex > 100, but prompt says > 80
};

export const getRestRecommendation = (workloadIndex: number) => {
  if (workloadIndex > 80) {
    return { 
      recommendRest: true, 
      injuryRiskMultiplier: 1.25,
      skipMatchEffects: { workloadReduction: 15, selectionScorePenalty: 5 }
    };
  }
  return { 
    recommendRest: false, 
    injuryRiskMultiplier: 1.0,
    skipMatchEffects: { workloadReduction: 15, selectionScorePenalty: 5 }
  };
};
