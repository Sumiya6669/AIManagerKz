import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { MessageSquare, Calendar, CreditCard, Bot, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const FEED_ITEMS = [
  { id: 1, icon: Bot, type: 'ai', text: 'AI обработал запрос Айдос Нурланов', sub: 'Бронирование подтверждено автоматически', time: '14:07', color: 'text-primary', bg: 'bg-primary/8' },
  { id: 2, icon: CreditCard, type: 'payment', text: 'Kaspi оплата 15 000 ₸', sub: 'Камила Сериков · депозит принят', time: '14:06', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 3, icon: Calendar, type: 'booking', text: 'Новая бронь: Ерлан Жумабеков', sub: 'Сб 19:30 · 3 гостя · VIP зона', time: '14:04', color: 'text-violet-600', bg: 'bg-violet-50' },
  { id: 4, icon: AlertTriangle, type: 'alert', text: 'Эскалация к оператору', sub: 'Камила Сериков · банкет 30 чел.', time: '14:03', color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 5, icon: MessageSquare, type: 'message', text: 'Новый диалог WhatsApp', sub: 'Гость спрашивает о меню', time: '13:58', color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 6, icon: CheckCircle, type: 'booking', text: 'Бронь Динара Касымова завершена', sub: '4 гостя · столик №7 · VIP', time: '13:45', color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

export default function ActivityFeed() {
  const [items, setItems] = useState(FEED_ITEMS);

  return (
    <div className="bg-white rounded-xl border border-border/60 shadow-card overflow-hidden h-full flex flex-col">
      <div className="px-5 py-3.5 border-b border-border/60 flex items-center justify-between flex-shrink-0">
        <span className="text-sm font-semibold">Activity Feed</span>
        <div className="text-[10px] text-muted-foreground">Последние события</div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[30px] top-0 bottom-0 w-px bg-border/60" />

          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-start gap-3 px-4 py-3 hover:bg-muted/20 transition-colors relative"
            >
              <div className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 relative z-10 border-2 border-white",
                item.bg
              )}>
                <item.icon className={cn("w-3.5 h-3.5", item.color)} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-xs font-medium">{item.text}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{item.sub}</p>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono flex-shrink-0 pt-0.5">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}