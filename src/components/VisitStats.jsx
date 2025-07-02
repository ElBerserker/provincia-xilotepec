import { useEffect, useState } from 'react';
import axios from 'axios';

const VisitStats = () => {
  const [visits, setVisits] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        await axios.post('https://visit-count-nob6.onrender.com/api/visits'); // cambia por tu URL
        const { data } = await axios.get('https://visit-count-nob6.onrender.com/api/visits');
        setVisits(data);
        setTotal(data.reduce((acc, v) => acc + v.count, 0));
      } catch (error) {
        console.error('Error al obtener visitas:', error);
      }
    };

    fetchVisits();
  }, []);

  return (
    <div className="absolute top-40 rigth-4 bg-white shadow-md p-4 rounded z-[1000] text-sm w-full">
      <h2 className="font-bold text-lg mb-2">🌐 Visitas Globales</h2>
      <p className="mb-2">Total: <strong>{total}</strong></p>
      <ul className="list-disc pl-4">
        {visits.map(({ country, count }) => (
          <li key={country}>
            {country}: {count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VisitStats;
