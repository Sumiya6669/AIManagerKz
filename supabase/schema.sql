create extension if not exists "pgcrypto";

create type public.business_type as enum ('restaurant', 'restobar', 'cafe', 'hotel', 'bath_complex', 'other');
create type public.profile_role as enum ('owner', 'admin', 'manager', 'operator', 'accountant', 'viewer');
create type public.reservation_status as enum ('new', 'pending_payment', 'confirmed', 'cancelled', 'completed', 'no_show');
create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded', 'cancelled');
create type public.payment_provider as enum ('kaspi', 'halyk', 'freedom_pay', 'mock', 'manual');
create type public.channel_type as enum ('telegram', 'whatsapp', 'webchat', 'instagram', 'phone', 'walk_in');
create type public.conversation_status as enum ('ai_active', 'human_active', 'waiting', 'closed');
create type public.integration_status as enum ('connected', 'pending', 'error', 'disabled', 'mock');
create type public.notification_status as enum ('queued', 'sent', 'failed', 'read');
create type public.subscription_status as enum ('trialing', 'active', 'past_due', 'cancelled');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business_type public.business_type not null default 'restaurant',
  billing_email text,
  phone text,
  country text default 'KZ',
  timezone text default 'Asia/Almaty',
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  full_name text,
  phone text,
  role public.profile_role not null default 'operator',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.branches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  city text,
  address text,
  timezone text default 'Asia/Almaty',
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  full_name text,
  phone text,
  email text,
  external_id text,
  source_channel public.channel_type,
  total_bookings integer not null default 0,
  total_spent numeric(14,2) not null default 0,
  tags text[] not null default '{}',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, phone)
);

create table public.tables (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  branch_id uuid not null references public.branches(id) on delete cascade,
  name text not null,
  zone text,
  seats integer not null check (seats > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  branch_id uuid not null references public.branches(id) on delete cascade,
  name text not null,
  room_type text default 'dining',
  capacity integer not null check (capacity > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  table_id uuid references public.tables(id) on delete set null,
  room_id uuid references public.rooms(id) on delete set null,
  status public.reservation_status not null default 'new',
  source_channel public.channel_type not null default 'webchat',
  starts_at timestamptz not null,
  ends_at timestamptz,
  guests_count integer not null check (guests_count > 0),
  deposit_amount numeric(14,2) default 0,
  notes text,
  external_refs jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  reservation_id uuid references public.reservations(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  provider public.payment_provider not null default 'mock',
  status public.payment_status not null default 'pending',
  amount numeric(14,2) not null check (amount >= 0),
  currency text not null default 'KZT',
  payment_url text,
  provider_payment_id text,
  paid_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  channel public.channel_type not null,
  external_id text,
  status public.conversation_status not null default 'ai_active',
  intent text,
  confidence numeric(4,3),
  sentiment text,
  ai_summary text,
  last_message text,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  role text not null check (role in ('customer', 'ai', 'operator', 'system', 'tool')),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete cascade,
  provider text not null,
  category text not null,
  status public.integration_status not null default 'pending',
  config jsonb not null default '{}'::jsonb,
  secret_ref text,
  last_sync_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, branch_id, provider)
);

create table public.integration_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  integration_id uuid references public.integrations(id) on delete set null,
  direction text not null check (direction in ('inbound', 'outbound')),
  event_type text not null,
  status text not null,
  request_payload jsonb,
  response_payload jsonb,
  error_message text,
  latency_ms integer,
  created_at timestamptz not null default now()
);

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete cascade,
  name text not null,
  description text,
  category text,
  price numeric(14,2) not null default 0,
  currency text not null default 'KZT',
  is_available boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  channel public.channel_type not null,
  status public.notification_status not null default 'queued',
  recipient text,
  subject text,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  event_name text not null,
  entity_type text,
  entity_id uuid,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.ai_agent_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  conversation_id uuid references public.ai_conversations(id) on delete cascade,
  agent_name text not null,
  provider text not null default 'mock',
  intent text,
  confidence numeric(4,3),
  input jsonb,
  output jsonb,
  status text not null default 'completed',
  error_message text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.ai_tool_calls (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  agent_run_id uuid references public.ai_agent_runs(id) on delete cascade,
  conversation_id uuid references public.ai_conversations(id) on delete cascade,
  tool_name text not null,
  status text not null default 'success',
  input jsonb,
  output jsonb,
  latency_ms integer,
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  plan text not null default 'starter',
  status public.subscription_status not null default 'trialing',
  seats integer not null default 1,
  branch_limit integer not null default 1,
  trial_ends_at timestamptz,
  current_period_ends_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id)
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index idx_profiles_organization on public.profiles(organization_id);
create index idx_branches_organization on public.branches(organization_id);
create index idx_customers_organization_phone on public.customers(organization_id, phone);
create index idx_reservations_org_starts_at on public.reservations(organization_id, starts_at);
create index idx_reservations_branch_status on public.reservations(branch_id, status);
create index idx_payments_org_status on public.payments(organization_id, status);
create index idx_ai_conversations_org_status on public.ai_conversations(organization_id, status);
create index idx_ai_messages_conversation_created on public.ai_messages(conversation_id, created_at);
create index idx_integration_logs_org_created on public.integration_logs(organization_id, created_at desc);
create index idx_analytics_events_org_created on public.analytics_events(organization_id, created_at desc);
create index idx_ai_agent_runs_org_created on public.ai_agent_runs(organization_id, created_at desc);
create index idx_ai_tool_calls_run on public.ai_tool_calls(agent_run_id);
create index idx_audit_logs_org_created on public.audit_logs(organization_id, created_at desc);

create trigger set_organizations_updated_at before update on public.organizations for each row execute function public.set_updated_at();
create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_branches_updated_at before update on public.branches for each row execute function public.set_updated_at();
create trigger set_customers_updated_at before update on public.customers for each row execute function public.set_updated_at();
create trigger set_tables_updated_at before update on public.tables for each row execute function public.set_updated_at();
create trigger set_rooms_updated_at before update on public.rooms for each row execute function public.set_updated_at();
create trigger set_reservations_updated_at before update on public.reservations for each row execute function public.set_updated_at();
create trigger set_payments_updated_at before update on public.payments for each row execute function public.set_updated_at();
create trigger set_ai_conversations_updated_at before update on public.ai_conversations for each row execute function public.set_updated_at();
create trigger set_integrations_updated_at before update on public.integrations for each row execute function public.set_updated_at();
create trigger set_menu_items_updated_at before update on public.menu_items for each row execute function public.set_updated_at();
create trigger set_subscriptions_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();
