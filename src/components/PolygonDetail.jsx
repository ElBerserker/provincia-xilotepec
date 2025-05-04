const PolygonDetail = ({ selectedPolygons, filterByDate }) => {
  if (selectedPolygons.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="text-gray-500">Selecciona un área para ver detalles</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md overflow-y-auto max-h-96">
      <h2 className="text-xl font-bold mb-4">Mapas seleccionados ({selectedPolygons.length})</h2>
      
      {selectedPolygons.map((polygon) => {
        // Filtrar marcadores y rutas visibles
        const visibleMarkers = filterByDate(polygon.markers);
        const visibleRoutes = filterByDate(polygon.routes);
        const isPolygonVisible = filterByDate([polygon]).length > 0;

        if (!isPolygonVisible && visibleMarkers.length === 0 && visibleRoutes.length === 0) {
          return null;
        }

        return (
          <div key={polygon.id} className="mb-6 last:mb-0">
            <div className="flex items-start mb-3">
              <div 
                className="w-16 h-16 rounded-md mr-4 bg-cover bg-center"
                style={{ 
                  backgroundColor: polygon.color + '20',
                  backgroundImage: polygon.image ? `url(${polygon.image})` : 'none'
                }}
              ></div>
              <div>
                <h3 className="text-lg font-bold">{polygon.name}</h3>
                <div className="flex items-center mt-1">
                  <span 
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: polygon.color }}
                  ></span>
                  <span className="text-sm text-gray-600">
                    {polygon.startDate && `Desde ${new Date(polygon.startDate).toLocaleDateString('es-ES')}`}
                    {polygon.endDate && ` • Hasta ${new Date(polygon.endDate).toLocaleDateString('es-ES')}`}
                  </span>
                </div>
              </div>
            </div>

            {visibleRoutes.length > 0 && (
              <div className="mb-3">
                <h4 className="font-semibold mb-1">Rutas disponibles ({visibleRoutes.length}):</h4>
                <div className="space-y-1">
                  {visibleRoutes.map((route) => (
                    <div key={route.id} className="flex items-center">
                      <span 
                        className="inline-block w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: route.color }}
                      ></span>
                      <span className="text-sm">{route.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {polygon.image && isPolygonVisible && (
              <img 
                src={polygon.image} 
                alt={polygon.name} 
                className="w-full h-32 object-cover rounded-md mb-3"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PolygonDetail;