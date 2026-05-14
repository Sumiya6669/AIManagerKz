import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Bot, Zap, AlertTriangle, CreditCard, RefreshCw, TrendingUp, MessageSquare, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

const INITIAL_TASKS = [
  {
    id: 1, type: 'ai_responding', icon: MessageSquare,
    text: 'AI отвечает клиенту в Telegram',
    detail: 'Камила Сериков — бронирование банкета',
    status: 'active', color: 'text-primary', bg: 'bg-primary/8', dot: 'bg-primary'
  },
  {
    id: 2, type: 'payment_pending', icon: CreditCard,
    text: 'Kaspi: ожидаем оплату 10 000 ₸',
    detail: 'Камила Сериков — депозит',
    status: 'warning', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500'
  },
  {
    id: 3, type: 'escalation', icon: AlertTriangle,
    text: 'Клиент запросил оператора',
    detail: 'Камила Сериков — банкет на 30 чел.',
    status: 'alert', color: 'text-destructive', bg: 'bg-red-50', dot: 'bg-red-500'
  },
  {
    id: 4, type: 'booking_created', icon: Calendar,
    text: 'Бронь создана автоматически',
    detail: 'Айдос Нурланов — пт 20:00, 4 гостя',
    status: 'success', color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500'
  },
  {
    id: 5, type: 'iiko_sync', icon: RefreshCw,
    text: 'iiko синхронизация',
    detail: '142 записи · 12 сек назад',
    status: 'success', color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500'
  },
];

const RECOMMENDATIONS = [
  { icon: TrendingUp, text: 'Включите депозиты в пятницу вечером — конверсия +23%', type: 'insight' },
  { icon: Bot, text: 'AI обработал 94% диалогов без оператора сегодня', type: 'performance' },
  { icon: CreditCard, text: 'Потенциальная выручка из неоплаченных броней: 45 000 ₸', type: 'revenue' },
];

export default function AICommandCenter() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTicker(t => t + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-border/60 shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border-2 border-white" />
          </div>
          <span className="text-sm font-semibold">AI Command Center</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          LIVE
        </div>
      </div>

      {/* Active Tasks */}
      <div className="divide-y divide-border/40">
        {tasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "flex items-start gap-3 px-5 py-3 hover:bg-muted/20 transition-colors cursor-pointer",
            )}
          >
            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", task.bg)}>
              <task.icon className={cn("w-3.5 h-3.5", task.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium leading-snug text-foreground">{task.text}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{task.detail}</p>
            </div>
            <div className="flex-shrink-0 mt-1">
              <div className="relative">
                <div className={cn("w-1.5 h-1.5 rounded-full", task.dot)} />
                {(task.status === 'active' || task.status === 'warning' || task.status === 'alert') && (
                  <div className={cn("absolute inset-0 rounded-full animate-ping opacity-60", task.dot)} />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Recommendations */}
      <div className="border-t border-border/60 bg-muted/20 px-5 py-3">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">AI Рекомендации</p>
        <div className="space-y-2">
          {RECOMMENDATIONS.map((r, i) => (
            <div key={i} className="flex items-start gap-2">
              <r.icon className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-muted-foreground leading-snug">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}