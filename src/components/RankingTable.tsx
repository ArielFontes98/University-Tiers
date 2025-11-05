import { useState } from 'react';
import { ScoredCourse } from '../lib/types';
import TierBadge from './TierBadge';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface RankingTableProps {
  courses: ScoredCourse[];
}

type SortField = 'finalScore' | 'baseScore' | 'University' | 'Quality_0_3' | 'Scale_0_3' | 'Employability_0_3' | 'GeoFit_0_2';
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
                className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('Quality_0_3')}
                title="Quality Index (0-3)"
              >
                Q <SortIcon field="Quality_0_3" />
              </th>
              <th
                className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('Scale_0_3')}
                title="Scale/Cohort Size (0-3)"
              >
                S <SortIcon field="Scale_0_3" />
              </th>
              <th
                className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('Employability_0_3')}
                title="Employability (0-3)"
              >
                E <SortIcon field="Employability_0_3" />
              </th>
              <th
                className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('GeoFit_0_2')}
                title="Geographic Fit (0-2)"
              >
                G <SortIcon field="GeoFit_0_2" />
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('baseScore')}
              >
                Base <SortIcon field="baseScore" />
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

              return (
                <>
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => toggleRow(idx)}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">{course.Country}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {course.University}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{course['City/Region']}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{course['Course Archetype']}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm">
                        {course.Quality_0_3}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                        {course.Scale_0_3}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                        {course.Employability_0_3}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-semibold text-sm">
                        {course.GeoFit_0_2}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {course.baseScore.toFixed(1)}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, course.baseScore)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-primary">
                        {course.finalScore.toFixed(1)}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-primary h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, course.finalScore)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <TierBadge tier={course.tier} />
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`expanded-${idx}`} className="bg-gray-50">
                      <td colSpan={11} className="px-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Details</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">Raw Score:</span>{' '}
                                <span className="text-gray-900">{course.rawScore.toFixed(2)}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Base Score (normalized 0-100):</span>{' '}
                                <span className="text-gray-900">{course.baseScore.toFixed(2)}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Country Modifier:</span>{' '}
                                <span className={`font-semibold ${
                                  course.countryModifier > 1 ? 'text-green-600' : 
                                  course.countryModifier < 1 ? 'text-orange-600' : 
                                  'text-gray-700'
                                }`}>
                                  {course.countryModifier.toFixed(2)}x
                                </span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Final Score:</span>{' '}
                                <span className="text-primary font-bold">{course.finalScore.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                            <p className="text-sm text-gray-700">
                              {course.Notes || 'No notes available'}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedCourses.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No courses match your current filters
        </div>
      )}
    </div>
  );
}
