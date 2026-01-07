// app/components/CustomMarker.tsx
'use client';

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

// Configurar íconos personalizados
const createCustomIcon = (color: string, letter: string) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
      ">
        ${letter}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface CustomMarkerProps {
  client: {
    id: string;
    businessName: string;
    contactName: string | null;
    email: string;
    phone: string | null;
    address: string | null;
    city: string | null;
    department: string | null;
    latitude: number;
    longitude: number;
    status: string;
  };
}

export default function CustomMarker({ client }: CustomMarkerProps) {
  // Determinar color según estado
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return '#10B981'; // green-500
      case 'inactive': return '#EF4444'; // red-500
      case 'lead': return '#F59E0B'; // yellow-500
      default: return '#6B7280'; // gray-500
    }
  };

  const color = getStatusColor(client.status);
  const letter = client.businessName.charAt(0).toUpperCase();
  const icon = createCustomIcon(color, letter);

  return (
    <Marker
      position={[client.latitude, client.longitude]}
      icon={icon}
    >
      <Popup>
        <div className="p-2 min-w-[250px]">
          <h3 className="font-bold text-lg text-gray-900">{client.businessName}</h3>
          
          {client.contactName && (
            <p className="text-gray-700 mt-1">
              <span className="font-medium">Contacto:</span> {client.contactName}
            </p>
          )}
          
          <p className="text-gray-600 text-sm mt-1">
            <span className="font-medium">Email:</span> {client.email}
          </p>
          
          {client.phone && (
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Teléfono:</span> {client.phone}
            </p>
          )}
          
          {client.address && (
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Dirección:</span> {client.address}
            </p>
          )}
          
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <span className={`px-2 py-1 rounded-full text-xs font-medium
              ${client.status === 'active' ? 'bg-green-100 text-green-800' : 
                client.status === 'inactive' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'}`}>
              {client.status === 'active' ? 'Activo' : 
               client.status === 'inactive' ? 'Inactivo' : 'Lead'}
            </span>
            
            {(client.city || client.department) && (
              <span className="text-gray-600 text-sm">
                📍 {[client.city, client.department].filter(Boolean).join(', ')}
              </span>
            )}
          </div>
          
          <div className="mt-4 pt-3 border-t">
            <a
              href={`/admin/clients/${client.id}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Ver detalles del cliente →
            </a>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}