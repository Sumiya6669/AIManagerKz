import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Building2, CheckCircle2, Clock, CreditCard, MessageSquare, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/i18n';

export default function Onboarding() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const saved = useMemo(() => {
    try { return JSON.parse(window.localStorage.getItem('reserva-onboarding') || '{}'); } catch { return {}; }
  }, []);
  const steps = [
    { key: 'org', icon: Building2, title: t('onboarding.org') },
    { key: 'branch', icon: Store, title: t('onboarding.branch') },
    { key: 'schedule', icon: Clock, title: t('onboarding.schedule') },
    { key: 'channels', icon: MessageSquare, title: t('onboarding.channels') },
    { key: 'payments', icon: CreditCard, title: t('onboarding.payments') },
    { key: 'ai', icon: Bot, title: t('onboarding.ai') },
    { key: 'done', icon: CheckCircle2, title: t('onboarding.done') },
  ];
  const [step, setStep] = useState(0);

  const current = steps[step];
  const Icon = current.icon;

  const finish = () => {
    window.localStorage.setItem('reserva-onboarding-complete', 'true');
    navigate('/dashboard');
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-950">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Badge variant="secondary">SaaS setup</Badge>
            <h1 className="mt-3 text-3xl font-black">{t('onboarding.title')}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{t('onboarding.subtitle')}</p>
          </div>
          <Button variant="outline" onClick={finish}>{t('onboarding.complete')}</Button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl border border-border/60 bg-white p-3 shadow-card">
            {steps.map((item, index) => {
              const StepIcon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setStep(index)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition ${index === step ? 'bg-primary/8 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}
                >
                  <StepIcon className="h-4 w-4" />
                  {item.title}
                </button>
              );
            })}
          </aside>

          <section className="rounded-2xl border border-border/60 bg-white p-6 shadow-card">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black">{current.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t('onboarding.mockNotice')}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {current.key === 'org' && (
                <>
                  <Field label={t('auth.orgName')} value={saved.organizationName || 'Altyn Hospitality Group'} />
                  <Field label={t('auth.businessType')} value={saved.businessType || 'restaurant'} />
                  <Field label={t('auth.city')} value={saved.city || 'Almaty'} />
                  <Field label={t('auth.defaultLanguage')} value={saved.defaultLanguage || 'ru'} />
                </>
              )}
              {current.key === 'branch' && (
                <>
                  <Field label="Branch name" value="Main branch" />
                  <Field label="Address" value="Dostyk Ave 100" />
                  <Field label="Timezone" value="Asia/Almaty" />
                  <Field label="Capacity" value="80 guests" />
                </>
              )}
              {current.key === 'schedule' && (
                <>
                  <Field label="Monday-Friday" value="10:00-23:00" />
                  <Field label="Saturday" value="10:00-01:00" />
                  <Field label="Sunday" value="11:00-23:00" />
                  <Field label="Deposit peak time" value="Friday 19:00-22:00" />
                </>
              )}
              {current.key === 'channels' && <ToggleList items={['Telegram Bot', 'WhatsApp Business API', 'Instagram Direct placeholder', 'Web Chat']} />}
              {current.key === 'payments' && <ToggleList items={['Kaspi Pay', 'Halyk', 'Freedom Pay', 'Manual payment']} />}
              {current.key === 'ai' && <ToggleList items={['Auto booking', 'Payment reminders', 'Upsell suggestions', 'Escalation to manager']} />}
              {current.key === 'done' && (
                <div className="sm:col-span-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  <h3 className="mt-4 text-xl font-black text-emerald-950">Workspace is ready</h3>
                  <p className="mt-2 text-sm leading-6 text-emerald-800">Mock configuration is saved. You can connect real API keys in integrations and settings.</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}>{t('common.back')}</Button>
              {step === steps.length - 1 ? (
                <Button onClick={finish}>{t('onboarding.complete')}</Button>
              ) : (
                <Button onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))}>{t('common.continue')}</Button>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({ label, value }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input defaultValue={value} />
    </div>
  );
}

function ToggleList({ items }) {
  return items.map((item) => (
    <div key={item} className="flex items-center justify-between rounded-xl border border-border/60 p-4">
      <span className="text-sm font-bold">{item}</span>
      <Switch defaultChecked />
    </div>
  ));
}
