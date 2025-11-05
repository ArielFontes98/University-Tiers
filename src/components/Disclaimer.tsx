import { AlertCircle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900">
          <p className="font-semibold mb-1">Heuristic Scores – For Simulation Only</p>
          <p className="text-amber-800">
            These scores are based on public proxies (course quality, cohort size, employability, geography) 
            and are intended for prioritization experiments only. They will be refined with internal 
            performance data and more accurate metrics (MEC/ENADE rankings, national indices, LinkedIn patterns, 
            Nubank pipeline data) when available.
          </p>
        </div>
      </div>
    </div>
  );
}
