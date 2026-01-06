// app/admin/payments/page.tsx
import { Prisma } from '@prisma/client'
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const dynamic = 'force-dynamic';

type PaymentWithDetails = Prisma.PaymentGetPayload<{
  include: {
    subscription: {
      include: {
        client: {
          select: {
            businessName: true;
            contactName: true;
          }
        };
        product: {
          select: {
            name: true;
          }
        };
      };
    };
  };
}>;

export default async function PaymentsPage() {
  const payments: PaymentWithDetails[] = await prisma.payment.findMany({
    include: {
      subscription: {
        include: {
          client: {
            select: {
              businessName: true,
              contactName: true,
            }
          },
          product: {
            select: {
              name: true,
            }
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  });

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyPayments = payments.filter(p => {
    const paymentDate = new Date(p.createdAt);
    return paymentDate.getMonth() === currentMonth && 
           paymentDate.getFullYear() === currentYear;
  });

  // Obtener métricas adicionales
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const completedPayments = payments.filter(p => p.status === 'completed').length;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pagos</h1>
      <p className="text-gray-600 mb-6">
        Historial de transacciones y gestión de facturación.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700">Total Recaudado</h3>
          <p className="text-3xl font-bold text-green-600">
            ${totalRevenue.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">Acumulado total</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700">Pagos del Mes</h3>
          <p className="text-3xl font-bold text-blue-600">
            {monthlyPayments.length}
          </p>
          <p className="text-sm text-gray-500">
            ${monthlyPayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700">Pendientes</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {pendingPayments}
          </p>
          <p className="text-sm text-gray-500">Por cobrar</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700">Completados</h3>
          <p className="text-3xl font-bold text-green-600">
            {completedPayments}
          </p>
          <p className="text-sm text-gray-500">Pagados</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Periodo
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {payment.subscription.client.businessName}
                  </div>
                  {payment.subscription.client.contactName && (
                    <div className="text-sm text-gray-500">
                      {payment.subscription.client.contactName}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {payment.subscription.product.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-semibold text-green-700">
                    ${payment.amount.toFixed(2)}
                  </span>
                  <div className="text-xs text-gray-500">
                    {payment.currency}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(payment.period), "MMM yyyy", { locale: es })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(payment.dueDate), "dd/MM/yyyy", { locale: es })}
                  {new Date(payment.dueDate) < new Date() && payment.status === 'pending' && (
                    <span className="ml-2 text-xs text-red-500 font-medium">
                      VENCIDO
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      payment.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : payment.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {payment.status === "completed"
                      ? "Pagado"
                      : payment.status === "pending"
                      ? "Pendiente"
                      : "Fallido"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.paidAt ? (
                    format(new Date(payment.paidAt), "dd/MM/yyyy", { locale: es })
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}