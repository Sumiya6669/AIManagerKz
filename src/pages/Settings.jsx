import React from 'react';
import { Building2, Crown, KeyRound, MapPin, Save, ShieldCheck, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { organization } from '@/data/mockData';

export default function Settings() {
  return (
    <div className="max-w-5xl space-y-6 animate-fade-in">
      <div>
        <Badge variant="secondary">Workspace settings</Badge>
        <h1 className="mt-3 text-2xl font-black tracking-tight">Настройки</h1>
        <p className="mt-1 text-sm text-muted-foreground">Организация, филиалы, команда, роли, подписка и env-readiness.</p>
      </div>

      <Tabs defaultValue="organization">
        <TabsList className="flex h-auto flex-wrap justify-start">
          <TabsTrigger value="organization">Организация</TabsTrigger>
          <TabsTrigger value="branches">Филиалы</TabsTrigger>
          <TabsTrigger value="team">Команда</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="subscription">Подписка</TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="mt-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /> Организация</CardTitle>
              <CardDescription>Multi-tenant root entity. Все данные в Supabase привязаны к organization_id.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Название</Label>
                <Input className="mt-1.5" defaultValue={organization.name} />
              </div>
              <div>
                <Label>Тип бизнеса</Label>
                <Select defaultValue="restaurant">
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Ресторан</SelectItem>
                    <SelectItem value="cafe">Кафе</SelectItem>
                    <SelectItem value="restobar">Рестобар</SelectItem>
                    <SelectItem value="hotel">Гостиница</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>BIN / IIN</Label>
                <Input className="mt-1.5" placeholder="000000000000" />
              </div>
              <div>
                <Label>Billing email</Label>
                <Input className="mt-1.5" defaultValue="billing@altyn.example" />
              </div>
              <Button className="gap-2 sm:col-span-2">
                <Save className="h-4 w-4" />
                Сохранить настройки
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branches" className="mt-5">
          <div className="grid gap-4 md:grid-cols-2">
            {organization.branches.map((branch) => (
              <Card key={branch.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> {branch.name}</CardTitle>
                  <CardDescription>{branch.city} · {branch.type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input defaultValue={branch.city} />
                  <div className="flex items-center justify-between rounded-xl border border-border/60 p-3">
                    <span className="text-sm font-semibold">AI active in branch</span>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Role-based access</CardTitle>
              <CardDescription>Owner, admin, manager, operator, accountant. RLS policies используют profiles.role.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {['Owner · full access', 'Manager · reservations + dialogs', 'Operator · dialogs + notes', 'Accountant · payments + exports'].map((role) => (
                <div key={role} className="flex items-center justify-between rounded-xl border border-border/60 p-3">
                  <span className="text-sm font-semibold">{role}</span>
                  <Badge variant="outline">enabled</Badge>
                </div>
              ))}
              <Button variant="outline">Пригласить участника</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Production security</CardTitle>
              <CardDescription>Настройки безопасности и готовность к Supabase Auth.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {['Supabase Auth required in production', 'RLS enabled for tenant tables', 'Audit trail for agent and integration actions', 'Webhook secrets required for n8n and payments'].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-xl border border-border/60 p-3">
                  <span className="text-sm font-semibold">{item}</span>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="mt-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Crown className="h-5 w-5 text-amber-600" /> Business plan</CardTitle>
              <CardDescription>Готово для Stripe billing или локального биллинга через subscriptions.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {['Unlimited AI dialogs', '5 branches included', 'iiko + 1C adapters', 'Priority onboarding', 'Webhook automation', 'Audit exports'].map((feature) => (
                <div key={feature} className="rounded-xl border border-primary/10 bg-primary/5 p-3 text-sm font-semibold text-primary">{feature}</div>
              ))}
              <Button className="gap-2 md:col-span-3">
                <KeyRound className="h-4 w-4" />
                Управлять billing portal
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
