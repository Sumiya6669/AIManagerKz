import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Bot, CalendarCheck, CheckCircle2, CreditCard, DatabaseZap,
  MessageSquare, ShieldCheck, Sparkles, TrendingUp, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { activityFeed, metrics } from '@/data/mockData';
import { cn } from '@/lib/utils';

const leftCards = [
  {
    icon: MessageSquare,
    label: 'AI Dialog',
    title: 'Клиент: Хочу столик на 4 человека сегодня в 20:00',
    text: 'AI: Проверяю доступность...',
    tone: 'primary',
  },
  {
    icon: CalendarCheck,
    label: 'Booking created',
    title: 'Бронь создана',
    text: '4 гостя · 20:00 · Telegram',
    tone: 'green',
  },
  {
    icon: CreditCard,
    label: 'Payment pending',
    title: 'Kaspi предоплата',
    text: '10 000 ₸ · ожидает оплаты',
    tone: 'amber',
  },
];

const rightCards = [
  {
    icon: TrendingUp,
    label: 'Revenue recovered',
    title: '+240 000 ₸',
    text: 'возвращено из неоплаченных броней',
    tone: 'green',
  },
  {
    icon: Bot,
    label: 'AI automation',
    title: '92%',
    text: 'диалогов обработано без оператора',
    tone: 'primary',
  },
  {
    icon: DatabaseZap,
    label: 'Integration sync',
    title: 'iiko sync',
    text: 'бронь отправлена 2 сек назад',
    tone: 'cyan',
  },
];

const featureRows = [
  ['WhatsApp + Telegram', 'AI принимает заявки и отвечает по SLA < 2 сек'],
  ['Kaspi + Halyk', 'Предоплаты, депозиты, статусы и повторные касания'],
  ['iiko + 1C', 'Синхронизация броней, гостей, платежей и логов'],
  ['Multi-tenant SaaS', 'Организации, филиалы, роли, RLS и аудит'],
];

const toneClass = {
  primary: 'border-primary/15 bg-primary/8 text-primary',
  green: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  amber: 'border-amber-100 bg-amber-50 text-amber-700',
  cyan: 'border-cyan-100 bg-cyan-50 text-cyan-700',
};

function FloatingCard({ item, index, side }) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -24 : 24, y: 10 }}
      animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
      transition={{ opacity: { delay: index * 0.12 }, x: { delay: index * 0.12 }, y: { duration: 5 + index, repeat: Infinity, ease: 'easeInOut' } }}
      className="rounded-2xl border border-white/70 bg-white/78 p-4 text-left shadow-premium backdrop-blur-xl"
    >
      <div className="flex items-center gap-2">
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-xl border', toneClass[item.tone])}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{item.label}</span>
      </div>
      <p className="mt-3 text-sm font-bold leading-snug text-slate-950">{item.title}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.text}</p>
    </motion.div>
  );
}

function AnimatedNumber({ value, suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const numeric = Number(value);
    let frame = 0;
    const id = setInterval(() => {
      frame += 1;
      setCount(Math.round((numeric * frame) / 24));
      if (frame >= 24) clearInterval(id);
    }, 35);
    return () => clearInterval(id);
  }, [value]);

  return <>{count}{suffix}</>;
}

