import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'demo-user',
    email: 'operator@reserva-flow.ai',
    full_name: 'Demo Operator',
    role: 'owner',
    organization_id: 'org_demo_altyn',
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(true);
  const [appPublicSettings] = useState({ authMode: isSupabaseConfigured ? 'supabase' : 'demo' });

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    setIsLoadingAuth(true);
    setAuthError(null);

    if (!isSupabaseConfigured || !supabase) {
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      setAuthChecked(true);
      return;
    }

    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      setUser(null);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setAuthChecked(true);
      setAuthError({ type: 'auth_required', message: 'Authentication required' });
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    setUser({
      id: data.user.id,
      email: data.user.email,
      full_name: profile?.full_name || data.user.user_metadata?.full_name || 'Operator',
      role: profile?.role || 'member',
      organization_id: profile?.organization_id,
    });
    setIsAuthenticated(true);
    setIsLoadingAuth(false);
    setAuthChecked(true);
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  const navigateToLogin = () => {
    setAuthError({ type: 'auth_required', message: 'Configure Supabase Auth to enable login.' });
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    appPublicSettings,
    authChecked,
    logout,
    navigateToLogin,
    checkUserAuth,
    checkAppState: checkUserAuth,
    hasRole: (...roles) => roles.includes(user?.role),
  }), [user, isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authError, appPublicSettings, authChecked]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
