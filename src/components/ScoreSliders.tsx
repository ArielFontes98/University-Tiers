import { CriteriaScores, CRITERIA_NAMES, CRITERIA_WEIGHTS } from '../types';

interface ScoreSlidersProps {
  scores: CriteriaScores;
  onScoresChange: (scores: CriteriaScores) => void;
}

export function ScoreSliders({ scores, onScoresChange }: ScoreSlidersProps) {
  const handleChange = (key: keyof CriteriaScores, value: number) => {
    onScoresChange({ ...scores, [key]: value });
  };

  const criteriaKeys = Object.keys(CRITERIA_NAMES) as (keyof CriteriaScores)[];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Scoring Criteria</h3>
      {criteriaKeys.map(key => (
        <div key={key} className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor={key} className="text-sm font-medium text-gray-700">
              {CRITERIA_NAMES[key]}
              <span className="text-xs text-gray-500 ml-2">(weight: {CRITERIA_WEIGHTS[key]})</span>
            </label>
            <span className="text-sm font-bold text-primary">{scores[key]}</span>
          </div>
          <input
            id={key}
            type="range"
            min="0"
            max="10"
            step="1"
            value={scores[key]}
            onChange={(e) => handleChange(key, parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={CRITERIA_NAMES[key]}
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>
      ))}
    </div>
  );
}

