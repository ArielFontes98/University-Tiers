import { ScoredCourse, TargetFunction, FunctionWeights } from './types';

interface ExportFilters {
  countries: string[];
  archetypes: string[];
}

/**
 * Export scored courses to CSV with metadata header.
 * 
 * Includes:
 * - Metadata comment lines (target function, filters, weights)
 * - All raw data fields (Country, University, City/Region, Course Archetype, Notes)
 * - Raw criterion scores (Quality_0_3, Scale_0_3, Employability_0_3, GeoFit_0_2)
 * - Computed fields (rawScore, baseScore, countryModifier, finalScore, tier)
 */
export function exportToCSV(
  courses: ScoredCourse[],
  targetFunction: TargetFunction,
  weights: FunctionWeights,
  countryModifiers: Record<string, number>,
  filters: ExportFilters
): void {
  if (courses.length === 0) {
    alert('No courses to export');
    return;
  }

  // Build metadata header
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const metadata = [
    `# STEM Course Prioritization Export`,
    `# Generated: ${new Date().toLocaleString()}`,
    `# Target Function: ${targetFunction}`,
    `# Active Filters:`,
    `#   Countries: ${filters.countries.length > 0 ? filters.countries.join(', ') : 'All'}`,
    `#   Archetypes: ${filters.archetypes.length > 0 ? filters.archetypes.join(', ') : 'All'}`,
    `# Function Weights:`,
    `#   Quality (wQ): ${weights.wQ.toFixed(2)}`,
    `#   Scale (wS): ${weights.wS.toFixed(2)}`,
    `#   Employability (wE): ${weights.wE.toFixed(2)}`,
    `#   GeoFit (wG): ${weights.wG.toFixed(2)}`,
    `#`,
  ].join('\n');

  // CSV headers
  const headers = [
    'Country',
    'University',
    'City/Region',
    'Course Archetype',
    'Notes',
    'Quality_0_3',
    'Scale_0_3',
    'Employability_0_3',
    'GeoFit_0_2',
    'RawScore',
    'BaseScore_0_100',
    'CountryModifier',
    'FinalScore',
    'Tier',
  ];

  // Build CSV rows
  const rows = courses.map(course => [
    escapeCSV(course.Country),
    escapeCSV(course.University),
    escapeCSV(course['City/Region']),
    escapeCSV(course['Course Archetype']),
    escapeCSV(course.Notes),
    course.Quality_0_3,
    course.Scale_0_3,
    course.Employability_0_3,
    course.GeoFit_0_2,
    course.rawScore.toFixed(2),
    course.baseScore.toFixed(2),
    course.countryModifier.toFixed(2),
    course.finalScore.toFixed(2),
    escapeCSV(course.tier),
  ]);

  // Combine all parts
  const csvContent = [
    metadata,
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  // Download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `university-tiers-${targetFunction}-${timestamp}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function escapeCSV(value: string | number): string {
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
