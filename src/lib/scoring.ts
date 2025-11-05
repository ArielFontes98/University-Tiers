import { CourseData, ScoredCourse, TargetFunction, FunctionWeights } from './types';

/**
 * Default function-specific weights for the 4 criteria.
 * 
 * Criteria:
 * - Q (Quality_0_3): Course quality/reputation in country
 * - S (Scale_0_3): Cohort size/volume
 * - E (Employability_0_3): Pipeline to data/tech roles
 * - G (GeoFit_0_2): Geographic/strategic fit
 */
export const FUNCTION_WEIGHTS: Record<TargetFunction, FunctionWeights> = {
  'AE': {
    wQ: 0.8,
    wS: 1.2,
    wE: 1.0,
    wG: 0.8,
  },
  'BA': {
    wQ: 1.0,
    wS: 0.8,
    wE: 1.2,
    wG: 1.0,
  },
  'DS/MLE': {
    wQ: 1.2,
    wS: 0.8,
    wE: 1.2,
    wG: 0.8,
  },
};

/**
 * Country priority modifiers.
 * Applied to base score (0-100) to produce final score.
 */
export const COUNTRY_MODIFIERS: Record<string, number> = {
  'Brazil': 1.20,
  'Mexico': 1.10,
  'Colombia': 1.05,
  'United States': 0.95,
};

export const DEFAULT_COUNTRY_MODIFIER = 0.90;

/**
 * Criteria definitions for tooltips and documentation.
 */
export const CRITERIA_INFO = {
  Quality_0_3: {
    name: 'Course Quality Index',
    question: 'How strong is this course within its country?',
    scale: [
      '3 = top programs (very selective, strong reputation)',
      '2 = solid / well-known program',
      '1 = decent but not a strong reference',
      '0 = unknown / weak'
    ]
  },
  Scale_0_3: {
    name: 'Scale / Cohort Size',
    question: 'How many students does this course produce per year?',
    scale: [
      '3 = large cohorts (strong, stable annual volume)',
      '2 = mid-size cohorts',
      '1 = small / niche program',
      '0 = unknown'
    ]
  },
  Employability_0_3: {
    name: 'Employability in Data/Tech',
    question: 'How often do graduates show up in data/tech/fintech roles?',
    scale: [
      '3 = strong pipeline (CS, Data Science, Stats, etc.)',
      '2 = decent pipeline (Economics, Applied Math, etc.)',
      '1 = low direct pipeline',
      '0 = unknown / no signal'
    ]
  },
  GeoFit_0_2: {
    name: 'Geographic / Strategic Fit',
    question: 'Is this campus/city strategically important?',
    scale: [
      '2 = key hub (major tech/financial/talent hub)',
      '1 = secondary but still relevant',
      '0 = low strategic fit'
    ]
  }
};

export function getCountryModifier(country: string): number {
  return COUNTRY_MODIFIERS[country] ?? DEFAULT_COUNTRY_MODIFIER;
}

/**
 * Calculate score for a course based on the simplified 4-criteria model.
 * 
 * Formula:
 * 1. RawScore = Q*wQ + S*wS + E*wE + G*wG
 * 2. MaxRaw = 3*wQ + 3*wS + 3*wE + 2*wG (theoretical maximum)
 * 3. BaseScore = (RawScore / MaxRaw) * 100
 * 4. FinalScore = BaseScore * CountryModifier
 * 5. Tier assigned based on FinalScore thresholds
 * 
 * TODO: Future enhancement - add a 5th criterion for internal Nubank traction/performance
 * when that data becomes available. This would plug in as:
 * - NubankTraction_0_3 (e.g., based on # of hires, performance, retention)
 * - Add a wN weight to FunctionWeights
 * - Update formula: RawScore = Q*wQ + S*wS + E*wE + G*wG + N*wN
 */
export function calculateScore(
  course: CourseData,
  _targetFunction: TargetFunction,
  weights: FunctionWeights,
  customCountryModifiers?: Record<string, number>
): ScoredCourse {
  const Q = course.Quality_0_3 || 0;
  const S = course.Scale_0_3 || 0;
  const E = course.Employability_0_3 || 0;
  const G = course.GeoFit_0_2 || 0;

  const { wQ, wS, wE, wG } = weights;

  // Calculate raw score
  const rawScore = Q * wQ + S * wS + E * wE + G * wG;

  // Calculate maximum possible score for normalization
  const maxRaw = 3 * wQ + 3 * wS + 3 * wE + 2 * wG;

  // Normalize to 0-100
  const baseScore = maxRaw > 0 ? (rawScore / maxRaw) * 100 : 0;

  // Apply country modifier
  const countryModifier = customCountryModifiers?.[course.Country] ?? getCountryModifier(course.Country);
  const finalScore = baseScore * countryModifier;

  return {
    ...course,
    rawScore: Math.round(rawScore * 100) / 100,
    baseScore: Math.round(baseScore * 100) / 100,
    countryModifier,
    finalScore: Math.round(finalScore * 100) / 100,
    tier: getTier(finalScore),
  };
}

/**
 * Determine tier based on final score.
 */
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
