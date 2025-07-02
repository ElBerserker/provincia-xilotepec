const { createClient } = require('@supabase/supabase-js');

exports.handler = async () => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

  try {
    // 1. Total de visitas
    const { count: total, error: countError } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    // 2. Conteo por país (agrupado)
    const { data: countries, error: countriesError } = await supabase
      .rpc('get_visits_by_country');

    if (countriesError) throw countriesError;

    return {
      statusCode: 200,
      body: JSON.stringify({
        totalVisits: total,
        countries: countries || []
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
