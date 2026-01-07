// app/admin/subscriptions/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import PaymentModal from '@/components/PaymentModal';

export default function SubscriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch subscription
      const subRes = await fetch(`/api/subscriptions/${params.id}`);
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscription(subData);
      } else {
        console.error('Error fetching subscription');
      }

      // Fetch payments
      const payRes = await fetch(`/api/payments?subscriptionId=${params.id}`);
      if (payRes.ok) {
        const payData = await payRes.json();
        setPayments(payData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    fetchData(); // Recargar datos después de registrar pago
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando suscripción...</p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Suscripción no encontrada</h1>
          <p className="text-gray-600 mb-8">La suscripción que buscas no existe o fue eliminada.</p>
          <Link
            href="/admin/subscriptions"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Volver a Suscripciones
          </Link>
        </div>
      </div>
    );
  }

  const today = new Date();
  const nextPayment = new Date(today.getFullYear(), today.getMonth(), subscription.billingDay);
  if (nextPayment < today) {
    nextPayment.setMonth(nextPayment.getMonth() + 1);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/subscriptions"
                className="text-gray-500 hover:text-gray-700"
              >
                ← Volver
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Detalle de Suscripción</h1>
            </div>
            <p className="text-gray-600 mt-2">
              {subscription.product?.name} • {subscription.client?.businessName}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Registrar Pago
            </button>
            <Link
              href={`/admin/subscriptions/${subscription.id}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Información principal */}
        <div className="lg:col-span-2 space-y-8">
          {/* Información de la suscripción */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información de la Suscripción</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="font-medium text-lg">{subscription.client?.businessName}</p>
                <p className="text-gray-600">{subscription.client?.contactName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Producto</p>
                <p className="font-medium text-lg">{subscription.product?.name}</p>
                <p className="text-gray-600">{subscription.product?.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Precio Mensual</p>
                <p className="font-medium text-lg text-green-600">
                  ${subscription.priceMonthly?.toLocaleString('es-CO')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <span className={`px-3 py-1 text-sm rounded-full font-medium
                  ${subscription.status === 'active' ? 'bg-green-100 text-green-800' : 
                    subscription.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'}`}>
                  {subscription.status === 'active' ? 'Activa' : 
                   subscription.status === 'cancelled' ? 'Cancelada' : 'Pendiente'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Día de Facturación</p>
                <p className="font-medium text-lg">{subscription.billingDay} de cada mes</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Próximo Pago</p>
                <p className="font-medium text-lg">
                  {format(nextPayment, "dd 'de' MMMM yyyy", { locale: es })}
                </p>
              </div>
              {subscription.instanceUrl && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">URL de Instancia</p>
                  <a 
                    href={subscription.instanceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:text-blue-800 break-all"
                  >
                    {subscription.instanceUrl}
                  </a>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Fecha de Inicio</p>
                <p className="font-medium">
                  {format(new Date(subscription.startsAt), "dd/MM/yyyy", { locale: es })}
                </p>
              </div>
              {subscription.endsAt && (
                <div>
                  <p className="text-sm text-gray-500">Fecha de Fin</p>
                  <p className="font-medium">
                    {format(new Date(subscription.endsAt), "dd/MM/yyyy", { locale: es })}
                </p>
                </div>
              )}
            </div>
          </div>

          {/* Historial de Pagos */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Historial de Pagos</h2>
              <span className="text-sm text-gray-500">
                {payments.length} pagos registrados
              </span>
            </div>
            
            {payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Comprobante
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {format(new Date(payment.dueDate), "dd/MM/yyyy", { locale: es })}
                          </div>
                          {payment.paidAt && (
                            <div className="text-sm text-gray-500">
                              Pagado: {format(new Date(payment.paidAt), "dd/MM/yyyy", { locale: es })}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className={`text-lg font-bold
                            ${payment.status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                            ${payment.amount?.toLocaleString('es-CO')}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium
                            ${payment.status === 'paid' ? 'bg-green-100 text-green-800' : 
                              payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {payment.status === 'paid' ? 'Pagado' : 
                             payment.status === 'pending' ? 'Pendiente' : 'Vencido'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {payment.receiptUrl ? (
                            <a
                              href={payment.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Ver comprobante
                            </a>
                          ) : (
                            <span className="text-gray-500 text-sm">No disponible</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">No hay pagos registrados para esta suscripción</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Información del cliente */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-4">Información del Cliente</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{subscription.client?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium">{subscription.client?.phone || 'No registrado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ubicación</p>
                <p className="font-medium">
                  {subscription.client?.city && subscription.client?.department 
                    ? `${subscription.client.city}, ${subscription.client.department}`
                    : 'No registrada'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado del Cliente</p>
                <span className={`px-2 py-1 text-xs rounded-full ${subscription.client?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {subscription.client?.status === 'active' ? 'Activo' : 'Lead'}
                </span>
              </div>
              <div className="pt-4">
                <Link
                  href={`/admin/clients/${subscription.client?.id}`}
                  className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Ver Perfil del Cliente
                </Link>
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-4">Acciones</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Registrar Pago
              </button>
              <Link
                href={`/admin/subscriptions/${subscription.id}/edit`}
                className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Editar Suscripción
              </Link>
              <button
                onClick={() => {
                  if (confirm('¿Estás seguro de que deseas cancelar esta suscripción?')) {
                    // Aquí iría la lógica para cancelar
                    alert('Función de cancelación por implementar');
                  }
                }}
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                Cancelar Suscripción
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de pago */}
      {showPaymentModal && subscription && (
        <PaymentModal
          subscription={subscription}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}