const axios = require('axios');

let visitData = {}; // memoria temporal

exports.handler = async (event) => {
  const ip = event.headers['x-forwarded-for']?.split(',')[0] || '8.8.8.8';

  try {
    const { data } = await axios.get(`https://ipapi.co/${ip}/json/`);
    const country = data.country_name || 'Desconocido';

    visitData[country] = (visitData[country] || 0) + 1;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Visit recorded', country }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get country from IP' }),
    };
  }
};
