import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, Bot, CalendarCheck, Clock, CreditCard,
  DatabaseZap, MessageSquare, RefreshCw, Sparkles, TrendingUp, Zap
} from 'lucide-react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import MetricCard from '@/components/ui/MetricCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { activityFeed, metrics, reservations, toolTimeline } from '@/data/mockData';
import { cn } from '@/lib/utils';

const commandTasks = [
  { icon: MessageSquare, title: 'Текущие диалоги', value: '18', text: '12 ведет AI, 4 ждут оплату, 2 у оператора', tone: 'primary' },
  { icon: CreditCard, title: 'Pending payments', value: '64 000 ₸', text: 'AI отправляет повторные напоминания', tone: 'amber' },
  { icon: AlertTriangle, title: 'Escalation alerts', value: '2', text: 'Банкет и жалоба требуют менеджера', tone: 'red' },
  { icon: DatabaseZap, title: 'Integration status', value: '99.7%', text: 'iiko healthy · 1C mock · n8n ready', tone: 'green' },
];

const insights = [
  'AI обработал 92% диалогов без оператора.',
  '4 клиента не завершили оплату. Рекомендуется повторный touch через WhatsApp.',
  'WhatsApp дает лучшую конверсию: +34% к Telegram.',
  'AI рекомендует включить депозит в пятницу вечером с 19:00 до 22:00.',
];

const revenueData = [
  { day: 'Пн', bookings: 18, revenue: 210000 },
  { day: 'Вт', bookings: 22, revenue: 280000 },
  { day: 'Ср', bookings: 19, revenue: 240000 },
  { day: 'Чт', bookings: 38, revenue: 824000 },
  { day: 'Пт', bookings: 52, revenue: 1120000 },
  { day: 'Сб', bookings: 61, revenue: 1340000 },
  { day: 'Вс', bookings: 44, revenue: 930000 },
];

const intentData = [
  { intent: 'booking', value: 64 },
  { intent: 'payment', value: 18 },
  { intent: 'menu', value: 12 },
  { intent: 'human', value: 6 },
];

const toneClasses = {
  primary: 'bg-primary/8 text-primary border-primary/15',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  red: 'bg-red-50 text-red-700 border-red-100',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/60 bg-white p-3 text-xs shadow-premium">
      <p className="font-bold">{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} className="mt-1 font-semibold" style={{ color: item.color }}>
          {item.name}: {item.dataKey === 'revenue' ? `${item.value.toLocaleString()} ₸` : item.value}
        </p>
      ))}
    </div>
  );
}

function CommandTask({ task, index }) {
  const Icon = task.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl border border-border/60 bg-white p-4 shadow-card"
    >
      <div className="flex items-start gap-3">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl border', toneClasses[task.tone])}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{task.title}</p>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-black">{task.value}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{task.text}</p>
        </div>
      </div>
    </motion.div>
  );
}

function ActivityItem({ item, index }) {
  const icons = {
    intent: Bot,
    booking: CalendarCheck,
    payment: CreditCard,
    sync: RefreshCw,
    alert: AlertTriangle,
    upsell: TrendingUp,
  };
  const Icon = icons[item.type] || Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative flex gap-3 rounded-xl p-3 transition hover:bg-muted/40"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold">{item.title}</p>
          <span className="font-mono text-[10px] text-muted-foreground">{item.time}</span>
        </div>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.text}</p>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success" className="gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Realtime
            </Badge>
            <Badge variant="outline">Altyn Center</Badge>
            <Badge variant="outline">Business plan</Badge>
          </div>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-foreground">AI Command Center</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Единый центр управления диалогами, бронями, оплатами, эскалациями и интеграциями.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Clock className="h-4 w-4" />
            Live logs
          </Button>
          <Button className="gap-2">
            <Zap className="h-4 w-4" />
            Запустить AI task
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {metrics.map((metric, index) => (
          <div key={metric.title} className="xl:col-span-1">
            <MetricCard
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
              trend={metric.trend}
              trendUp={!metric.trend?.startsWith('-')}
              accent={metric.accent}
              icon={[CalendarCheck, CreditCard, Bot, Clock, AlertTriangle, Zap][index]}
            />
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {commandTasks.map((task, index) => <CommandTask key={task.title} task={task} index={index} />)}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-xl border border-border/60 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">Business metrics</p>
              <p className="text-xs text-muted-foreground">Брони и выручка по дням недели</p>
            </div>
            <Badge variant="secondary">AI forecast</Badge>
          </div>
          <div className="mt-5 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(243,75%,59%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(243,75%,59%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,8%,93%)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(240,8%,52%)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(240,8%,52%)' }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Выручка" stroke="hsl(243,75%,59%)" strokeWidth={2} fill="url(#revenue)" />
                <Bar dataKey="bookings" name="Брони" fill="hsl(171,72%,44%)" radius={[4, 4, 0, 0]} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">Intent mix</p>
              <p className="text-xs text-muted-foreground">Последние 24 часа</p>
            </div>
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-5 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intentData} layout="vertical" margin={{ left: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,8%,93%)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="intent" type="category" width={72} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(240,8%,52%)' }} />
                <Tooltip cursor={{ fill: 'hsl(240,12%,96%)' }} />
                <Bar dataKey="value" fill="hsl(243,75%,59%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr_0.9fr]">
        <div className="rounded-xl border border-border/60 bg-white p-5 shadow-card">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="text-sm font-bold">AI Insights</p>
          </div>
          <div className="mt-4 space-y-3">
            {insights.map((insight) => (
              <div key={insight} className="rounded-xl border border-primary/10 bg-primary/5 p-3">
                <p className="text-xs leading-5 text-slate-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold">Realtime activity feed</p>
            <Badge variant="success">LIVE</Badge>
          </div>
          <div className="mt-3 divide-y divide-border/50">
            {activityFeed.map((item, index) => <ActivityItem key={item.title} item={item} index={index} />)}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold">AI tool calls</p>
            <Badge variant="outline">audit trail</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {toolTimeline.map((tool) => (
              <div key={tool.name} className="rounded-xl border border-border/60 bg-slate-50/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-xs font-bold">{tool.name}</p>
                  <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold',
                    tool.status === 'success' ? 'bg-emerald-50 text-emerald-700' :
                    tool.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                    'bg-slate-100 text-slate-600'
                  )}>{tool.status}</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{tool.payload} · {tool.latency}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <div>
            <p className="text-sm font-bold">Сегодняшние брони</p>
            <p className="text-xs text-muted-foreground">Контроль статусов и оплат</p>
          </div>
          <Button variant="outline" size="sm">Все брони</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr>
                {['ID', 'Клиент', 'Дата / время', 'Гости', 'Статус', 'Оплата', 'Канал'].map((head) => (
                  <th key={head} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="border-t border-border/40 hover:bg-muted/20">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{reservation.id}</td>
                  <td className="px-5 py-3 text-sm font-semibold">{reservation.customer}</td>
                  <td className="px-5 py-3 text-xs">{reservation.date} · {reservation.time}</td>
                  <td className="px-5 py-3 text-xs">{reservation.guests}</td>
                  <td className="px-5 py-3"><Badge variant={reservation.status === 'confirmed' ? 'success' : reservation.status === 'pending_payment' ? 'warning' : 'outline'}>{reservation.status}</Badge></td>
                  <td className="px-5 py-3"><Badge variant={reservation.payment === 'paid' ? 'success' : reservation.payment === 'pending' ? 'warning' : 'secondary'}>{reservation.payment}</Badge></td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{reservation.channel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
