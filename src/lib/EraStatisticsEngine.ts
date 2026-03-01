/**
 * Era Statistics Engine
 * Normalizes statistics across different eras to prevent stat inflation.
 */

export const computeSeasonStats = (seasonData: any) => {
  // In a real scenario, this would aggregate all matches in the season
  return {
    LeagueAverageRuns: 32.5,
    LeagueAverageStrikeRate: 135.0,
    LeagueAverageWickets: 6.2,
    LeagueAverageEconomy: 7.5
  };
};

export const detectInflation = (currentStats: any, historicalStats: any) => {
  const runsInflated = currentStats.LeagueAverageRuns > (historicalStats.LeagueAverageRuns * 1.15);
  const srInflated = currentStats.LeagueAverageStrikeRate > (historicalStats.LeagueAverageStrikeRate * 1.10);
  return runsInflated || srInflated;
};

export const applyEraAdjustment = (performanceScore: number, inflationDetected: boolean) => {
  const eraAdjustmentFactor = 0.95;
  return inflationDetected ? performanceScore * eraAdjustmentFactor : performanceScore;
};

export const applyRegressionCap = (average: number, format: string, statType: 'batting' | 'economy') => {
  const caps: Record<string, Record<string, number>> = {
    Test: { batting: 55, economy: 2.5 },
    ODI: { batting: 60, economy: 5.0 },
    T20I: { batting: 45, economy: 7.0 } // T20 SR cap is handled separately
  };
  
  const cap = caps[format]?.[statType];
  if (!cap) return average;
  
  return average > cap ? (average + cap) / 2 : average;
};
