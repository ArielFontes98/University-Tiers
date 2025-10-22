import { describe, it, expect } from 'vitest';
import { calculateScore, getTier, FUNCTION_MULTIPLIERS, COUNTRY_MODIFIERS } from '../utils/scoring';
import { CriteriaScores } from '../types';

describe('Scoring Functions', () => {
  const mockScores: CriteriaScores = {
    curriculumDepth: 8,
    engineeringFoundations: 7,
    dataEngineeringExposure: 6,
    analyticsBusinessOrientation: 8,
    cohortSizeContinuity: 9,
    capstoneProjectsIntensity: 7,
    toolsStackFamiliarity: 8,
    clubsCompetitions: 6,
    internshipAlignment: 7,
    diPipelineContribution: 7,
    regionalCoverageFit: 6,
  };

  it('should calculate correct base score for DS/MLE function', () => {
    const result = calculateScore(mockScores, 'DS/MLE', 'Brazil');
    expect(result.baseScore).toBeGreaterThan(0);
    expect(result.baseScore).toBeLessThanOrEqual(100);
  });

  it('should apply country modifier correctly', () => {
    const brazilResult = calculateScore(mockScores, 'DS/MLE', 'Brazil');
    const usResult = calculateScore(mockScores, 'DS/MLE', 'United States');
    
    // Brazil has higher modifier (1.20) than US (0.95)
    expect(brazilResult.finalScore).toBeGreaterThan(usResult.finalScore);
  });

  it('should calculate different scores for different functions', () => {
    const aeResult = calculateScore(mockScores, 'AE', 'Brazil');
    const baResult = calculateScore(mockScores, 'BA', 'Brazil');
    const dsResult = calculateScore(mockScores, 'DS/MLE', 'Brazil');
    
    // Different function multipliers should produce different scores
    expect(aeResult.baseScore).not.toBe(baResult.baseScore);
    expect(baResult.baseScore).not.toBe(dsResult.baseScore);
  });

  it('should return correct tier for score ranges', () => {
    expect(getTier(90)).toBe(0);
    expect(getTier(85)).toBe(0);
    expect(getTier(75)).toBe(1);
    expect(getTier(70)).toBe(1);
    expect(getTier(60)).toBe(2);
    expect(getTier(55)).toBe(2);
    expect(getTier(50)).toBe(3);
    expect(getTier(30)).toBe(3);
  });

  it('should not exceed 100 in final score', () => {
    const perfectScores: CriteriaScores = {
      curriculumDepth: 10,
      engineeringFoundations: 10,
      dataEngineeringExposure: 10,
      analyticsBusinessOrientation: 10,
      cohortSizeContinuity: 10,
      capstoneProjectsIntensity: 10,
      toolsStackFamiliarity: 10,
      clubsCompetitions: 10,
      internshipAlignment: 10,
      diPipelineContribution: 10,
      regionalCoverageFit: 10,
    };
    
    const result = calculateScore(perfectScores, 'DS/MLE', 'Brazil');
    expect(result.finalScore).toBeLessThanOrEqual(100);
  });

  it('should return 0 score for all zero criteria', () => {
    const zeroScores: CriteriaScores = {
      curriculumDepth: 0,
      engineeringFoundations: 0,
      dataEngineeringExposure: 0,
      analyticsBusinessOrientation: 0,
      cohortSizeContinuity: 0,
      capstoneProjectsIntensity: 0,
      toolsStackFamiliarity: 0,
      clubsCompetitions: 0,
      internshipAlignment: 0,
      diPipelineContribution: 0,
      regionalCoverageFit: 0,
    };
    
    const result = calculateScore(zeroScores, 'DS/MLE', 'Brazil');
    expect(result.baseScore).toBe(0);
  });
});

describe('Function Multipliers', () => {
  it('should have correct length for all functions', () => {
    expect(FUNCTION_MULTIPLIERS.AE).toHaveLength(11);
    expect(FUNCTION_MULTIPLIERS.BA).toHaveLength(11);
    expect(FUNCTION_MULTIPLIERS['DS/MLE']).toHaveLength(11);
  });

  it('should have all multipliers between 0 and 1', () => {
    Object.values(FUNCTION_MULTIPLIERS).forEach(multipliers => {
      multipliers.forEach(m => {
        expect(m).toBeGreaterThanOrEqual(0);
        expect(m).toBeLessThanOrEqual(1);
      });
    });
  });
});

describe('Country Modifiers', () => {
  it('should have all expected countries', () => {
    expect(COUNTRY_MODIFIERS['Brazil']).toBe(1.20);
    expect(COUNTRY_MODIFIERS['Mexico']).toBe(1.10);
    expect(COUNTRY_MODIFIERS['Colombia']).toBe(1.05);
    expect(COUNTRY_MODIFIERS['United States']).toBe(0.95);
    expect(COUNTRY_MODIFIERS['Others']).toBe(0.90);
  });

  it('should have Brazil as highest modifier', () => {
    const modifiers = Object.values(COUNTRY_MODIFIERS);
    const maxModifier = Math.max(...modifiers);
    expect(COUNTRY_MODIFIERS['Brazil']).toBe(maxModifier);
  });
});

