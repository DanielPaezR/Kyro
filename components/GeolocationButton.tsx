// app/components/GeolocationButton.tsx
'use client';

import { useState } from 'react';

interface GeolocationButtonProps {
  address: string;
  city: string;
  department: string;
  onCoordinatesFound: (lat: number, lng: number) => void;
}

export default function GeolocationButton({ 
  address, 
  city, 
  department,
  onCoordinatesFound 
}: GeolocationButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const geocodeAddress = async () => {
    if (!address.trim()) {
      setError('Por favor ingresa una dirección');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Construir la dirección completa
      const locationParts = [address.trim()];
      if (city.trim()) locationParts.push(city.trim());
      if (department.trim()) locationParts.push(department.trim());
      locationParts.push('Colombia');
      
      const fullAddress = locationParts.join(', ');
      const encodedAddress = encodeURIComponent(fullAddress);
      
      // Usar Nominatim (OpenStreetMap) - Gratuito
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&countrycodes=co&limit=1`,
        {
          headers: {
            'User-Agent': 'KyroPlatform/1.0 (contact@kyro.com)'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        
        onCoordinatesFound(lat, lng);
        setSuccess(true);
        setError(null);
      } else {
        setError('No se encontraron coordenadas para esta dirección. Intenta con una dirección más específica.');
      }
    } catch (err: any) {
      console.error('Error en geolocalización:', err);
      setError(`Error al obtener coordenadas: ${err.message || 'Intenta nuevamente.'}`);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onCoordinatesFound(position.coords.latitude, position.coords.longitude);
        setSuccess(true);
        setLoading(false);
      },
      (error) => {
        console.error('Error de geolocalización:', error);
        let errorMessage = 'No se pudo obtener tu ubicación.';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado. Permite el acceso en la configuración de tu navegador.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Información de ubicación no disponible.';
            break;
          case error.TIMEOUT:
            errorMessage = 'La solicitud de ubicación ha expirado.';
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleManualCoordinates = () => {
    // Coordenadas de ejemplo para ciudades principales de Colombia
    const cityCoordinates: Record<string, { lat: number; lng: number }> = {
      'Bogotá': { lat: 4.710989, lng: -74.072092 },
      'Medellín': { lat: 6.244203, lng: -75.581212 },
      'Cali': { lat: 3.451647, lng: -76.531982 },
      'Barranquilla': { lat: 10.963889, lng: -74.796387 },
      'Cartagena': { lat: 10.391049, lng: -75.479426 },
      'Bucaramanga': { lat: 7.119349, lng: -73.122742 },
      'Pereira': { lat: 4.808717, lng: -75.690601 },
      'Manizales': { lat: 5.070275, lng: -75.513817 },
      'Cúcuta': { lat: 7.893907, lng: -72.507821 },
      'Ibagué': { lat: 4.444676, lng: -75.242438 }
    };

    const cityKey = Object.keys(cityCoordinates).find(key => 
      city.toLowerCase().includes(key.toLowerCase())
    );

    if (cityKey) {
      const { lat, lng } = cityCoordinates[cityKey];
      onCoordinatesFound(lat, lng);
      setSuccess(true);
      setError(null);
    } else {
      setError('No hay coordenadas predefinidas para esta ciudad. Usa "Obtener por Dirección" o ingresa manualmente.');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={geocodeAddress}
          disabled={loading || !address.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm flex items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Buscando...
            </>
          ) : (
            '📍 Obtener por Dirección'
          )}
        </button>
        
        <button
          type="button"
          onClick={getUserLocation}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm flex items-center"
        >
          📍 Usar Mi Ubicación
        </button>
        
        <button
          type="button"
          onClick={handleManualCoordinates}
          disabled={loading || !city.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 text-sm"
        >
          🏙️ Coordenadas de Ciudad
        </button>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm font-medium">⚠️ {error}</p>
        </div>
      )}
      
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700 text-sm font-medium">
            ✅ ¡Coordenadas encontradas! Se han autocompletado los campos.
          </p>
        </div>
      )}
      
      <div className="p-3 bg-gray-50 rounded-md">
        <p className="text-xs text-gray-600">
          <strong>💡 Consejos para mejores resultados:</strong>
        </p>
        <ul className="text-xs text-gray-600 mt-1 list-disc list-inside space-y-1">
          <li>Ingresa dirección completa: "Carrera 15 #88-64, Chapinero, Bogotá"</li>
          <li>Usa "Coordenadas de Ciudad" para ubicación aproximada si no tienes dirección exacta</li>
          <li>Para mayor precisión, usa "Usar Mi Ubicación" cuando estés en el lugar del cliente</li>
        </ul>
      </div>
    </div>
  );
}