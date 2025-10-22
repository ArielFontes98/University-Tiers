import { CriteriaScores, TargetFunction, Country, Tier } from '../types';
import { CRITERIA_WEIGHTS } from '../types';

export const FUNCTION_MULTIPLIERS: Record<TargetFunction, number[]> = {
  'AE': [0.6, 0.9, 1.0, 0.5, 0.8, 0.7, 0.9, 0.6, 0.6, 0.6, 0.6],
  'BA': [1.0, 0.6, 0.6, 1.0, 0.9, 0.9, 0.7, 0.8, 0.9, 0.8, 0.7],
  'DS/MLE': [1.0, 0.9, 0.8, 0.7, 0.8, 0.8, 1.0, 0.7, 0.8, 0.7, 0.6],
};

export const COUNTRY_MODIFIERS: Record<Country, number> = {
  'Brazil': 1.20,
  'Mexico': 1.10,
  'Colombia': 1.05,
  'United States': 0.95,
  'Others': 0.90,
};

const criteriaKeys: (keyof CriteriaScores)[] = [
  'curriculumDepth',
  'engineeringFoundations',
  'dataEngineeringExposure',
  'analyticsBusinessOrientation',
  'cohortSizeContinuity',
  'capstoneProjectsIntensity',
  'toolsStackFamiliarity',
  'clubsCompetitions',
  'internshipAlignment',
  'diPipelineContribution',
  'regionalCoverageFit',
];

export function calculateScore(
  scores: CriteriaScores,
  targetFunction: TargetFunction,
  country: Country
): { baseScore: number; finalScore: number; tier: Tier } {
  const multipliers = FUNCTION_MULTIPLIERS[targetFunction];
  
  let weightedSum = 0;
  let maxPossible = 0;
  
  criteriaKeys.forEach((key, index) => {
    const weight = CRITERIA_WEIGHTS[key];
    const multiplier = multipliers[index];
    weightedSum += scores[key] * weight * multiplier;
    maxPossible += 10 * weight * multiplier;
  });
  
  const baseScore = (weightedSum / maxPossible) * 100;
  const countryModifier = COUNTRY_MODIFIERS[country];
  const finalScore = Math.min(100, baseScore * countryModifier);
  
  const tier = getTier(finalScore);
  
  return { baseScore, finalScore, tier };
}

export function getTier(finalScore: number): Tier {
  if (finalScore >= 85) return 0;
  if (finalScore >= 70) return 1;
  if (finalScore >= 55) return 2;
  return 3;
}

export function getTierInfo(tier: Tier): {
  name: string;
  color: string;
  bgColor: string;
  playbook: string[];
} {
  switch (tier) {
    case 0:
      return {
        name: 'Tier 0 – Strategic',
        color: 'text-purple-700',
        bgColor: 'bg-purple-100',
        playbook: [
          'MOU with university leadership',
          '2–3 major events per semester',
          'Capstone partnerships & projects',
          'Campus Champion program',
          'Always-on ads during peak recruiting',
        ],
      };
    case 1:
      return {
        name: 'Tier 1 – Core',
        color: 'text-blue-700',
        bgColor: 'bg-blue-100',
        playbook: [
          '1–2 events per semester',
          'Strategic ad windows',
          'Interview blitz campaigns',
          'Regular presence at career fairs',
        ],
      };
    case 2:
      return {
        name: 'Tier 2 – Opportunistic',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-100',
        playbook: [
          '1 event per semester or virtual',
          'Small ad bursts',
          'Tight ROI monitoring',
          'Leverage student ambassadors',
        ],
      };
    case 3:
      return {
        name: 'Tier 3 – Explore',
        color: 'text-gray-700',
        bgColor: 'bg-gray-100',
        playbook: [
          'Virtual or joint career fairs',
          'Content syndication',
          'Low-touch engagement',
          'Monitor for future potential',
        ],
      };
  }
}

