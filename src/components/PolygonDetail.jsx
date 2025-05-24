import { useState } from 'react';
import { createPortal } from 'react-dom';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const PolygonDetail = ({ selectedPolygons, filterByDate }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);

  const handleImageClick = (imagen) => {
    setSelectedImage(imagen);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  if (selectedPolygons.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="text-gray-500">Selecciona un área para ver detalles</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Mapas seleccionados ({selectedPolygons.length})</h2>

      {selectedPolygons.map((polygon) => {
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
                    {polygon.temporality && `Temporalidad: ${polygon.temporality}`}
                    {/*
                    {polygon.startDate && `Desde ${new Date(polygon.startDate).toLocaleDateString('es-ES')}`}
                    {polygon.endDate && ` • Hasta ${new Date(polygon.endDate).toLocaleDateString('es-ES')}`}
                    */}
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
                        className="inline-block w-6 h-2 rounded mr-2"
                        style={{ backgroundColor: route.color }}
                      ></span>
                      <span className="text-sm">{route.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {polygon.image && isPolygonVisible && (
              <div className="relative">
                <img
                  src={polygon.image}
                  alt={polygon.name}
                  className="w-full h-32 object-cover rounded-md mb-3 cursor-zoom-in transition-transform duration-200 hover:opacity-90"
                  onClick={() => handleImageClick(polygon.image)}
                  onMouseEnter={() => setHoveredImage(polygon.id)}
                  onMouseLeave={() => setHoveredImage(null)}
                />
                {hoveredImage === polygon.id && (
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <div className="inline-block bg-black bg-opacity-70 text-white text-xs py-1 px-2 rounded">
                      Haz click para hacer zoom
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {selectedImage && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-90 z-[2000] flex items-center justify-center p-4">
          <div className='h-[60vh] flex flex-col justify-center'>
          <TransformWrapper
            initialScale={1}
            minScale={1}
            maxScale={5}
            wheel={{ step: 0.2 }}
            doubleClick={{ disabled: true }}
            panning={{ velocityDisabled: true }}            
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <div className="relative">
                <div className="absolute top-4 right-4 z-10 flex space-x-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      zoomIn();
                    }}
                    className="bg-black bg-opacity-30 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-30 transition-all"
                  >
                    +
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      zoomOut();
                    }}
                    className="bg-black bg-opacity-30 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-30 transition-all"
                  >
                    -
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      resetTransform();
                    }}
                    className="bg-black bg-opacity-30 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-30 transition-all"
                  >
                    ⟲
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseImage();
                    }}
                    className="bg-black bg-opacity-30 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-30 transition-all"
                  >
                    ✕
                  </button>
                </div>

                <TransformComponent
                  wrapperClass="w-full h-full flex items-center justify-center"
                  contentClass="flex items-center justify-center"
                >
                  <img 
                    src={selectedImage} 
                    alt="Zoomable" 
                    className="max-w-[90vw] max-h-[90vh] object-contain rounded shadow-xl"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </TransformComponent>
              </div>
            )}
          </TransformWrapper>
        </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default PolygonDetail;