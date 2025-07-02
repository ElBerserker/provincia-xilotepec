// src/components/VisitCounter.jsx
import { useEffect, useState } from 'react';
import ccl from 'country-code-lookup';


export const getCountryCode = (countryName) => {
  if (!countryName) return '';
  
  try {
    // Busca por nombre en inglés o español
    const country = ccl.byCountry(countryName) || 
                    ccl.byCountrySpanish(countryName);
    return country?.iso2 || '';
  } catch {
    return '';
  }
};

const VisitCounter = () => {
  const [stats, setStats] = useState({ total: 0, countries: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Primero registra la visita
        await fetch('/.netlify/functions/track-visit', { method: 'POST' });
        
        // Luego obtiene los datos
        const res = await fetch('/.netlify/functions/get-visits');
        if (!res.ok) throw new Error('Error al obtener visitas');
        
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.85)',
      color: 'white',
      padding: '16px',
      borderRadius: '10px',
      zIndex: 1000,
      maxWidth: '280px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginTop: 0, borderBottom: '1px solid #444', paddingBottom: '8px' }}>
        🌎 Visitas totales: <strong>{stats.total.toLocaleString()}</strong>
      </h3>
      
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {stats.countries.map((country, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '4px 0',
            borderBottom: index === stats.countries.length - 1 ? 'none' : '1px dashed #333'
          }}>
            <ReactCountryFlag countryCode={getCountryCode(country.country)} svg />

            <span>📍 {country.country || 'Desconocido'}:</span>
            <strong>{country.count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};  

export default VisitCounter;