import { createClient } from '@supabase/supabase-js';

const allowedBusinessTypes = new Set(['restaurant', 'cafe', 'restobar', 'hotel', 'other', 'bath_complex']);

function cors(response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function required(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export default async function handler(request, response) {
  cors(response);
  if (request.method === 'OPTIONS') return response.status(204).end();
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return response.status(500).json({ error: 'Server Supabase env is not configured.' });
  }

  const body = request.body || {};
  const {
    fullName,
    email,
    password,
    phone,
    organizationName,
    businessType = 'restaurant',
    city,
    defaultLanguage = 'ru',
  } = body;

  if (![fullName, email, password, phone, organizationName, city].every(required)) {
    return response.status(400).json({ error: 'fullName, email, password, phone, organizationName and city are required.' });
  }

  if (String(password).length < 8) {
    return response.status(400).json({ error: 'Password must contain at least 8 characters.' });
  }

  const safeBusinessType = allowedBusinessTypes.has(businessType) ? businessType : 'other';
  const dbBusinessType = safeBusinessType === 'bath_complex' ? 'other' : safeBusinessType;
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const createUser = await supabase.auth.admin.createUser({
      email,
      password,
      phone,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        default_language: defaultLanguage,
      },
    });

    if (createUser.error && !/already|registered|exists/i.test(createUser.error.message)) {
      throw createUser.error;
    }

    let user = createUser.data?.user;
    if (!user) {
      const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (error) throw error;
      user = data.users.find((item) => item.email?.toLowerCase() === String(email).toLowerCase());
      if (!user) throw new Error('User already exists but could not be loaded.');

      const update = await supabase.auth.admin.updateUserById(user.id, {
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName, default_language: defaultLanguage },
      });
      if (update.error) throw update.error;
      user = update.data.user;
    }

    const organization = await supabase
      .from('organizations')
      .insert({
        name: organizationName,
        business_type: dbBusinessType,
        billing_email: email,
        phone,
        settings: {
          default_language: defaultLanguage,
          requested_business_type: safeBusinessType,
          onboarding_completed: false,
          ai_name: defaultLanguage === 'kk' ? 'Айдана' : 'Alina',
          demo_mode: true,
        },
      })
      .select('id')
      .single();
    if (organization.error) throw organization.error;

    const branch = await supabase
      .from('branches')
      .insert({
        organization_id: organization.data.id,
        name: 'Main branch',
        city,
        settings: { default_language: defaultLanguage, onboarding_step: 'branch' },
      })
      .select('id')
      .single();
    if (branch.error) throw branch.error;

    const profile = await supabase.from('profiles').upsert({
      id: user.id,
      organization_id: organization.data.id,
      full_name: fullName,
      phone,
      role: 'owner',
    }, { onConflict: 'id' });
    if (profile.error) throw profile.error;

    await supabase.from('integrations').insert([
      { organization_id: organization.data.id, branch_id: branch.data.id, provider: 'telegram', category: 'communication', status: 'mock', config: { env: 'TELEGRAM_BOT_TOKEN' } },
      { organization_id: organization.data.id, branch_id: branch.data.id, provider: 'whatsapp', category: 'communication', status: 'mock', config: { env: 'WHATSAPP_API_TOKEN' } },
      { organization_id: organization.data.id, branch_id: branch.data.id, provider: 'kaspi', category: 'payment', status: 'mock', config: { env: 'KASPI_API_KEY' } },
      { organization_id: organization.data.id, branch_id: branch.data.id, provider: 'iiko', category: 'pos', status: 'mock', config: { env: 'IIKO_API_KEY' } },
      { organization_id: organization.data.id, branch_id: branch.data.id, provider: '1c', category: 'accounting', status: 'mock', config: { env: 'ONE_C_API_TOKEN' } },
      { organization_id: organization.data.id, branch_id: branch.data.id, provider: 'n8n', category: 'automation', status: 'mock', config: { env: 'N8N_WEBHOOK_SECRET' } },
    ]);

    return response.status(200).json({
      user_id: user.id,
      organization_id: organization.data.id,
      branch_id: branch.data.id,
      role: 'owner',
    });
  } catch (error) {
    console.error('Registration failed', error);
    return response.status(500).json({ error: error.message || 'Registration failed.' });
  }
}
