export const organization = {
  id: 'org_demo_altyn',
  name: 'Altyn Hospitality Group',
  plan: 'Business',
  branches: [
    { id: 'branch_center', name: 'Altyn Center', city: 'Алматы', type: 'Ресторан' },
    { id: 'branch_rooftop', name: 'Altyn Rooftop', city: 'Астана', type: 'Рестобар' },
  ],
};

export const metrics = [
  { title: 'Брони сегодня', value: '38', subtitle: '+12% к прошлому четвергу', trend: '+12%', accent: 'blue' },
  { title: 'Выручка', value: '824 000 ₸', subtitle: 'получено через Kaspi/Halyk', trend: '+18%', accent: 'green' },
  { title: 'AI success rate', value: '92%', subtitle: 'без участия оператора', trend: '+6%', accent: 'purple' },
  { title: 'Средний ответ', value: '1.8 сек', subtitle: 'WhatsApp, Telegram, WebChat', trend: '-34%', accent: 'cyan' },
  { title: 'Lost revenue', value: '64 000 ₸', subtitle: 'ожидают повторного касания', trend: '4 оплаты', accent: 'amber' },
  { title: 'Automation rate', value: '88%', subtitle: 'tool calls выполнены успешно', trend: '+9%', accent: 'indigo' },
];

export const activityFeed = [
  { time: '14:12', type: 'intent', title: 'AI определил intent', text: 'booking_request · confidence 0.96 · Telegram' },
  { time: '14:11', type: 'booking', title: 'Бронь создана', text: '4 гостя · сегодня 20:00 · VIP-зона' },
  { time: '14:10', type: 'payment', title: 'Kaspi ссылка отправлена', text: '10 000 ₸ · deposit · expires in 15 min' },
  { time: '14:08', type: 'sync', title: 'iiko sync complete', text: 'reservation_id RSV-2031 · 2 сек назад' },
  { time: '14:07', type: 'alert', title: 'Эскалация менеджеру', text: 'Банкет на 30 гостей требует ручного расчёта' },
  { time: '14:05', type: 'upsell', title: 'AI предложил upsell', text: 'Депозит + сет “Chef table” · вероятность 74%' },
];

export const reservations = [
  { id: 'RSV-2031', customer: 'Айдос Нурланов', phone: '+7 701 123 4567', date: '2026-05-14', time: '20:00', guests: 4, status: 'confirmed', channel: 'Telegram', payment: 'paid', amount: 10000 },
  { id: 'RSV-2032', customer: 'Камила Серикова', phone: '+7 702 987 6543', date: '2026-05-14', time: '21:30', guests: 8, status: 'pending_payment', channel: 'WhatsApp', payment: 'pending', amount: 30000 },
  { id: 'RSV-2033', customer: 'Erlan Group', phone: '+7 700 222 3333', date: '2026-05-15', time: '19:00', guests: 18, status: 'new', channel: 'WebChat', payment: 'not_required', amount: 0 },
  { id: 'RSV-2034', customer: 'Динара Касымова', phone: '+7 707 888 1122', date: '2026-05-14', time: '18:30', guests: 2, status: 'confirmed', channel: 'Instagram', payment: 'paid', amount: 5000 },
  { id: 'RSV-2035', customer: 'Miras Hotel Guest', phone: '+7 747 111 9090', date: '2026-05-16', time: '22:00', guests: 6, status: 'confirmed', channel: 'Phone', payment: 'paid', amount: 15000 },
];

