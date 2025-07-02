// src/components/VisitCounter.jsx
import { useEffect, useState } from 'react';

const VisitCounter = () => {
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    // Registrar visita
    fetch('/.netlify/functions/track-visit', { method: 'POST' });

    // Obtener total
    fetch('/.netlify/functions/get-visits')
      .then(res => res.json())
      .then(data => setVisits(data.totalVisits || 0));
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '8px',
      zIndex: 1000
    }}>
      👥 Visitas: {visits.toLocaleString()}
    </div>
  );
};

export default VisitCounter;