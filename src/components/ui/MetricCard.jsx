import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const accents = {
  blue: 'bg-blue-50 text-blue-700',
  green: 'bg-emerald-50 text-emerald-700',
  purple: 'bg-violet-50 text-violet-700',
  amber: 'bg-amber-50 text-amber-700',
  cyan: 'bg-cyan-50 text-cyan-700',
  indigo: 'bg-indigo-50 text-indigo-700',
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUp,
  trendNeutral,
  accent = 'blue',
  loading,
}) {
  if (loading) {
    return <div className="h-32 rounded-xl border border-border/60 bg-white p-4 shadow-card"><div className="h-full rounded-lg shimmer" /></div>;
  }

  const TrendIcon = trendUp ? ArrowUpRight : ArrowDownRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border/60 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-premium"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-foreground">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', accents[accent] || accents.blue)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {trend && (
        <div className={cn('mt-4 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold',
          trendNeutral ? 'bg-slate-50 text-slate-600' : trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
        )}>
          {!trendNeutral && <TrendIcon className="h-3 w-3" />}
          {trend}
        </div>
      )}
    </motion.div>
  );
}
