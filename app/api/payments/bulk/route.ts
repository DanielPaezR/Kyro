// app/api/payments/bulk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { paymentIds } = body;

    if (!paymentIds || !Array.isArray(paymentIds) || paymentIds.length === 0) {
      return NextResponse.json(
        { error: 'IDs de pagos requeridos' },
        { status: 400 }
      );
    }

    // Verificar que los pagos existan
    const existingPayments = await prisma.payment.findMany({
      where: { id: { in: paymentIds } },
      select: { id: true, status: true, subscriptionId: true },
    });

    if (existingPayments.length !== paymentIds.length) {
      return NextResponse.json(
        { error: 'Algunos pagos no existen' },
        { status: 404 }
      );
    }

    // No permitir eliminar pagos ya pagados sin confirmación
    const paidPayments = existingPayments.filter(p => p.status === 'paid');
    if (paidPayments.length > 0) {
      return NextResponse.json(
        { 
          error: 'No se pueden eliminar pagos ya pagados', 
          paidPaymentIds: paidPayments.map(p => p.id) 
        },
        { status: 400 }
      );
    }

    // Eliminar pagos
    await prisma.payment.deleteMany({
      where: { id: { in: paymentIds } },
    });

    return NextResponse.json({ 
      message: `Se eliminaron ${paymentIds.length} pago(s) correctamente`,
      deletedCount: paymentIds.length
    });
  } catch (error) {
    console.error('Error deleting bulk payments:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}