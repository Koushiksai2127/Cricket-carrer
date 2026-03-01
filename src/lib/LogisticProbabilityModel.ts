/**
 * Logistic Probability Model
 * Replaces static thresholds with smooth curves for match simulation.
 */

export const calculateBoundaryProbability = (netScore: number) => {
  return 1 / (1 + Math.exp(-0.25 * netScore));
};

export const calculateWicketProbability = (netScore: number) => {
  return 1 / (1 + Math.exp(0.3 * netScore));
};

export const calculateDotProbability = (netScore: number) => {
  return 1 / (1 + Math.exp(-0.15 * netScore));
};

export const calculateSingleProbability = (netScore: number) => {
  return 1 / (1 + Math.exp(-0.10 * netScore));
};
