import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import AppLayout from '@/components/layout/AppLayout';

const Landing = lazy(() => import('@/pages/Landing'));
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

const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />
  </div>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return <LoadingScreen />;
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Landing />} />
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
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
