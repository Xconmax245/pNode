import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export default function NodeHealthBadge({ status }: { status: string }) {
  const mapping: Record<string, { label: string; classes: string; icon: React.ReactNode }> = {
    healthy: { 
      label: 'Healthy', 
      classes: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: <CheckCircle size={12} />
    },
    degraded: { 
      label: 'Degraded', 
      classes: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: <AlertCircle size={12} />
    },
    down: { 
      label: 'Down', 
      classes: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
      icon: <XCircle size={12} />
    },
  };

  const m = mapping[status] ?? { 
    label: 'Unknown', 
    classes: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
    icon: null 
  };

  return (
    <Badge variant="outline" className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium border ${m.classes}`}>
      {m.icon}
      {m.label}
    </Badge>
  );
}
