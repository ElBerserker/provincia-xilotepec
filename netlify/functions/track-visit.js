const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  console.log('Headers recibidos:', event.headers);
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    { auth: { persistSession: false } }
  );

  const ip = event.headers['x-nf-client-connection-ip'] || '127.0.0.1';
  const country = event.headers['x-country'] || 'Desconocido';
  const city = event.headers['x-city'] || 'Desconocido';

  console.log('Datos a insertar:', { ip, country, city });

  const { data, error } = await supabase
    .from('visits')
    .insert([{ 
      ip_address: ip, 
      country: country,
      city: city 
    }])
    .select();

  if (error) {
    console.error('Error Supabase:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ 
        error: error.message,
        details: error.details
      }) 
    };
  }

  console.log('Inserción exitosa:', data);
  return { 
    statusCode: 200, 
    body: JSON.stringify({ 
      success: true,
      inserted: data 
    }) 
  };
};