// app/admin/map/page.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Carga Leaflet dinámicamente solo en cliente
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
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
  const [center, setCenter] = useState<[number, number]>([4.5709, -74.2973]);
  const [zoom, setZoom] = useState(6);
  const [filter, setFilter] = useState("all");
  const [mapLoaded, setMapLoaded] = useState(false);

  // Colores por estado
  const statusColors: Record<string, string> = {
    active: "#10B981",
    inactive: "#EF4444",
    lead: "#F59E0B",
  };

  useEffect(() => {
    fetchClients();
    setMapLoaded(true);
  }, [filter]);

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients/map");
      if (response.ok) {
        const data = await response.json();
        setClients(data);
        
        const clientWithCoords = data.find(
          (c: ClientLocation) => c.latitude && c.longitude
        );
        if (clientWithCoords) {
          setCenter([clientWithCoords.latitude!, clientWithCoords.longitude!]);
          setZoom(10);
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mapa de Clientes</h1>
          <p className="text-gray-600">
            Visualiza la ubicación de tus clientes en el mapa
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Filtrar:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">Todos los clientes</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="lead">Leads</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {clientsWithCoords.length} de {filteredClients.length} clientes con ubicación
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Activos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm">Inactivos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm">Leads</span>
            </div>
          </div>
        </div>

        {/* Mapa - Solo se renderiza en cliente */}
        <div className="h-[600px] relative">
          {mapLoaded && (
            <MapContainer
              center={center}
              zoom={zoom}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {clientsWithCoords.map((client) => (
                <Marker
                  key={client.id}
                  position={[client.latitude!, client.longitude!]}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg">{client.businessName}</h3>
                      {client.contactName && (
                        <p className="text-gray-700">{client.contactName}</p>
                      )}
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Email:</span> {client.email}
                        </p>
                        {client.phone && (
                          <p className="text-sm">
                            <span className="font-medium">Tel:</span> {client.phone}
                          </p>
                        )}
                        {client.address && (
                          <p className="text-sm">
                            <span className="font-medium">Dirección:</span> {client.address}
                          </p>
                        )}
                        <p className="text-sm">
                          <span className="font-medium">Ciudad:</span> {client.city || "No especificada"}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Estado:</span>{" "}
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            client.status === "active"
                              ? "bg-green-100 text-green-800"
                              : client.status === "inactive"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {client.status === "active" ? "Activo" : 
                             client.status === "inactive" ? "Inactivo" : "Lead"}
                          </span>
                        </p>
                      </div>
                      <div className="mt-3 pt-3 border-t">
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
              ))}
            </MapContainer>
          )}
        </div>

        {/* Lista de clientes sin coordenadas */}
        {filteredClients.filter(c => !c.latitude || !c.longitude).length > 0 && (
          <div className="p-4 border-t">
            <h3 className="font-medium text-gray-700 mb-2">
              Clientes sin ubicación ({filteredClients.filter(c => !c.latitude || !c.longitude).length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredClients
                .filter((client) => !client.latitude || !client.longitude)
                .map((client) => (
                  <div
                    key={client.id}
                    className="p-3 bg-gray-50 rounded-lg border"
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
                        {client.city}, {client.department}
                      </p>
                    )}
                    <a
                      href={`/admin/clients/${client.id}`}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-2 inline-block"
                    >
                      Agregar coordenadas →
                    </a>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Instrucciones */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2">📌 ¿Cómo agregar coordenadas?</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>1. Ve a la página de edición del cliente</li>
          <li>2. Busca la dirección en Google Maps</li>
          <li>3. Copia las coordenadas (latitud y longitud)</li>
          <li>4. Actualiza los campos en el formulario de cliente</li>
          <li>5. El cliente aparecerá automáticamente en el mapa</li>
        </ul>
      </div>
    </div>
  );
}