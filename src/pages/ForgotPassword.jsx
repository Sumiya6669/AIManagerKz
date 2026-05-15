import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useI18n } from '@/i18n';

export default function ForgotPassword() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ type: 'idle', message: '' });
    if (!email) {
      setStatus({ type: 'error', message: 'Email is required.' });
      return;
    }
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) throw error;
      }
      setStatus({ type: 'success', message: 'If the email exists, reset instructions were sent.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10 text-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-border/70 bg-white p-8 shadow-premium">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </Link>
          <LanguageSwitcher compact />
        </div>
        <h1 className="text-3xl font-black">{t('auth.resetTitle')}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{t('auth.resetSubtitle')}</p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <Label>{t('auth.email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="email" className="pl-9" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
          </div>
          {status.message && (
            <div className={`rounded-xl border p-3 text-sm ${status.type === 'error' ? 'border-red-100 bg-red-50 text-red-700' : 'border-emerald-100 bg-emerald-50 text-emerald-700'}`}>
              {status.message}
            </div>
          )}
          <Button type="submit" className="w-full gap-2" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t('auth.sendReset')}
          </Button>
        </form>
      </div>
    </main>
  );
}
