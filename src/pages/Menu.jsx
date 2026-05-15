import React, { useMemo, useState } from 'react';
import { Plus, Search, Sparkles, UtensilsCrossed } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MetricCard from '@/components/ui/MetricCard';
import { menuItems } from '@/data/mockData';

export default function Menu() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    return menuItems.filter((item) => item.name.toLowerCase().includes(normalized) || item.category.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <Badge variant="secondary">Menu intelligence</Badge>
          <h1 className="mt-3 text-2xl font-black tracking-tight">Меню</h1>
          <p className="mt-1 text-sm text-muted-foreground">Позиции, наличие, маржинальность и upsell-подсказки для AI.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить блюдо
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Позиции" value={menuItems.length} subtitle="в demo меню" icon={UtensilsCrossed} />
        <MetricCard title="Доступно" value={menuItems.filter((item) => item.available).length} subtitle="AI может продавать" icon={Sparkles} accent="green" />
        <MetricCard title="Best margin" value="62%" subtitle="Signature mocktails" icon={Sparkles} accent="purple" trendNeutral trend="upsell" />
        <MetricCard title="AI upsell" value="+18%" subtitle="к среднему чеку" icon={Sparkles} accent="amber" trend="+18%" trendUp />
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Поиск блюда или категории..." />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {filtered.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="rounded-xl border border-border/60 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-premium"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 text-primary">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <Badge variant={item.available ? 'success' : 'secondary'}>{item.available ? 'available' : 'paused'}</Badge>
            </div>
            <p className="mt-4 min-h-[48px] text-base font-black leading-6">{item.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.category}</p>
            <div className="mt-4 flex items-end justify-between">
              <p className="text-xl font-black text-primary">{item.price.toLocaleString()} ₸</p>
              <Badge variant="outline">margin {item.margin}</Badge>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
