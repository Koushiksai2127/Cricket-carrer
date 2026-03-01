/**
 * Team Chemistry Engine
 * Manages team morale, trust, and conflicts.
 */

export const updateTeamMorale = (currentMorale = 50, events: string[] = []) => {
  let newMorale = currentMorale;
  events.forEach(e => {
    if (e === 'team_win' || e === 'century' || e === 'tournament_win') newMorale += 5;
    if (e === 'team_loss' || e === 'failure' || e === 'conflict') newMorale -= 5;
  });
  return Math.max(0, Math.min(100, newMorale));
};

export const updateDressingRoomTrust = (currentTrust = 50, events: string[] = []) => {
  let newTrust = currentTrust;
  events.forEach(e => {
    if (e === 'good_performance' || e === 'team_win') newTrust += 5;
    if (e === 'poor_performance') newTrust -= 5;
    if (e === 'conflict') newTrust -= 15;
  });
  return Math.max(0, Math.min(100, newTrust));
};

export const calculateLeadershipImpact = (captainLeadership: number) => {
  return captainLeadership * 0.2;
};

export const triggerConflictEvent = (confidence: number, workEthic: number) => {
  if (confidence > 80 && workEthic < 40 && Math.random() > 0.7) {
    return { 
      conflict: true, 
      moralePenalty: 10, 
      trustPenalty: 15, 
      headline: "Dressing Room Bust-up!" 
    };
  }
  return { conflict: false, moralePenalty: 0, trustPenalty: 0, headline: null };
};

export const applySelectionBias = (isFavored: boolean) => {
  return isFavored ? 2 : 0;
};
