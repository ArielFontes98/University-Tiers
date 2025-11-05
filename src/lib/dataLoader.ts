import { CourseData } from './types';

const NUMERIC_FIELDS = [
  'Quality_0_3',
  'Scale_0_3', 
  'Employability_0_3',
  'GeoFit_0_2'
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
      // Check if this is a numeric field
      if (NUMERIC_FIELDS.includes(header)) {
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

/**
 * Loads course data from JSON (preferred) or CSV (fallback).
 * 
 * Data file paths:
 * - Primary: public/data/university_course_simple_scores.json
 * - Fallback: public/data/university_course_simple_scores.csv
 * 
 * Expected fields:
 * - Country, University, City/Region, Course Archetype, Notes (strings)
 * - Quality_0_3, Scale_0_3, Employability_0_3, GeoFit_0_2 (numbers)
 */
export async function loadCourseData(): Promise<CourseData[]> {
  const baseUrl = import.meta.env.BASE_URL;
  const jsonUrl = `${baseUrl}data/university_course_simple_scores.json`;
  const csvUrl = `${baseUrl}data/university_course_simple_scores.csv`;

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
