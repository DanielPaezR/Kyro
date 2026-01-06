import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export default async function SubscriptionsPage() {
  const subscriptions = await prisma.subscription.findMany({
    include: {
      client: true,
      product: true,
      payments: {
        orderBy: { dueDate: 'desc' },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Suscripciones</h1>
        <Link 
          href="/admin/subscriptions/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Nueva Suscripción
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">Activas</h3>
          <p className="text-3xl font-bold text-green-600">
            {subscriptions.filter(s => s.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">Ingreso Mensual</h3>
          <p className="text-3xl font-bold text-blue-600">
            ${subscriptions
              .filter(s => s.status === 'active')
              .reduce((sum, s) => sum + s.priceMonthly, 0)
              .toLocaleString('es-CO')}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">Próximos Pagos</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {subscriptions.filter(s => {
              const today = new Date()
              const dueDate = new Date(today.getFullYear(), today.getMonth(), s.billingDay)
              return s.status === 'active' && dueDate > today
            }).length}
          </p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Próximo Pago
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subscriptions.map((subscription) => {
              const nextPayment = new Date()
              nextPayment.setDate(subscription.billingDay)
              if (nextPayment < new Date()) {
                nextPayment.setMonth(nextPayment.getMonth() + 1)
              }

              return (
                <tr key={subscription.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{subscription.client.businessName}</div>
                    <div className="text-sm text-gray-500">{subscription.client.contactName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{subscription.product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${subscription.priceMonthly.toLocaleString('es-CO')}/mes
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${subscription.status === 'active' ? 'bg-green-100 text-green-800' : 
                        subscription.status === 'past_due' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {subscription.status === 'active' ? 'Activa' : 
                       subscription.status === 'past_due' ? 'Vencida' : 'Cancelada'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(nextPayment, "dd 'de' MMMM", { locale: es })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link 
                      href={`/admin/subscriptions/${subscription.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Ver
                    </Link>
                    <Link 
                      href={`/admin/subscriptions/${subscription.id}/payment`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Pagar
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}