export type Country = 'Brazil' | 'Mexico' | 'Colombia' | 'United States' | 'Others';

export type TargetFunction = 'AE' | 'BA' | 'DS/MLE';

export type Tier = 0 | 1 | 2 | 3;

export interface UniversityData {
  Country: Country;
  University: string;
  'City/Region': string;
  'STEM Courses (Archetypes)': string;
  Notes: string;
}

export interface CriteriaScores {
  curriculumDepth: number;
  engineeringFoundations: number;
  dataEngineeringExposure: number;
  analyticsBusinessOrientation: number;
  cohortSizeContinuity: number;
  capstoneProjectsIntensity: number;
  toolsStackFamiliarity: number;
  clubsCompetitions: number;
  internshipAlignment: number;
  diPipelineContribution: number;
  regionalCoverageFit: number;
}

export interface UniversityScore extends UniversityData {
  selectedCourse: string;
  scores: CriteriaScores;
  baseScore: number;
  finalScore: number;
  tier: Tier;
}

export interface Filters {
  countries: Country[];
  stemCourses: string[];
  targetFunction: TargetFunction;
}

export const CRITERIA_NAMES = {
  curriculumDepth: 'Curriculum Depth (DS/ML/Stats/SQL)',
  engineeringFoundations: 'Engineering Foundations',
  dataEngineeringExposure: 'Data Engineering Exposure',
  analyticsBusinessOrientation: 'Analytics/Business Orientation',
  cohortSizeContinuity: 'Cohort Size & Continuity',
  capstoneProjectsIntensity: 'Capstone/Projects Intensity',
  toolsStackFamiliarity: 'Tools & Stack Familiarity',
  clubsCompetitions: 'Clubs & Competitions',
  internshipAlignment: 'Internship Alignment',
  diPipelineContribution: 'D&I Pipeline Contribution',
  regionalCoverageFit: 'Regional Coverage Fit',
} as const;

export const CRITERIA_WEIGHTS = {
  curriculumDepth: 10,
  engineeringFoundations: 8,
  dataEngineeringExposure: 7,
  analyticsBusinessOrientation: 8,
  cohortSizeContinuity: 9,
  capstoneProjectsIntensity: 7,
  toolsStackFamiliarity: 6,
  clubsCompetitions: 6,
  internshipAlignment: 7,
  diPipelineContribution: 7,
  regionalCoverageFit: 5,
} as const;

