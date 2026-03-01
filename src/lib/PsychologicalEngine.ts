/**
 * Psychological Engine
 * Handles pressure tolerance, slumps, and media pressure.
 */

export const calculatePressureModifier = (basePerformance: number, bigMatchTemperament: number) => {
  return basePerformance * (bigMatchTemperament / 100);
};

export const triggerSlump = (formScoreHistory: number[], mentalResilience: number, experience: number) => {
  const isSlump = formScoreHistory.length >= 3 && formScoreHistory.slice(-3).every(score => score < 30);
  
  if (!isSlump) {
    return { active: false, duration: 0, penalty: 0 };
  }
  
  const baseDuration = Math.floor(Math.random() * 7) + 2; // Random 2-8
  const adjustment = Math.floor((mentalResilience + experience) / 40);
  const duration = Math.max(1, baseDuration - adjustment);
  const penalty = -(Math.floor(Math.random() * 8) + 8); // -8 to -15 skill penalty
  
  return { active: true, duration, penalty };
};

export const updateMediaPressure = (currentPressure: number, events: string[], confidence: number) => {
  let newPressure = currentPressure - 2; // Resets -2 per match
  
  if (events.includes('failures_3') || events.includes('dropped') || events.includes('controversy')) {
    newPressure += 20;
  }
  
  // Reduces by Confidence * 0.1 per 10 points
  const reduction = (confidence * 0.1) * (currentPressure / 10);
  newPressure -= reduction;
  
  return Math.max(0, Math.min(100, newPressure));
};
