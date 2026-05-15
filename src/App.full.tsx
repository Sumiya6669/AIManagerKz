import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Link, Outlet, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ShieldCheck } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { queryClientInstance } from '@/lib/query-client';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
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

const LoadingScreen = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background text-foreground">
    <div className="rounded-2xl border border-border/60 bg-white p-6 text-center shadow-premium">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />
      <p className="mt-4 text-sm font-semibold">Reserva Flow AI загружается</p>
      <p className="mt-1 text-xs text-muted-foreground">Если это занимает дольше пары секунд, перезагрузите страницу.</p>
    </div>
  </div>
);

const AuthRequiredScreen = () => (
  <div className="min-h-screen bg-slate-50 px-6 py-16 text-slate-950">
    <div className="mx-auto max-w-xl rounded-2xl border border-border/60 bg-white p-8 shadow-premium">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8 text-primary">
        <ShieldCheck className="h-6 w-6" />
      </div>
      <h1 className="mt-6 text-2xl font-black">Нужна авторизация Supabase</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Приложение успешно загрузилось, но в production включен Supabase Auth и текущей сессии нет.
        Это больше не рендерит пустой экран: подключите login flow или откройте публичную landing page.
      </p>
      <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        Для production добавьте Supabase Auth UI, invitation flow или временно работайте без Supabase env vars в demo mode.
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link to="/login">
          <Button className="w-full sm:w-auto">Войти</Button>
        </Link>
        <Link to="/">
          <Button variant="outline" className="w-full sm:w-auto">На главную</Button>
        </Link>
        <Button variant="ghost" className="w-full sm:w-auto" onClick={() => window.location.reload()}>Повторить</Button>
      </div>
    </div>
  </div>
);

function RequireAuth() {
  const { isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) return <LoadingScreen />;
  if (authError?.type === 'user_not_registered') return <UserNotRegisteredError />;
  if (!isAuthenticated || authError?.type === 'auth_required') return <AuthRequiredScreen />;

  return <Outlet />;
}

function AppRoutes() {
  useEffect(() => {
    console.info('[Reserva Flow AI] App rendered', {
      mode: import.meta.env.MODE,
      supabaseConfigured: Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY),
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
            <Route path="/conversations" element={<Conversations />} />
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

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AppRoutes />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
