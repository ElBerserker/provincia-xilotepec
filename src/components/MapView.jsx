import { MapContainer, TileLayer, Polygon, Polyline, Marker, Popup, ScaleControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LayerSelector from './LayerSelector';
import Compass from './Compass';
import CaptureButton from './CaptureButton';
import CenterMapButton from './CenterMapButton';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = ({ polygons, selectedPolygons, onPolygonClick, dateRange }) => {
  // Función para verificar si una fecha está en el rango
  const isDateInRange = (startDate, endDate) => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return true;
    if (!startDate) return false;

    const rangeStart = dateRange[0];
    const rangeEnd = dateRange[1];
    const startInRange = new Date(startDate) >= rangeStart && new Date(startDate) <= rangeEnd;
    const endInRange = endDate ? new Date(endDate) >= rangeStart && new Date(endDate) <= rangeEnd : false;
    const spansRange = new Date(startDate) <= rangeStart && (endDate ? new Date(endDate) >= rangeEnd : true);

    return startInRange || endInRange || spansRange;
  };

  // Calculate center based on selected polygons or default to Teotihuacán
  const calculateCenter = () => {
    if (selectedPolygons.length > 0) {
      const firstPolygon = selectedPolygons[0];
      return [firstPolygon.positions[0][0], firstPolygon.positions[0][1]];
    }
    return [19.6925, -98.8438]; // Default center
  };

  return (
    <MapContainer
      center={calculateCenter()}
      zoom={14}      
      className="h-[100%] w-[100%] z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ScaleControl position="bottomleft" className="scale" imperial={false} />
      
      {/* Contenedor principal para los controles */}
      <div className="absolute top-24 right-4 z-[1000] flex flex-col gap-3">
        <LayerSelector />
        <CenterMapButton selectedPolygons={selectedPolygons} dateRange={dateRange} />
        <CaptureButton />
      </div>
      
      {/* Brújula (mantenemos su posición absoluta individual) */}
      <Compass />

      {/* Mostrar solo polígonos seleccionados y dentro del rango de fechas */}
      {selectedPolygons
        .filter(polygon => isDateInRange(polygon.startDate, polygon.endDate))
        .map((polygon) => (
          <Polygon
            key={polygon.id}
            positions={polygon.positions}
            pathOptions={{ color: polygon.color, fillOpacity: 0.2 }}
            eventHandlers={{
              click: () => onPolygonClick(polygon),
            }}
          />
        ))}

      {/* Mostrar rutas y marcadores dentro del rango de fechas */}
      {selectedPolygons.map((polygon) => (
        <>
          {polygon.routes
            .filter(route => isDateInRange(route.startDate, route.endDate))
            .map((route) => (
              <Polyline
                key={`${polygon.id}-${route.id}`}
                positions={route.positions}
                pathOptions={{ color: route.color, weight: 5 }}
              />
            ))}

          {polygon.markers
            .filter(marker => isDateInRange(marker.startDate, marker.endDate))
            .map((marker) => (
              <Marker key={`${polygon.id}-${marker.id}`} position={marker.position}>
                <Popup>
                  <div className="w-64">
                    <h3 className="font-bold text-lg">{marker.title}</h3>
                    {marker.image && (
                      <img
                        src={marker.image}
                        alt={marker.title}
                        className="w-full h-32 object-cover mb-2 rounded"
                      />
                    )}
                    <p className="text-sm">{marker.description}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      {marker.startDate && (
                        <p>Desde: {new Date(marker.startDate).toLocaleDateString('es-ES')}</p>
                      )}
                      {marker.endDate && (
                        <p>Hasta: {new Date(marker.endDate).toLocaleDateString('es-ES')}</p>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </>
      ))}
    </MapContainer>
  );
};

export default MapView;