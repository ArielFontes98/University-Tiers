import { getTierNumber } from '../lib/scoring';

interface TierBadgeProps {
  tier: string;
}

export default function TierBadge({ tier }: TierBadgeProps) {
  const tierNum = getTierNumber(tier);
  
  const styles = {
    0: 'bg-primary text-white font-bold shadow-lg',
    1: 'bg-primary-light text-white font-semibold shadow-md',
    2: 'bg-purple-200 text-primary-dark font-medium',
    3: 'bg-gray-200 text-gray-700',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm ${styles[tierNum as keyof typeof styles]}`}>
      {tier}
    </span>
  );
}
