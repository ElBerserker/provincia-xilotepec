// netlify/functions/track-visit.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  const ip = event.headers['x-nf-client-connection-ip'];
  const country = event.headers['x-country'] || 'Desconocido';

  const { error } = await supabase
    .from('visits')
    .insert([{ ip_address: ip, country: country }]);

  if (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};