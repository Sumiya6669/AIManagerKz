create or replace function public.current_organization_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id from public.profiles where id = auth.uid()
$$;

create or replace function public.current_profile_role()
returns public.profile_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_org_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role() in ('owner', 'admin'), false)
$$;

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.branches enable row level security;
alter table public.customers enable row level security;
alter table public.tables enable row level security;
alter table public.rooms enable row level security;
alter table public.reservations enable row level security;
alter table public.payments enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
alter table public.integrations enable row level security;
alter table public.integration_logs enable row level security;
alter table public.menu_items enable row level security;
alter table public.notifications enable row level security;
alter table public.analytics_events enable row level security;
alter table public.ai_agent_runs enable row level security;
alter table public.ai_tool_calls enable row level security;
alter table public.subscriptions enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles can read org profiles"
on public.profiles for select
using (organization_id = public.current_organization_id() or id = auth.uid());

create policy "profiles self update"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "admins manage profiles"
on public.profiles for all
using (organization_id = public.current_organization_id() and public.is_org_admin())
with check (organization_id = public.current_organization_id() and public.is_org_admin());

create policy "members read own organization"
on public.organizations for select
using (id = public.current_organization_id());

create policy "admins update own organization"
on public.organizations for update
using (id = public.current_organization_id() and public.is_org_admin())
with check (id = public.current_organization_id() and public.is_org_admin());

create policy "tenant read branches" on public.branches for select using (organization_id = public.current_organization_id());
create policy "admins write branches" on public.branches for all using (organization_id = public.current_organization_id() and public.is_org_admin()) with check (organization_id = public.current_organization_id() and public.is_org_admin());

create policy "tenant read customers" on public.customers for select using (organization_id = public.current_organization_id());
create policy "staff write customers" on public.customers for all using (organization_id = public.current_organization_id()) with check (organization_id = public.current_organization_id());

create policy "tenant read tables" on public.tables for select using (organization_id = public.current_organization_id());
create policy "admins write tables" on public.tables for all using (organization_id = public.current_organization_id() and public.is_org_admin()) with check (organization_id = public.current_organization_id() and public.is_org_admin());

create policy "tenant read rooms" on public.rooms for select using (organization_id = public.current_organization_id());
create policy "admins write rooms" on public.rooms for all using (organization_id = public.current_organization_id() and public.is_org_admin()) with check (organization_id = public.current_organization_id() and public.is_org_admin());

create policy "tenant read reservations" on public.reservations for select using (organization_id = public.current_organization_id());
create policy "staff write reservations" on public.reservations for all using (organization_id = public.current_organization_id()) with check (organization_id = public.current_organization_id());

create policy "tenant read payments" on public.payments for select using (organization_id = public.current_organization_id());
create policy "staff write payments" on public.payments for all using (organization_id = public.current_organization_id() and public.current_profile_role() in ('owner','admin','manager','accountant')) with check (organization_id = public.current_organization_id());

create policy "tenant read conversations" on public.ai_conversations for select using (organization_id = public.current_organization_id());
create policy "staff write conversations" on public.ai_conversations for all using (organization_id = public.current_organization_id()) with check (organization_id = public.current_organization_id());

create policy "tenant read messages" on public.ai_messages for select using (organization_id = public.current_organization_id());
create policy "staff write messages" on public.ai_messages for all using (organization_id = public.current_organization_id()) with check (organization_id = public.current_organization_id());

create policy "tenant read integrations" on public.integrations for select using (organization_id = public.current_organization_id());
create policy "admins write integrations" on public.integrations for all using (organization_id = public.current_organization_id() and public.is_org_admin()) with check (organization_id = public.current_organization_id() and public.is_org_admin());

create policy "tenant read integration logs" on public.integration_logs for select using (organization_id = public.current_organization_id());
create policy "service writes integration logs" on public.integration_logs for insert with check (organization_id is not null);

create policy "tenant read menu" on public.menu_items for select using (organization_id = public.current_organization_id());
create policy "staff write menu" on public.menu_items for all using (organization_id = public.current_organization_id()) with check (organization_id = public.current_organization_id());

create policy "tenant read notifications" on public.notifications for select using (organization_id = public.current_organization_id());
create policy "staff write notifications" on public.notifications for all using (organization_id = public.current_organization_id()) with check (organization_id = public.current_organization_id());

create policy "tenant read analytics" on public.analytics_events for select using (organization_id = public.current_organization_id());
create policy "service writes analytics" on public.analytics_events for insert with check (organization_id is not null);

create policy "tenant read agent runs" on public.ai_agent_runs for select using (organization_id = public.current_organization_id());
create policy "service writes agent runs" on public.ai_agent_runs for insert with check (organization_id is not null);

create policy "tenant read tool calls" on public.ai_tool_calls for select using (organization_id = public.current_organization_id());
create policy "service writes tool calls" on public.ai_tool_calls for insert with check (organization_id is not null);

create policy "tenant read subscriptions" on public.subscriptions for select using (organization_id = public.current_organization_id());
create policy "admins write subscriptions" on public.subscriptions for all using (organization_id = public.current_organization_id() and public.is_org_admin()) with check (organization_id = public.current_organization_id() and public.is_org_admin());

create policy "tenant read audit logs" on public.audit_logs for select using (organization_id = public.current_organization_id());
create policy "service writes audit logs" on public.audit_logs for insert with check (organization_id is not null);
