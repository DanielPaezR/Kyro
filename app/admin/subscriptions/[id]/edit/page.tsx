// app/admin/subscriptions/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditSubscriptionPage() {
  const router = useRouter();
  const params = useParams();
  const subscriptionId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    clientId: '',
    productId: '',
    priceMonthly: '',
    billingDay: '1',
    status: 'active',
    startsAt: '',
    endsAt: '',
    paymentMethod: '',
    instanceUrl: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch clients, products, and subscription data
      const [clientsRes, productsRes, subscriptionRes] = await Promise.all([
        fetch('/api/clients'),
        fetch('/api/products'),
        fetch(`/api/subscriptions/${subscriptionId}`),
      ]);

      if (clientsRes.ok) {
        setClients(await clientsRes.json());
      }

      if (productsRes.ok) {
        setProducts(await productsRes.json());
      }

      if (subscriptionRes.ok) {
        const subscription = await subscriptionRes.json();
        setFormData({
          clientId: subscription.clientId,
          productId: subscription.productId,
          priceMonthly: subscription.priceMonthly.toString(),
          billingDay: subscription.billingDay.toString(),
          status: subscription.status,
          startsAt: new Date(subscription.startsAt).toISOString().split('T')[0],
          endsAt: subscription.endsAt ? 
            new Date(subscription.endsAt).toISOString().split('T')[0] : '',
          paymentMethod: subscription.paymentMethod || '',
          instanceUrl: subscription.instanceUrl || '',
        });
      } else {
        console.error('Error fetching subscription');
        alert('Error al cargar la suscripción');
        router.push('/admin/subscriptions');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'productId') {
      // Buscar el producto seleccionado
      const selectedProduct = products.find(p => p.id === value);
      if (selectedProduct) {
        setFormData(prev => ({
          ...prev,
          productId: value,
          priceMonthly: selectedProduct.basePriceMonthly.toString(),
        }));
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          priceMonthly: parseFloat(formData.priceMonthly),
          billingDay: parseInt(formData.billingDay),
        }),
      });

      if (response.ok) {
        alert('Suscripción actualizada exitosamente');
        router.push(`/admin/subscriptions/${subscriptionId}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('Error al actualizar la suscripción');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Editar Suscripción</h1>
        <p className="text-gray-600">Actualiza la información de la suscripción</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente *
            </label>
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccionar cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.businessName} - {client.email}
                </option>
              ))}
            </select>
          </div>

          {/* Producto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Producto *
            </label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccionar producto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.basePriceMonthly}/mes
                </option>
              ))}
            </select>
          </div>

          {/* Precio Mensual */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio Mensual (COP) *
            </label>
            <input
              type="number"
              name="priceMonthly"
              value={formData.priceMonthly}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
              step="0.01"
            />
            <p className="text-xs text-gray-500 mt-1">
              Se auto-completa al seleccionar un producto
            </p>
          </div>

          {/* Día de Facturación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Día de Facturación *
            </label>
            <select
              name="billingDay"
              value={formData.billingDay}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day}>
                  {day} de cada mes
                </option>
              ))}
              <option value="31">Último día del mes</option>
            </select>
          </div>

          {/* Fecha de Inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Inicio *
            </label>
            <input
              type="date"
              name="startsAt"
              value={formData.startsAt}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Fecha de Fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Fin (opcional)
            </label>
            <input
              type="date"
              name="endsAt"
              value={formData.endsAt}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Activo</option>
              <option value="pending">Pendiente</option>
              <option value="cancelled">Cancelado</option>
              <option value="expired">Expirado</option>
            </select>
          </div>

          {/* Método de Pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Método de Pago
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar método</option>
              <option value="credit_card">Tarjeta de Crédito</option>
              <option value="debit_card">Tarjeta Débito</option>
              <option value="bank_transfer">Transferencia Bancaria</option>
              <option value="cash">Efectivo</option>
              <option value="nequi">Nequi</option>
              <option value="daviplata">Daviplata</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          {/* URL de Instancia */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de Instancia (opcional)
            </label>
            <input
              type="url"
              name="instanceUrl"
              value={formData.instanceUrl}
              onChange={handleChange}
              placeholder="https://cliente.tuproducto.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enlace a la instancia personalizada del cliente
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push(`/admin/subscriptions/${subscriptionId}`)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}