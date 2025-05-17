import { useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import layersData from '../data/layersData.json';
import { FaLayerGroup } from 'react-icons/fa'; // Icono de capas
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Iconos de flecha

const LayerSelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLayer, setCurrentLayer] = useState(layersData.Layers[3]); // OpenStreetMap por defecto
    const map = useMap();

    const changeLayer = (layer) => {
        setCurrentLayer(layer);
        setIsOpen(false);
        // Actualizar el mapa base
        map.eachLayer((l) => {
            if (l.options.attribution) {
                map.removeLayer(l);
            }
        });

        L.tileLayer(layer.url, {
            attribution: layer.attribution
        }).addTo(map);
    };

    return (
        <div className="z-[1000] controls-personal">
            {/* Botón principal */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md shadow-lg flex items-center hover:bg-gray-100 transition-colors"
                title="Seleccionar capa del mapa"
            >
                <FaLayerGroup className="h-5 w-5 text-gray-700" />
                <span className="hidden md:inline ml-2">{currentLayer.name}</span>
                {isOpen ? (
                    <FaChevronUp className="h-3 w-3 ml-1 text-gray-600" />
                ) : (
                    <FaChevronDown className="h-3 w-3 ml-1 text-gray-600" />
                )}
            </button>

            {/* Menú desplegable */}
            {isOpen && (
                <div className="mt-2 bg-white rounded-md shadow-lg overflow-hidden w-full md:w-64 ">
                    {layersData.Layers.map((layer) => (
                        <div
                            key={layer.name}
                            onClick={() => changeLayer(layer)}
                            className={`p-3 cursor-pointer hover:bg-gray-100 flex items-center ${currentLayer.name === layer.name ? 'bg-blue-50' : ''
                                }`}
                        >
                            <div className="w-8 h-8 md:w-12 md:h-12 mr-2 md:mr-3 bg-gray-200 overflow-hidden rounded">
                                <img
                                    src={layer.previewUrl}
                                    alt={layer.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/48?text=Preview';
                                    }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm md:text-base truncate">{layer.name}</div>
                                <div className="text-xs text-gray-500 truncate hidden md:block">
                                    {layer.attribution.replace(/<[^>]+>/g, '')}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LayerSelector;