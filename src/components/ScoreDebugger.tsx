import { useState } from 'react';
import { ScoredCourse, TargetFunction, Weights } from '../lib/types';
import { CRITERION_KEYS, FUNCTION_MULTIPLIERS } from '../lib/scoring';
import { ChevronDown, ChevronUp, Calculator } from 'lucide-react';

interface ScoreDebuggerProps {
  courses: ScoredCourse[];
  targetFunction: TargetFunction;
  weights: Weights;
}

export default function ScoreDebugger({ courses, targetFunction, weights }: ScoreDebuggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (courses.length === 0) return null;

  const course = courses[selectedIdx];
  const multipliers = FUNCTION_MULTIPLIERS[targetFunction];

  // Calculate contribution of each criterion
  const contributions = CRITERION_KEYS.map((key, idx) => {
    const score = course[key] as number || 0;
    const weight = weights[key] ?? 1.0;
    const multiplier = multipliers[idx];
    const maxContribution = 10 * weight * multiplier;
    const actualContribution = score * weight * multiplier;
    const percentage = maxContribution > 0 ? (actualContribution / maxContribution) * 100 : 0;
    
    return {
      name: key.replace(' (0-10)', '').replace('(DS/ML/Stats/SQL) ', ''),
      score,
      weight,
      multiplier,
      contribution: actualContribution,
      maxContribution,
      percentage,
    };
  });

  const totalContribution = contributions.reduce((sum, c) => sum + c.contribution, 0);
  const totalMax = contributions.reduce((sum, c) => sum + c.maxContribution, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <Calculator className="w-5 h-5 text-primary" />
          <div className="text-left">
            <h3 className="font-bold text-gray-900">Score Calculator</h3>
            <p className="text-sm text-gray-600">
              See how weights affect scoring in real-time
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          {/* Course selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select a course to analyze:
            </label>
            <select
              value={selectedIdx}
              onChange={(e) => setSelectedIdx(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {courses.slice(0, 50).map((c, idx) => (
                <option key={idx} value={idx}>
                  {c.University} - {c['Course Archetype']} (Final: {c.finalScore.toFixed(2)})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Showing top 50 courses for performance
            </p>
          </div>

          {/* Score breakdown */}
          <div className="bg-white rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-gray-900">Final Calculation</h4>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {course.finalScore.toFixed(2)}
                </div>
                <div className="text-xs text-gray-600">
                  {course.baseScore.toFixed(2)} × {course.countryModifier}
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-700 space-y-1 bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between">
                <span>Sum of weighted scores:</span>
                <span className="font-mono font-semibold">{totalContribution.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Maximum possible:</span>
                <span className="font-mono font-semibold">{totalMax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-300 pt-1 mt-1">
                <span className="font-semibold">Base Score (0-100):</span>
                <span className="font-mono font-bold text-blue-600">
                  {course.baseScore.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Country Modifier ({course.Country}):</span>
                <span className={`font-mono font-bold ${
                  course.countryModifier > 1 ? 'text-green-600' : 
                  course.countryModifier < 1 ? 'text-orange-600' : 
                  'text-gray-700'
                }`}>
                  ×{course.countryModifier}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-300 pt-1 mt-1">
                <span className="font-bold">Final Score:</span>
                <span className="font-mono font-bold text-primary text-lg">
                  {course.finalScore.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Criterion contributions */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 mb-3">
              Criterion Contributions (higher = more impact)
            </h4>
            {contributions.map((c, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">
                      {idx + 1}. {c.name}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-600">
                        Score: {c.score} • Weight: {c.weight.toFixed(1)} • Mult: {c.multiplier}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-bold text-primary">
                      {c.contribution.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      of {c.maxContribution.toFixed(1)}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      c.weight > 1.0 ? 'bg-green-500' :
                      c.weight < 1.0 ? 'bg-orange-400' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs text-yellow-800">
              <strong>💡 How to test:</strong> Adjust any weight slider above and watch this panel update in real-time!
              Try the "Test" button to see extreme changes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

