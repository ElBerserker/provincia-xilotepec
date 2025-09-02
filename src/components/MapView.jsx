import { MapContainer, TileLayer, Polygon, Polyline, Marker, Popup, ScaleControl, Pane, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LayerSelector from './LayerSelector';
import Compass from './Compass';
import CaptureButton from './CaptureButton';
import CenterMapButton from './CenterMapButton';
import { trackPageView } from '../utils/analytics';
import { useEffect, useState, useRef } from 'react';
import VisitCounter from './VisitCounter';
import { FaVolumeUp, FaStop } from 'react-icons/fa';

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
      { latitude: 19.9491878389946, longitude: -99.3624454999214, mapType: 'Jurisdiccion de Xilotepec-Chichimecas' },
      { latitude: 19.96651575341602, longitude: -99.38082515439918, mapType: 'Mapa de 1583' },
      { latitude: 20.050334744636768, longitude: -99.56308643939458, mapType: 'Mapa de 1583' },
      { latitude: 21.7850150200913, longitude: -101.541707455004, mapType: 'Jurisdiccion de Xilotepec-Chichimecas' },
      { latitude: 22.7719329748843, longitude: -102.572646983423, mapType: 'Jurisdiccion de Xilotepec-Chichimecas' }
    ]
  },
];

// Componente para el botón de lectura de voz simplificado
const SpeechButton = ({ text, disabled, size = "medium", popupRef }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const sizeClasses = {
    small: "p-1 text-sm",
    medium: "p-2 text-base",
    large: "p-3 text-lg"
  };

  const iconSize = {
    small: 14,
    medium: 18,
    large: 22
  };

  const handleSpeech = (e) => {
    e.stopPropagation(); // Prevenir que el evento se propague y cierre el popup
    
    if (isSpeaking) {
      // Detener la lectura
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Iniciar la lectura
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <button
      onClick={handleSpeech}
      disabled={disabled}
      className={`
        flex items-center justify-center rounded-full transition-all duration-200
        ${disabled 
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
          : isSpeaking 
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-md' 
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow hover:shadow-lg'
        }
        ${sizeClasses[size]}
      `}
      title={disabled ? 'Reconocimiento de voz no disponible' : isSpeaking ? 'Detener lectura' : 'Leer descripción'}
    >
      {isSpeaking ? <FaStop size={iconSize[size]} /> : <FaVolumeUp size={iconSize[size]} />}
    </button>
  );
};

const MapView = ({ polygons, selectedPolygons, onPolygonClick, dateRange }) => {
  const [browserSupportsSpeech, setBrowserSupportsSpeech] = useState(false);
  const popupRef = useRef(null);

  // Verificar si el navegador soporta la API de speech
  useEffect(() => {
    const checkSpeechSupport = () => {
      const hasSpeechSynthesis = 'speechSynthesis' in window;
      setBrowserSupportsSpeech(hasSpeechSynthesis);
    };

    checkSpeechSupport();
  }, []);

  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  const isDateInRange = (startDate, endDate, year) => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return true;

    const rangeStartYear = dateRange[0].getFullYear();
    const rangeEndYear = dateRange[1].getFullYear();

    if (year) {
      const itemYear = parseInt(year);
      return itemYear >= rangeStartYear && itemYear <= rangeEndYear;
    }

    if (!startDate) return false;

    const startYear = new Date(startDate).getFullYear();
    const endYear = endDate ? new Date(endDate).getFullYear() : startYear;

    return (
      (startYear >= rangeStartYear && startYear <= rangeEndYear) ||
      (endYear >= rangeStartYear && endYear <= rangeEndYear) ||
      (startYear <= rangeStartYear && endYear >= rangeEndYear)
    );
  };

  const calculateCenter = () => {
    if (selectedPolygons.length > 0) {
      const firstPolygon = selectedPolygons[0];
      return [firstPolygon.positions[0][0], firstPolygon.positions[0][1]];
    }
    return [19.954210, -99.534492];
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

      <div className="absolute top-24 right-4 z-[1000] flex flex-col gap-3">
        <LayerSelector />
        <CenterMapButton selectedPolygons={selectedPolygons} dateRange={dateRange} />
        <CaptureButton />
        <VisitCounter />
      </div>

      <Compass />

      <Pane name="caminoRealPane" style={{ zIndex: 400 }}>
        <Polyline
          positions={caminoReal[0].coords_route.map(coord => [coord.latitude, coord.longitude])}
          color='red'
          weight={4}
          pathOptions={{ pane: 'caminoRealPane' }}
          eventHandlers={{
            click: (e) => {
              const popup = L.popup()
                .setLatLng(e.latlng)
                .setContent(`${caminoReal[0].description || 'Sin nombre'}`)
                .openOn(e.target._map);
            },
          }}
        />
      </Pane>

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
              <div 
                className="w-72" 
                ref={popupRef}
                onClick={(e) => e.stopPropagation()} // Prevenir cierre al hacer clic dentro del popup
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-gray-800 flex-1 mr-2">{polygon.name}</h3>
                  {browserSupportsSpeech && (
                    <SpeechButton 
                      text={`${polygon.name}. ${polygon.description}`} 
                      disabled={!browserSupportsSpeech}
                      size="medium"
                      popupRef={popupRef}
                    />
                  )}
                </div>
                {polygon.image && (
                  <img
                    src={polygon.image}
                    alt={polygon.name}
                    className="w-full h-42 object-cover mb-3 rounded-lg shadow-md"
                  />
                )}
                <p className="text-sm text-justify text-gray-700 max-h-48 overflow-auto pr-2 leading-relaxed">
                  {polygon.description}
                </p>
                <div className="text-xs text-gray-500 mt-3 flex border-t pt-2">
                  <div className='text-left w-[30%]'>
                    {polygon.year && (
                      <p className="font-semibold">
                        <span className="text-blue-600">Año:</span> {polygon.year}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Popup>
          </Polygon>
        ))}

      {selectedPolygons.map((polygon) => (
        <>
          {polygon.sub_polygons
            .filter(_sub_polygon => isDateInRange(polygon.startDate, polygon.endDate, polygon.year))
            .map((subPolygon) => (
              <Polygon
                key={subPolygon.id}
                positions={subPolygon.positions}
                pathOptions={{ color: subPolygon.color, weight: 5 }}
              >
                <Popup>
                  <div 
                    className="w-72"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-gray-800 flex-1 mr-2">{subPolygon.name}</h3>
                      {browserSupportsSpeech && (
                        <SpeechButton 
                          text={`${subPolygon.name}. ${subPolygon.description || ''}`} 
                          disabled={!browserSupportsSpeech}
                          size="medium"
                        />
                      )}
                    </div>
                    {subPolygon.image && (
                      <img
                        src={subPolygon.image}
                        alt={subPolygon.name}
                        className="w-full h-32 object-cover mb-3 rounded-lg shadow-md"
                      />
                    )}
                    <div className="text-xs text-gray-500 mt-3 flex border-t pt-2">
                      <div className='text-left w-[30%]'>
                        {subPolygon.year && (
                          <p className="font-semibold">
                            <span className="text-blue-600">Año:</span> {subPolygon.year}
                          </p>
                        )}
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
                    const popup = L.popup()
                      .setLatLng(e.latlng)
                      .setContent(`${route.name || 'Sin nombre'}`)
                      .openOn(e.target._map);
                  },
                }}
              />
            ))}

          {polygon.markers
            .filter(marker => isDateInRange(marker.startDate, marker.endDate, marker.year))
            .map((marker) => (
              <Marker key={`${polygon.id}-${marker.id}`} position={marker.position}>
                <Popup>
                  <div 
                    className="w-72"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-gray-800 flex-1 mr-2">{marker.title}</h3>
                      {browserSupportsSpeech && marker.description && (
                        <SpeechButton 
                          text={`${marker.title}`} 
                          disabled={!browserSupportsSpeech}
                          size="small"
                        />
                      )}
                    </div>
                    {marker.image && (
                      <img
                        src={marker.image}
                        alt={marker.title}
                        className="w-full h-32 object-cover mb-3 rounded-lg shadow-md"
                      />
                    )}
                    <div className="text-xs text-gray-500 mt-3 flex border-t pt-2">
                      <div className='text-left w-[30%]'>
                        {marker.year && (
                          <p className="font-semibold">
                            <span className="text-blue-600">Año:</span> {marker.year}
                          </p>
                        )}
                      </div>
                      <div className='text-right flex-1'>
                        {marker.type && (
                          <p className="font-semibold">
                            <span className="text-blue-600">Tipo:</span> {marker.type}
                          </p>
                        )}
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