import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, Bot, CheckCircle2, FileText, Search, Send, Sparkles, User, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import AIStatusBadge from '@/components/ui/AIStatusBadge';
import { chatMessages, conversations, toolTimeline } from '@/data/mockData';
import { cn } from '@/lib/utils';

const statusMap = {
  ai_active: { badge: 'active', label: 'AI ведет' },
  human_active: { badge: 'escalation', label: 'Оператор' },
  waiting: { badge: 'waiting', label: 'Ожидание' },
  closed: { badge: 'completed', label: 'Закрыт' },
};

const intentLabels = {
  booking_request: 'Бронирование',
  price_question: 'Цена',
  menu_question: 'Меню',
  payment_question: 'Оплата',
  human_request: 'Оператор',
  complaint: 'Жалоба',
};

function ConversationCard({ conversation, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full border-b border-border/50 p-4 text-left transition hover:bg-muted/30',
        selected && 'bg-primary/5 shadow-[inset_3px_0_0_hsl(var(--primary))]'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-cyan-50 text-primary">
            {conversation.status === 'ai_active' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
          </div>
          <span className={cn('absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white',
            conversation.status === 'ai_active' ? 'bg-primary' :
            conversation.status === 'human_active' ? 'bg-amber-500' :
            conversation.status === 'closed' ? 'bg-emerald-500' : 'bg-slate-400'
          )} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-bold">{conversation.customer}</p>
            <AIStatusBadge status={statusMap[conversation.status]?.badge} />
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">{conversation.lastMessage}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Badge variant="outline">{conversation.channel}</Badge>
            <Badge variant="secondary">{intentLabels[conversation.intent] || conversation.intent}</Badge>
          </div>
        </div>
      </div>
    </button>
  );
}

function MessageBubble({ message, index }) {
  const isAi = message.role === 'ai';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={cn('flex gap-3', isAi ? 'justify-start' : 'justify-end')}
    >
      {isAi && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div className={cn('max-w-[78%]', !isAi && 'flex flex-col items-end')}>
        {message.tool && (
          <div className="mb-1.5 inline-flex max-w-full items-center gap-1.5 rounded-lg border border-border/60 bg-white px-2.5 py-1.5 font-mono text-[10px] text-muted-foreground shadow-sm">
            <Zap className="h-3 w-3 shrink-0 text-primary" />
            <span className="truncate">{message.tool}</span>
          </div>
        )}
        <div className={cn(
          'rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm',
          isAi ? 'rounded-tl-md border border-border/60 bg-white text-foreground' : 'rounded-tr-md bg-primary text-white'
        )}>
          {message.text}
        </div>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground">{message.time}</p>
      </div>
      {!isAi && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <User className="h-4 w-4" />
        </div>
      )}
    </motion.div>
  );
}

function ToolCallRow({ tool }) {
  return (
    <div className="rounded-xl border border-border/60 bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-xs font-bold">{tool.name}</p>
        <Badge variant={tool.status === 'success' ? 'success' : tool.status === 'pending' ? 'warning' : 'secondary'}>
          {tool.status}
        </Badge>
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">{tool.payload} · {tool.latency}</p>
    </div>
  );
}

export default function Conversations() {
  const [selectedId, setSelectedId] = useState(conversations[0].id);
  const [query, setQuery] = useState('');
  const selected = conversations.find((conversation) => conversation.id === selectedId) || conversations[0];

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    return conversations.filter((conversation) =>
      conversation.customer.toLowerCase().includes(normalized) ||
      conversation.channel.toLowerCase().includes(normalized) ||
      conversation.intent.toLowerCase().includes(normalized)
    );
  }, [query]);

  return (
    <div className="-m-4 h-[calc(100vh-64px)] overflow-hidden bg-white sm:-m-6">
      <div className="grid h-full lg:grid-cols-[340px_1fr_340px]">
        <aside className="hidden border-r border-border/60 bg-white lg:flex lg:flex-col">
          <div className="border-b border-border/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-lg font-black">AI Dialogs</h1>
                <p className="text-xs text-muted-foreground">{conversations.length} диалога · {conversations.filter((c) => c.status === 'ai_active').length} AI active</p>
              </div>
              <Badge variant="success">LIVE</Badge>
            </div>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Поиск клиента, канала, intent..." />
            </div>
          </div>
          <div className="custom-scrollbar flex-1 overflow-y-auto">
            {filtered.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                selected={conversation.id === selected.id}
                onClick={() => setSelectedId(conversation.id)}
              />
            ))}
          </div>
        </aside>

        <main className="flex min-w-0 flex-col bg-[hsl(240,20%,99%)]">
          <div className="border-b border-border/60 bg-white px-4 py-4 sm:px-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-cyan-50 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-black">{selected.customer}</h2>
                    <AIStatusBadge status={statusMap[selected.status]?.badge} size="md" />
                    <Badge variant="outline">{selected.channel}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{selected.summary}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Заметка
                </Button>
                <Button size="sm" className="gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Escalate
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-b border-border/60 bg-white/75 px-4 py-3 sm:grid-cols-3 sm:px-6">
            <div className="rounded-xl border border-border/60 bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Intent</p>
              <p className="mt-1 text-sm font-black">{intentLabels[selected.intent] || selected.intent}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Confidence</p>
              <p className="mt-1 text-sm font-black text-primary">{Math.round(selected.confidence * 100)}%</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sentiment</p>
              <p className="mt-1 text-sm font-black capitalize text-emerald-700">{selected.sentiment}</p>
            </div>
          </div>

          <div className="custom-scrollbar flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mx-auto max-w-3xl space-y-4">
              {chatMessages.map((message, index) => <MessageBubble key={`${message.time}-${index}`} message={message} index={index} />)}
              {selected.status === 'ai_active' && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/8 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl rounded-tl-md border border-border/60 bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((item) => (
                          <span key={item} className="h-1.5 w-1.5 rounded-full bg-primary ai-thinking" style={{ animationDelay: `${item * 0.18}s` }} />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">AI печатает...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-border/60 bg-white p-4">
            <div className="mx-auto flex max-w-3xl items-end gap-2">
              <Textarea rows={2} className="min-h-[52px] resize-none" placeholder="Ответ оператора или внутренняя инструкция для AI..." />
              <Button className="h-[52px] gap-2">
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </main>

        <aside className="hidden border-l border-border/60 bg-slate-50/60 lg:flex lg:flex-col">
          <div className="border-b border-border/60 bg-white p-4">
            <p className="text-sm font-black">AI timeline</p>
            <p className="mt-1 text-xs text-muted-foreground">Tool calls, actions and audit events</p>
          </div>
          <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-4">
            <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm font-bold">AI summary</p>
              </div>
              <p className="mt-2 text-xs leading-6 text-slate-600">{selected.summary}</p>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Tool calls</p>
              <div className="space-y-2">
                {toolTimeline.map((tool) => <ToolCallRow key={tool.name} tool={tool} />)}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Actions</p>
              <div className="space-y-2">
                {[
                  ['Intent detected', 'booking_request · 0.96'],
                  ['Slot reserved', 'VIP-7 · 20:00 · 4 guests'],
                  ['Payment link', 'Kaspi · 10 000 ₸ · pending'],
                  ['Manager notified', 'Telegram internal channel'],
                ].map(([title, text]) => (
                  <div key={title} className="flex gap-3 rounded-xl border border-border/60 bg-white p-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold">{title}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Internal notes</p>
              <div className="rounded-xl border border-border/60 bg-white p-3">
                <p className="text-xs leading-5 text-slate-600">VIP-гость. Предложить стол у окна и десертный сет после подтверждения оплаты.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
