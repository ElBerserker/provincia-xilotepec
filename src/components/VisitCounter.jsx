// src/components/VisitCounter.jsx
import { useEffect, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';


const VisitCounter = () => {
  const [stats, setStats] = useState({
    total: 0,
    countries: []
  });

  useEffect(() => {
    fetch('/.netlify/functions/get-visits')
      .then(res => res.json())
      .then(data => {
        setStats({
          total: data.totalVisits,
          countries: data.countries
        });
      });
  }, []);

  return (
    <div className='top-80' style={{
      position: 'fixed',

      right: '20px',
      background: 'rgba(255, 255, 255)',
      color: 'black',
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
            <span>📍 {country.country || 'Desconocido'}:</span>
            <strong>{country.count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisitCounter;
