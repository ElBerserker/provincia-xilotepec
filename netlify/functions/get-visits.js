// netlify/functions/get-visits.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async () => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  
  // Obtener conteo total
  const { count: total } = await supabase
    .from('visits')
    .select('*', { count: 'exact' });

  // Obtener conteo por país
  const { data: countries } = await supabase
    .from('visits')
    .select('country, count(*)')
    .groupBy('country')
    .order('count', { ascending: false });

  return {
    statusCode: 200,
    body: JSON.stringify({ 
      totalVisits: total,
      countries: countries || []
    })
  };
};