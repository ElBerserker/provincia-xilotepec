import React, { useState, useEffect, useRef } from 'react';

// Polyfill para síntesis de voz
const getSpeechSynthesis = () => {
  if (typeof window !== 'undefined') {
    return window.speechSynthesis || window.webkitSpeechSynthesis;
  }
  return null;
};

const getSpeechSynthesisUtterance = (text, options = {}) => {
  if (typeof window !== 'undefined') {
    const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance || window.webkitSpeechSynthesisUtterance;
    if (SpeechSynthesisUtterance) {
      const utterance = new SpeechSynthesisUtterance(text);
      Object.assign(utterance, options);
      return utterance;
    }
  }
  return null;
};

const TextToSpeechEnhanced = () => {
  const [text, setText] = useState('');
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [browserStatus, setBrowserStatus] = useState('checking');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const synthesisRef = useRef(null);

  // Verificar soporte y cargar voces
  useEffect(() => {
    const checkSupport = () => {
      const synthesis = getSpeechSynthesis();
      
      if (!synthesis) {
        setIsSupported(false);
        setBrowserStatus('unsupported');
        return;
      }

      synthesisRef.current = synthesis;
      setIsSupported(true);

      // Cargar voces cuando estén disponibles
      const loadVoices = () => {
        const availableVoices = synthesis.getVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0 && !selectedVoice) {
          setSelectedVoice(availableVoices[0]);
        }
        setBrowserStatus('supported');
      };

      if (synthesis.getVoices().length > 0) {
        loadVoices();
      } else {
        synthesis.addEventListener('voiceschanged', loadVoices);
        setBrowserStatus('loading');
      }

      return () => {
        if (synthesis) {
          synthesis.removeEventListener('voiceschanged', loadVoices);
        }
      };
    };

    checkSupport();
  }, []);

  // Solicitar permisos en Brave
  const requestPermission = async () => {
    try {
      // Intentar activar la síntesis de voz
      if (synthesisRef.current) {
        const testUtterance = getSpeechSynthesisUtterance(' ');
        if (testUtterance) {
          synthesisRef.current.speak(testUtterance);
          synthesisRef.current.cancel();
          setBrowserStatus('supported');
        }
      }
    } catch (error) {
      console.warn('Error al solicitar permisos:', error);
      setBrowserStatus('permission-required');
    }
  };

  const handleSpeak = () => {
    if (!text.trim() || !synthesisRef.current) return;

    // Cancelar cualquier speech previo
    synthesisRef.current.cancel();

    const utterance = getSpeechSynthesisUtterance(text, {
      pitch,
      rate,
      volume,
      voice: selectedVoice
    });

    if (utterance) {
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      try {
        synthesisRef.current.speak(utterance);
      } catch (error) {
        console.error('Error al hablar:', error);
        setBrowserStatus('error');
      }
    }
  };

  const handleStop = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handlePause = () => {
    if (synthesisRef.current && isSpeaking) {
      synthesisRef.current.pause();
      setIsSpeaking(false);
    }
  };

  const handleResume = () => {
    if (synthesisRef.current && synthesisRef.current.paused) {
      synthesisRef.current.resume();
      setIsSpeaking(true);
    }
  };

  // Función para leer texto de ejemplo
  const speakExample = (exampleText) => {
    setText(exampleText);
    setTimeout(() => {
      handleSpeak();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Convertidor de Texto a Voz Mejorado
        </h1>

        {/* Estado del navegador */}
        <div className="mb-6">
          {browserStatus === 'checking' && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              🔍 Verificando compatibilidad con tu navegador...
            </div>
          )}

          {browserStatus === 'unsupported' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              ❌ Tu navegador no soporta síntesis de voz. Usa Chrome, Edge o Safari.
            </div>
          )}

          {browserStatus === 'permission-required' && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
              🔒 Permiso requerido. 
              <button 
                onClick={requestPermission}
                className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Habilitar voz
              </button>
            </div>
          )}

          {browserStatus === 'loading' && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
              ⏳ Cargando voces disponibles...
            </div>
          )}

          {browserStatus === 'supported' && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              ✅ Navegador compatible
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Área de texto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texto a leer:
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe o pega el texto que quieres escuchar..."
              className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="6"
            />
          </div>

          {/* Selector de voz */}
          {voices.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar voz:
              </label>
              <select
                value={selectedVoice ? selectedVoice.name : ''}
                onChange={(e) => {
                  const voice = voices.find(v => v.name === e.target.value);
                  setSelectedVoice(voice);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Controles de voz */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Velocidad: {rate}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tono: {pitch}
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volumen: {volume}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleSpeak}
              disabled={!text || !isSupported || isSpeaking}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSpeaking ? '🔊 Hablando...' : '▶️ Reproducir'}
            </button>

            <button
              onClick={handleStop}
              disabled={!isSpeaking}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ⏹️ Detener
            </button>

            <button
              onClick={handlePause}
              disabled={!isSpeaking}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ⏸️ Pausar
            </button>

            <button
              onClick={handleResume}
              disabled={isSpeaking || !synthesisRef.current?.paused}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ▶️ Reanudar
            </button>

            <button
              onClick={() => setText('')}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              🗑️ Limpiar
            </button>
          </div>

          {/* Ejemplos rápidos */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Ejemplos rápidos:</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'Hola, ¿cómo estás?',
                'Bienvenido a la aplicación de texto a voz',
                'El clima hoy está muy agradable',
                'Gracias por usar nuestro servicio'
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => speakExample(example)}
                  disabled={!isSupported}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 disabled:opacity-50 transition-colors"
                >
                  {example.slice(0, 20)}...
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Información para Brave */}
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Usuarios de Brave:</h4>
          <p className="text-sm text-yellow-700">
            Si no funciona, intenta:
            <br />
            1. Hacer clic en el ícono de Brave → Configuración de escudo → Desactivar bloqueos para este sitio
            <br />
            2. O haz clic en "Habilitar voz" arriba
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeechEnhanced;