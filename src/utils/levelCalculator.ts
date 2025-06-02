
const LEVEL_THRESHOLDS = [
  0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200,
  4000, 4900, 5900, 7000, 8200, 9500, 10900, 12400, 14000, 15700
];

export function calculateLevel(xp: number): { level: number; nextThreshold: number | null; xpToNext: number } {
  let level = 1;
  
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }

  let nextThreshold = null;
  let xpToNext = 0;

  if (level < LEVEL_THRESHOLDS.length) {
    nextThreshold = LEVEL_THRESHOLDS[level];
    xpToNext = nextThreshold - xp;
  }

  return { level, nextThreshold, xpToNext };
}

export function getProgressPercentage(xp: number): number {
  const { level, nextThreshold } = calculateLevel(xp);
  
  if (!nextThreshold) return 100;
  
  const prevThreshold = level > 1 ? LEVEL_THRESHOLDS[level - 1] : 0;
  const levelXp = xp - prevThreshold;
  const levelRange = nextThreshold - prevThreshold;
  
  return Math.floor((levelXp / levelRange) * 100);
}
