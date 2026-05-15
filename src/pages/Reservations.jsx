import React, { useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock, CreditCard, Plus, Search, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MetricCard from '@/components/ui/MetricCard';
import { reservations } from '@/data/mockData';

const statusVariant = {
  confirmed: 'success',
  pending_payment: 'warning',
  new: 'outline',
  cancelled: 'danger',
};

export default function Reservations() {
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    return reservations.filter((reservation) => {
      const matchStatus = status === 'all' || reservation.status === status;
      const matchQuery = reservation.customer.toLowerCase().includes(normalized) || reservation.phone.includes(query) || reservation.id.toLowerCase().includes(normalized);
      return matchStatus && matchQuery;
    });
  }, [query, status]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <Badge variant="secondary">Reservations OS</Badge>
          <h1 className="mt-3 text-2xl font-black tracking-tight">Бронирования</h1>
          <p className="mt-1 text-sm text-muted-foreground">Единый поток ручных, AI и интеграционных броней.</p>
        </div>
        <Button className="gap-2" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Новая бронь
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Сегодня" value="38" subtitle="28 подтверждено" icon={CalendarDays} trend="+12%" trendUp />
        <MetricCard title="Ожидают оплату" value="64 000 ₸" subtitle="4 ссылки активны" icon={CreditCard} accent="amber" trendNeutral trend="Kaspi/Halyk" />
        <MetricCard title="Средний lead time" value="4.2 мин" subtitle="от запроса до брони" icon={Clock} accent="cyan" trend="-28%" />
        <MetricCard title="Гостей" value="146" subtitle="сегодня в залах" icon={Users} accent="green" trend="+18%" trendUp />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-white p-4 shadow-card md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Поиск по клиенту, телефону, ID..." />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'new', 'pending_payment', 'confirmed'].map((item) => (
            <Button key={item} size="sm" variant={status === item ? 'default' : 'outline'} onClick={() => setStatus(item)}>
              {item === 'all' ? 'Все' : item}
            </Button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr>
                {['ID', 'Клиент', 'Дата / время', 'Гости', 'Статус', 'Оплата', 'Канал', 'Сумма'].map((head) => (
                  <th key={head} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((reservation, index) => (
                <motion.tr
                  key={reservation.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-t border-border/40 hover:bg-muted/20"
                >
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{reservation.id}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold">{reservation.customer}</p>
                    <p className="text-xs text-muted-foreground">{reservation.phone}</p>
                  </td>
                  <td className="px-5 py-4 text-sm">{reservation.date} · {reservation.time}</td>
                  <td className="px-5 py-4 text-sm">{reservation.guests}</td>
                  <td className="px-5 py-4"><Badge variant={statusVariant[reservation.status] || 'outline'}>{reservation.status}</Badge></td>
                  <td className="px-5 py-4"><Badge variant={reservation.payment === 'paid' ? 'success' : reservation.payment === 'pending' ? 'warning' : 'secondary'}>{reservation.payment}</Badge></td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{reservation.channel}</td>
                  <td className="px-5 py-4 text-sm font-bold">{reservation.amount.toLocaleString()} ₸</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новая бронь</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Имя клиента</Label>
              <Input className="mt-1.5" placeholder="Айдос Нурланов" />
            </div>
            <div>
              <Label>Телефон</Label>
              <Input className="mt-1.5" placeholder="+7..." />
            </div>
            <div>
              <Label>Дата</Label>
              <Input type="date" className="mt-1.5" />
            </div>
            <div>
              <Label>Время</Label>
              <Input type="time" className="mt-1.5" />
            </div>
            <div>
              <Label>Гости</Label>
              <Input type="number" min="1" defaultValue="2" className="mt-1.5" />
            </div>
            <div>
              <Label>Канал</Label>
              <Select defaultValue="phone">
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">Телефон</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="webchat">WebChat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
            <Button className="gap-2" onClick={() => setOpen(false)}>
              <CheckCircle2 className="h-4 w-4" />
              Создать mock-бронь
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
