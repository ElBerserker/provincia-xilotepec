import { useEffect, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';

// Mapeo mejorado de códigos de país a nombres completos
const getCountryName = (code) => {
  const countryNames = {
    US: 'Estados Unidos',
    MX: 'México',
    RO: 'Rumania',
    // Agrega más según necesites
  };
  return countryNames[code] || code; // Si no está en el mapa, muestra el código
};

const VisitCounter = () => {
  const [stats, setStats] = useState({ 
    total: 0, 
    countries: [] 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Registrar nueva visita
        await fetch('/.netlify/functions/track-visit', { method: 'POST' });
        
        // 2. Obtener estadísticas
        const response = await fetch('/.netlify/functions/get-visits');
        const data = await response.json();
        
        setStats({
          total: data.totalVisits,
          countries: data.countries.map(item => ({
            code: item.country, // US, MX, etc.
            name: getCountryName(item.country),
            count: item.visit_count
          }))
        });
      } catch (error) {
        console.error("Error fetching visits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div style={{ color: '#666' }}>Cargando estadísticas...</div>;

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
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h3 style={{ 
        margin: '0 0 12px 0',
        fontSize: '1.1em',
        borderBottom: '1px solid #444',
        paddingBottom: '8px'
      }}>
        🌍 Visitas totales: <strong>{stats.total.toLocaleString()}</strong>
      </h3>
      
      <div style={{ 
        maxHeight: '200px',
        overflowY: 'auto',
        paddingRight: '8px'
      }}>
        {stats.countries.map((country, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 0',
            borderBottom: index === stats.countries.length - 1 ? 'none' : '1px dashed #444'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ReactCountryFlag
                countryCode={country.code}
                svg
                style={{
                  width: '1.4em',
                  height: '1em',
                  boxShadow: '0 0 1px rgba(0,0,0,0.5)'
                }}
                title={country.name}
              />
              <span>{country.name}</span>
            </div>
            <strong>{country.count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisitCounter;