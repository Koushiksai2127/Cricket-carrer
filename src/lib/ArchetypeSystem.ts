/**
 * Archetype System
 * Classifies players and applies specific modifiers based on their build.
 */

export const assignArchetype = (attributes: any) => {
  if (attributes.technique > 80 && attributes.temperament > 80) return 'Anchor';
  if (attributes.power > 80 && attributes.timing > 70) return 'Aggressive Finisher';
  if (attributes.technique > 85 && attributes.temperament > 85) return 'Test Specialist';
  if (attributes.death_bowling > 85 && attributes.accuracy > 80) return 'Death Bowler';
  if (attributes.swing_turn > 85 && attributes.speed > 80) return 'Swing Bowler';
  if (attributes.variations > 85 && attributes.swing_turn > 80) return 'Wrist Spinner';
  if (attributes.batting_avg > 30 && attributes.bowling_avg < 35) return 'All-Rounder';
  if (attributes.catching > 85 && attributes.reflex > 85) return 'Wicket-Keeper Batter';
  
  return 'Balanced';
};

export const applyArchetypeModifiers = (archetype: string, stats: any) => {
  let modified = { ...stats };
  
  switch (archetype) {
    case 'Anchor':
      modified.strikeRate = (modified.strikeRate || 100) * 0.9;
      modified.temperament = (modified.temperament || 50) * 1.05;
      break;
    case 'Aggressive Finisher':
      modified.strikeRate = (modified.strikeRate || 100) * 1.15;
      modified.temperament = (modified.temperament || 50) * 0.95;
      break;
    case 'Test Specialist':
      modified.testAvg = (modified.testAvg || 35) * 1.05;
      modified.odiAvg = (modified.odiAvg || 35) * 0.97;
      break;
    case 'Death Bowler':
      modified.deathBowling = (modified.deathBowling || 50) * 1.10;
      modified.economy = (modified.economy || 8.0) * 0.95;
      break;
    case 'Swing Bowler':
      modified.swingTurn = (modified.swingTurn || 50) * 1.10;
      modified.variations = (modified.variations || 50) * 0.95;
      break;
    case 'Wrist Spinner':
      modified.variations = (modified.variations || 50) * 1.10;
      modified.accuracy = (modified.accuracy || 50) * 0.95;
      break;
    default:
      break;
  }
  
  return modified;
};

export const influenceProbabilityCurves = (archetype: string, baseProbabilities: any, matchContext: any) => {
  let probs = { ...baseProbabilities };
  
  if (archetype === 'Anchor') {
    probs.boundary *= 0.9;
    probs.dot *= 1.1;
  } else if (archetype === 'Aggressive Finisher') {
    probs.boundary *= 1.2;
    probs.dot *= 0.8;
  } else if (archetype === 'Death Bowler' && matchContext.isDeathOvers) {
    probs.wicket *= 1.25;
  }
  
  return probs;
};

export const evolveArchetype = (currentArchetype: string, newAttributes: any) => {
  const newArchetype = assignArchetype(newAttributes);
  return newArchetype !== currentArchetype ? newArchetype : currentArchetype;
};
