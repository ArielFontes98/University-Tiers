import { describe, it, expect } from 'vitest';
import { calculateScore, getTier, getCountryModifier, CRITERION_KEYS } from './scoring';
import { CourseData, Weights } from './types';

describe('scoring', () => {
  const mockCourse: CourseData = {
    Country: 'Brazil',
    University: 'Test University',
    'City/Region': 'Test City',
    'Course Archetype': 'Data Science',
    Notes: 'Test notes',
    'Curriculum Depth (DS/ML/Stats/SQL) (0-10)': 8,
    'Engineering Foundations (0-10)': 7,
    'Data Engineering Exposure (0-10)': 6,
    'Analytics/Business Orientation (0-10)': 7,
    'Cohort Size & Continuity (0-10)': 8,
    'Capstone/Projects Intensity (0-10)': 7,
    'Tools & Stack Familiarity (0-10)': 8,
    'Clubs & Competitions (0-10)': 6,
    'Internship Alignment (0-10)': 7,
    'D&I Pipeline Contribution (0-10)': 7,
    'Regional Coverage Fit (0-10)': 8,
  };

  const defaultWeights: Weights = {};
  CRITERION_KEYS.forEach(key => {
    defaultWeights[key] = 1.0;
  });

  describe('getTier', () => {
    it('should return Tier 0 for scores >= 85', () => {
      expect(getTier(85)).toBe('Tier 0 – Strategic');
      expect(getTier(90)).toBe('Tier 0 – Strategic');
      expect(getTier(100)).toBe('Tier 0 – Strategic');
    });

    it('should return Tier 1 for scores >= 70 and < 85', () => {
      expect(getTier(70)).toBe('Tier 1 – Core');
      expect(getTier(75)).toBe('Tier 1 – Core');
      expect(getTier(84.99)).toBe('Tier 1 – Core');
    });

    it('should return Tier 2 for scores >= 55 and < 70', () => {
      expect(getTier(55)).toBe('Tier 2 – Opportunistic');
      expect(getTier(60)).toBe('Tier 2 – Opportunistic');
      expect(getTier(69.99)).toBe('Tier 2 – Opportunistic');
    });

    it('should return Tier 3 for scores < 55', () => {
      expect(getTier(54.99)).toBe('Tier 3 – Explore');
      expect(getTier(40)).toBe('Tier 3 – Explore');
      expect(getTier(0)).toBe('Tier 3 – Explore');
    });
  });

  describe('getCountryModifier', () => {
    it('should return correct modifiers for known countries', () => {
      expect(getCountryModifier('Brazil')).toBe(1.20);
      expect(getCountryModifier('Mexico')).toBe(1.10);
      expect(getCountryModifier('Colombia')).toBe(1.05);
      expect(getCountryModifier('United States')).toBe(0.95);
    });

    it('should return default modifier for unknown countries', () => {
      expect(getCountryModifier('France')).toBe(0.90);
      expect(getCountryModifier('Unknown')).toBe(0.90);
    });
  });

  describe('calculateScore', () => {
    it('should calculate base score with default weights', () => {
      const result = calculateScore(mockCourse, 'DS/MLE', defaultWeights);
      expect(result.baseScore).toBeGreaterThan(0);
      expect(result.baseScore).toBeLessThanOrEqual(100);
    });

    it('should apply country modifier correctly', () => {
      const result = calculateScore(mockCourse, 'DS/MLE', defaultWeights);
      expect(result.countryModifier).toBe(1.20); // Brazil
      expect(result.finalScore).toBeCloseTo(result.baseScore * 1.20, 1);
    });

    it('should assign correct tier', () => {
      const result = calculateScore(mockCourse, 'DS/MLE', defaultWeights);
      expect(result.tier).toMatch(/^Tier [0-3]/);
    });

    it('should respect custom weights', () => {
      const customWeights: Weights = { ...defaultWeights };
      // Set first criterion to 2.0
      customWeights[CRITERION_KEYS[0]] = 2.0;

      const defaultResult = calculateScore(mockCourse, 'DS/MLE', defaultWeights);
      const customResult = calculateScore(mockCourse, 'DS/MLE', customWeights);

      // Custom weight should affect the score
      expect(customResult.baseScore).not.toBe(defaultResult.baseScore);
    });

    it('should handle different target functions', () => {
      const aeResult = calculateScore(mockCourse, 'AE', defaultWeights);
      const baResult = calculateScore(mockCourse, 'BA', defaultWeights);
      const dsResult = calculateScore(mockCourse, 'DS/MLE', defaultWeights);

      // Different functions should yield different scores
      expect(aeResult.baseScore).not.toBe(baResult.baseScore);
      expect(baResult.baseScore).not.toBe(dsResult.baseScore);
    });
  });
});

