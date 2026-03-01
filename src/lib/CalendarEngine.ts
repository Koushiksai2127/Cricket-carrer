/**
 * Calendar Engine
 * Generates schedules and manages format conflicts and rest periods.
 */

export const generateAnnualSchedule = (year: number) => {
  // Generates 50-60 matches per year across all formats
  const schedule = [];
  const totalMatches = Math.floor(Math.random() * 11) + 50; // 50 to 60
  
  for (let i = 0; i < totalMatches; i++) {
    schedule.push({
      id: `match_${year}_${i}`,
      date: new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      format: ['Test', 'ODI', 'T20I', 'Franchise'][Math.floor(Math.random() * 4)],
      conflict_flag: Math.random() > 0.85,
      rest_period_flag: false
    });
  }
  
  return schedule.sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const detectFormatConflict = (schedule: any[]) => {
  return schedule.filter(match => match.conflict_flag);
};

export const handleConflictChoice = (choice: string) => {
  if (choice === 'franchise') {
    return { selectionScorePenalty: 5, earningsPenalty: 0 };
  } else if (choice === 'national') {
    return { selectionScorePenalty: 0, earningsPenalty: 0.10 }; // 10% franchise earnings penalty
  }
  return { selectionScorePenalty: 0, earningsPenalty: 0 };
};

export const manageRestPeriods = (consecutiveMatches: number) => {
  if (consecutiveMatches >= 5) {
    return { mandatoryRest: true, workloadReduction: 20 };
  }
  return { mandatoryRest: false, workloadReduction: 0 };
};
