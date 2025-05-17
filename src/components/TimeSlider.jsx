import { useState, useEffect } from 'react';
import { Slider } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const TimeSlider = ({ polygons, onDateRangeChange }) => {
  // Obtener todas las fechas relevantes de los datos
  const allDates = [];
  
  polygons.forEach(polygon => {
    if (polygon.startDate) allDates.push(new Date(polygon.startDate));
    if (polygon.endDate) allDates.push(new Date(polygon.endDate));
    
    polygon.markers.forEach(marker => {
      if (marker.startDate) allDates.push(new Date(marker.startDate));
      if (marker.endDate) allDates.push(new Date(marker.endDate));
    });
    
    polygon.routes.forEach(route => {
      if (route.startDate) allDates.push(new Date(route.startDate));
      if (route.endDate) allDates.push(new Date(route.endDate));
    });
  });

  // Encontrar fechas mínima y máxima
  const minDate = new Date(Math.min(...allDates));
  const maxDate = new Date(Math.max(...allDates));
  
  // Convertir fechas a timestamps para el slider
  const minTimestamp = minDate.getTime();
  const maxTimestamp = maxDate.getTime();
  
  // Estado para el rango seleccionado
  const [value, setValue] = useState([minTimestamp, maxTimestamp]);

  // Formateador de fechas mejorado
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return {
      short: format(date, 'MMM yyyy', { locale: es }),
      long: format(date, 'd MMMM yyyy', { locale: es }),
      year: format(date, 'yyyy', { locale: es })
    };
  };

  // Manejar cambio en el slider
  const handleChange = (event, newValue) => {
    setValue(newValue);
    onDateRangeChange(newValue.map(t => new Date(t)));
  };

  // Marcas para el slider (por año y puntos de datos importantes)
  const generateMarks = () => {
    const marks = [];
    const years = new Set();
    
    // Agregar marcas anuales
    const currentYear = new Date(minDate);
    currentYear.setMonth(0, 1);
    
    while (currentYear <= maxDate) {
      marks.push({
        value: currentYear.getTime(),
        label: format(currentYear, 'yyyy', { locale: es }),
        type: 'year'
      });
      years.add(currentYear.getFullYear());
      currentYear.setFullYear(currentYear.getFullYear() + 1);
    }
    
    // Agregar marcas para fechas importantes (inicios/finales)
    allDates.forEach(date => {
      const timestamp = date.getTime();
      const year = date.getFullYear();
      
      if (!years.has(year) || 
          date.getMonth() === 0 || date.getMonth() === 6) {
        marks.push({
          value: timestamp,
          label: format(date, 'MMM yy', { locale: es }),
          type: 'event'
        });
      }
    });
    
    return marks.sort((a, b) => a.value - b.value);
  };

  const marks = generateMarks();

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm opacity-80 p-4 rounded-xl shadow-2xl border border-gray-200 z-[1000] w-11/12 max-w-4xl">
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-700">
            Rango de Tiempo
          </div>
          <div className="bg-blue-50 px-3 py-1 rounded-full text-sm font-medium text-blue-600">
            {formatDate(value[0]).long} - {formatDate(value[1]).long}
          </div>
        </div>
        
        <Slider
          value={value}
          onChange={handleChange}
          min={minTimestamp}
          max={maxTimestamp}
          step={30 * 24 * 60 * 60 * 1000} // Paso de 1 mes en milisegundos
          marks={marks}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => formatDate(v).short}
          sx={{
            color: '#3b82f6', // Azul-500
            height: 8,
            '& .MuiSlider-thumb': {
              width: 20,
              height: 20,
              backgroundColor: '#fff',
              border: '2px solid #3b82f6',
              '&:hover, &.Mui-focusVisible': {
                boxShadow: '0 0 0 6px rgba(59, 130, 246, 0.2)',
              },
            },
            '& .MuiSlider-mark': {
              backgroundColor: '#bfdbfe',
              height: 8,
              '&.MuiSlider-markActive': {
                backgroundColor: '#3b82f6',
              },
            },
            '& .MuiSlider-markLabel': {
              fontSize: '0.75rem',
              color: '#6b7280',
              '&[data-index="0"], &[data-index="1"]': {
                transform: 'translateY(20px)',
              },
              '&.year-mark': {
                fontWeight: 'bold',
                color: '#1e40af',
              },
            },
          }}
        />
      </div>
      
      <style jsx='true' global='tue' >{`
        .MuiSlider-markLabel[data-type="year"] {
          font-weight: 600 !important;
          color: #1e40af !important;
        }
      `}</style>
    </div>
  );
};

export default TimeSlider;