import { Tier } from '../types';
import { getTierInfo } from '../utils/scoring';

interface TierBadgeProps {
  tier: Tier;
  finalScore: number;
}

export function TierBadge({ tier, finalScore }: TierBadgeProps) {
  const tierInfo = getTierInfo(tier);
  
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${tierInfo.bgColor} ${tierInfo.color}`}>
      <span className="text-xl font-bold">{finalScore.toFixed(1)}</span>
      <span>•</span>
      <span>{tierInfo.name}</span>
    </div>
  );
}