function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.25, duration: 0.65 }}
      className="relative mx-auto mt-12 w-full max-w-4xl overflow-hidden rounded-[1.25rem] border border-slate-200/80 bg-white shadow-[0_24px_80px_-36px_rgba(79,70,229,0.65)]"
    >
      <div className="flex items-center justify-between border-b border-border/70 bg-slate-50/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <Badge variant="success" className="gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Live AI Command Center
        </Badge>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[1.35fr_0.9fr]">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {metrics.slice(0, 6).map((metric) => (
              <div key={metric.title} className="rounded-xl border border-border/60 bg-slate-50/60 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{metric.title}</p>
                <p className="mt-2 text-xl font-black text-slate-950">{metric.value}</p>
                <p className="mt-1 text-[10px] text-slate-500">{metric.subtitle}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border/60 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">Realtime conversion</p>
                <p className="text-xs text-muted-foreground">Telegram, WhatsApp, WebChat</p>
              </div>
              <span className="text-xs font-bold text-emerald-600">+18.4%</span>
            </div>
            <div className="mt-5 flex h-28 items-end gap-2">
              {[42, 54, 47, 68, 72, 88, 79, 96, 92, 112, 124, 118].map((height, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height }}
                  transition={{ delay: index * 0.04, duration: 0.5 }}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-primary to-cyan-400"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-slate-950 p-4 text-white">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold">Agent run</p>
            <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-300">RUNNING</span>
          </div>
          <div className="mt-4 space-y-3">
            {activityFeed.slice(0, 5).map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + index * 0.08 }}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold">{item.title}</p>
                  <span className="font-mono text-[10px] text-slate-400">{item.time}</span>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-950">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/60 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-ai-glow-sm">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-black">Reserva Flow AI</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">AI Manager</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
            <a href="#platform" className="hover:text-slate-950">Платформа</a>
            <a href="#workflows" className="hover:text-slate-950">Workflows</a>
            <a href="#deployment" className="hover:text-slate-950">Deployment</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Демо</Button>
            </Link>
            <Link to="/settings">
              <Button size="sm" className="gap-1.5">
                Подключить <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative px-5 pb-20 pt-28 sm:pt-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.24),transparent_34%),radial-gradient(circle_at_18%_18%,rgba(6,182,212,0.16),transparent_25%),linear-gradient(180deg,#fff,rgba(248,250,252,0.7))]" />
          <div className="absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
          <div className="mx-auto grid max-w-7xl items-start gap-6 lg:grid-cols-[260px_1fr_260px]">
            <div className="hidden space-y-4 pt-20 lg:block">
              {leftCards.map((item, index) => <FloatingCard key={item.label} item={item} index={index} side="left" />)}
            </div>

            <div className="text-center">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-3 py-1.5 text-xs font-bold text-primary shadow-sm backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Production-ready AI SaaS для hospitality
                </div>
                <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-[1.02] tracking-tight text-slate-950 sm:text-5xl lg:text-7xl">
                  AI-менеджер, который продаёт, бронирует и принимает оплаты 24/7
                </h1>
                <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                  Автоматизируйте заявки, бронирования, оплаты и коммуникации в WhatsApp, Telegram, iiko и 1С для ресторанов, кафе, рестобаров и гостиниц.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link to="/dashboard">
                    <Button size="lg" className="w-full gap-2 sm:w-auto">
                      <Zap className="h-4 w-4" />
                      Попробовать демо
                    </Button>
                  </Link>
                  <Link to="/settings">
                    <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
                      Запросить подключение
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <div className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-3 text-left">
                {[
                  ['92', '%', 'AI automation'],
                  ['1.8', 's', 'avg response'],
                  ['240', 'k ₸', 'recovered'],
                ].map(([value, suffix, label]) => (
                  <div key={label} className="rounded-xl border border-white/80 bg-white/72 p-3 shadow-sm backdrop-blur">
                    <p className="text-2xl font-black text-slate-950"><AnimatedNumber value={value} suffix={suffix} /></p>
                    <p className="mt-1 text-[11px] font-semibold text-slate-500">{label}</p>
                  </div>
                ))}
              </div>

              <DashboardPreview />
            </div>

            <div className="hidden space-y-4 pt-20 lg:block">
              {rightCards.map((item, index) => <FloatingCard key={item.label} item={item} index={index} side="right" />)}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:hidden">
              {[...leftCards, ...rightCards].map((item, index) => <FloatingCard key={item.label} item={item} index={index} side="left" />)}
            </div>
          </div>
        </section>

        <section id="platform" className="border-y border-border/60 bg-slate-50 px-5 py-16">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Badge variant="outline" className="bg-white">Platform architecture</Badge>
              <h2 className="mt-4 text-3xl font-black tracking-tight">Не админка, а операционная система для AI-продаж</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Платформа готова к multi-tenant SaaS: организации, филиалы, роли, RLS, агентные логи, интеграционные адаптеры и Vercel API endpoints.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {featureRows.map(([title, text]) => (
                <div key={title} className="rounded-xl border border-border/60 bg-white p-5 shadow-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <p className="mt-4 font-bold">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="workflows" className="px-5 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <Badge variant="secondary">AI agent workflows</Badge>
                <h2 className="mt-4 text-3xl font-black tracking-tight">От сообщения до оплаты и синхронизации</h2>
              </div>
              <Link to="/ai-dialogs">
                <Button variant="outline" className="gap-2">Открыть AI Dialogs <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ['Intake + Intent', 'Принимает сообщения, определяет intent и confidence, извлекает дату, гостей и канал.'],
                ['Booking + Payment', 'Проверяет доступность, создает бронь, формирует Kaspi/Halyk/FreedomPay оплату.'],
                ['Integration + Analytics', 'Отправляет бронь в iiko/1C, пишет tool calls и генерирует рекомендации.'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-border/60 bg-white p-6 shadow-card">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <p className="mt-5 text-lg font-black">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="deployment" className="border-t border-border/60 bg-slate-950 px-5 py-14 text-white">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">Ready for Vercel + Supabase + n8n</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight">Разверните SaaS, подключите ключи и замените mock-провайдеры реальными API.</h2>
            </div>
            <Link to="/dashboard">
              <Button size="lg" className="gap-2 bg-white text-slate-950 hover:bg-slate-100">
                Перейти в продукт
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
