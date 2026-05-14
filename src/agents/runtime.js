function classifyIntent(message) {
  const text = String(message || '').toLowerCase();
  if (/(оператор|менеджер|позовите|с человеком|human)/i.test(text)) return { intent: 'human_request', confidence: 0.9 };
  if (/(жалоб|плохо|ужас|complaint)/i.test(text)) return { intent: 'complaint', confidence: 0.88 };
  if (/(отмен|cancel)/i.test(text)) return { intent: 'cancel_reservation', confidence: 0.86 };
  if (/(перенес|измен|modify)/i.test(text)) return { intent: 'modify_reservation', confidence: 0.84 };
  if (/(брон|стол|номер|гост|сегодня|завтра|вечер|book)/i.test(text)) return { intent: 'booking_request', confidence: 0.94 };
  if (/(оплат|kaspi|halyk|депозит|pay)/i.test(text)) return { intent: 'payment_question', confidence: 0.87 };
  if (/(меню|блюд|menu)/i.test(text)) return { intent: 'menu_question', confidence: 0.82 };
  if (/(цена|стоим|прайс|price)/i.test(text)) return { intent: 'price_question', confidence: 0.8 };
  return { intent: 'unknown', confidence: 0.55 };
}

function extractEntities(message) {
  const text = String(message || '').toLowerCase();
  const guestsMatch = text.match(/(\d+)\s*(гост|человек|персон|people|guests)/);
  const timeMatch = text.match(/([01]?\d|2[0-3])[:. ]?([0-5]\d)?/);
  return {
    guests: guestsMatch ? Number(guestsMatch[1]) : undefined,
    time: timeMatch ? `${timeMatch[1].padStart(2, '0')}:${timeMatch[2] || '00'}` : undefined,
    date: text.includes('завтра') ? 'tomorrow' : text.includes('сегодня') ? 'today' : undefined,
    payment_provider: text.includes('halyk') ? 'halyk' : text.includes('freedom') ? 'freedom_pay' : 'kaspi',
  };
}

export async function handleAgentMessage(input) {
  const { intent, confidence } = classifyIntent(input.message);
  const entities = extractEntities(input.message);
  const conversation_id = input.conversation_id || `conv_${Date.now()}`;
  const toolCalls = [
    { name: 'detect_intent', status: 'mock', output: { intent, confidence } },
    { name: 'extract_entities', status: 'mock', output: entities },
  ];
  const actions = ['detect_intent', 'write_analytics_event'];
  let reply = 'Принял сообщение. Уточняю детали и продолжу диалог.';
  let shouldEscalate = confidence < 0.65 || intent === 'complaint' || intent === 'human_request';

  if (intent === 'booking_request' && !shouldEscalate) {
    const reservationId = `rsv_${Date.now()}`;
    const paymentId = `pay_${Date.now()}`;
    actions.push('check_availability', 'create_reservation', 'create_payment', 'send_notification', 'sync_iiko', 'sync_1c');
    toolCalls.push(
      { name: 'get_available_slots', status: 'mock', output: { available: true, table_id: entities.guests > 8 ? 'banquet-room-a' : 'vip-table-7' } },
      { name: 'create_reservation', status: 'mock', output: { reservation_id: reservationId, status: 'pending_payment' } },
      { name: 'create_payment', status: 'mock', output: { payment_id: paymentId, provider: entities.payment_provider, url: `https://pay.mock/${paymentId}` } },
      { name: 'sync_iiko', status: 'mock', output: { queued: true } },
      { name: 'sync_1c', status: 'mock', output: { queued: true } }
    );
    reply = `Нашел доступный слот и создал бронь. Ссылка на предоплату: https://pay.mock/${paymentId}. После оплаты бронь будет подтверждена автоматически.`;
  }

  if (shouldEscalate) {
    actions.push('escalate_to_human', 'send_notification');
    toolCalls.push({ name: 'send_notification', status: 'mock', output: { manager_notified: true } });
    reply = 'Передаю диалог менеджеру и сохраняю резюме обращения.';
  }

  return {
    reply,
    intent,
    confidence,
    actions,
    toolCalls,
    conversation_id,
    shouldEscalate,
    entities,
  };
}
