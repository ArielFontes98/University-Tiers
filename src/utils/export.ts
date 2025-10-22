import { UniversityScore } from '../types';

export function exportToCSV(universities: UniversityScore[]): void {
  const headers = [
    'Country',
    'University',
    'City/Region',
    'STEM Course',
    'Base Score',
    'Country Modifier',
    'Final Score',
    'Tier',
    'Notes',
  ];
  
  const rows = universities.map(uni => [
    uni.Country,
    uni.University,
    uni['City/Region'],
    uni.selectedCourse,
    uni.baseScore.toFixed(2),
    uni.Country,
    uni.finalScore.toFixed(2),
    `Tier ${uni.tier}`,
    uni.Notes,
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `university-tiers-export-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

