import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      subscriptions: {
        include: {
          product: true,
          payments: {
            orderBy: { dueDate: 'desc' },
            take: 5
          }
        }
      }
    }
  })

  if (!client) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{client.businessName}</h1>
            <p className="text-gray-600 mt-2">{client.contactName} • {client.email}</p>
          </div>
          <div className="space-x-3">
            <Link 
              href={`/admin/clients/${client.id}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Editar
            </Link>
            <Link 
              href={`/admin/subscriptions/new?client=${client.id}`}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              + Nueva Suscripción
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información del Cliente */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Información del Cliente</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{client.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium">{client.phone || 'No registrado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ubicación</p>
                <p className="font-medium">
                  {client.city && client.department 
                    ? `${client.city}, ${client.department}`
                    : 'No registrada'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <span className={`px-2 py-1 text-xs rounded-full ${client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {client.status === 'active' ? 'Activo' : 'Lead'}
                </span>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Dirección</p>
                <p className="font-medium">{client.address || 'No registrada'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha de Registro</p>
                <p className="font-medium">
                  {format(new Date(client.createdAt), "dd 'de' MMMM yyyy", { locale: es })}
                </p>
              </div>
            </div>
          </div>

          {/* Suscripciones */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Suscripciones</h2>
              <Link 
                href={`/admin/subscriptions/new?client=${client.id}`}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Agregar Suscripción
              </Link>
            </div>
            
            {client.subscriptions.length > 0 ? (
              <div className="space-y-4">
                {client.subscriptions.map((subscription) => (
                  <div key={subscription.id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold">{subscription.product.name}</h3>
                        <p className="text-sm text-gray-600">
                          ${subscription.priceMonthly.toLocaleString('es-CO')}/mes
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {subscription.status === 'active' ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      <p>Día de pago: {subscription.billingDay} de cada mes</p>
                      {subscription.payments[0] && (
                        <p className="text-gray-600">
                          Último pago: {format(new Date(subscription.payments[0].paidAt || subscription.payments[0].dueDate), "dd/MM/yyyy")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No hay suscripciones activas</p>
            )}
          </div>
        </div>

        {/* Sidebar - Acciones rápidas */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="font-bold mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <Link 
                href={`/admin/subscriptions/new?client=${client.id}`}
                className="block w-full bg-green-600 text-white text-center py-2 rounded hover:bg-green-700"
              >
                Agregar Suscripción
              </Link>
              <Link 
                href={`/admin/clients/${client.id}/edit`}
                className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
              >
                Editar Cliente
              </Link>
              {client.latitude && client.longitude && (
                <Link 
                  href={`/admin/map?lat=${client.latitude}&lng=${client.longitude}`}
                  className="block w-full bg-purple-600 text-white text-center py-2 rounded hover:bg-purple-700"
                >
                  Ver en Mapa
                </Link>
              )}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="font-bold mb-4">Estadísticas</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Suscripciones Activas</p>
                <p className="text-2xl font-bold">
                  {client.subscriptions.filter(s => s.status === 'active').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ingreso Mensual</p>
                <p className="text-2xl font-bold text-green-600">
                  ${client.subscriptions
                    .filter(s => s.status === 'active')
                    .reduce((sum, s) => sum + s.priceMonthly, 0)
                    .toLocaleString('es-CO')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}