// app/admin/quick-payment/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PaymentModal from '@/components/PaymentModal';

interface Subscription {
  id: string;
  priceMonthly: number;
  client: {
    businessName: string;
    contactName: string | null;
  };
  product: {
    name: string;
  };
}

export default function QuickPaymentPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchActiveSubscriptions();
  }, []);

  const fetchActiveSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscriptions?status=active');
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    fetchActiveSubscriptions(); // Recargar si es necesario
    setShowPaymentModal(false);
    router.push('/admin/payments'); // Redirigir a la página de pagos
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando suscripciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Registro Rápido de Pagos</h1>
            <p className="text-gray-600 mt-2">Selecciona una suscripción para registrar un pago</p>
          </div>
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            ← Volver al Dashboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.map((subscription) => (
          <div
            key={subscription.id}
            className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition cursor-pointer"
            onClick={() => {
              setSelectedSubscription(subscription);
              setShowPaymentModal(true);
            }}
          >
            <div className="mb-4">
              <h3 className="font-bold text-lg text-gray-900">
                {subscription.client.businessName}
              </h3>
              <p className="text-gray-600 text-sm">{subscription.client.contactName}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500">Producto</p>
              <p className="font-medium">{subscription.product.name}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500">Monto Mensual</p>
              <p className="text-2xl font-bold text-green-600">
                ${subscription.priceMonthly.toLocaleString('es-CO')}
              </p>
            </div>
            
            <div className="flex justify-end">
              <span className="text-blue-600 font-medium hover:text-blue-800">
                Registrar Pago →
              </span>
            </div>
          </div>
        ))}
      </div>

      {subscriptions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500">No hay suscripciones activas para registrar pagos</p>
          <button
            onClick={() => router.push('/admin/subscriptions')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Ver suscripciones →
          </button>
        </div>
      )}

      {/* Modal de pago */}
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