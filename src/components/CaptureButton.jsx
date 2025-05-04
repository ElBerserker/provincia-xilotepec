import { useState } from 'react';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { useMap } from 'react-leaflet';
import { FaCamera, FaSpinner } from 'react-icons/fa'; // Iconos de cámara y spinner
import { MdOutlinePhotoCamera } from 'react-icons/md'; // Alternativa de icono de cámara

const CaptureButton = () => {
  const map = useMap();
  const [isLoading, setIsLoading] = useState(false);

  const captureMap = async () => {
    setIsLoading(true);
    try {
      // Esperar a que todos los elementos se rendericen
      await new Promise(resolve => setTimeout(resolve, 500));

      // Obtener el contenedor del mapa
      const mapContainer = map.getContainer();
      
      // Configuración especial para Leaflet
      const options = {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
        filter: (node) => {
          // Excluir elementos no deseados
          if (node.classList && (
            node.classList.contains('leaflet-control-zoom') ||
            node.classList.contains('controls-personal')
          )) {
            return false;
          }
          return true;
        },
        style: {
          transform: 'none',
          overflow: 'visible'
        }
      };

      // Forzar redibujado de los elementos SVG
      mapContainer.querySelectorAll('svg').forEach(svg => {
        svg.setAttribute('width', svg.getBoundingClientRect().width);
        svg.setAttribute('height', svg.getBoundingClientRect().height);
      });

      // Capturar la imagen
      const dataUrl = await htmlToImage.toPng(mapContainer, options);
      
      // Descargar la imagen
      saveAs(dataUrl, `mapa-${new Date().toISOString().slice(0, 10)}.png`);
    } catch (error) {
      console.error('Error al capturar el mapa:', error);
      alert('Error al capturar el mapa. Por favor intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={captureMap}
      disabled={isLoading}
      className="z-[1000] controls-personal p-2 md:p-2 rounded-md shadow-md hover:bg-gray-100 transition-colors flex items-center"
      title="Capturar mapa como imagen"
    >
      {isLoading ? (
        <>
          <FaSpinner className="animate-spin h-5 w-5 text-gray-600" />
          <span className="hidden md:inline ml-2">Procesando...</span>
        </>
      ) : (
        <>
          <MdOutlinePhotoCamera className="h-6 w-6 text-gray-700" />
          <span className="hidden md:inline ml-2">Capturar Mapa</span>
        </>
      )}
    </button>
  );
};

export default CaptureButton;