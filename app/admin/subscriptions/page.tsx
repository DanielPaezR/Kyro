// app/admin/subscriptions/page.tsx - VERSIÓN COMPLETA CON BOTÓN DE PAGO
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import PaymentModal from '@/components/PaymentModal'; 

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Fetch subscriptions cuando el componente se monta
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscriptions');
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const handleRegisterPayment = (subscription: any) => {
    setSelectedSubscription(subscription);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    fetchSubscriptions(); // Recargar datos
    setShowPaymentModal(false);
  };

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

      {/* ... estadísticas ... */}

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
            {subscriptions.map((subscription: any) => {
              const today = new Date();
              const nextPayment = new Date(today.getFullYear(), today.getMonth(), subscription.billingDay);
              if (nextPayment < today) {
                nextPayment.setMonth(nextPayment.getMonth() + 1);
              }

              return (
                <tr key={subscription.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{subscription.client?.businessName}</div>
                    <div className="text-sm text-gray-500">{subscription.client?.contactName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{subscription.product?.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${subscription.priceMonthly?.toLocaleString('es-CO') || 0}/mes
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
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Ver
                    </Link>
                    <button
                      onClick={() => handleRegisterPayment(subscription)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Pagar
                    </button>
                    <Link 
                      href={`/admin/subscriptions/${subscription.id}/edit`}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal de registro de pago */}
      {showPaymentModal && selectedSubscription && (
        <PaymentModal
          subscription={selectedSubscription}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}