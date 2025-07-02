exports.handler = async () => {
  const visitData = require('./visit.js').visitData || {};
  const result = Object.entries(visitData).map(([country, count]) => ({ country, count }));

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
