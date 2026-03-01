/**
 * Match Pressure Engine
 * Calculates situational pressure during matches.
 */

export const calculateRunRatePressure = (currentRRR: number, format: string) => {
  const baseRR = format === 'Test' ? 3.5 : format === 'ODI' ? 5.0 : 8.0;
  const pressure = (currentRRR - baseRR) * 0.05;
  return Math.max(0, pressure);
};

export const applyCollapsePressure = (wicketsInLast5Overs: number, currentConfidence: number) => {
  if (wicketsInLast5Overs >= 3) {
    return { 
      confidencePenalty: 5, 
      extraWicketProbability: 0.15 
    };
  }
  return { confidencePenalty: 0, extraWicketProbability: 0 };
};

export const applyFinalMatchMultiplier = (netScore: number, isFinal: boolean, bigMatchTemperament: number) => {
  if (!isFinal) return netScore;
  const multiplier = bigMatchTemperament / 100;
  return netScore * multiplier;
};

export const applyDeadRubberReduction = (isDeadRubber: boolean, netScore: number, injuryRisk: number) => {
  if (!isDeadRubber) return { netScore, injuryRisk };
  return { 
    netScore: netScore * 0.8, // 20% reduction
    injuryRisk: injuryRisk * 0.8 
  };
};
