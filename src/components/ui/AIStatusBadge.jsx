import { cn } from '@/lib/utils';

const config = {
  active: 'border-primary/20 bg-primary/8 text-primary',
  waiting: 'border-amber-100 bg-amber-50 text-amber-700',
  escalation: 'border-red-100 bg-red-50 text-red-700',
  completed: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  mock: 'border-slate-200 bg-slate-50 text-slate-600',
};

const labels = {
  active: 'AI Active',
  waiting: 'Waiting',
  escalation: 'Escalation',
  completed: 'Closed',
  mock: 'Mock',
};

export default function AIStatusBadge({ status = 'active', size = 'sm', className }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border font-semibold',
      size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[10px]',
      config[status] || config.mock,
      className
    )}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status] || status}
    </span>
  );
}
