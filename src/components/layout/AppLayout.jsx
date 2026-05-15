import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[hsl(240,20%,99%)]">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className={cn(
        "transition-all duration-300 ease-out lg:block",
        collapsed ? "lg:ml-[76px]" : "lg:ml-[256px]"
      )}>
        <TopBar user={user} onMenuClick={() => setMobileOpen(true)} />
        <main className="min-h-[calc(100vh-64px)] p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
