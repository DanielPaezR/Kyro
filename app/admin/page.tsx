// app/admin/page.tsx - VERSIÓN ACTUALIZADA
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Obtener estadísticas CORRECTAS
  const [
    totalClients,
    totalProducts,
    activeSubscriptions,
    recentPayments,
    monthlyRevenue,
    pendingPayments,
    paidPayments
  ] = await Promise.all([
    prisma.client.count(),
    prisma.product.count(),
    prisma.subscription.count({
      where: { status: 'active' }
    }),
    prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        subscription: {
          include: {
            client: { select: { businessName: true } },
            product: { select: { name: true } }
          }
        }
      },
      where: {
        status: 'paid' // Solo mostrar pagos completados en recientes
      }
    }),
    // Ingresos del mes (solo pagados)
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: 'paid',
        paidAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
        }
      }
    }),
    // Pagos pendientes
    prisma.payment.count({
      where: { 
        status: 'pending',
        dueDate: {
          gte: new Date() // Solo pendientes futuros
        }
      }
    }),
    // Pagos pagados este mes
    prisma.payment.count({
      where: {
        status: 'paid',
        paidAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    })
  ]);

  // Calcular pagos vencidos
  const overduePayments = await prisma.payment.count({
    where: {
      status: 'pending',
      dueDate: {
        lt: new Date() // Vencidos (fecha pasada)
      }
    }
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Bienvenido al panel de administración de Kyro Platform</p>

      {/* Stats Grid Mejorada */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Clientes Totales */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes Totales</p>
              <p className="text-2xl font-bold text-gray-900">{totalClients}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <Link href="/admin/clients" className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-4 block">
            Ver todos →
          </Link>
        </div>

        {/* Productos Activos */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Productos Activos</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <Link href="/admin/products" className="text-green-600 hover:text-green-800 text-sm font-medium mt-4 block">
            Ver productos →
          </Link>
        </div>

        {/* Suscripciones Activas */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Suscripciones Activas</p>
              <p className="text-2xl font-bold text-gray-900">{activeSubscriptions}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <Link href="/admin/subscriptions" className="text-purple-600 hover:text-purple-800 text-sm font-medium mt-4 block">
            Ver suscripciones →
          </Link>
        </div>

        {/* Ingresos del Mes */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos del Mes</p>
              <p className="text-2xl font-bold text-gray-900">
                ${monthlyRevenue._sum.amount?.toFixed(2) || "0.00"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {paidPayments} pagos registrados
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <Link href="/admin/payments" className="text-yellow-600 hover:text-yellow-800 text-sm font-medium mt-4 block">
            Ver pagos →
          </Link>
        </div>
      </div>

      {/* Segunda fila de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Pagos Pendientes */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pagos Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingPayments}</p>
              <p className="text-xs text-gray-500 mt-1">Próximos vencimientos</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pagos Vencidos */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pagos Vencidos</p>
              <p className="text-2xl font-bold text-red-600">{overduePayments}</p>
              <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pagos del Mes */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pagos del Mes</p>
              <p className="text-2xl font-bold text-green-600">{paidPayments}</p>
              <p className="text-xs text-gray-500 mt-1">Completados este mes</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity - ACTUALIZADO con componente de pagos rápido */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pagos Recientes</h2>
          <div className="space-y-4">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">
                    {payment.subscription.client.businessName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {payment.subscription.product.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    ${payment.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {recentPayments.length === 0 && (
              <p className="text-gray-500 text-center py-4">No hay pagos recientes</p>
            )}
          </div>
          <Link href="/admin/payments" className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-4 block text-center">
            Ver todos los pagos →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Acción: Nuevo Cliente */}
            <Link href="/admin/clients/new" className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg border border-blue-200 transition">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Nuevo Cliente</p>
                  <p className="text-xs text-gray-500">Agregar negocio</p>
                </div>
              </div>
            </Link>

            {/* Acción: Nuevo Producto */}
            <Link href="/admin/products/new" className="bg-green-50 hover:bg-green-100 p-4 rounded-lg border border-green-200 transition">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Nuevo Producto</p>
                  <p className="text-xs text-gray-500">Crear sistema</p>
                </div>
              </div>
            </Link>

            {/* Acción: Mapa de Clientes */}
            <Link href="/admin/map" className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg border border-purple-200 transition">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Mapa de Clientes</p>
                  <p className="text-xs text-gray-500">Ver ubicaciones</p>
                </div>
              </div>
            </Link>

            {/* Acción: REGISTRAR PAGO RÁPIDO - Ahora va a una página especial */}
            <Link href="/admin/quick-payment" className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg border border-yellow-200 transition">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Registrar Pago</p>
                  <p className="text-xs text-gray-500">Rápido con modal</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}