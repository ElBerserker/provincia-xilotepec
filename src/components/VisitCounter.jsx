import { useEffect, useState } from 'react';

const VisitCounter = () => {
  const [stats, setStats] = useState({
    total: 0, // Valor inicial seguro
    countries: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Primero registra la visita
        await fetch('/.netlify/functions/track-visit', { method: 'POST' });
        
        // 2. Luego obtiene los datos
        const response = await fetch('/.netlify/functions/get-visits');
        
        if (!response.ok) {
          throw new Error('Error al obtener visitas');
        }
        
        const data = await response.json();
        
        // Validación adicional
        if (typeof data.totalVisits !== 'number') {
          throw new Error('Formato de datos inválido');
        }
        
        setStats({
          total: data.totalVisits || 0, // Fallback a 0 si es undefined/null
          countries: data.countries || []
        });
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Cargando estadísticas...</div>;
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
        🌎 Visitas totales: <strong>{(stats.total || 0).toLocaleString()}</strong>
      </h3>
      
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {stats.countries.map((country, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '4px 0',
            borderBottom: index === stats.countries.length - 1 ? 'none' : '1px dashed #333'
          }}>
            <span>📍 {country.country || 'Desconocido'}:</span>
            <strong>{country.count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};