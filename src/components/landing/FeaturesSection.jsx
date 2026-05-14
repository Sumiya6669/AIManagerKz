import React from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare, CalendarCheck, CreditCard, BarChart3,
  Users, Bot, Plug, Bell
} from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'Мультиканальный чат',
    description: 'WhatsApp, Telegram, Instagram, Web — все каналы в одном окне.',
    color: 'bg-primary/10 text-primary'
  },
  {
    icon: Bot,
    title: 'AI-менеджер',
    description: 'Отвечает мгновенно, собирает данные, ведёт до бронирования.',
    color: 'bg-accent/10 text-accent'
  },
  {
    icon: CalendarCheck,
    title: 'Автоброни',
    description: 'Проверяет доступность, бронирует столы и номера автоматически.',
    color: 'bg-chart-3/10 text-chart-3'
  },
  {
    icon: CreditCard,
    title: 'Онлайн-оплата',
    description: 'Kaspi, Halyk, Freedom Pay — предоплата и депозит через ссылку.',
    color: 'bg-destructive/10 text-destructive'
  },
  {
    icon: Users,
    title: 'CRM клиентов',
    description: 'История бронирований, коммуникаций, сумм оплат и предпочтений.',
    color: 'bg-chart-5/10 text-chart-5'
  },
  {
    icon: Plug,
    title: 'Интеграции',
    description: 'iiko, 1C, платёжные системы — данные передаются автоматически.',
    color: 'bg-primary/10 text-primary'
  },
  {
    icon: BarChart3,
    title: 'AI-аналитика',
    description: 'Конверсия, средний чек, пропущенные заявки, рекомендации.',
    color: 'bg-accent/10 text-accent'
  },
  {
    icon: Bell,
    title: 'Уведомления',
    description: 'Напоминания клиентам, уведомления администраторам в реальном времени.',
    color: 'bg-chart-3/10 text-chart-3'
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-6 bg-background" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Всё что нужно для автоматизации
          </h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
            Полный набор инструментов для управления бронированиями, клиентами и платежами
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}