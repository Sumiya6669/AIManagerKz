import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const HOURS = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
const BOOKINGS_DATA = [2, 3, 1, 4, 6, 5, 3, 7, 12, 15, 18, 14, 10, 6];
const CURRENT_HOUR = new Date().getHours();

export default function RealtimePulse() {
  const [tick, setTick] = useState(0);
  const maxVal = Math.max(...BOOKINGS_DATA);

  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-border/60 shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold">Загруженность по часам</p>
          <p className="text-xs text-muted-foreground mt-0.5">Сегодня · прогноз AI</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-primary bg-primary/8 px-2 py-1 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Realtime
        </div>
      </div>
      <div className="flex items-end gap-1 h-16">
        {HOURS.map((hour, i) => {
          const val = BOOKINGS_DATA[i] || 0;
          const height = Math.max(8, (val / maxVal) * 100);
          const isCurrentHour = parseInt(hour) === CURRENT_HOUR;
          const isPast = parseInt(hour) < CURRENT_HOUR;

          return (
            <div key={hour} className="flex-1 flex flex-col items-center gap-1 group cursor-default">
              <div className="relative w-full flex items-end justify-center" style={{ height: 56 }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: i * 0.02, duration: 0.4, ease: 'easeOut' }}
                  className={cn(
                    "w-full rounded-sm transition-colors",
                    isCurrentHour ? "bg-primary" :
                    isPast ? "bg-muted-foreground/20" :
                    "bg-primary/20 group-hover:bg-primary/35"
                  )}
                />
                {isCurrentHour && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-0 w-full rounded-sm bg-primary/30"
                    style={{ height: `${height}%` }}
                  />
                )}
              </div>
              {(i % 3 === 0 || isCurrentHour) && (
                <span className={cn(
                  "text-[9px] font-mono",
                  isCurrentHour ? "text-primary font-bold" : "text-muted-foreground/60"
                )}>
                  {hour}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
            <span className="text-[10px] text-muted-foreground">Текущий час</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-primary/20" />
            <span className="text-[10px] text-muted-foreground">Прогноз</span>
          </div>
        </div>
        <span className="text-[10px] text-muted-foreground font-medium">Пик: 19:00–21:00</span>
      </div>
    </div>
  );
}