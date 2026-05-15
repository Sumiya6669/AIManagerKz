import React, { useMemo, useState } from 'react';
import { CreditCard, MessageSquare, Plus, Search, Star, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MetricCard from '@/components/ui/MetricCard';
import { customers } from '@/data/mockData';

export default function Customers() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    return customers.filter((customer) => customer.name.toLowerCase().includes(normalized) || customer.phone.includes(query));
  }, [query]);

  const totalSpent = customers.reduce((sum, customer) => sum + customer.spent, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <Badge variant="secondary">Customer CRM</Badge>
          <h1 className="mt-3 text-2xl font-black tracking-tight">Клиенты</h1>
          <p className="mt-1 text-sm text-muted-foreground">Профили гостей, история броней, сегменты и каналы коммуникации.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить клиента
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Всего клиентов" value={customers.length} subtitle="demo workspace" icon={UserRound} />
        <MetricCard title="VIP сегмент" value={customers.filter((customer) => customer.segment === 'VIP').length} subtitle="высокий LTV" icon={Star} accent="amber" />
        <MetricCard title="LTV" value={`${Math.round(totalSpent / customers.length).toLocaleString()} ₸`} subtitle="средний чек клиента" icon={CreditCard} accent="green" trend="+14%" trendUp />
        <MetricCard title="Лучший канал" value="WhatsApp" subtitle="+34% conversion" icon={MessageSquare} accent="purple" trendNeutral trend="AI insight" />
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Поиск по имени или телефону..." />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {filtered.map((customer, index) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="rounded-xl border border-border/60 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-premium"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-cyan-50 text-base font-black text-primary">
                {customer.name.split(' ').map((item) => item[0]).slice(0, 2).join('')}
              </div>
              <Badge variant={customer.segment === 'VIP' ? 'warning' : 'outline'}>{customer.segment}</Badge>
            </div>
            <p className="mt-4 text-base font-black">{customer.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{customer.phone}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-muted/40 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Брони</p>
                <p className="mt-1 text-lg font-black">{customer.bookings}</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Spent</p>
                <p className="mt-1 text-lg font-black">{customer.spent.toLocaleString()} ₸</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Badge variant="secondary">{customer.channel}</Badge>
              <Button size="sm" variant="ghost">Профиль</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
