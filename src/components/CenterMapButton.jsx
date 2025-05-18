import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { FaCrosshairs, FaMapMarkerAlt } from 'react-icons/fa'; // Iconos de centrado y marcador
import { MdMyLocation } from 'react-icons/md'; // Alternativa de icono de ubicación

const CenterMapButton = ({ selectedPolygons, dateRange }) => {
  const map = useMap();

  const centerMapOnVisibleElements = () => {
    if (selectedPolygons.length === 0) {
      map.setView([19.954210, -99.534492], 10); // Vista por defecto
      return;
    }

    // Función para verificar si un elemento está en el rango de fechas visible
    const isVisible = (startDate, endDate) => {
      if (!dateRange || !dateRange[0] || !dateRange[1]) return true;
      if (!startDate) return false;
      
      const rangeStart = dateRange[0];
      const rangeEnd = dateRange[1];
      const startInRange = new Date(startDate) >= rangeStart && new Date(startDate) <= rangeEnd;
      const endInRange = endDate ? new Date(endDate) >= rangeStart && new Date(endDate) <= rangeEnd : false;
      const spansRange = new Date(startDate) <= rangeStart && (endDate ? new Date(endDate) >= rangeEnd : true);
      
      return startInRange || endInRange || spansRange;
    };

    // Recopilar todas las posiciones visibles
    let allPositions = [];

    selectedPolygons.forEach(polygon => {
      // Agregar polígono si es visible
      if (isVisible(polygon.startDate, polygon.endDate)) {
        allPositions = allPositions.concat(polygon.positions);
      }

      // Agregar marcadores visibles
      polygon.markers
        .filter(marker => isVisible(marker.startDate, marker.endDate))
        .forEach(marker => {
          allPositions.push(marker.position);
        });

      // Agregar rutas visibles
      polygon.routes
        .filter(route => isVisible(route.startDate, route.endDate))
        .forEach(route => {
          allPositions = allPositions.concat(route.positions);
        });
    });

    if (allPositions.length === 0) {
      // Si no hay elementos visibles, centrar en los polígonos seleccionados
      selectedPolygons.forEach(polygon => {
        allPositions = allPositions.concat(polygon.positions);
      });
    }

    // Calcular los límites del área visible
    const bounds = L.latLngBounds(allPositions);
    
    // Ajustar el zoom con un padding para mejor visualización
    map.fitBounds(bounds, {
      padding: [50, 50], // Padding en píxeles
      maxZoom: 16, // Zoom máximo permitido
      duration: 2
    });
  };

  return (
    <button
      onClick={centerMapOnVisibleElements}
      className="controls-personal z-[1000] p-2 md:p-2 rounded-md shadow-md hover:bg-gray-100 transition-colors flex items-center"
      title="Centrar mapa en elementos visibles"
    >
      <MdMyLocation className="h-6 w-6 text-gray-700" />
      <span className="hidden md:inline ml-2">Centrar</span>
    </button>
  );
};

export default CenterMapButton;