import { prisma } from '../../lib/prisma'
import Link from 'next/link'

export default async function AdminPage() {
  const [clientsCount, subscriptionsCount, revenue] = await Promise.all([
    prisma.client.count(),
    prisma.subscription.count(),
    prisma.subscription.aggregate({
      _sum: { priceMonthly: true }
    })
  ])
  

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Kyro</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">Clientes Totales</h3>
          <p className="text-3xl font-bold text-blue-600">{clientsCount}</p>
          <Link href="/admin/clients" className="text-sm text-blue-500 hover:underline mt-2 block">
            Ver todos →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">Suscripciones Activas</h3>
          <p className="text-3xl font-bold text-green-600">{subscriptionsCount}</p>
          <Link href="/admin/subscriptions" className="text-sm text-blue-500 hover:underline mt-2 block">
            Gestionar →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">Ingresos Mensuales</h3>
          <p className="text-3xl font-bold text-purple-600">
            ${revenue._sum.priceMonthly?.toLocaleString('es-CO') || '0'}
          </p>
          <Link href="/admin/payments" className="text-sm text-blue-500 hover:underline mt-2 block">
            Ver pagos →
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/admin/clients/new" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Nuevo Cliente
          </Link>
          <Link 
            href="/admin/subscriptions/new" 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Nueva Suscripción
          </Link>
          <Link 
            href="/admin/map" 
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            📍 Ver Mapa de Clientes
          </Link>
          <Link 
            href="/admin/products" 
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            📦 Gestionar Productos
          </Link>
        </div>
      </div>
    </div>
  )
}