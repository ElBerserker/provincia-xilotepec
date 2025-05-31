import { useState, useEffect } from 'react';
import MapView from './components/MapView';
import PolygonList from './components/PolygonList';
import PolygonDetail from './components/PolygonDetail';
import TimeSlider from './components/TimeSlider';
import mapData from './data/mapData.json';

function App() {
  const [selectedPolygons, setSelectedPolygons] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);

  // Cerrar el menú al cambiar el tamaño de la pantalla si es mayor a md
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Función para filtrar elementos por año
  const filterByDate = (items) => {
    if (!dateRange[0] || !dateRange[1]) return items;

    const rangeStartYear = dateRange[0].getFullYear();
    const rangeEndYear = dateRange[1].getFullYear();

    return items.filter(item => {
      const itemYear = item.year ? parseInt(item.year) : null;

      if (!itemYear) return true;

      return itemYear >= rangeStartYear && itemYear <= rangeEndYear;
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden scrollbar-hide">
        {/* Sidebar */}
        <div className={`${showMobileMenu ? 'translate-x-0' : '-translate-x-full'} 
                        md:translate-x-0 transform transition-transform duration-300 ease-in-out
                        fixed md:static top-0 left-0 w-4/5 md:w-96 h-full bg-gray-50 p-4 
                        overflow-y-auto border-r border-gray-200 z-40 flex flex-col scrollbar-hide overflow-hidden`}>
          {/* Header del menú */}
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Provincia de Xilotepec</h2>
            <button
              className="md:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setShowMobileMenu(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contenido principal del menú */}
          <div className="flex-1 overflow-y-auto">
            <PolygonList
              polygons={mapData.polygons}
              selectedPolygons={selectedPolygons}
              onSelectPolygon={setSelectedPolygons}
              filterByDate={filterByDate}
            />

            <div className="mt-4">
              <PolygonDetail
                selectedPolygons={selectedPolygons}
                filterByDate={filterByDate}
              />
            </div>
          </div>

          {/* Footer con licencia - Versión mejorada */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-600 text-center">
              <p
                xmlns:cc="http://creativecommons.org/ns#"
                className="mb-2 leading-relaxed"
              >
                Este trabajo está licenciado bajo {' '}
                <a
                  href="https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1"
                  target="_blank"
                  rel="license noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  CC BY-NC-SA 4.0
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                Por el Mtro. Alejandro Lovera Limberg
              </p>
              <div className="flex justify-center space-x-1 mb-1">
                <img
                  src="https://mirrors.creativecommons.org/presskit/icons/cc.svg"
                  alt="Creative Commons"
                  className="h-5 w-5"
                />
                <img
                  src="https://mirrors.creativecommons.org/presskit/icons/by.svg"
                  alt="Atribución"
                  className="h-5 w-5"
                />
                <img
                  src="https://mirrors.creativecommons.org/presskit/icons/nc.svg"
                  alt="No Comercial"
                  className="h-5 w-5"
                />
                <img
                  src="https://mirrors.creativecommons.org/presskit/icons/sa.svg"
                  alt="Compartir Igual"
                  className="h-5 w-5"
                />
              </div>
              <p className="text-gray-500 text-xxs">Atribución - No Comercial - Compartir Igual</p>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {showMobileMenu && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
        )}

        {/* Main Map Area */}
        <div className="flex-1 relative">
          <MapView
            polygons={mapData.polygons}
            selectedPolygons={selectedPolygons}
            onPolygonClick={(polygon) => {
              if (!selectedPolygons.some(p => p.id === polygon.id)) {
                setSelectedPolygons([...selectedPolygons, polygon]);
              }
            }}
            dateRange={dateRange}
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 w-[90%] md:w-[70%]">
            <TimeSlider
              polygons={mapData.polygons}
              onDateRangeChange={setDateRange}
            />
          </div>
        </div>
      </div>

      {/* Mobile toggle button */}
      <div className="md:hidden fixed top-64 right-4 z-50">
        <button
          className="bg-blue-600 text-white p-4 rounded shadow-lg hover:bg-blue-700 transition-colors"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default App;