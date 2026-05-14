import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, Code2, Plug, RefreshCw, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MetricCard from '@/components/ui/MetricCard';
import { integrations } from '@/data/mockData';
import { cn } from '@/lib/utils';

const statusConfig = {
  connected: { icon: CheckCircle2, variant: 'success', className: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
  pending: { icon: Clock, variant: 'warning', className: 'text-amber-700 bg-amber-50 border-amber-100' },
  error: { icon: AlertTriangle, variant: 'danger', className: 'text-red-700 bg-red-50 border-red-100' },
  mock: { icon: Code2, variant: 'outline', className: 'text-slate-700 bg-slate-50 border-slate-200' },
};

export default function Integrations() {
  const connected = integrations.filter((integration) => integration.status === 'connected').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <Badge variant="secondary">Adapter architecture</Badge>
          <h1 className="mt-3 text-2xl font-black tracking-tight">Интеграции</h1>
          <p className="mt-1 text-sm text-muted-foreground">Каналы, платежи, POS и accounting подключаются через provider-интерфейсы.</p>
        </div>
        <Button className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Проверить health
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Connected" value={connected} subtitle={`${integrations.length} адаптеров`} icon={Plug} accent="green" />
        <MetricCard title="Errors" value={integrations.filter((item) => item.status === 'error').length} subtitle="требуют настройки webhook" icon={AlertTriangle} accent="amber" />
        <MetricCard title="Mock providers" value={integrations.filter((item) => item.status === 'mock').length} subtitle="готовы к реальным API" icon={Code2} accent="purple" />
        <MetricCard title="Audit logs" value="100%" subtitle="каждый sync пишет log" icon={ShieldCheck} accent="cyan" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((integration, index) => {
          const config = statusConfig[integration.status] || statusConfig.mock;
          const Icon = config.icon;
          return (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="rounded-xl border border-border/60 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-premium"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl border', config.className)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-black">{integration.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{integration.category}</p>
                  </div>
                </div>
                <Badge variant={config.variant}>{integration.status}</Badge>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted/40 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Requests</p>
                  <p className="mt-1 text-lg font-black">{integration.requests}</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Latency</p>
                  <p className="mt-1 text-lg font-black">{integration.latency}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button size="sm" variant="outline">{integration.status === 'connected' ? 'Настроить' : 'Подключить'}</Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
