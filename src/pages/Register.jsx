import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Loader2, Mail, Phone, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';
import { useI18n } from '@/i18n';

const businessTypes = [
  { value: 'restaurant', label: 'Ресторан' },
  { value: 'cafe', label: 'Кафе' },
  { value: 'restobar', label: 'Рестобар' },
  { value: 'hotel', label: 'Гостиница' },
  { value: 'bath_complex', label: 'Банный комплекс' },
  { value: 'other', label: 'Другое' },
];

export default function Register() {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const { checkUserAuth } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    organizationName: '',
    businessType: 'restaurant',
    city: '',
    defaultLanguage: language,
  });
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ type: 'idle', message: '' });

    const required = ['fullName', 'email', 'password', 'phone', 'organizationName', 'city'];
    const missing = required.find((key) => !form[key]);
    if (missing) {
      setStatus({ type: 'error', message: 'Fill all required fields.' });
      return;
    }

    setIsSubmitting(true);
    try {
      if (!isSupabaseConfigured || !supabase) {
        window.localStorage.setItem('reserva-onboarding', JSON.stringify(form));
        navigate('/onboarding');
        return;
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || 'Registration failed.');
      }

      const signIn = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (signIn.error) throw signIn.error;

      window.localStorage.setItem('reserva-onboarding', JSON.stringify({ ...form, organizationId: payload.organization_id }));
      await checkUserAuth();
      navigate('/onboarding');
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Registration failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-premium">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            <section className="bg-slate-950 p-8 text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-cyan-200">
                <Building2 className="h-6 w-6" />
              </div>
              <h1 className="mt-6 text-3xl font-black">{t('auth.register')}</h1>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Create Supabase Auth user, organization, branch, owner profile and demo settings in one flow.
              </p>
              <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
                After registration you will continue to onboarding and then dashboard.
              </div>
            </section>

            <form className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8" onSubmit={submit}>
              <div className="space-y-2">
                <Label>{t('auth.name')}</Label>
                <div className="relative">
                  <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-9" value={form.fullName} onChange={(event) => update('fullName', event.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('auth.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="email" className="pl-9" value={form.email} onChange={(event) => update('email', event.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('auth.password')}</Label>
                <Input type="password" minLength={8} value={form.password} onChange={(event) => update('password', event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t('auth.phone')}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-9" value={form.phone} onChange={(event) => update('phone', event.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('auth.orgName')}</Label>
                <Input value={form.organizationName} onChange={(event) => update('organizationName', event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t('auth.businessType')}</Label>
                <Select value={form.businessType} onValueChange={(value) => update('businessType', value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{businessTypes.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('auth.city')}</Label>
                <Input value={form.city} onChange={(event) => update('city', event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t('auth.defaultLanguage')}</Label>
                <Select value={form.defaultLanguage} onValueChange={(value) => update('defaultLanguage', value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="kk">Қазақша</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {status.message && (
                <div className="sm:col-span-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">{status.message}</div>
              )}
              <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                <Link to="/login" className="text-sm font-semibold text-primary hover:underline">{t('auth.haveAccount')} {t('auth.login')}</Link>
                <Button type="submit" className="gap-2" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {t('auth.createAccount')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
