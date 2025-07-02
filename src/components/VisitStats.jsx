import { useEffect, useState } from 'react';

const VisitStats = () => {
  const [visits, setVisits] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        await fetch('/api/visit');
        const res = await fetch('/api/getVisits');
        const data = await res.json();
        setVisits(data);
        setTotal(data.reduce((sum, item) => sum + item.count, 0));
      } catch (err) {
        console.error('Error al obtener visitas', err);
      }
    };

    fetchVisits();
  }, []);

  return (
    <div className="absolute top-60 rigth-4 bg-white p-4 rounded shadow z-[1000] text-sm">
      <h2 className="font-bold text-lg mb-2">🌍 Visitas Globales</h2>
      <p>Total: <strong>{total}</strong></p>
      <ul className="list-disc pl-4 mt-2">
        {visits.map(({ country, count }) => (
          <li key={country}>{country}: {count}</li>
        ))}
      </ul>
    </div>
  );
};

export default VisitStats;
