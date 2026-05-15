import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AlertTriangle, Loader2, ShieldCheck } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { queryClientInstance } from '@/lib/query-client';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { isSupabaseConfigured, supabaseConfigError } from '@/lib/supabase';
import ErrorBoundary from '@/components/ErrorBoundary';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Reservations = lazy(() => import('@/pages/Reservations'));
const Customers = lazy(() => import('@/pages/Customers'));
const Conversations = lazy(() => import('@/pages/Conversations'));
const AISettings = lazy(() => import('@/pages/AISettings'));
const Menu = lazy(() => import('@/pages/Menu'));
const Payments = lazy(() => import('@/pages/Payments'));
const Integrations = lazy(() => import('@/pages/Integrations'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Settings = lazy(() => import('@/pages/Settings'));
const VoiceAI = lazy(() => import('@/pages/VoiceAI'));
const AppLayout = lazy(() => import('@/components/layout/AppLayout'));
const PageNotFound = lazy(() => import('@/lib/PageNotFound'));

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-950">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-premium">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <h1 className="mt-4 text-lg font-black">Reserva Flow AI is loading</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The application shell is active. If a route chunk is slow, this screen stays visible instead of a blank page.
        </p>
      </div>
    </div>
  );
}

function GlobalErrorScreen({ title = 'Application fallback', message, actionLabel = 'Reload' }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16 text-slate-950">
      <div className="w-full max-w-xl rounded-2xl border border-red-100 bg-white p-8 shadow-premium">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="mt-6 text-2xl font-black">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{message}</p>
        <Button className="mt-6" onClick={() => window.location.reload()}>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}

function AuthRequiredScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16 text-slate-950">
      <div className="w-full max-w-xl rounded-2xl border border-border/60 bg-white p-8 shadow-premium">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="mt-6 text-2xl font-black">Authentication required</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Reserva Flow AI loaded correctly, but this protected workspace needs an active Supabase session.
          Sign in from the login page or remove Supabase env vars to use demo mode.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <a href="/login">Open login</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/">Open landing</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

function MissingEnvBanner() {
  if (isSupabaseConfigured && !supabaseConfigError) return <></>;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-semibold text-amber-900">
      Demo mode is active. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel to enable live Supabase auth and data.
      {supabaseConfigError ? ` ${supabaseConfigError}` : ''}
    </div>
  );
}

function RequireAuth() {
  const { isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) return <LoadingScreen />;
  if (authError?.type === 'user_not_registered') return <UserNotRegisteredError />;
  if (!isAuthenticated || authError?.type === 'auth_required') return <AuthRequiredScreen />;

  return <Outlet />;
}

function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <AuthProvider>
        <MissingEnvBanner />
        {children}
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AppRoutes() {
  useEffect(() => {
    console.info('[Reserva Flow AI] App rendered', {
      mode: import.meta.env.MODE,
      supabaseConfigured: isSupabaseConfigured,
    });
  }, []);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/ai-dialogs" element={<Conversations />} />
            <Route path="/conversations" element={<Navigate to="/ai-dialogs" replace />} />
            <Route path="/ai-settings" element={<AISettings />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/voice-ai" element={<VoiceAI />} />
          </Route>
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary
      fallback={
        <GlobalErrorScreen
          title="Reserva Flow AI could not render"
          message="A runtime error was caught by the top-level ErrorBoundary. The app will show this fallback instead of a white screen."
        />
      }
    >
      <BrowserRouter>
        <AppProviders>
          <AppRoutes />
        </AppProviders>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
