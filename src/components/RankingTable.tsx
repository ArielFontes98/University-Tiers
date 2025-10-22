import { useState } from 'react';
import { ScoredCourse } from '../lib/types';
import { CRITERION_KEYS } from '../lib/scoring';
import TierBadge from './TierBadge';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface RankingTableProps {
  courses: ScoredCourse[];
}

type SortField = 'finalScore' | 'baseScore' | 'University';
type SortDirection = 'asc' | 'desc';

export default function RankingTable({ courses }: RankingTableProps) {
  const [sortField, setSortField] = useState<SortField>('finalScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'University' ? 'asc' : 'desc');
    }
  };

  const sortedCourses = [...courses].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'desc' ? (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    );
  };

  const toggleRow = (idx: number) => {
    setExpandedRow(expandedRow === idx ? null : idx);
  };

  const getShortName = (key: string) => {
    return key
      .replace(' (0-10)', '')
      .replace('(DS/ML/Stats/SQL) ', '')
      .replace('D&I', 'D&I');
  };

  // Find source columns
  const getSourceColumns = (course: ScoredCourse): string[] => {
    return Object.keys(course).filter(key => key.startsWith('Source:'));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Country
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('University')}
              >
                University <SortIcon field="University" />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                City/Region
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Course
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('baseScore')}
              >
                Base <SortIcon field="baseScore" />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Modifier
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('finalScore')}
              >
                Final <SortIcon field="finalScore" />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Tier
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedCourses.map((course, idx) => {
              const isExpanded = expandedRow === idx;
              const sourceColumns = getSourceColumns(course);

              return (
                <React.Fragment key={idx}>
                  <tr
                    className="hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => toggleRow(idx)}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">{course.Country}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {course.University}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{course['City/Region']}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{course['Course Archetype']}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {course.baseScore.toFixed(2)}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${course.baseScore}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${
                        course.countryModifier > 1 ? 'text-green-600' : 
                        course.countryModifier < 1 ? 'text-orange-600' : 
                        'text-gray-700'
                      }`}>
                        {course.countryModifier.toFixed(2)}x
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-primary">
                        {course.finalScore.toFixed(2)}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(course.finalScore, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <TierBadge tier={course.tier} />
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Raw Criterion Scores
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            {CRITERION_KEYS.map((key, i) => (
                              <div key={key} className="flex justify-between items-center">
                                <span className="text-sm text-gray-700">
                                  {i + 1}. {getShortName(key)}
                                </span>
                                <span className="text-sm font-semibold text-primary">
                                  {(course[key] as number || 0).toFixed(1)}
                                </span>
                              </div>
                            ))}
                          </div>

                          {course.Notes && (
                            <div className="mt-4">
                              <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                              <p className="text-sm text-gray-700">{course.Notes}</p>
                            </div>
                          )}

                          {sourceColumns.length > 0 && (
                            <div className="mt-4">
                              <h4 className="font-semibold text-gray-900 mb-2">Sources</h4>
                              <div className="space-y-1">
                                {sourceColumns.map(col => (
                                  <div key={col} className="text-sm text-gray-700">
                                    <span className="font-medium">{col}:</span>{' '}
                                    {String(course[col])}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Import React for Fragment
import React from 'react';

