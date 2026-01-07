// app/admin/payments/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  dueDate: string;
  paidAt: string | null;
  status: string;
  receiptUrl: string | null;
  notes: string | null;
  createdAt: string;
  subscription: {
    id: string;
    client: {
      id: string;
      businessName: string;
      contactName: string | null;
    };
    product: {
      name: string;
    };
  };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' ? '/api/payments' : `/api/payments?status=${filter}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagado';
      case 'pending': return 'Pendiente';
      case 'overdue': return 'Vencido';
      case 'failed': return 'Fallido';
      default: return status;
    }
  };

  const handleSelectPayment = (paymentId: string) => {
    setSelectedPayments(prev =>
      prev.includes(paymentId)
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPayments.length === payments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(payments.map(p => p.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedPayments.length) return;
    
    if (!confirm(`¿Estás seguro de eliminar ${selectedPayments.length} pago(s)? Esta acción no se puede deshacer.`)) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch('/api/payments/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIds: selectedPayments }),
      });

      if (response.ok) {
        alert(`Se eliminaron ${selectedPayments.length} pago(s) correctamente`);
        setSelectedPayments([]);
        fetchPayments(); // Recargar la lista
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Error al eliminar pagos'}`);
      }
    } catch (error) {
      console.error('Error deleting payments:', error);
      alert('Error al eliminar los pagos');
    } finally {
      setDeleting(false);
    }
  };

  const handleMarkAsPaid = async (paymentId: string) => {
    if (!confirm('¿Marcar este pago como pagado?')) return;

    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' }),
      });

      if (response.ok) {
        alert('Pago marcado como pagado');
        fetchPayments();
      }
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const handleDeleteSingle = async (paymentId: string) => {
    if (!confirm('¿Estás seguro de eliminar este pago?')) return;

    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Pago eliminado correctamente');
        fetchPayments();
      }
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pagos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administración de Pagos</h1>
          <p className="text-gray-600">Gestiona y limpia pagos duplicados o incorrectos</p>
        </div>
        <div className="flex space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="all">Todos los pagos</option>
            <option value="pending">Pendientes</option>
            <option value="paid">Pagados</option>
            <option value="overdue">Vencidos</option>
            <option value="failed">Fallidos</option>
          </select>
        </div>
      </div>

      {/* Panel de acciones masivas */}
      {selectedPayments.length > 0 && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-medium text-blue-800">
                {selectedPayments.length} pago(s) seleccionado(s)
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  if (confirm('¿Marcar los pagos seleccionados como pagados?')) {
                    selectedPayments.forEach(id => handleMarkAsPaid(id));
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Marcar como Pagados
              </button>
              <button
                onClick={handleDeleteSelected}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Eliminando...' : 'Eliminar Seleccionados'}
              </button>
              <button
                onClick={() => setSelectedPayments([])}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                <input
                  type="checkbox"
                  checked={payments.length > 0 && selectedPayments.length === payments.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vencimiento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Pago
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className={selectedPayments.includes(payment.id) ? 'bg-blue-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedPayments.includes(payment.id)}
                    onChange={() => handleSelectPayment(payment.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {payment.subscription.client.businessName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {payment.subscription.client.contactName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {payment.subscription.product.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-lg font-bold text-gray-900">
                    ${payment.amount.toLocaleString('es-CO')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {payment.currency}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(payment.dueDate), "dd/MM/yyyy", { locale: es })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(payment.dueDate), "MMM yyyy", { locale: es })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(payment.status)}`}>
                    {getStatusText(payment.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.paidAt ? (
                    <>
                      <div>{format(new Date(payment.paidAt), "dd/MM/yyyy", { locale: es })}</div>
                      <div className="text-xs text-green-600">✓ Pagado</div>
                    </>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/subscriptions/${payment.subscription.id}`}
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver suscripción"
                    >
                      🔍
                    </Link>
                    {payment.status !== 'paid' && (
                      <button
                        onClick={() => handleMarkAsPaid(payment.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Marcar como pagado"
                      >
                        ✓
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteSingle(payment.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar pago"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {payments.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">No hay pagos registrados</p>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-500">Total Pagos</p>
          <p className="text-2xl font-bold">{payments.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-500">Pagados</p>
          <p className="text-2xl font-bold text-green-600">
            {payments.filter(p => p.status === 'paid').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-500">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-600">
            {payments.filter(p => p.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-500">Vencidos/Fallidos</p>
          <p className="text-2xl font-bold text-red-600">
            {payments.filter(p => p.status === 'overdue' || p.status === 'failed').length}
          </p>
        </div>
      </div>
    </div>
  );
}