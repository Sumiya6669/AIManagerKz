import React from 'react';
import { CheckCircle2, Clock, CreditCard, RefreshCw, TrendingUp, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MetricCard from '@/components/ui/MetricCard';
import { payments } from '@/data/mockData';

const statusVariant = {
  paid: 'success',
  pending: 'warning',
  failed: 'danger',
};

const statusIcon = {
  paid: CheckCircle2,
  pending: Clock,
  failed: XCircle,
};

export default function Payments() {
  const paid = payments.filter((payment) => payment.status === 'paid');
  const pending = payments.filter((payment) => payment.status === 'pending');
  const totalPaid = paid.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPending = pending.reduce((sum, payment) => sum + payment.amount, 0);
  const successRate = Math.round((paid.length / payments.length) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <Badge variant="secondary">Payment operations</Badge>
          <h1 className="mt-3 text-2xl font-black tracking-tight">Платежи</h1>
          <p className="mt-1 text-sm text-muted-foreground">Kaspi, Halyk, FreedomPay и mock provider в единой платежной шине.</p>
        </div>
        <Button className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Sync statuses
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Получено" value={`${totalPaid.toLocaleString()} ₸`} subtitle={`${paid.length} успешных платежа`} icon={CreditCard} accent="green" trend="+18%" trendUp />
        <MetricCard title="Ожидает" value={`${totalPending.toLocaleString()} ₸`} subtitle="AI отправит reminder" icon={Clock} accent="amber" trendNeutral trend="4 reminders" />
        <MetricCard title="Success rate" value={`${successRate}%`} subtitle="по всем провайдерам" icon={TrendingUp} accent="purple" trend="+6%" trendUp />
        <MetricCard title="Провайдеры" value="4" subtitle="Kaspi, Halyk, Freedom, Mock" icon={CreditCard} trendNeutral trend="adapter-ready" />
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-white shadow-card">
        <div className="border-b border-border/60 px-5 py-4">
          <p className="text-sm font-bold">Payment ledger</p>
          <p className="mt-1 text-xs text-muted-foreground">Webhook-ready статусы и связка с reservation_id.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr>
                {['ID', 'Provider', 'Status', 'Reservation', 'Amount', 'Created'].map((head) => (
                  <th key={head} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => {
                const Icon = statusIcon[payment.status] || Clock;
                return (
                  <tr key={payment.id} className="border-t border-border/40 hover:bg-muted/20">
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{payment.id}</td>
                    <td className="px-5 py-4 text-sm font-bold">{payment.provider}</td>
                    <td className="px-5 py-4">
                      <Badge variant={statusVariant[payment.status] || 'outline'} className="gap-1.5">
                        <Icon className="h-3 w-3" />
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{payment.reservation}</td>
                    <td className="px-5 py-4 text-sm font-black">{payment.amount.toLocaleString()} ₸</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{payment.createdAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
