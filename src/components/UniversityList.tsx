import { useState } from 'react';
import { UniversityData, CriteriaScores, TargetFunction } from '../types';
import { TierBadge } from './TierBadge';
import { ScoreSliders } from './ScoreSliders';
import { ActivationPlaybook } from './ActivationPlaybook';
import { calculateScore, COUNTRY_MODIFIERS } from '../utils/scoring';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface UniversityListProps {
  universities: UniversityData[];
  targetFunction: TargetFunction;
  onScoresChange: (university: string, course: string, scores: CriteriaScores) => void;
  getScores: (university: string, course: string) => CriteriaScores;
}

export function UniversityList({
  universities,
  targetFunction,
  onScoresChange,
  getScores,
}: UniversityListProps) {
  const [expandedUniversity, setExpandedUniversity] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  const toggleUniversity = (universityName: string) => {
    if (expandedUniversity === universityName) {
      setExpandedUniversity(null);
      setSelectedCourse('');
    } else {
      setExpandedUniversity(universityName);
      const courses = universities
        .find(u => u.University === universityName)
        ?.['STEM Courses (Archetypes)'].split(';')
        .map(c => c.trim())
        .filter(Boolean) || [];
      setSelectedCourse(courses[0] || '');
    }
  };

  if (universities.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No universities match the current filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {universities.map(uni => {
        const courses = uni['STEM Courses (Archetypes)']
          .split(';')
          .map(c => c.trim())
          .filter(Boolean);
        
        const isExpanded = expandedUniversity === uni.University;
        const currentCourse = isExpanded ? selectedCourse : courses[0];
        const scores = getScores(uni.University, currentCourse);
        const { baseScore, finalScore, tier } = calculateScore(
          scores,
          targetFunction,
          uni.Country
        );

        return (
          <div key={uni.University} className="card overflow-hidden">
            {/* Header */}
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleUniversity(uni.University)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{uni.University}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {uni['City/Region']} • {uni.Country}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {courses.map(course => (
                      <span
                        key={course}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                  {uni.Notes && (
                    <p className="text-sm text-gray-500 mt-2 italic">{uni.Notes}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-3">
                  <TierBadge tier={tier} finalScore={finalScore} />
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded content */}
            {isExpanded && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                {/* Course selector */}
                {courses.length > 1 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Course to Score
                    </label>
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      {courses.map(course => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Sliders */}
                  <div className="lg:col-span-2">
                    <ScoreSliders
                      scores={scores}
                      onScoresChange={(newScores) =>
                        onScoresChange(uni.University, currentCourse, newScores)
                      }
                    />
                  </div>

                  {/* Score summary and playbook */}
                  <div className="space-y-6">
                    <div className="card p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Base Score:</span>
                          <span className="text-lg font-bold text-gray-900">
                            {baseScore.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Country Modifier:</span>
                          <span className="text-lg font-bold text-primary">
                            ×{COUNTRY_MODIFIERS[uni.Country]}
                          </span>
                        </div>
                        <div className="pt-3 border-t border-gray-200">
                          <TierBadge tier={tier} finalScore={finalScore} />
                        </div>
                      </div>
                    </div>

                    <ActivationPlaybook tier={tier} />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

