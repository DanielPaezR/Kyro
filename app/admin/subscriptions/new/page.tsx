// app/admin/subscriptions/new/page.tsx - VERSIÓN CORREGIDA
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Client {
  id: string;
  businessName: string;
  contactName: string | null;
  email: string;
  status: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  basePriceMonthly: number;
  slug: string;
  demoUrl: string | null;
}

export default function NewSubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientIdFromUrl = searchParams.get('client');

  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    clientId: clientIdFromUrl || '',
    productId: '',
    priceMonthly: '',
    billingDay: '1',
    status: 'active',
    startsAt: new Date().toISOString().split('T')[0],
    endsAt: '',
    paymentMethod: '',
    instanceUrl: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clientsRes, productsRes] = await Promise.all([
        fetch('/api/clients'),
        fetch('/api/products'),
      ]);
      
      if (clientsRes.ok) {
        const clientsData = await clientsRes.json();
        setClients(clientsData);
      } else {
        console.error('Error fetching clients:', await clientsRes.text());
      }
      
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      } else {
        console.error('Error fetching products:', await productsRes.text());
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
    setLoading(true);

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          priceMonthly: parseFloat(formData.priceMonthly),
          billingDay: parseInt(formData.billingDay),
        }),
      });

      if (response.ok) {
        alert('Suscripción creada exitosamente');
        router.push('/admin/subscriptions');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('Error al crear la suscripción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Nueva Suscripción</h1>
        <p className="text-gray-600">Registra una nueva suscripción para un cliente</p>
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
            onClick={() => router.push('/admin/subscriptions')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando...
              </>
            ) : 'Crear Suscripción'}
          </button>
        </div>
      </form>
    </div>
  );
}