const { createClient } = require('@supabase/supabase-js');

exports.handler = async () => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  try {
    // Obtener conteo total
    const { count: total } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true });

    // Obtener conteo por país (usando la sintaxis correcta)
    const { data: countries } = await supabase
      .from('visits')
      .select('country')
      .then(response => {
        // Agrupación manual
        const counts = {};
        response.data.forEach(visit => {
          const country = visit.country || 'Desconocido';
          counts[country] = (counts[country] || 0) + 1;
        });
        return Object.entries(counts).map(([country, count]) => ({
          country,
          count
        })).sort((a, b) => b.count - a.count);
      });

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        totalVisits: total,
        countries
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message,
        details: "Error al procesar los datos de visitas"
      })
    };
  }
};