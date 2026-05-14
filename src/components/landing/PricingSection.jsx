import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Starter',
    price: '29 900',
    period: '/мес',
    description: 'Для небольших заведений',
    features: [
      'До 200 бронирований/мес',
      '1 филиал',
      'AI-чат Telegram + Web',
      'Базовая CRM',
      'Email-поддержка'
    ],
    popular: false
  },
  {
    name: 'Business',
    price: '59 900',
    period: '/мес',
    description: 'Для растущего бизнеса',
    features: [
      'Безлимитные бронирования',
      'До 5 филиалов',
      'Все каналы: TG, WA, IG, Web',
      'Полная CRM + аналитика',
      'Интеграция iiko + 1С',
      'Онлайн-оплата',
      'Приоритетная поддержка'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Индивидуально',
    period: '',
    description: 'Для сетей и холдингов',
    features: [
      'Всё из Business',
      'Безлимит филиалов',
      'Персональный менеджер',
      'Кастомные интеграции',
      'SLA 99.9%',
      'Белый лейбл'
    ],
    popular: false
  }
];

export default function PricingSection() {
  return (
    <section className="py-20 px-6 bg-secondary/30" id="pricing">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Тарифы</h2>
          <p className="text-muted-foreground text-lg mt-4">
            14 дней бесплатного пробного периода на любом тарифе
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={cn(
                "rounded-2xl p-8 bg-card border transition-all duration-300",
                plan.popular
                  ? "border-primary shadow-xl shadow-primary/10 ring-1 ring-primary scale-[1.02]"
                  : "border-border hover:border-primary/30 hover:shadow-lg"
              )}
            >
              {plan.popular && (
                <div className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full w-fit mb-4">
                  Популярный
                </div>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mt-1">{plan.description}</p>
              <div className="mt-6 mb-6">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-muted-foreground"> ₸{plan.period}</span>
              </div>
              <Button
                className={cn("w-full mb-6", plan.popular ? "" : "variant-outline")}
                variant={plan.popular ? "default" : "outline"}
              >
                Попробовать бесплатно
              </Button>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}