export const conversations = [
  {
    id: 'conv_101',
    customer: 'Айдос Нурланов',
    channel: 'Telegram',
    status: 'ai_active',
    intent: 'booking_request',
    confidence: 0.96,
    sentiment: 'positive',
    lastMessage: 'Да, бронируйте. Kaspi подходит.',
    summary: 'Клиент хочет столик на 4 гостей сегодня в 20:00. AI нашёл доступный VIP-стол и создаёт оплату.',
  },
  {
    id: 'conv_102',
    customer: 'Камила Серикова',
    channel: 'WhatsApp',
    status: 'human_active',
    intent: 'human_request',
    confidence: 0.83,
    sentiment: 'neutral',
    lastMessage: 'Нужен банкет на 30 человек и отдельное меню.',
    summary: 'Нужен ручной расчёт банкета. AI собрал дату, бюджет и предпочтения.',
  },
  {
    id: 'conv_103',
    customer: 'Динара Касымова',
    channel: 'Instagram',
    status: 'closed',
    intent: 'menu_question',
    confidence: 0.91,
    sentiment: 'positive',
    lastMessage: 'Спасибо, меню получила.',
    summary: 'AI отправил меню и предложил забронировать столик.',
  },
  {
    id: 'conv_104',
    customer: 'Miras Hotel Guest',
    channel: 'WebChat',
    status: 'waiting',
    intent: 'payment_question',
    confidence: 0.88,
    sentiment: 'neutral',
    lastMessage: 'Можно оплатить Halyk?',
    summary: 'AI объясняет варианты оплаты и готовит ссылку Halyk.',
  },
];

export const chatMessages = [
  { role: 'customer', time: '14:03', text: 'Хочу столик на 4 человека сегодня в 20:00' },
  { role: 'ai', time: '14:03', text: 'Проверяю доступность. Подскажите, нужен обычный зал или VIP-зона?', tool: 'detect_intent() -> booking_request · 0.96' },
  { role: 'customer', time: '14:04', text: 'Лучше VIP, если есть свободно.' },
  { role: 'ai', time: '14:04', text: 'Есть свободный стол №7 в VIP-зоне на 20:00. Создать бронь и отправить Kaspi предоплату 10 000 ₸?', tool: 'get_available_slots(date, time, guests)' },
  { role: 'customer', time: '14:05', text: 'Да, бронируйте. Kaspi подходит.' },
  { role: 'ai', time: '14:05', text: 'Готово. Бронь создана, ссылка Kaspi отправлена. После оплаты я автоматически подтвержу бронь и отправлю её в iiko.', tool: 'create_reservation() -> create_payment() -> send_notification()' },
];

export const toolTimeline = [
  { name: 'detect_intent()', status: 'success', latency: '182ms', payload: 'booking_request' },
  { name: 'extract_entities()', status: 'success', latency: '240ms', payload: 'guests=4, time=20:00' },
  { name: 'get_available_slots()', status: 'success', latency: '410ms', payload: 'table=VIP-7' },
  { name: 'create_reservation()', status: 'success', latency: '320ms', payload: 'RSV-2031' },
  { name: 'create_payment()', status: 'pending', latency: '510ms', payload: 'Kaspi 10 000 ₸' },
  { name: 'sync_iiko()', status: 'queued', latency: '-', payload: 'after payment' },
];

export const integrations = [
  { name: 'Telegram Bot', category: 'Communication', status: 'connected', requests: '1 420', latency: '48ms', lastSync: '2 мин назад', env: 'TELEGRAM_BOT_TOKEN' },
  { name: 'WhatsApp Business API', category: 'Communication', status: 'pending', requests: '284', latency: '112ms', lastSync: 'ожидает ключ', env: 'WHATSAPP_API_TOKEN' },
  { name: 'Instagram Direct', category: 'Communication', status: 'mock', requests: '0', latency: '-', lastSync: 'placeholder', env: 'INSTAGRAM_API_TOKEN' },
  { name: 'Web Chat', category: 'Communication', status: 'connected', requests: '830', latency: '31ms', lastSync: 'сейчас', env: 'VITE_WEBCHAT_PUBLIC_KEY' },
  { name: 'Kaspi Pay', category: 'Payments', status: 'connected', requests: '89', latency: '124ms', lastSync: '5 мин назад', env: 'KASPI_API_KEY' },
  { name: 'Halyk epay', category: 'Payments', status: 'error', requests: '34', latency: '890ms', lastSync: 'ошибка подписи', env: 'HALYK_API_KEY' },
  { name: 'Freedom Pay', category: 'Payments', status: 'mock', requests: '0', latency: '-', lastSync: 'placeholder', env: 'FREEDOM_PAY_API_KEY' },
  { name: 'Manual payment', category: 'Payments', status: 'connected', requests: '12', latency: '-', lastSync: 'manual', env: '-' },
  { name: 'iiko POS', category: 'POS', status: 'connected', requests: '3 812', latency: '22ms', lastSync: '2 сек назад', env: 'IIKO_API_KEY' },
  { name: '1C', category: 'Accounting', status: 'mock', requests: '0', latency: '-', lastSync: 'placeholder', env: 'ONE_C_API_TOKEN' },
  { name: 'n8n Webhooks', category: 'Automation', status: 'connected', requests: '208', latency: '74ms', lastSync: '1 мин назад', env: 'N8N_WEBHOOK_SECRET' },
];

