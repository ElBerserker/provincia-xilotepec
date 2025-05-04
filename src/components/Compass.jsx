import { useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';

const Compass = () => {
  const map = useMap();
  const [bearing, setBearing] = useState(0);

  useEffect(() => {
    const handleMove = () => {
      // Obtener el ángulo de rotación del mapa
      const angle = map.getBearing ? map.getBearing() : 0;
      setBearing(angle);
    };

    map.on('move', handleMove);
    return () => {
      map.off('move', handleMove);
    };
  }, [map]);

  return (
    <div className="absolute top-4 right-4 z-[1000] bg-white p-2 rounded-full shadow-md">
      <div className="relative w-10 h-10">
        {/* Círculo exterior */}
        <div className="absolute inset-0 rounded-full border-2 border-gray-300"></div>

        {/* Indicador Norte */}
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     w-0 h-0 border-l-4 border-r-4 border-b-6 border-l-transparent border-r-transparent 
                     border-b-red-500"
          style={{ transform: `translate(-50%, -50%) rotate(${bearing}deg)` }}
        ></div>

        {/* Puntos cardinales */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Norte (N) */}
          <div
            className="absolute top-0 text-xs font-bold text-red-500"
            style={{ transform: `rotate(${-bearing}deg) translateY(-12px)` }}
          >
            N
          </div>
          
          {/* Sur (S) */}
          <div
            className="absolute bottom-0 text-xs font-bold text-gray-600"
            style={{ transform: `rotate(${-bearing}deg) translateY(12px)` }}
          >
            S
          </div>
          
          {/* Este (E) */}
          <div
            className="absolute right-0 text-xs font-bold text-gray-600"
            style={{ transform: `rotate(${-bearing}deg) translateX(12px)` }}
          >
            E
          </div>
          
          {/* Oeste (W) */}
          <div
            className="absolute left-0 text-xs font-bold text-gray-600"
            style={{ transform: `rotate(${-bearing}deg) translateX(-12px)` }}
          >
            W
          </div>
        </div>

        {/* Punto central */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default Compass;