import { MapContainer, TileLayer, Polygon, Polyline, Marker, Popup, ScaleControl, Pane, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LayerSelector from './LayerSelector';
import Compass from './Compass';
import CaptureButton from './CaptureButton';
import CenterMapButton from './CenterMapButton';
import { trackPageView } from '../utils/analytics';
import { useEffect } from 'react';
import VisitCounter from './VisitCounter';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const caminoReal = [
  {
    name: 'Camino Real',
    description: 'Camino real de tierra adentro.',
    coords_route: [
      { latitude: 19.4382788294, longitude: -99.1340476016348, mapType: 'Jurisdiccion de Xilotepec-Chichimecas' },
      //{ latitude: 19.8755301987497, longitude: -99.5451710801731 , mapType: 'Mapa de Chapa de Mota-San Felipe'},
      //{ latitude: 19.9122572216547, longitude: -99.6498757208665 , mapType: 'Mapa de Chapa de Mota-San Felipe'},
      { latitude: 19.9491878389946, longitude: -99.3624454999214, mapType: 'Jurisdiccion de Xilotepec-Chichimecas' },
      { latitude: 19.96651575341602, longitude: -99.38082515439918, mapType: 'Mapa de 1583' },//Corregido
      { latitude: 20.050334744636768, longitude: -99.56308643939458, mapType: 'Mapa de 1583' },
      { latitude: 21.7850150200913, longitude: -101.541707455004, mapType: 'Jurisdiccion de Xilotepec-Chichimecas' },
      { latitude: 22.7719329748843, longitude: -102.572646983423, mapType: 'Jurisdiccion de Xilotepec-Chichimecas' }
    ]
  },
];

const MapView = ({ polygons, selectedPolygons, onPolygonClick, dateRange }) => {

  useEffect(() => {
    trackPageView(window.location.pathname); // Rastrea la página actual
  }, []);

  // Función para verificar si una fecha está en el rango
  const isDateInRange = (startDate, endDate, year) => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return true;

    const rangeStartYear = dateRange[0].getFullYear();
    const rangeEndYear = dateRange[1].getFullYear();

    // Preferir el campo year si está disponible
    if (year) {
      const itemYear = parseInt(year);
      return itemYear >= rangeStartYear && itemYear <= rangeEndYear;
    }

    // Fallback a startDate/endDate si year no está disponible
    if (!startDate) return false;

    const startYear = new Date(startDate).getFullYear();
    const endYear = endDate ? new Date(endDate).getFullYear() : startYear;

    return (
      (startYear >= rangeStartYear && startYear <= rangeEndYear) ||
      (endYear >= rangeStartYear && endYear <= rangeEndYear) ||
      (startYear <= rangeStartYear && endYear >= rangeEndYear)
    );
  };

  // Calculate center based on selected polygons
  const calculateCenter = () => {
    if (selectedPolygons.length > 0) {
      const firstPolygon = selectedPolygons[0];
      return [firstPolygon.positions[0][0], firstPolygon.positions[0][1]];
    }
    return [19.954210, -99.534492]; // Default center
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
        <VisitCounter />

      </div>

      {/* Brújula (mantenemos su posición absoluta individual) */}
      <Compass />

      <Pane name="caminoRealPane" style={{ zIndex: 400 }}>

        <Polyline
          positions={caminoReal[0].coords_route.map(coord => [coord.latitude, coord.longitude])}
          color='red'
          weight={4}
          pathOptions={{ pane: 'caminoRealPane' }}
          eventHandlers={{
            click: (e) => {
              // Abre un Popup en la posición del clic
              const popup = L.popup()
                .setLatLng(e.latlng)
                .setContent(`${caminoReal[0].description || 'Sin nombre'}`)
                .openOn(e.target._map);
            },
          }}
        >
        </Polyline>
      </Pane>

      {/* Mostrar solo polígonos seleccionados y dentro del rango de fechas */}
      {selectedPolygons
        .filter(polygon => isDateInRange(polygon.startDate, polygon.endDate, polygon.year))
        .map((polygon) => (
          <Polygon
            key={polygon.id}
            positions={polygon.positions}
            pathOptions={{ color: polygon.color, fillOpacity: 0.2 }}
            eventHandlers={{
              click: () => onPolygonClick(polygon),
            }}
          >
            <Popup>
              <div className="w-64">
                <h3 className="font-bold text-lg">{polygon.name}</h3>
                {polygon.image && (
                  <img
                    src={polygon.image}
                    alt={polygon.name}
                    className="w-full h-42 object-cover mb-2 rounded"
                  />
                )}
                {/*<p className="text-sm">{marker.description}</p>*/}
                <div className="text-xs text-gray-500 mt-2 flex">
                  <div className='text-left w-[30%]'>
                    {polygon.year && (<p><b>Año:</b> {polygon.year}</p>)}
                  </div>
                </div>
              </div>
            </Popup>
          </Polygon>
        ))}

      {/* Mostrar rutas y marcadores dentro del rango de fechas */}
      {selectedPolygons.map((polygon) => (
        <>

          {polygon.sub_polygons
            .filter(_sub_polygon => isDateInRange(polygon.startDate, polygon.endDate, polygon.year))
            .map((polygon) => (
              <Polygon
                key={polygon.id}
                positions={polygon.positions}
                pathOptions={{ color: polygon.color, weight: 5 }}

              >
                <Popup>
                  <div className="w-64">
                    <h3 className="font-bold text-lg">{polygon.name}</h3>
                    {polygon.image && (
                      <img
                        src={polygon.image}
                        alt={polygon.name}
                        className="w-full h-32 object-cover mb-2 rounded"
                      />
                    )}
                    {/*<p className="text-sm">{marker.description}</p>*/}
                    <div className="text-xs text-gray-500 mt-2 flex">
                      <div className='text-left w-[30%]'>
                        {polygon.year && (<p><b>Año:</b> {polygon.year}</p>)}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Polygon>
            ))}

          {polygon.routes
            .filter(route => isDateInRange(route.startDate, route.endDate, route.year))
            .map((route) => (
              <Polyline
                key={`${polygon.id}-${route.id}`}
                positions={route.positions}
                pathOptions={{ color: route.color, weight: 5 }}
                eventHandlers={{
                  click: (e) => {
                    // Abre un Popup en la posición del clic
                    const popup = L.popup()
                      .setLatLng(e.latlng)
                      .setContent(`${route.name || 'Sin nombre'}`)
                      .openOn(e.target._map);
                  },
                }}
              >
              </Polyline>
            ))}

          {polygon.markers
            .filter(marker => isDateInRange(marker.startDate, marker.endDate, marker.year))
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
                    {/*<p className="text-sm">{marker.description}</p>*/}
                    <div className="text-xs text-gray-500 mt-2 flex">
                      <div className='text-left w-[30%]'>
                        {marker.year && (<p><b>Año:</b> {marker.year}</p>)}
                      </div>
                      <div className='text-right w-full'>
                        {marker.type && (<p><b>Tipo:</b> {marker.type}</p>)}
                      </div>
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