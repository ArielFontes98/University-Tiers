import { UniversityData } from '../types';

export async function loadUniversityData(): Promise<UniversityData[]> {
  try {
    // Try loading JSON first
    const response = await fetch('/University-Tiers/data/universities_stem_courses_seed.json');
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn('Failed to load JSON, trying CSV:', error);
  }

  try {
    // Fallback to CSV
    const response = await fetch('/University-Tiers/data/universities_stem_courses_seed.csv');
    if (response.ok) {
      const text = await response.text();
      return parseCSV(text);
    }
  } catch (error) {
    console.error('Failed to load CSV:', error);
  }

  // Return empty array if both fail
  return [];
}

function parseCSV(text: string): UniversityData[] {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const data: UniversityData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      data.push(row as UniversityData);
    }
  }
  
  return data;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

