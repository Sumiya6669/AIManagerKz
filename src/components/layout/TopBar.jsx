import React, { useMemo, useState } from 'react';
import { Command } from 'cmdk';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, ChevronDown, Menu, Search, Building2, GitBranch, Command as CommandIcon, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useI18n } from '@/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { organization } from '@/data/mockData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function TopBar({ user, onMenuClick }) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const actions = useMemo(() => [
    { label: t('nav.dashboard'), path: '/dashboard', hint: 'Dashboard' },
    { label: t('nav.aiDialogs'), path: '/ai-dialogs', hint: 'Support center' },
    { label: t('nav.reservations'), path: '/reservations', hint: 'Reservations' },
    { label: t('nav.integrations'), path: '/integrations', hint: 'iiko, 1C, Kaspi' },
    { label: t('nav.aiSettings'), path: '/ai-settings', hint: 'Agents policy' },
    { label: t('nav.settings'), path: '/settings', hint: 'Org, team, plan' },
  ], [t]);

  const filteredActions = useMemo(() => {
    const normalized = query.toLowerCase();
    return actions.filter((action) => action.label.toLowerCase().includes(normalized) || action.hint.toLowerCase().includes(normalized));
  }, [actions, query]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-white/82 px-4 backdrop-blur-xl sm:px-6">
      <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary lg:hidden" onClick={onMenuClick} aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>

      <button
        onClick={() => setCommandOpen(true)}
        className="hidden min-w-[260px] items-center gap-2 rounded-xl border border-border/70 bg-white px-3 py-2 text-left text-sm text-muted-foreground shadow-sm transition hover:bg-secondary/60 md:flex"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1">{t('common.search')}</span>
        <span className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">Ctrl K</span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden items-center gap-2 rounded-xl border border-border/70 bg-white px-3 py-2 text-xs font-semibold hover:bg-secondary sm:flex">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              {organization.name}
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {organization.branches.map((branch) => (
              <DropdownMenuItem key={branch.id}>
                <div>
                  <p className="text-sm font-semibold">{branch.name}</p>
                  <p className="text-xs text-muted-foreground">{branch.city} · {branch.type}</p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden items-center gap-2 rounded-xl border border-border/70 bg-white px-3 py-2 text-xs font-semibold hover:bg-secondary md:flex">
              <GitBranch className="h-3.5 w-3.5 text-primary" />
              Altyn Center
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Altyn Center</DropdownMenuItem>
            <DropdownMenuItem>Altyn Rooftop</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        <LanguageSwitcher compact />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-secondary sm:px-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {user?.full_name?.[0] || user?.email?.[0] || 'U'}
              </div>
              <span className="hidden text-sm font-semibold text-foreground sm:block">
                {user?.full_name || user?.email || 'User'}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-2">
              <p className="truncate text-xs font-semibold text-foreground">{user?.full_name || 'User'}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-primary">{user?.role || 'member'}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings">{t('nav.settings')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              {t('auth.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
        <DialogContent className="max-w-xl overflow-hidden p-0">
          <Command className="bg-white">
            <div className="flex items-center border-b border-border px-4">
              <CommandIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              <Command.Input
                value={query}
                onValueChange={setQuery}
                placeholder={t('common.search')}
                className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Command.List className="max-h-[320px] overflow-y-auto p-2">
              <Command.Empty className="py-8 text-center text-sm text-muted-foreground">{t('pages.empty')}</Command.Empty>
              {filteredActions.map((action) => (
                <Command.Item
                  key={action.path}
                  value={`${action.label} ${action.hint}`}
                  onSelect={() => {
                    navigate(action.path);
                    setCommandOpen(false);
                  }}
                  className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-3 text-sm aria-selected:bg-secondary"
                >
                  <div>
                    <p className="font-semibold">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.hint}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Command.Item>
              ))}
            </Command.List>
            <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-3">
              <span className="text-xs text-muted-foreground">Commands are available from any section.</span>
              <Button size="sm" variant="outline" onClick={() => setCommandOpen(false)}>{t('common.cancel')}</Button>
            </div>
          </Command>
        </DialogContent>
      </Dialog>
    </header>
  );
}