export const customers = [
  { id: 'cus_1', name: 'Айдос Нурланов', phone: '+7 701 123 4567', channel: 'Telegram', bookings: 12, spent: 184000, segment: 'VIP' },
  { id: 'cus_2', name: 'Камила Серикова', phone: '+7 702 987 6543', channel: 'WhatsApp', bookings: 4, spent: 96000, segment: 'Banquet' },
  { id: 'cus_3', name: 'Динара Касымова', phone: '+7 707 888 1122', channel: 'Instagram', bookings: 8, spent: 124000, segment: 'Regular' },
  { id: 'cus_4', name: 'Miras Hotel Guest', phone: '+7 747 111 9090', channel: 'WebChat', bookings: 2, spent: 45000, segment: 'Hotel' },
];

export const payments = [
  { id: 'PAY-9001', provider: 'Kaspi', status: 'paid', amount: 10000, reservation: 'RSV-2031', createdAt: '2026-05-14 14:06' },
  { id: 'PAY-9002', provider: 'Halyk', status: 'pending', amount: 30000, reservation: 'RSV-2032', createdAt: '2026-05-14 14:09' },
  { id: 'PAY-9003', provider: 'FreedomPay', status: 'paid', amount: 5000, reservation: 'RSV-2034', createdAt: '2026-05-14 13:52' },
  { id: 'PAY-9004', provider: 'Kaspi', status: 'failed', amount: 19000, reservation: 'RSV-2028', createdAt: '2026-05-14 12:31' },
];

export const menuItems = [
  { id: 'menu_1', name: 'Chef steak set', category: 'Основные блюда', price: 18500, available: true, margin: '41%' },
  { id: 'menu_2', name: 'Seafood plateau', category: 'Основные блюда', price: 32000, available: true, margin: '36%' },
  { id: 'menu_3', name: 'Dessert pairing', category: 'Десерты', price: 7800, available: true, margin: '54%' },
  { id: 'menu_4', name: 'Signature mocktails', category: 'Напитки', price: 3900, available: true, margin: '62%' },
  { id: 'menu_5', name: 'Banquet menu S', category: 'Банкеты', price: 22000, available: false, margin: '33%' },
];

export const callLog = [
  { id: 'call_1', name: 'Айдос Нурланов', phone: '+7 701 123 4567', status: 'completed', duration: '2:14', outcome: 'Бронь создана', confidence: 97 },
  { id: 'call_2', name: 'Динара Касымова', phone: '+7 707 888 1122', status: 'completed', duration: '1:45', outcome: 'Меню отправлено', confidence: 92 },
  { id: 'call_3', name: 'Камила Серикова', phone: '+7 702 987 6543', status: 'escalated', duration: '3:52', outcome: 'Банкет передан оператору', confidence: 78 },
  { id: 'call_4', name: 'Неизвестный гость', phone: '+7 700 555 6677', status: 'missed', duration: '0:00', outcome: 'Callback queued', confidence: 0 },
];
