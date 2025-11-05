import { FunctionWeights } from '../lib/types';
import { RotateCcw } from 'lucide-react';

interface WeightSlidersProps {
  weights: FunctionWeights;
  onWeightChange: (weights: FunctionWeights) => void;
  onReset: () => void;
}

const WEIGHT_INFO = [
  { key: 'wQ', label: 'Quality', description: 'Course quality/reputation in country', max: 3 },
  { key: 'wS', label: 'Scale', description: 'Cohort size/volume', max: 3 },
  { key: 'wE', label: 'Employability', description: 'Pipeline to data/tech roles', max: 3 },
  { key: 'wG', label: 'GeoFit', description: 'Geographic/strategic fit', max: 2 },
];

export default function WeightSliders({ weights, onWeightChange, onReset }: WeightSlidersProps) {
  const handleSliderChange = (key: keyof FunctionWeights, value: number) => {
    onWeightChange({
      ...weights,
      [key]: value,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Criterion Weights</h3>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
          title="Reset to function defaults"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      <div className="space-y-4">
        {WEIGHT_INFO.map(({ key, label, description }) => {
          const weightKey = key as keyof FunctionWeights;
          const value = weights[weightKey];
          
          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor={key} className="text-sm font-medium text-gray-700">
                  {label}
                  <span className="ml-2 text-xs text-gray-500">({description})</span>
                </label>
                <span className="text-sm font-semibold text-purple-600 min-w-[3rem] text-right">
                  {value.toFixed(1)}
                </span>
              </div>
              <input
                id={key}
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={value}
                onChange={(e) => handleSliderChange(weightKey, parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0.0</span>
                <span>1.0</span>
                <span>2.0</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          Adjust weights to emphasize different criteria. Higher weights mean that criterion 
          has more influence on the final score. Default weights vary by target function (AE, BA, DS/MLE).
        </p>
      </div>
    </div>
  );
}
