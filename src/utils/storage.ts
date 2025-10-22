import { CriteriaScores, Filters } from '../types';

const STORAGE_KEYS = {
  SCORES: 'university-tiers-scores',
  FILTERS: 'university-tiers-filters',
} as const;

export function saveScores(universityId: string, course: string, scores: CriteriaScores): void {
  try {
    const key = `${universityId}::${course}`;
    const allScores = getAllScores();
    allScores[key] = scores;
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(allScores));
  } catch (error) {
    console.error('Failed to save scores:', error);
  }
}

export function loadScores(universityId: string, course: string): CriteriaScores | null {
  try {
    const key = `${universityId}::${course}`;
    const allScores = getAllScores();
    return allScores[key] || null;
  } catch (error) {
    console.error('Failed to load scores:', error);
    return null;
  }
}

function getAllScores(): Record<string, CriteriaScores> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SCORES);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    return {};
  }
}

export function saveFilters(filters: Filters): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(filters));
  } catch (error) {
    console.error('Failed to save filters:', error);
  }
}

export function loadFilters(): Filters | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FILTERS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load filters:', error);
    return null;
  }
}

export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SCORES);
    localStorage.removeItem(STORAGE_KEYS.FILTERS);
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
}

