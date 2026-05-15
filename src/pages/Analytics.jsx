import React from 'react';
import { Bot, CalendarCheck, CreditCard, Sparkles, Target, TrendingUp } from 'lucide-react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import MetricCard from '@/components/ui/MetricCard';

const revenueTrend = [
  { week: 'Нед 1', revenue: 225000, bookings: 45, ai: 88 },
  { week: 'Нед 2', revenue: 310000, bookings: 52, ai: 90 },
  { week: 'Нед 3', revenue: 385000, bookings: 61, ai: 92 },
  { week: 'Нед 4', revenue: 428000, bookings: 68, ai: 94 },
];

const channels = [
  { name: 'WhatsApp', value: 42, color: '#10b981' },
  { name: 'Telegram', value: 31, color: '#6366f1' },
  { name: 'WebChat', value: 17, color: '#06b6d4' },
  { name: 'Phone', value: 10, color: '#f59e0b' },
];

const hours = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'].map((hour, index) => ({
  hour,
  bookings: [2, 3, 1, 4, 6, 5, 3, 7, 12, 15, 18, 14, 10][index],
}));

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Badge variant="secondary">AI Analytics</Badge>
        <h1 className="mt-3 text-2xl font-black tracking-tight">Аналитика</h1>
        <p className="mt-1 text-sm text-muted-foreground">Выручка, конверсия, каналы, автоматизация и рекомендации AI.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Выручка месяца" value="1 348 000 ₸" subtitle="+23% месяц к месяцу" icon={CreditCard} accent="green" trend="+23%" trendUp />
        <MetricCard title="AI automation" value="94%" subtitle="диалогов без оператора" icon={Bot} accent="purple" trend="+6%" trendUp />
        <MetricCard title="Booking conversion" value="71%" subtitle="заявка -> бронь" icon={Target} trend="+5%" trendUp />
        <MetricCard title="Брони" value="226" subtitle="за 4 недели" icon={CalendarCheck} accent="cyan" trend="+18%" trendUp />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-xl border border-border/60 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">Revenue trend</p>
              <p className="text-xs text-muted-foreground">Недельная динамика выручки и броней</p>
            </div>
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-5 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="analyticsRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,8%,93%)" vertical={false} />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(240,8%,52%)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(240,8%,52%)' }} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#analyticsRevenue)" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-white p-5 shadow-card">
          <p className="text-sm font-bold">Каналы бронирования</p>
          <p className="mt-1 text-xs text-muted-foreground">Доля подтвержденных броней</p>
          <div className="mt-5 h-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={channels} dataKey="value" cx="50%" cy="50%" innerRadius={52} outerRadius={86} paddingAngle={3}>
                  {channels.map((channel) => <Cell key={channel.name} fill={channel.color} />)}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {channels.map((channel) => (
              <div key={channel.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: channel.color }} />
                  {channel.name}
                </span>
                <span className="font-bold">{channel.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-white p-5 shadow-card">
          <p className="text-sm font-bold">Загрузка по часам</p>
          <p className="mt-1 text-xs text-muted-foreground">AI прогнозирует пики 19:00-21:00</p>
          <div className="mt-5 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hours}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,8%,93%)" vertical={false} />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(240,8%,52%)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(240,8%,52%)' }} />
                <Tooltip />
                <Bar dataKey="bookings" fill="#6366f1" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-white p-5 shadow-card">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <p className="text-sm font-bold">AI recommendations</p>
          </div>
          <div className="mt-4 space-y-3">
            {[
              'Включить обязательный депозит в пятницу и субботу после 19:00.',
              'Перенести больше трафика в WhatsApp: конверсия выше на 34%.',
              'Автоматизировать callback для пропущенных звонков через Voice AI.',
              'Добавить upsell десертного сета для VIP-гостей после подтверждения оплаты.',
            ].map((item) => (
              <div key={item} className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
