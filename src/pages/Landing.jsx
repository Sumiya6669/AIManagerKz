import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Bot, CalendarCheck, CheckCircle2, CreditCard, DatabaseZap,
  MessageSquare, ShieldCheck, Sparkles, TrendingUp, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useI18n } from '@/i18n';
import { activityFeed, metrics } from '@/data/mockData';
import { cn } from '@/lib/utils';

const toneClass = {
  primary: 'border-primary/15 bg-primary/8 text-primary',
  green: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  amber: 'border-amber-100 bg-amber-50 text-amber-700',
  cyan: 'border-cyan-100 bg-cyan-50 text-cyan-700',
};

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

function ShowcaseItem({ icon: Icon, label, title, text, tone = 'primary', index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.18 + index * 0.07 }}
      className="rounded-2xl border border-white/55 bg-white/72 p-4 shadow-sm backdrop-blur-xl"
    >
      <div className="flex items-start gap-3">
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border', toneClass[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</span>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          </div>
          <p className="mt-2 text-sm font-black leading-snug text-slate-950">{title}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
        </div>
      </div>
    </motion.div>
  );
}

function PremiumShowcase() {
  const { t } = useI18n();
  const items = [
    { icon: MessageSquare, label: t('showcase.aiDialog'), title: t('showcase.clientText'), text: t('showcase.aiText'), tone: 'primary' },
    { icon: CalendarCheck, label: t('showcase.bookingCreated'), title: t('showcase.bookingCreated'), text: t('showcase.bookingMeta'), tone: 'green' },
    { icon: CreditCard, label: t('showcase.paymentPending'), title: t('showcase.paymentPending'), text: t('showcase.paymentMeta'), tone: 'amber' },
    { icon: TrendingUp, label: 'Revenue', title: t('showcase.revenueRecovered'), text: t('showcase.revenueMeta'), tone: 'green' },
    { icon: Bot, label: 'Automation', title: t('showcase.automation'), text: t('showcase.automationMeta'), tone: 'primary' },
    { icon: DatabaseZap, label: 'Integration', title: t('showcase.sync'), text: t('showcase.syncMeta'), tone: 'cyan' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65 }}
      className="relative"
    >
      <div className="absolute -inset-8 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_30%_10%,rgba(99,102,241,0.35),transparent_34%),radial-gradient(circle_at_90%_20%,rgba(6,182,212,0.28),transparent_30%),linear-gradient(135deg,rgba(99,102,241,0.14),rgba(14,165,233,0.1))] blur-2xl" />
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/55 p-4 shadow-[0_32px_100px_-42px_rgba(79,70,229,0.9)] backdrop-blur-2xl">
        <div className="absolute inset-0 -z-10 rounded-[1.75rem] bg-gradient-to-br from-white/75 via-indigo-50/60 to-cyan-50/60" />
        <div className="rounded-[1.35rem] border border-white/70 bg-slate-950 p-4 text-white shadow-inner">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black">{t('landing.showcaseTitle')}</p>
              <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">{t('landing.showcaseSubtitle')}</p>
            </div>
            <Badge variant="success" className="gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {t('common.live')}
            </Badge>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              ['92', '%', 'AI'],
              ['1.8', 's', 'SLA'],
              ['240', 'k ₸', 'Revenue'],
            ].map(([value, suffix, label]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-2xl font-black"><AnimatedNumber value={value} suffix={suffix} /></p>
                <p className="mt-1 text-[10px] font-semibold text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          {items.map((item, index) => <ShowcaseItem key={item.label + index} {...item} index={index} />)}
        </div>
      </div>
    </motion.div>
  );
}

