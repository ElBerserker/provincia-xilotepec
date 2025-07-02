import { useEffect, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';

// Mapeo de países a códigos ISO
const getCountryCode = (countryName) => {
  const countryMap = {
    'méxico': 'MX', 'mexico': 'MX',
    'españa': 'ES', 'spain': 'ES',
    'colombia': 'CO', 'argentina': 'AR',
    'perú': 'PE', 'peru': 'PE',
    'chile': 'CL', 'venezuela': 'VE',
    'estados unidos': 'US', 'united states': 'US',
    'desconocido': 'UN'
  };

  return countryMap[countryName?.toLowerCase()] || '';
};

const VisitCounter = () => {
  const [stats, setStats] = useState({ 
    total: 0, 
    countries: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Registrar visita
        await fetch('/.netlify/functions/track-visit', { method: 'POST' });
        
        // Obtener estadísticas
        const res = await fetch('/.netlify/functions/get-visits');
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || "Error al cargar visitas");

        setStats({
          total: data.totalVisits,
          countries: data.countries.map(c => ({
            ...c,
            code: getCountryCode(c.country)
          }))
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Cargando estadísticas...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '16px',
      borderRadius: '10px',
      zIndex: 1000,
      maxWidth: '300px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <h3 style={{ margin: '0 0 12px 0', borderBottom: '1px solid #444', paddingBottom: '8px' }}>
        🌍 Visitas totales: <strong>{stats.total.toLocaleString()}</strong>
      </h3>
      
      <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '8px' }}>
        {stats.countries.map((country, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 0',
            borderBottom: index === stats.countries.length - 1 ? 'none' : '1px dashed #444'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {country.code && (
                <ReactCountryFlag
                  countryCode={country.code}
                  svg
                  style={{ width: '1.4em', height: '1em' }}
                  title={country.country}
                />
              )}
              <span>{country.country}</span>
            </div>
            <strong>{country.visit_count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisitCounter;