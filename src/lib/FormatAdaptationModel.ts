/**
 * Format Adaptation Model
 * Handles player performance scaling across different formats.
 */

export const calculateFormatAdaptation = (attributes: any, format: string) => {
  if (format === 'Test' || format === 'First Class') {
    return (attributes.technique + attributes.temperament) / 2;
  }
  if (format === 'ODI' || format === 'List A') {
    return (attributes.timing + attributes.power + attributes.temperament) / 3;
  }
  if (format === 'T20I' || format === 'Domestic T20' || format === 'Franchise') {
    return (attributes.power + (attributes.death_bowling || 50) + attributes.confidence) / 3;
  }
  return 50;
};

export const calculateFormatSpecificPerformance = (attributes: any, format: string) => {
  const baseSkill = (attributes.technique + attributes.timing + attributes.power + attributes.temperament) / 4;
  const adaptation = calculateFormatAdaptation(attributes, format);
  return baseSkill * (adaptation / 100);
};

export const evolveFormatAdaptation = (currentAdaptation: number, matchesPlayedInFormat: number) => {
  // +0.5 adaptation per 10 matches in format
  const evolution = Math.floor(matchesPlayedInFormat / 10) * 0.5;
  return Math.min(100, currentAdaptation + evolution);
};