function DashboardPreview() {
  return (
    <div className="rounded-2xl border border-border/60 bg-white p-4 shadow-card">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {metrics.slice(0, 6).map((metric) => (
          <div key={metric.title} className="rounded-xl border border-border/60 bg-slate-50/70 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{metric.title}</p>
            <p className="mt-2 text-xl font-black text-slate-950">{metric.value}</p>
            <p className="mt-1 text-[10px] text-slate-500">{metric.subtitle}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-border/60 bg-slate-950 p-4 text-white">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">Realtime activity</p>
          <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-300">RUNNING</span>
        </div>
        <div className="mt-4 space-y-2">
          {activityFeed.slice(0, 4).map((item) => (
            <div key={item.title} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold">{item.title}</p>
                <span className="font-mono text-[10px] text-slate-400">{item.time}</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const { t } = useI18n();

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
            <a href="#platform" className="hover:text-slate-950">Platform</a>
            <a href="#workflows" className="hover:text-slate-950">Workflows</a>
            <a href="#deployment" className="hover:text-slate-950">Deployment</a>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher compact />
            <Link to="/login">
              <Button variant="ghost" size="sm">{t('auth.login')}</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="gap-1.5">
                {t('common.connect')} <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative px-5 pb-20 pt-28 sm:pt-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(99,102,241,0.22),transparent_30%),radial-gradient(circle_at_80%_8%,rgba(6,182,212,0.18),transparent_28%),linear-gradient(180deg,#fff,rgba(248,250,252,0.82))]" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.98fr_1.02fr]">
            <div className="text-left">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-3 py-1.5 text-xs font-bold text-primary shadow-sm backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  {t('landing.badge')}
                </div>
                <h1 className="mt-7 max-w-4xl text-4xl font-black leading-[1.02] tracking-tight text-slate-950 sm:text-5xl lg:text-7xl">
                  {t('landing.headline')}
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  {t('landing.subtitle')}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to="/dashboard">
                    <Button size="lg" className="w-full gap-2 sm:w-auto">
                      <Zap className="h-4 w-4" />
                      {t('landing.primaryCta')}
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
                      {t('landing.secondaryCta')}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
                  {[
                    ['92', '%', 'automation'],
                    ['1.8', 's', 'response'],
                    ['240', 'k ₸', 'recovered'],
                  ].map(([value, suffix, label]) => (
                    <div key={label} className="rounded-xl border border-white/80 bg-white/72 p-3 shadow-sm backdrop-blur">
                      <p className="text-2xl font-black text-slate-950"><AnimatedNumber value={value} suffix={suffix} /></p>
                      <p className="mt-1 text-[11px] font-semibold text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <PremiumShowcase />
          </div>
        </section>

        <section className="px-5 pb-16">
          <div className="mx-auto max-w-7xl">
            <DashboardPreview />
          </div>
        </section>

        <section id="platform" className="border-y border-border/60 bg-slate-50 px-5 py-16">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Badge variant="outline" className="bg-white">Platform architecture</Badge>
              <h2 className="mt-4 text-3xl font-black tracking-tight">{t('landing.platformTitle')}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{t('landing.platformText')}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['WhatsApp + Telegram', 'AI принимает заявки и отвечает по SLA < 2 сек'],
                ['Kaspi + Halyk', 'Предоплаты, депозиты, статусы и повторные касания'],
                ['iiko + 1C', 'Синхронизация броней, гостей, платежей и логов'],
                ['Multi-tenant SaaS', 'Организации, филиалы, роли, RLS и аудит'],
              ].map(([title, text]) => (
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
                <h2 className="mt-4 text-3xl font-black tracking-tight">{t('landing.workflowsTitle')}</h2>
              </div>
              <Link to="/ai-dialogs">
                <Button variant="outline" className="gap-2">{t('nav.aiDialogs')} <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ['Intake + Intent', 'Принимает сообщения, определяет intent/confidence и извлекает дату, гостей и канал.'],
                ['Booking + Payment', 'Проверяет доступность, создаёт бронь и формирует Kaspi/Halyk/FreedomPay оплату.'],
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
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight">{t('landing.deploymentTitle')}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{t('landing.deploymentText')}</p>
            </div>
            <Link to="/register">
              <Button size="lg" className="gap-2 bg-white text-slate-950 hover:bg-slate-100">
                {t('auth.register')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
