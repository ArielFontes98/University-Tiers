import { Weights } from '../lib/types';
import { CRITERION_KEYS } from '../lib/scoring';

interface WeightSlidersProps {
  weights: Weights;
  onWeightsChange: (weights: Weights) => void;
}

export default function WeightSliders({ weights, onWeightsChange }: WeightSlidersProps) {
  const handleWeightChange = (key: string, value: number) => {
    onWeightsChange({ ...weights, [key]: value });
  };

  const resetWeights = () => {
    const defaultWeights: Weights = {};
    CRITERION_KEYS.forEach(key => {
      defaultWeights[key] = 1.0;
    });
    onWeightsChange(defaultWeights);
  };

  const getShortName = (key: string) => {
    return key
      .replace(' (0-10)', '')
      .replace('(DS/ML/Stats/SQL) ', '')
      .replace('D&I', 'D&I');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Criterion Weights</h2>
        <button
          onClick={resetWeights}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition"
          aria-label="Reset all weights to 1.0"
        >
          Reset
        </button>
      </div>

      <div className="space-y-5">
        {CRITERION_KEYS.map((key, idx) => {
          const weight = weights[key] ?? 1.0;
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor={`weight-${idx}`}
                  className="text-sm font-medium text-gray-700"
                >
                  {idx + 1}. {getShortName(key)}
                </label>
                <span className="text-sm font-bold text-primary">
                  {weight.toFixed(1)}
                </span>
              </div>
              <input
                id={`weight-${idx}`}
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={weight}
                onChange={(e) => handleWeightChange(key, parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={`Weight for ${getShortName(key)}`}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.0</span>
                <span>1.0</span>
                <span>2.0</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

