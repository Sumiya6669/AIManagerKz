import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const types = {
  insight: { icon: Sparkles, color: 'text-primary', bg: 'bg-primary/8', border: 'border-primary/15' },
  revenue: { icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  alert: { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  tip: { icon: Lightbulb, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
};

export default function AIInsightCard({ title, value, description, type = 'insight', cta, delay = 0 }) {
  const config = types[type] || types.insight;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        "bg-white rounded-xl border shadow-card p-4 hover:shadow-premium transition-all duration-200",
        config.border
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", config.bg)}>
          <Icon className={cn("w-4 h-4", config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
          {value && <p className={cn("text-xl font-bold mt-0.5", config.color)}>{value}</p>}
          <p className="text-xs text-muted-foreground mt-1 leading-snug">{description}</p>
          {cta && (
            <button className={cn("text-xs font-medium mt-2 hover:underline", config.color)}>{cta} →</button>
          )}
        </div>
      </div>
    </motion.div>
  );
}