import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, KeyRound, Loader2, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';
import { useI18n } from '@/i18n';

export default function Login() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { checkUserAuth } = useAuth();
  const [email, setEmail] = useState('operator@reserva-flow.ai');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('password');
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: 'idle', message: '' });

    if (!isSupabaseConfigured || !supabase) {
      navigate('/dashboard');
      return;
    }

    if (!email) {
      setStatus({ type: 'error', message: 'Email is required.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = mode === 'magic'
        ? await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: `${window.location.origin}/dashboard` },
          })
        : await supabase.auth.signInWithPassword({ email, password });

      if (result.error) {
        setStatus({ type: 'error', message: result.error.message });
        return;
      }

      if (mode === 'magic') {
        setStatus({ type: 'success', message: 'Magic link sent. Check your inbox.' });
        return;
      }

      await checkUserAuth();
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-2xl border border-border/70 bg-white shadow-premium lg:grid-cols-[0.9fr_1.1fr]">
          <section className="relative hidden bg-slate-950 p-10 text-white lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.42),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.22),transparent_25%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                {t('common.back')}
              </Link>
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-cyan-200">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h1 className="mt-6 text-3xl font-black tracking-tight">{t('auth.secureAccess')}</h1>
                <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
                  Dashboard, AI dialogs, integrations, payments and tenant settings are protected by Supabase Auth and RLS.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
                Frontend uses only public Supabase anon key. Service role keys stay server-side.
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-10">
            <div className="flex items-center justify-between">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground lg:hidden">
                <ArrowLeft className="h-4 w-4" />
                {t('common.back')}
              </Link>
              <LanguageSwitcher compact />
            </div>

            <div className="mt-8 max-w-md lg:mt-0">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Reserva Flow AI</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">{t('auth.login')}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {isSupabaseConfigured ? 'Use Supabase Auth credentials.' : 'Demo mode is active locally.'}
              </p>

              <div className="mt-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  className={`rounded-lg px-3 py-2 text-sm font-bold transition ${mode === 'password' ? 'bg-white shadow-sm' : 'text-muted-foreground'}`}
                  onClick={() => setMode('password')}
                >
                  {t('auth.passwordMode')}
                </button>
                <button
                  type="button"
                  className={`rounded-lg px-3 py-2 text-sm font-bold transition ${mode === 'magic' ? 'bg-white shadow-sm' : 'text-muted-foreground'}`}
                  onClick={() => setMode('magic')}
                >
                  {t('auth.magicLink')}
                </button>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="email" type="email" autoComplete="email" className="pl-9" value={email} onChange={(event) => setEmail(event.target.value)} />
                  </div>
                </div>

                {mode === 'password' && (
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="password" type="password" autoComplete="current-password" className="pl-9" value={password} onChange={(event) => setPassword(event.target.value)} />
                    </div>
                  </div>
                )}

                {status.message && (
                  <div className={`rounded-xl border p-3 text-sm ${status.type === 'error' ? 'border-red-100 bg-red-50 text-red-700' : 'border-emerald-100 bg-emerald-50 text-emerald-700'}`}>
                    {status.message}
                  </div>
                )}

                <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {mode === 'magic' ? t('auth.magicLink') : t('auth.login')}
                </Button>
              </form>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
                <Link to="/forgot-password" className="font-semibold text-primary hover:underline">{t('auth.forgot')}</Link>
                <Link to="/register" className="font-semibold text-primary hover:underline">{t('auth.noAccount')} {t('auth.register')}</Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
