insert into public.organizations (id, name, business_type, billing_email, phone, settings)
values (
  '00000000-0000-0000-0000-000000000001',
  'Altyn Hospitality Group',
  'restaurant',
  'billing@altyn.example',
  '+7 701 000 0000',
  '{"ai_name":"Алина","deposit_required":true,"default_deposit":10000}'::jsonb
)
on conflict (id) do nothing;

insert into public.branches (id, organization_id, name, city, address)
values
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Altyn Center', 'Алматы', 'Dostyk Ave 100'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'Altyn Rooftop', 'Астана', 'Mangilik El 55')
on conflict (id) do nothing;

insert into public.customers (id, organization_id, full_name, phone, source_channel, total_bookings, total_spent, tags)
values
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', 'Айдос Нурланов', '+7 701 123 4567', 'telegram', 12, 184000, '{VIP}'),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000001', 'Камила Серикова', '+7 702 987 6543', 'whatsapp', 4, 96000, '{banquet}'),
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000001', 'Динара Касымова', '+7 707 888 1122', 'instagram', 8, 124000, '{regular}')
on conflict (organization_id, phone) do nothing;

insert into public.tables (id, organization_id, branch_id, name, zone, seats)
values
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'VIP-7', 'VIP', 4),
  ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Main-12', 'Main hall', 6)
on conflict (id) do nothing;

insert into public.rooms (id, organization_id, branch_id, name, room_type, capacity)
values
  ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Banquet A', 'banquet', 32)
on conflict (id) do nothing;

insert into public.reservations (id, organization_id, branch_id, customer_id, table_id, status, source_channel, starts_at, guests_count, deposit_amount, notes)
values
  ('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000301', 'confirmed', 'telegram', now() + interval '4 hours', 4, 10000, 'AI-created demo reservation'),
  ('00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000202', null, 'pending_payment', 'whatsapp', now() + interval '6 hours', 8, 30000, 'Pending Kaspi deposit')
on conflict (id) do nothing;

insert into public.payments (id, organization_id, reservation_id, customer_id, provider, status, amount, payment_url, provider_payment_id, paid_at)
values
  ('00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000201', 'kaspi', 'paid', 10000, 'https://pay.mock/kaspi/demo', 'kaspi_demo_paid', now()),
  ('00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000202', 'halyk', 'pending', 30000, 'https://pay.mock/halyk/demo', 'halyk_demo_pending', null)
on conflict (id) do nothing;

insert into public.ai_conversations (id, organization_id, branch_id, customer_id, channel, status, intent, confidence, sentiment, ai_summary, last_message)
values
  ('00000000-0000-0000-0000-000000000701', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000201', 'telegram', 'ai_active', 'booking_request', 0.96, 'positive', 'Клиент бронирует стол на 4 гостей.', 'Да, бронируйте. Kaspi подходит.'),
  ('00000000-0000-0000-0000-000000000702', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000202', 'whatsapp', 'human_active', 'human_request', 0.83, 'neutral', 'Нужен расчет банкета на 30 гостей.', 'Передайте менеджеру.')
on conflict (id) do nothing;

insert into public.ai_messages (organization_id, conversation_id, role, content, metadata)
values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000701', 'customer', 'Хочу столик на 4 человека сегодня в 20:00', '{}'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000701', 'ai', 'Проверяю доступность...', '{"tool":"detect_intent"}');

insert into public.integrations (organization_id, branch_id, provider, category, status, config, last_sync_at)
values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'telegram', 'channel', 'connected', '{"webhook":true}', now()),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'kaspi', 'payment', 'connected', '{"mock":true}', now()),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'iiko', 'pos', 'connected', '{"mock":true}', now())
on conflict (organization_id, branch_id, provider) do nothing;

insert into public.menu_items (organization_id, branch_id, name, description, category, price, is_available)
values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Chef steak set', 'AI upsell item', 'Основные блюда', 18500, true),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Dessert pairing', 'High-margin dessert set', 'Десерты', 7800, true);

insert into public.subscriptions (organization_id, plan, status, seats, branch_limit, trial_ends_at)
values ('00000000-0000-0000-0000-000000000001', 'business', 'trialing', 10, 5, now() + interval '14 days')
on conflict (organization_id) do nothing;
