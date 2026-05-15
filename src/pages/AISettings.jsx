import React from 'react';
import { Brain, Save, Shield, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

const permissions = [
  ['Создавать брони', 'create_reservation'],
  ['Создавать ссылки оплаты', 'create_payment'],
  ['Синхронизировать iiko', 'sync_iiko'],
  ['Передавать оператору', 'escalate_to_human'],
  ['Предлагать upsell', 'propose_upsell'],
];

export default function AISettings() {
  return (
    <div className="max-w-5xl space-y-6 animate-fade-in">
      <div>
        <Badge variant="secondary">Agent policy</Badge>
        <h1 className="mt-3 text-2xl font-black tracking-tight">AI Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Поведение AI-менеджера, права tool calls, escalation rules и provider routing.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Личность AI</CardTitle>
            <CardDescription>Настройте тон, язык и system instructions для hospitality сценариев.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Имя AI</Label>
                <Input className="mt-1.5" defaultValue="Алина" />
              </div>
              <div>
                <Label>Тон</Label>
                <Select defaultValue="premium">
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premium">Premium hospitality</SelectItem>
                    <SelectItem value="friendly">Friendly cafe</SelectItem>
                    <SelectItem value="formal">Formal hotel</SelectItem>
                    <SelectItem value="nightlife">Restobar nightlife</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Greeting</Label>
              <Textarea className="mt-1.5" defaultValue="Здравствуйте! Я AI-менеджер ресторана. Помогу забронировать стол, уточнить меню или отправить ссылку на оплату." />
            </div>
            <div>
              <Label>Custom rules</Label>
              <Textarea className="mt-1.5" rows={4} defaultValue="Не обещать скидки без правила. При банкетах более 12 гостей передавать менеджеру. При жалобах сразу эскалировать." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-primary" /> Provider routing</CardTitle>
            <CardDescription>OpenAI, Claude, Gemini или mock provider без ключей.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Primary provider</Label>
              <Select defaultValue="mock">
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mock">Mock AI provider</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Claude</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {['OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'GOOGLE_GENERATIVE_AI_API_KEY'].map((env) => (
              <div key={env} className="rounded-xl border border-border/60 bg-muted/30 p-3">
                <p className="font-mono text-xs font-bold">{env}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Add in Vercel and .env.local for real provider mode.</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-emerald-600" /> Tool permissions</CardTitle>
          <CardDescription>Ограничьте действия AI, которые меняют бизнес-данные.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {permissions.map(([label, tool]) => (
            <div key={tool} className="flex items-center justify-between rounded-xl border border-border/60 p-3">
              <div>
                <p className="text-sm font-bold">{label}</p>
                <p className="font-mono text-[11px] text-muted-foreground">{tool}()</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
          <div className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50 p-3">
            <div>
              <p className="text-sm font-bold text-amber-900">Escalation on complaint</p>
              <p className="text-[11px] text-amber-800">Complaint, low confidence, human_request</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Button className="gap-2">
        <Save className="h-4 w-4" />
        Сохранить AI policy
      </Button>
    </div>
  );
}
