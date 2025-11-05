import { Info } from 'lucide-react';
import { CRITERIA_INFO } from '../lib/scoring';

export default function CriteriaInfo() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">About the Scoring Criteria</h3>
      </div>
      
      <div className="space-y-4">
        {Object.entries(CRITERIA_INFO).map(([key, info]) => (
          <div key={key} className="border-l-4 border-purple-200 pl-4">
            <h4 className="font-semibold text-gray-900 mb-1">{info.name}</h4>
            <p className="text-sm text-gray-600 mb-2 italic">{info.question}</p>
            <ul className="text-sm text-gray-700 space-y-1">
              {info.scale.map((item, idx) => (
                <li key={idx} className="ml-2">• {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> These criteria are currently scored heuristically based on public information. 
          Future versions will incorporate real data from MEC/ENADE rankings, LinkedIn employment patterns, 
          and internal Nubank pipeline performance.
        </p>
      </div>
    </div>
  );
}
