import { CheckCircle } from 'lucide-react';
import { Tier } from '../types';
import { getTierInfo } from '../utils/scoring';

interface ActivationPlaybookProps {
  tier: Tier;
}

export function ActivationPlaybook({ tier }: ActivationPlaybookProps) {
  const tierInfo = getTierInfo(tier);

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Activation Playbook</h3>
      <div className={`inline-block px-3 py-1 rounded-lg text-sm font-medium mb-4 ${tierInfo.bgColor} ${tierInfo.color}`}>
        {tierInfo.name}
      </div>
      <ul className="space-y-2">
        {tierInfo.playbook.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

