import { useState, useEffect } from 'react';
import { Slider } from '@mui/material';

const TimeSlider = ({ polygons, onDateRangeChange }) => {
  // Obtener todos los años relevantes de los datos
  const allYears = [];
  
  polygons.forEach(polygon => {
    if (polygon.year) allYears.push(parseInt(polygon.year));
    
    polygon.markers.forEach(marker => {
      if (marker.year) allYears.push(parseInt(marker.year));
    });
    
    polygon.routes.forEach(route => {
      if (route.year) allYears.push(parseInt(route.year));
    });
  });

  // Encontrar años mínimo y máximo
  const minYear = Math.min(...allYears);
  const maxYear = Math.max(...allYears);
  
  // Estado para el rango seleccionado
  const [value, setValue] = useState([minYear, maxYear]);

  // Manejar cambio en el slider
  const handleChange = (event, newValue) => {
    setValue(newValue);
    // Convertir años a fechas (1 de enero de cada año)
    onDateRangeChange([
      new Date(newValue[0], 0, 1),
      new Date(newValue[1], 11, 31) // 31 de diciembre
    ]);
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm opacity-80 p-4 rounded-xl shadow-2xl border border-gray-200 z-[1000] w-11/12 max-w-4xl">
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-700">
            Rango de Años
          </div>
          <div className="bg-blue-50 px-3 py-1 rounded-full text-sm font-medium text-gray-600">
            {value[0]} - {value[1]}
          </div>
        </div>
        
        <Slider
          value={value}
          onChange={handleChange}
          min={minYear}
          max={maxYear}
          step={1}
          marks={[
            { value: minYear, label: minYear.toString() },
            { value: maxYear, label: maxYear.toString() }
          ]}
          valueLabelDisplay="auto"
          sx={{
            color: '#3b82f6',
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
            '& .MuiSlider-markLabel': {
              fontSize: '0.75rem',
              color: '#6b7280',
            },
          }}
        />
      </div>
    </div>
  );
};

export default TimeSlider;