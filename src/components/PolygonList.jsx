import { useState } from 'react';

const PolygonList = ({ polygons, selectedPolygons, onSelectPolygon, filterByDate }) => {
  const [expandedCenturies, setExpandedCenturies] = useState({});
  const [showAll, setShowAll] = useState(false);

  const togglePolygonSelection = (polygon) => {
    if (selectedPolygons.some(p => p.id === polygon.id)) {
      onSelectPolygon(selectedPolygons.filter(p => p.id !== polygon.id));
    } else {
      onSelectPolygon([...selectedPolygons, polygon]);
    }
  };

  // Función para convertir a número romano
  const toRoman = (num) => {
    const romanNumerals = [
      { value: 1000, symbol: 'M' },
      { value: 900, symbol: 'CM' },
      { value: 500, symbol: 'D' },
      { value: 400, symbol: 'CD' },
      { value: 100, symbol: 'C' },
      { value: 90, symbol: 'XC' },
      { value: 50, symbol: 'L' },
      { value: 40, symbol: 'XL' },
      { value: 10, symbol: 'X' },
      { value: 9, symbol: 'IX' },
      { value: 5, symbol: 'V' },
      { value: 4, symbol: 'IV' },
      { value: 1, symbol: 'I' }
    ];
    
    if (num <= 0) return '';
    
    let result = '';
    for (let i = 0; i < romanNumerals.length; i++) {
      while (num >= romanNumerals[i].value) {
        result += romanNumerals[i].symbol;
        num -= romanNumerals[i].value;
      }
    }
    return result;
  };

  // Función para obtener el siglo en romano a partir del año
  const getCentury = (year) => {
    if (!year) return 'Sin fecha';
    const yearNum = parseInt(year);
    const century = Math.ceil(yearNum / 100);
    return `Siglo ${toRoman(century)}`;
  };

  // Filtrar polígonos visibles según fecha
  const visiblePolygons = filterByDate(polygons);

  // Agrupar polígonos por siglo
  const groupedPolygons = visiblePolygons.reduce((acc, polygon) => {
    const century = getCentury(polygon.year);
    if (!acc[century]) {
      acc[century] = [];
    }
    acc[century].push(polygon);
    return acc;
  }, {});

  // Ordenar los siglos de más antiguo a más reciente
  const sortedCenturies = Object.keys(groupedPolygons).sort((a, b) => {
    // Extraer el número del siglo para comparar
    const extractNumber = (str) => {
      const match = str.match(/Siglo ([A-Z]+)/);
      if (!match) return 0;
      const roman = match[1];
      // Conversión simple de romano a número para ordenar
      const romanMap = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
      let num = 0;
      for (let i = 0; i < roman.length; i++) {
        if (romanMap[roman[i]] < romanMap[roman[i+1]]) {
          num -= romanMap[roman[i]];
        } else {
          num += romanMap[roman[i]];
        }
      }
      return num;
    };
    
    return extractNumber(a) - extractNumber(b);
  });

  // Alternar visibilidad de un siglo
  const toggleCentury = (century) => {
    setExpandedCenturies(prev => ({
      ...prev,
      [century]: !prev[century]
    }));
  };

  // Alternar mostrar todos/agrupados
  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // Contar el total de polígonos visibles
  const totalVisiblePolygons = visiblePolygons.length;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-h-64 overflow-y-auto overflow-hidden scrollbar-hide">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Poligonos ({totalVisiblePolygons})</h2>
        <button 
          onClick={toggleShowAll}
          className="text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
        >
          {showAll ? 'Agrupar por siglo' : 'Mostrar todos'}
        </button>
      </div>

      {totalVisiblePolygons === 0 ? (
        <p className="text-gray-500 text-sm">No hay mapas visibles en el rango seleccionado</p>
      ) : showAll ? (
        <div className="space-y-2">
          {visiblePolygons.map((polygon) => {
            const isSelected = selectedPolygons.some(p => p.id === polygon.id);
            return (
              <div 
                key={polygon.id}
                onClick={() => togglePolygonSelection(polygon)}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-blue-100 border-l-4 border-blue-500' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="mt-1 mr-2"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <h3 className="font-medium">{polygon.name}</h3>
                    <div className="flex items-center mt-1">
                      <span 
                        className="inline-block w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: polygon.color }}
                      ></span>
                      <span className="text-sm text-gray-600">
                        {polygon.year && `${getCentury(polygon.year)} • ${polygon.year} • `}
                        {filterByDate(polygon.markers).length} puntos • {filterByDate(polygon.routes).length} rutas
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedCenturies.map((century) => (
            <div key={century} className="space-y-1">
              <div 
                onClick={() => toggleCentury(century)}
                className="flex justify-between items-center p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
              >
                <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">
                  {century}
                </h3>
                <span className="text-xs text-gray-500">
                  {groupedPolygons[century].length} mapas • 
                  <span className="ml-1">
                    {expandedCenturies[century] ? '▲' : '▼'}
                  </span>
                </span>
              </div>
              
              {expandedCenturies[century] && (
                <div className="space-y-2 pl-2 border-l-2 border-gray-200 ml-2">
                  {groupedPolygons[century].map((polygon) => {
                    const isSelected = selectedPolygons.some(p => p.id === polygon.id);
                    return (
                      <div 
                        key={polygon.id}
                        onClick={() => togglePolygonSelection(polygon)}
                        className={`p-2 rounded-md cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-100 border-l-4 border-blue-500' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="mt-1 mr-2"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div>
                            <h3 className="font-medium text-sm">{polygon.name}</h3>
                            <div className="flex items-center mt-1">
                              <span 
                                className="inline-block w-2 h-2 rounded-full mr-2"
                                style={{ backgroundColor: polygon.color }}
                              ></span>
                              <span className="text-xs text-gray-600">
                                {polygon.year} • {filterByDate(polygon.markers).length} puntos • {filterByDate(polygon.routes).length} líneas
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PolygonList;