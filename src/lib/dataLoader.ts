import { CourseData } from './types';

const CRITERION_HEADERS = [
  'Curriculum Depth (DS/ML/Stats/SQL) (0-10)',
  'Engineering Foundations (0-10)',
  'Data Engineering Exposure (0-10)',
  'Analytics/Business Orientation (0-10)',
  'Cohort Size & Continuity (0-10)',
  'Capstone/Projects Intensity (0-10)',
  'Tools & Stack Familiarity (0-10)',
  'Clubs & Competitions (0-10)',
  'Internship Alignment (0-10)',
  'D&I Pipeline Contribution (0-10)',
  'Regional Coverage Fit (0-10)',
];

async function loadJSON(url: string): Promise<CourseData[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load JSON from ${url}: ${response.statusText}`);
  }
  return response.json();
}

function parseCSV(text: string): CourseData[] {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('CSV file is empty or has no data rows');
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const data: CourseData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) continue;

    const row: any = {};
    headers.forEach((header, idx) => {
      const value = values[idx];
      // Check if this is a numeric criterion
      if (CRITERION_HEADERS.includes(header)) {
        row[header] = parseFloat(value) || 0;
      } else {
        row[header] = value;
      }
    });
    data.push(row as CourseData);
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
      result.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ''));
  return result;
}

async function loadCSV(url: string): Promise<CourseData[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load CSV from ${url}: ${response.statusText}`);
  }
  const text = await response.text();
  return parseCSV(text);
}

export async function loadCourseData(): Promise<CourseData[]> {
  const baseUrl = import.meta.env.BASE_URL;
  const jsonUrl = `${baseUrl}data/university_course_criteria_base.json`;
  const csvUrl = `${baseUrl}data/university_course_criteria_base.csv`;

  try {
    console.log('Loading data from JSON:', jsonUrl);
    const data = await loadJSON(jsonUrl);
    console.log(`Successfully loaded ${data.length} courses from JSON`);
    return data;
  } catch (jsonError) {
    console.warn('Failed to load JSON, falling back to CSV:', jsonError);
    try {
      const data = await loadCSV(csvUrl);
      console.log(`Successfully loaded ${data.length} courses from CSV`);
      return data;
    } catch (csvError) {
      throw new Error(
        `Failed to load data from both JSON and CSV sources.\n` +
        `JSON error: ${jsonError}\n` +
        `CSV error: ${csvError}\n` +
        `Please ensure data files exist at:\n` +
        `- ${jsonUrl}\n` +
        `- ${csvUrl}`
      );
    }
  }
}

