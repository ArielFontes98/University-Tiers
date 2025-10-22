export interface CourseData {
  Country: string;
  University: string;
  'City/Region': string;
  'Course Archetype': string;
  Notes: string;
  'Curriculum Depth (DS/ML/Stats/SQL) (0-10)': number;
  'Engineering Foundations (0-10)': number;
  'Data Engineering Exposure (0-10)': number;
  'Analytics/Business Orientation (0-10)': number;
  'Cohort Size & Continuity (0-10)': number;
  'Capstone/Projects Intensity (0-10)': number;
  'Tools & Stack Familiarity (0-10)': number;
  'Clubs & Competitions (0-10)': number;
  'Internship Alignment (0-10)': number;
  'D&I Pipeline Contribution (0-10)': number;
  'Regional Coverage Fit (0-10)': number;
  [key: string]: string | number; // For optional "Source: ..." columns
}

export interface ScoredCourse extends CourseData {
  baseScore: number;
  countryModifier: number;
  finalScore: number;
  tier: string;
}

export type TargetFunction = 'AE' | 'BA' | 'DS/MLE';

export interface Weights {
  [key: string]: number;
}

