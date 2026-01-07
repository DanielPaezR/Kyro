// app/api/payments/route.ts - VERSIÓN CORREGIDA
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// app/api/payments/route.ts - Agregar filtros al GET
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscriptionId');
    const status = searchParams.get('status');

    const where: any = {};
    
    if (subscriptionId) {
      where.subscriptionId = subscriptionId;
    }
    
    if (status && status !== 'all') {
      where.status = status;
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        subscription: {
          include: {
            client: {
              select: {
                id: true,
                businessName: true,
                contactName: true,
              },
            },
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        dueDate: 'desc',
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();

    // 1. Verificar que la suscripción exista
    const subscription = await prisma.subscription.findUnique({
      where: { id: body.subscriptionId },
      include: { client: true, product: true },
    });

    if (!subscription) {
      return NextResponse.json({ error: 'Suscripción no encontrada' }, { status: 404 });
    }

    // 2. Buscar el pago pendiente más reciente para actualizarlo
    const pendingPayment = await prisma.payment.findFirst({
      where: {
        subscriptionId: body.subscriptionId,
        status: 'pending',
        dueDate: {
          lte: new Date(body.paidAt || new Date()), // Pago que debería haberse vencido
        },
      },
      orderBy: {
        dueDate: 'desc',
      },
    });

    let payment;

    if (pendingPayment) {
      // 3. Si existe un pago pendiente, actualizarlo
      payment = await prisma.payment.update({
        where: { id: pendingPayment.id },
        data: {
          amount: parseFloat(body.amount) || subscription.priceMonthly,
          paidAt: body.paidAt ? new Date(body.paidAt) : new Date(),
          status: 'paid',
          receiptUrl: body.receiptUrl || null,
          notes: body.notes || null,
        },
      });
    } else {
      // 4. Si no hay pago pendiente, crear uno nuevo
      const dueDate = body.paidAt ? new Date(body.paidAt) : new Date();
      
      payment = await prisma.payment.create({
        data: {
          subscriptionId: body.subscriptionId,
          amount: parseFloat(body.amount) || subscription.priceMonthly,
          currency: body.currency || 'COP',
          period: new Date(dueDate.getFullYear(), dueDate.getMonth(), 1),
          paidAt: dueDate,
          dueDate: dueDate,
          status: 'paid',
          receiptUrl: body.receiptUrl || null,
          notes: body.notes || null,
        },
      });
    }

    // 5. Crear el próximo pago pendiente SOLO si no existe ya
    const nextMonth = new Date(payment.dueDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    // Verificar si ya existe un pago para el próximo mes
    const existingNextPayment = await prisma.payment.findFirst({
      where: {
        subscriptionId: body.subscriptionId,
        dueDate: {
          gte: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1),
          lt: new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 1),
        },
        status: 'pending',
      },
    });

    if (!existingNextPayment) {
      // Crear el próximo pago pendiente
      await prisma.payment.create({
        data: {
          subscriptionId: body.subscriptionId,
          amount: subscription.priceMonthly,
          currency: 'COP',
          dueDate: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), subscription.billingDay),
          period: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1),
          status: 'pending',
        },
      });
    }

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}