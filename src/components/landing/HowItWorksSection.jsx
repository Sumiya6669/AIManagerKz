import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Brain, CalendarCheck, CreditCard } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    step: '01',
    title: 'Клиент пишет',
    description: 'В Telegram, WhatsApp, Instagram или Web-чат на вашем сайте.'
  },
  {
    icon: Brain,
    step: '02',
    title: 'AI понимает',
    description: 'Определяет намерение, собирает данные: дату, время, кол-во гостей.'
  },
  {
    icon: CalendarCheck,
    step: '03',
    title: 'Бронь создана',
    description: 'Проверяет доступность, создаёт бронирование и уведомляет администратора.'
  },
  {
    icon: CreditCard,
    step: '04',
    title: 'Оплата принята',
    description: 'Отправляет ссылку на оплату, подтверждает бронь после оплаты.'
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 px-6 bg-background" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Как это работает</h2>
          <p className="text-muted-foreground text-lg mt-4">
            От сообщения до оплаченной брони — за 2 минуты
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-border" />
              )}
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                <step.icon className="w-8 h-8 text-primary" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {step.step}
                </span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}