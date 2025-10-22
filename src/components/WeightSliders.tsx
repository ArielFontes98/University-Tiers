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

  const testExtremes = () => {
    const extremeWeights: Weights = {};
    CRITERION_KEYS.forEach((key, idx) => {
      // Alternate between 0 and 2 to show clear impact
      extremeWeights[key] = idx % 2 === 0 ? 2.0 : 0.0;
    });
    onWeightsChange(extremeWeights);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Criterion Weights</h2>
        <div className="flex gap-2">
          <button
            onClick={testExtremes}
            className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-primary rounded-lg text-xs font-medium transition"
            aria-label="Test with extreme weights"
            title="Set alternating extreme weights to test impact"
          >
            Test
          </button>
          <button
            onClick={resetWeights}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition"
            aria-label="Reset all weights to 1.0"
          >
            Reset
          </button>
        </div>
      </div>
      
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          💡 <strong>Tip:</strong> Adjust weights to prioritize different criteria. 
          Higher values (2.0) amplify importance; lower values (0.0) minimize it.
        </p>
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
                <span className={`text-sm font-bold transition-all ${
                  weight === 1.0 ? 'text-gray-600' :
                  weight > 1.0 ? 'text-green-600' :
                  'text-orange-600'
                }`}>
                  {weight.toFixed(1)}
                  {weight !== 1.0 && (
                    <span className="text-xs ml-1">
                      {weight > 1.0 ? '↑' : '↓'}
                    </span>
                  )}
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

