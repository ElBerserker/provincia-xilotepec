// netlify/functions/get-visits.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async () => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  try {
    // Llama a tu función PostgreSQL existente
    const { data, error } = await supabase
      .rpc('get_visits_by_country');

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({
        totalVisits: data.reduce((sum, item) => sum + item.count, 0),
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