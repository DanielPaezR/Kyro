// app/admin/map/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para íconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
  iconUrl: '/leaflet/images/marker-icon.png',
  shadowUrl: '/leaflet/images/marker-shadow.png',
});

interface Client {
  id: string;
  businessName: string;
  contactName: string | null;
  email: string;
  city: string | null;
  department: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  subscriptions: Array<{ id: string }>;
}

export default function MapPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [center, setCenter] = useState<[number, number]>([4.710989, -74.072092]); // Bogotá
  const [zoom, setZoom] = useState(6);

  useEffect(() => {
    fetchClients();
  }, [filter]);

  const fetchClients = async () => {
    try {
      const url = filter === 'all' ? '/api/clients' : `/api/clients?status=${filter}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setClients(data);
        
        // Centrar el mapa en el primer cliente con coordenadas
        const clientWithCoords = data.find((c: Client) => c.latitude && c.longitude);
        if (clientWithCoords) {
          setCenter([clientWithCoords.latitude, clientWithCoords.longitude]);
          setZoom(12);
        }
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const clientsWithCoords = clients.filter(client => 
    client.latitude && client.longitude
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'lead': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mapa de Clientes</h1>
        <p className="text-gray-600">Visualiza la ubicación geográfica de tus clientes</p>
      </div>

      {/* Filtros y estadísticas */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="all">Todos los clientes</option>
              <option value="active">Solo activos</option>
              <option value="lead">Solo leads</option>
              <option value="inactive">Solo inactivos</option>
            </select>
            
            <div className="text-sm text-gray-600">
              <span className="font-medium">{clientsWithCoords.length}</span> de{' '}
              <span className="font-medium">{clients.length}</span> clientes con ubicación
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">Activos</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm">Leads</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm">Inactivos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="h-[600px] w-full relative">
          {clientsWithCoords.length > 0 ? (
            <MapContainer
              center={center}
              zoom={zoom}
              style={{ height: '100%', width: '100%' }}
              className="rounded-lg"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {clientsWithCoords.map((client) => {
                const color = client.status === 'active' ? 'green' : 
                             client.status === 'lead' ? 'blue' : 'yellow';
                
                const customIcon = L.divIcon({
                  html: `
                    <div style="
                      background-color: ${color};
                      width: 24px;
                      height: 24px;
                      border-radius: 50%;
                      border: 2px solid white;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      color: white;
                      font-weight: bold;
                      font-size: 12px;
                    ">
                      ${client.businessName.charAt(0)}
                    </div>
                  `,
                  className: 'custom-marker',
                  iconSize: [24, 24],
                  iconAnchor: [12, 12],
                });

                return (
                  <Marker
                    key={client.id}
                    position={[client.latitude!, client.longitude!]}
                    icon={customIcon}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-lg">{client.businessName}</h3>
                        <p className="text-gray-600">{client.contactName}</p>
                        <p className="text-gray-500 text-sm">{client.email}</p>
                        <div className="mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(client.status)}`}>
                            {client.status === 'active' ? 'Activo' : 
                             client.status === 'lead' ? 'Lead' : 'Inactivo'}
                          </span>
                          {client.city && (
                            <p className="text-sm text-gray-600 mt-1">
                              📍 {client.city}{client.department ? `, ${client.department}` : ''}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mt-1">
                            📊 {client.subscriptions.length} suscripción(es)
                          </p>
                        </div>
                        <div className="mt-3">
                          <a
                            href={`/admin/clients/${client.id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Ver detalles →
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-gray-100">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-gray-500">No hay clientes con ubicación geográfica</p>
              <p className="text-gray-400 text-sm mt-2">
                Agrega coordenadas en los formularios de creación/edición de clientes
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lista de clientes sin coordenadas */}
      {clients.length > clientsWithCoords.length && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">
            ⚠️ {clients.length - clientsWithCoords.length} clientes sin ubicación
          </h3>
          <p className="text-yellow-700 text-sm">
            Los siguientes clientes no aparecen en el mapa porque no tienen coordenadas:
          </p>
          <div className="mt-2 max-h-40 overflow-y-auto">
            <ul className="text-sm text-yellow-700 space-y-1">
              {clients
                .filter(client => !client.latitude || !client.longitude)
                .map(client => (
                  <li key={client.id} className="flex justify-between items-center py-1">
                    <span>{client.businessName} - {client.email}</span>
                    <a
                      href={`/admin/clients/${client.id}/edit`}
                      className="text-yellow-800 hover:text-yellow-900 text-xs font-medium"
                    >
                      Agregar ubicación →
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}