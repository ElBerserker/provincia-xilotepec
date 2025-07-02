const { createClient } = require('@supabase/supabase-js');

exports.handler = async () => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  try {
    const { data, error } = await supabase.rpc('get_visits_by_country');
    
    if (error) throw error;

    const totalVisits = data.reduce((total, item) => total + item.visit_count, 0);

    return {
      statusCode: 200,
      body: JSON.stringify({
        totalVisits,
        countries: data
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message,
        details: "Error al obtener datos de visitas"
      })
    };
  }
};