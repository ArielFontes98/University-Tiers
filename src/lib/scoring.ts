import { CourseData, ScoredCourse, TargetFunction, Weights } from './types';

// Function multipliers aligned with 11 criteria
export const FUNCTION_MULTIPLIERS: Record<TargetFunction, number[]> = {
  'AE': [0.6, 0.9, 1.0, 0.5, 0.8, 0.7, 0.9, 0.6, 0.6, 0.6, 0.6],
  'BA': [1.0, 0.6, 0.6, 1.0, 0.9, 0.9, 0.7, 0.8, 0.9, 0.8, 0.7],
  'DS/MLE': [1.0, 0.9, 0.8, 0.7, 0.8, 0.8, 1.0, 0.7, 0.8, 0.7, 0.6],
};

// Country modifiers
export const COUNTRY_MODIFIERS: Record<string, number> = {
  'Brazil': 1.20,
  'Mexico': 1.10,
  'Colombia': 1.05,
  'United States': 0.95,
};

export const DEFAULT_COUNTRY_MODIFIER = 0.90;

// Criterion keys in order
export const CRITERION_KEYS = [
  'Curriculum Depth (DS/ML/Stats/SQL) (0-10)',
  'Engineering Foundations (0-10)',
  'Data Engineering Exposure (0-10)',
  'Analytics/Business Orientation (0-10)',
  'Cohort Size & Continuity (0-10)',
  'Capstone/Projects Intensity (0-10)',
  'Tools & Stack Familiarity (0-10)',
  'Clubs & Competitions (0-10)',
  'Internship Alignment (0-10)',
  'D&I Pipeline Contribution (0-10)',
  'Regional Coverage Fit (0-10)',
];

export function getCountryModifier(country: string): number {
  return COUNTRY_MODIFIERS[country] ?? DEFAULT_COUNTRY_MODIFIER;
}

export function calculateScore(
  course: CourseData,
  targetFunction: TargetFunction,
  weights: Weights
): ScoredCourse {
  const multipliers = FUNCTION_MULTIPLIERS[targetFunction];
  
  let numerator = 0;
  let denominator = 0;

  CRITERION_KEYS.forEach((key, idx) => {
    const score = course[key] as number || 0;
    const weight = weights[key] ?? 1.0;
    const multiplier = multipliers[idx];

    numerator += score * weight * multiplier;
    denominator += 10 * weight * multiplier;
  });

  const baseScore = denominator > 0 ? (numerator / denominator) * 100 : 0;
  const countryModifier = getCountryModifier(course.Country);
  const finalScore = baseScore * countryModifier;

  return {
    ...course,
    baseScore: Math.round(baseScore * 100) / 100,
    countryModifier,
    finalScore: Math.round(finalScore * 100) / 100,
    tier: getTier(finalScore),
  };
}

export function getTier(finalScore: number): string {
  if (finalScore >= 85) return 'Tier 0 – Strategic';
  if (finalScore >= 70) return 'Tier 1 – Core';
  if (finalScore >= 55) return 'Tier 2 – Opportunistic';
  return 'Tier 3 – Explore';
}

export function getTierNumber(tier: string): number {
  if (tier.startsWith('Tier 0')) return 0;
  if (tier.startsWith('Tier 1')) return 1;
  if (tier.startsWith('Tier 2')) return 2;
  return 3;
}

