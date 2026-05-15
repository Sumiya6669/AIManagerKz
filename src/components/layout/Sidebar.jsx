import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, CalendarDays, Users, MessageSquare, Settings,
  UtensilsCrossed, CreditCard, Zap, BarChart3, Mic, ChevronLeft, Brain,
  X, Building2, ShieldCheck
} from 'lucide-react';

const navItems = [
  { label: 'Command Center', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Reservations', path: '/reservations', icon: CalendarDays },
  { label: 'Customers CRM', path: '/customers', icon: Users },
  { label: 'AI Dialogs', path: '/ai-dialogs', icon: MessageSquare },
  { label: 'Voice AI', path: '/voice-ai', icon: Mic },
  { label: 'Menu', path: '/menu', icon: UtensilsCrossed },
  { label: 'Payments', path: '/payments', icon: CreditCard },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Integrations', path: '/integrations', icon: Zap },
  { label: 'AI Settings', path: '/ai-settings', icon: Brain },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();

  const content = (
    <aside className={cn(
      "fixed left-0 top-0 z-40 flex h-full flex-col border-r border-border/60 bg-white shadow-card transition-all duration-300 ease-out",
      collapsed ? "lg:w-[76px]" : "lg:w-[256px]",
      mobileOpen ? "w-[280px] translate-x-0" : "w-[280px] -translate-x-full lg:translate-x-0"
    )}>
      <div className="flex h-16 items-center gap-3 overflow-hidden border-b border-border/60 px-4">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary shadow-ai-glow-sm">
          <Brain className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-foreground">Reserva Flow AI</p>
            <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Hospitality OS</p>
          </div>
        )}
        <button
          onClick={() => setMobileOpen(false)}
          className="ml-auto rounded-lg p-2 text-muted-foreground hover:bg-secondary lg:hidden"
          aria-label="Закрыть меню"
        >
          <X className="h-4 w-4" />
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "ml-auto hidden rounded-lg p-2 text-muted-foreground transition-transform duration-300 hover:bg-secondary lg:block",
            collapsed && "rotate-180"
          )}
          aria-label="Свернуть меню"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {!collapsed && (
        <div className="mx-3 mt-3 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/8 to-cyan-50 p-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <div className="min-w-0">
              <p className="truncate text-xs font-bold">Altyn Hospitality</p>
              <p className="text-[10px] text-muted-foreground">2 филиала · Business plan</p>
            </div>
          </div>
        </div>
      )}

      <nav className="custom-scrollbar flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {navItems.map(({ label, path, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors duration-150",
                active
                  ? "bg-primary/8 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="mx-3 mb-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
          <div className="flex items-center gap-2 text-emerald-700">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-60" />
            </div>
            <span className="text-xs font-bold">AI agents online</span>
          </div>
          <p className="mt-1.5 text-[11px] text-emerald-700/80">Intake, booking, payment and iiko sync are healthy.</p>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700">
            <ShieldCheck className="h-3 w-3" />
            RLS-ready multi-tenant mode
          </div>
        </div>
      )}
    </aside>
  );

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-30 bg-slate-950/30 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />}
      {content}
    </>
  );
}
