import { CriteriaScores } from '../types';

export const COURSE_PRESETS: Record<string, CriteriaScores> = {
  'Computer Science': {
    curriculumDepth: 7,
    engineeringFoundations: 9,
    dataEngineeringExposure: 6,
    analyticsBusinessOrientation: 5,
    cohortSizeContinuity: 8,
    capstoneProjectsIntensity: 7,
    toolsStackFamiliarity: 8,
    clubsCompetitions: 7,
    internshipAlignment: 7,
    diPipelineContribution: 6,
    regionalCoverageFit: 6,
  },
  'Data Science': {
    curriculumDepth: 9,
    engineeringFoundations: 7,
    dataEngineeringExposure: 8,
    analyticsBusinessOrientation: 8,
    cohortSizeContinuity: 7,
    capstoneProjectsIntensity: 8,
    toolsStackFamiliarity: 9,
    clubsCompetitions: 6,
    internshipAlignment: 8,
    diPipelineContribution: 7,
    regionalCoverageFit: 6,
  },
  'Statistics': {
    curriculumDepth: 8,
    engineeringFoundations: 5,
    dataEngineeringExposure: 5,
    analyticsBusinessOrientation: 9,
    cohortSizeContinuity: 7,
    capstoneProjectsIntensity: 7,
    toolsStackFamiliarity: 7,
    clubsCompetitions: 5,
    internshipAlignment: 7,
    diPipelineContribution: 6,
    regionalCoverageFit: 6,
  },
  'Information Systems': {
    curriculumDepth: 6,
    engineeringFoundations: 7,
    dataEngineeringExposure: 6,
    analyticsBusinessOrientation: 8,
    cohortSizeContinuity: 7,
    capstoneProjectsIntensity: 7,
    toolsStackFamiliarity: 7,
    clubsCompetitions: 6,
    internshipAlignment: 8,
    diPipelineContribution: 7,
    regionalCoverageFit: 6,
  },
  'Computer Engineering': {
    curriculumDepth: 6,
    engineeringFoundations: 10,
    dataEngineeringExposure: 7,
    analyticsBusinessOrientation: 4,
    cohortSizeContinuity: 8,
    capstoneProjectsIntensity: 8,
    toolsStackFamiliarity: 8,
    clubsCompetitions: 7,
    internshipAlignment: 7,
    diPipelineContribution: 6,
    regionalCoverageFit: 6,
  },
  'Software Engineering': {
    curriculumDepth: 7,
    engineeringFoundations: 9,
    dataEngineeringExposure: 7,
    analyticsBusinessOrientation: 5,
    cohortSizeContinuity: 8,
    capstoneProjectsIntensity: 9,
    toolsStackFamiliarity: 9,
    clubsCompetitions: 7,
    internshipAlignment: 8,
    diPipelineContribution: 7,
    regionalCoverageFit: 6,
  },
  'Mathematics': {
    curriculumDepth: 7,
    engineeringFoundations: 5,
    dataEngineeringExposure: 4,
    analyticsBusinessOrientation: 7,
    cohortSizeContinuity: 6,
    capstoneProjectsIntensity: 6,
    toolsStackFamiliarity: 5,
    clubsCompetitions: 5,
    internshipAlignment: 6,
    diPipelineContribution: 6,
    regionalCoverageFit: 6,
  },
  'Business Analytics': {
    curriculumDepth: 7,
    engineeringFoundations: 4,
    dataEngineeringExposure: 5,
    analyticsBusinessOrientation: 10,
    cohortSizeContinuity: 7,
    capstoneProjectsIntensity: 8,
    toolsStackFamiliarity: 7,
    clubsCompetitions: 6,
    internshipAlignment: 9,
    diPipelineContribution: 7,
    regionalCoverageFit: 7,
  },
  'Industrial Engineering': {
    curriculumDepth: 5,
    engineeringFoundations: 8,
    dataEngineeringExposure: 5,
    analyticsBusinessOrientation: 8,
    cohortSizeContinuity: 7,
    capstoneProjectsIntensity: 7,
    toolsStackFamiliarity: 6,
    clubsCompetitions: 6,
    internshipAlignment: 8,
    diPipelineContribution: 6,
    regionalCoverageFit: 6,
  },
  'Economics': {
    curriculumDepth: 5,
    engineeringFoundations: 3,
    dataEngineeringExposure: 3,
    analyticsBusinessOrientation: 9,
    cohortSizeContinuity: 6,
    capstoneProjectsIntensity: 6,
    toolsStackFamiliarity: 5,
    clubsCompetitions: 5,
    internshipAlignment: 7,
    diPipelineContribution: 6,
    regionalCoverageFit: 6,
  },
  'Default': {
    curriculumDepth: 5,
    engineeringFoundations: 5,
    dataEngineeringExposure: 5,
    analyticsBusinessOrientation: 5,
    cohortSizeContinuity: 5,
    capstoneProjectsIntensity: 5,
    toolsStackFamiliarity: 5,
    clubsCompetitions: 5,
    internshipAlignment: 5,
    diPipelineContribution: 5,
    regionalCoverageFit: 5,
  },
};

export function getPresetForCourse(courseName: string): CriteriaScores {
  // Try exact match first
  if (COURSE_PRESETS[courseName]) {
    return { ...COURSE_PRESETS[courseName] };
  }
  
  // Try partial match
  const normalizedCourse = courseName.toLowerCase();
  for (const [key, preset] of Object.entries(COURSE_PRESETS)) {
    if (normalizedCourse.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedCourse)) {
      return { ...preset };
    }
  }
  
  return { ...COURSE_PRESETS.Default };
}

