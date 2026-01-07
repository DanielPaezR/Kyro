// app/admin/map/page.tsx - VERSIÓN CORREGIDA
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

// Carga Leaflet dinámicamente solo en cliente
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false, loading: () => <div className="h-[600px] bg-gray-100 rounded-lg animate-pulse" /> }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const CustomMarker = dynamic(
  () => import("@/components/CustomMarker"),
  { ssr: false }
);

// Tipos
interface ClientLocation {
  id: string;
  businessName: string;
  contactName: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  department: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
}

export default function ClientsMapPage() {
  const [clients, setClients] = useState<ClientLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState<[number, number]>([4.5709, -74.2973]); // Centro de Colombia
  const [zoom, setZoom] = useState(6);
  const [filter, setFilter] = useState("all");
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    fetchClients();
    setMapLoaded(true);
  }, [filter]);

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients");
      if (response.ok) {
        const data = await response.json();
        setClients(data);
        
        // Buscar un cliente con coordenadas para centrar el mapa
        const clientWithCoords = data.find(
          (c: ClientLocation) => c.latitude && c.longitude
        );
        if (clientWithCoords) {
          setCenter([clientWithCoords.latitude!, clientWithCoords.longitude!]);
          setZoom(12);
        }
      }
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter((client) => {
    if (filter === "all") return true;
    return client.status === filter;
  });

  const clientsWithCoords = filteredClients.filter(
    (client) => client.latitude && client.longitude
  );

  // Calcular el centro del mapa basado en todos los clientes con coordenadas
  const calculateMapCenter = (): [number, number] => {
  if (clientsWithCoords.length === 0) {
    return [4.5709, -74.2973]; // Centro de Colombia por defecto
  }
  
  // Calcular promedio de latitudes y longitudes
  const totalLat = clientsWithCoords.reduce((sum, client) => sum + client.latitude!, 0);
  const totalLng = clientsWithCoords.reduce((sum, client) => sum + client.longitude!, 0);
  
  const avgLat = totalLat / clientsWithCoords.length;
  const avgLng = totalLng / clientsWithCoords.length;
  
  return [avgLat, avgLng];
};

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando datos de clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mapa de Clientes</h1>
          <p className="text-gray-600">
            Visualiza la ubicación geográfica de tus clientes
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Filtrar:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">Todos los clientes</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="lead">Leads</option>
            </select>
          </div>
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
            <span className="font-medium">{clientsWithCoords.length}</span> de{" "}
            <span className="font-medium">{filteredClients.length}</span> clientes con ubicación
          </div>
        </div>
      </div>

      {/* Leyenda */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm">Clientes Activos</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-sm">Clientes Inactivos</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-sm">Leads</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gray-500"></div>
            <span className="text-sm">Sin clasificar</span>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="h-[600px] w-full relative">
          {mapLoaded && (
            <MapContainer
              center={calculateMapCenter()}
              zoom={clientsWithCoords.length > 0 ? zoom : 6}
              style={{ height: "100%", width: "100%" }}
              className="rounded-lg"
              scrollWheelZoom={true}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {clientsWithCoords.map((client) => (
                <CustomMarker 
                  key={client.id} 
                  client={{
                    ...client,
                    latitude: client.latitude!,
                    longitude: client.longitude!
                  }} 
                />
              ))}
            </MapContainer>
          )}
        </div>
      </div>

      {/* Lista de clientes sin coordenadas */}
      {filteredClients.filter(c => !c.latitude || !c.longitude).length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-3">
            ⚠️ {filteredClients.filter(c => !c.latitude || !c.longitude).length} clientes sin ubicación en el mapa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredClients
              .filter((client) => !client.latitude || !client.longitude)
              .map((client) => (
                <div
                  key={client.id}
                  className="p-3 bg-white rounded-lg border border-yellow-100"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{client.businessName}</p>
                      <p className="text-sm text-gray-600">{client.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      client.status === "active"
                        ? "bg-green-100 text-green-800"
                        : client.status === "inactive"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {client.status === "active" ? "Activo" : 
                       client.status === "inactive" ? "Inactivo" : "Lead"}
                    </span>
                  </div>
                  {client.city && (
                    <p className="text-sm text-gray-500 mt-1">
                      📍 {client.city}{client.department ? `, ${client.department}` : ''}
                    </p>
                  )}
                  <div className="mt-2">
                    <a
                      href={`/admin/clients/${client.id}/edit`}
                      className="text-yellow-700 hover:text-yellow-900 text-xs font-medium inline-flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Agregar coordenadas
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Instrucciones */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          📌 ¿Cómo agregar coordenadas?
        </h3>
        <ol className="text-sm text-blue-700 space-y-1 pl-5 list-decimal">
          <li>Ve a la página de edición del cliente</li>
          <li>Ingresa la dirección completa</li>
          <li>Usa el botón "📍 Obtener por Dirección" para geolocalizar automáticamente</li>
          <li>O ingresa manualmente las coordenadas (puedes obtenerlas en Google Maps)</li>
          <li>Guarda los cambios y el cliente aparecerá automáticamente en el mapa</li>
        </ol>
      </div>
    </div>
  );
}