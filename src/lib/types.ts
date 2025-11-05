// Simplified data model with 4 criteria
export interface CourseData {
  Country: string;
  University: string;
  'City/Region': string;
  'Course Archetype': string;
  Notes: string;
  Quality_0_3: number;
  Scale_0_3: number;
  Employability_0_3: number;
  GeoFit_0_2: number;
  [key: string]: string | number; // For any additional optional fields
}

export interface ScoredCourse extends CourseData {
  rawScore: number;
  baseScore: number;      // 0-100 normalized
  countryModifier: number;
  finalScore: number;
  tier: string;
}

export type TargetFunction = 'AE' | 'BA' | 'DS/MLE';

// Simple weights for the 4 criteria
export interface FunctionWeights {
  wQ: number;  // Quality weight
  wS: number;  // Scale weight
  wE: number;  // Employability weight
  wG: number;  // GeoFit weight
}
