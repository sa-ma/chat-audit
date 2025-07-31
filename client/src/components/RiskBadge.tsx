import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface RiskBadgeProps {
  score: number;
  className?: string;
  showIcon?: boolean;
}

export function RiskBadge({ score, className, showIcon = true }: RiskBadgeProps) {
  const getRiskColor = (score: number) => {
    if (score >= 7) return 'destructive';
    if (score >= 4) return 'secondary';
    return 'default';
  };

  const getRiskIcon = (score: number) => {
    if (score >= 7) return <AlertTriangle className='h-4 w-4' />;
    if (score >= 4) return <Clock className='h-4 w-4' />;
    return <CheckCircle className='h-4 w-4' />;
  };

  return (
    <Badge variant={getRiskColor(score)} className={className}>
      {showIcon && getRiskIcon(score)}
      <span className={showIcon ? 'ml-1' : ''}>{score}</span>
    </Badge>
  );
}
