import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, CreditCard, CalendarCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 pt-32 pb-20 px-6">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Bot className="w-4 h-4" />
              AI-менеджер для вашего бизнеса
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Продажи, брони и оплаты{' '}
              <span className="text-primary">24/7</span>{' '}
              на автопилоте
            </h1>

            <p className="text-lg text-muted-foreground mt-6 leading-relaxed max-w-xl">
              AI-менеджер автоматически общается с клиентами в мессенджерах,
              бронирует столы и номера, принимает предоплату и ведёт CRM вашего ресторана или гостиницы.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Button size="lg" className="text-base px-8 h-12 shadow-lg shadow-primary/25">
                Начать бесплатно
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-12">
                Демо
              </Button>
            </div>

            <div className="flex items-center gap-6 mt-10 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Без кода
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Запуск за 15 минут
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                14 дней бесплатно
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Chat mockup */}
            <div className="bg-card rounded-2xl shadow-2xl border border-border p-6 max-w-md ml-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-sm">AI Менеджер</div>
                  <div className="text-xs text-green-500">Онлайн</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-secondary rounded-2xl rounded-tl-md px-4 py-3 text-sm max-w-[80%]">
                  Здравствуйте! Хочу забронировать столик на вечер пятницы
                </div>
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-4 py-3 text-sm max-w-[85%] ml-auto">
                  Добрый день! 🎉 Подскажите, на сколько гостей и во сколько хотели бы?
                </div>
                <div className="bg-secondary rounded-2xl rounded-tl-md px-4 py-3 text-sm max-w-[60%]">
                  На 4 человека, к 20:00
                </div>
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-4 py-3 text-sm max-w-[90%] ml-auto">
                  Отлично! Столик №7 в VIP-зоне свободен на 20:00. Бронирую? Депозит 5 000 ₸ 💳
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <div className="flex gap-1">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                    <CalendarCheck className="w-3 h-3" /> Бронь
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <CreditCard className="w-3 h-3" /> Оплата
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}