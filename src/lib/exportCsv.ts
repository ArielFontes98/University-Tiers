import { ScoredCourse, TargetFunction, Weights } from './types';
import { CRITERION_KEYS } from './scoring';

export function exportToCSV(
  courses: ScoredCourse[],
  targetFunction: TargetFunction,
  weights: Weights,
  countryModifiers: Record<string, number>,
  filters: {
    countries: string[];
    archetypes: string[];
  }
): void {
  // Build CSV content
  const lines: string[] = [];

  // Metadata header
  lines.push('# STEM Course Prioritization Export');
  lines.push(`# Target Function: ${targetFunction}`);
  lines.push(`# Countries Filter: ${filters.countries.length > 0 ? filters.countries.join(', ') : 'All'}`);
  lines.push(`# Archetypes Filter: ${filters.archetypes.length > 0 ? filters.archetypes.join(', ') : 'All'}`);
  lines.push('# Current Weights:');
  CRITERION_KEYS.forEach((key, idx) => {
    const shortName = key.replace(' (0-10)', '').replace('(DS/ML/Stats/SQL) ', '');
    lines.push(`#   ${idx + 1}. ${shortName}: ${weights[key]?.toFixed(1) ?? '1.0'}`);
  });
  lines.push('# Country Modifiers:');
  Object.entries(countryModifiers).sort().forEach(([country, modifier]) => {
    lines.push(`#   ${country}: ${modifier.toFixed(2)}x`);
  });
  lines.push('');

  // CSV Headers
  const headers = [
    'Country',
    'University',
    'City/Region',
    'Course Archetype',
    'Base Score',
    'Country Modifier',
    'Final Score',
    'Tier',
    ...CRITERION_KEYS,
    'Notes',
  ];
  lines.push(headers.map(escapeCSV).join(','));

  // Data rows
  courses.forEach(course => {
    const row = [
      course.Country,
      course.University,
      course['City/Region'],
      course['Course Archetype'],
      course.baseScore.toFixed(2),
      course.countryModifier.toFixed(2),
      course.finalScore.toFixed(2),
      course.tier,
      ...CRITERION_KEYS.map(key => (course[key] as number || 0).toString()),
      course.Notes || '',
    ];
    lines.push(row.map(escapeCSV).join(','));
  });

  // Create and download
  const csvContent = lines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  link.setAttribute('href', url);
  link.setAttribute('download', `stem-courses-${targetFunction}-${timestamp}.csv`);
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

