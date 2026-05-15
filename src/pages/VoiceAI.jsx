import React, { useState } from 'react';
import { Bot, Mic, Phone, PhoneMissed, Play, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MetricCard from '@/components/ui/MetricCard';
import AIStatusBadge from '@/components/ui/AIStatusBadge';
import { callLog } from '@/data/mockData';
import { cn } from '@/lib/utils';

const statusVariant = {
  completed: 'success',
  escalated: 'warning',
  missed: 'danger',
};

const transcript = [
  ['ai', 'Здравствуйте! Это Altyn Center. Я Алина, AI-администратор. Чем могу помочь?'],
  ['customer', 'Хочу забронировать столик на пятницу вечером.'],
  ['ai', 'Конечно. На сколько гостей и какое время вам удобно?'],
  ['customer', 'На четверых, к 20:00.'],
  ['ai', 'Есть VIP-стол на 20:00. Я отправлю Kaspi предоплату и подтвержу бронь после оплаты.'],
];

export default function VoiceAI() {
  const [selected, setSelected] = useState(callLog[0]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <Badge variant="secondary">Voice AI</Badge>
          <h1 className="mt-3 text-2xl font-black tracking-tight">AI телефонный ресепшн</h1>
          <p className="mt-1 text-sm text-muted-foreground">Звонки, транскрипты, intent detection и эскалация оператору.</p>
        </div>
        <AIStatusBadge status="active" size="md" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Звонков сегодня" value={callLog.length} subtitle="входящие" icon={Phone} />
        <MetricCard title="AI обработал" value="80%" subtitle="без оператора" icon={Bot} accent="purple" trend="+9%" trendUp />
        <MetricCard title="Средняя длительность" value="2:08" subtitle="по завершенным" icon={Mic} accent="cyan" />
        <MetricCard title="Пропущено" value={callLog.filter((call) => call.status === 'missed').length} subtitle="callback queued" icon={PhoneMissed} accent="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="overflow-hidden rounded-xl border border-border/60 bg-white shadow-card">
          <div className="border-b border-border/60 px-5 py-4">
            <p className="text-sm font-bold">Call log</p>
            <p className="mt-1 text-xs text-muted-foreground">Сегодня · live transcription ready</p>
          </div>
          {callLog.map((call) => (
            <button
              key={call.id}
              onClick={() => setSelected(call)}
              className={cn('w-full border-b border-border/40 p-4 text-left transition hover:bg-muted/30', selected.id === call.id && 'bg-primary/5 shadow-[inset_3px_0_0_hsl(var(--primary))]')}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-primary">
                  {call.status === 'missed' ? <PhoneMissed className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-bold">{call.name}</p>
                    <Badge variant={statusVariant[call.status]}>{call.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{call.phone} · {call.duration}</p>
                  <p className="mt-1 text-xs font-semibold text-primary">{call.outcome}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-white p-5 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-cyan-50 text-primary">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-base font-black">{selected.name}</p>
                  <p className="text-sm text-muted-foreground">{selected.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={statusVariant[selected.status]}>{selected.status}</Badge>
                {selected.confidence > 0 && <p className="mt-1 text-xs text-muted-foreground">confidence {selected.confidence}%</p>}
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-primary/10 bg-primary/5 p-3 text-sm leading-6 text-slate-700">
              Итог: {selected.outcome}. Запись сохранена в ai_agent_runs и готова для аналитики.
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border/60 bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
              <div>
                <p className="text-sm font-bold">Transcript</p>
                <p className="mt-1 text-xs text-muted-foreground">Mock STT transcript</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Play className="h-3.5 w-3.5" />
                Play
              </Button>
            </div>
            <div className="space-y-3 p-5">
              {transcript.map(([role, text], index) => (
                <div key={index} className={cn('flex gap-3', role === 'customer' && 'justify-end')}>
                  {role === 'ai' && <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/8 text-primary"><Bot className="h-4 w-4" /></div>}
                  <div className={cn('max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6', role === 'ai' ? 'border border-border/60 bg-white' : 'bg-primary text-white')}>
                    {text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
