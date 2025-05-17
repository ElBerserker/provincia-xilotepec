const PolygonList = ({ polygons, selectedPolygons, onSelectPolygon, filterByDate }) => {
  const togglePolygonSelection = (polygon) => {
    if (selectedPolygons.some(p => p.id === polygon.id)) {
      // Remove polygon if already selected
      onSelectPolygon(selectedPolygons.filter(p => p.id !== polygon.id));
    } else {
      // Add polygon if not selected
      onSelectPolygon([...selectedPolygons, polygon]);
    }
  };

  // Filtrar polígonos visibles según fecha
  const visiblePolygons = filterByDate(polygons);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-h-64 overflow-y-auto overflow-hidden scrollbar-hide">
      <h2 className="text-xl font-bold mb-4">Mapas Disponibles ({visiblePolygons.length})</h2>
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
                      {filterByDate(polygon.markers).length} marcadores • {filterByDate(polygon.routes).length} rutas
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PolygonList;