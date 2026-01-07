// app/api/payments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscriptionId');

    const where: any = {};
    if (subscriptionId) {
      where.subscriptionId = subscriptionId;
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        subscription: {
          include: {
            client: true,
            product: true,
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

    // Verificar que la suscripción exista
    const subscription = await prisma.subscription.findUnique({
      where: { id: body.subscriptionId },
      include: { client: true, product: true },
    });

    if (!subscription) {
      return NextResponse.json({ error: 'Suscripción no encontrada' }, { status: 404 });
    }

    // Crear el pago
    const payment = await prisma.payment.create({
      data: {
        subscriptionId: body.subscriptionId,
        amount: parseFloat(body.amount),
        currency: body.currency || 'COP',
        period: new Date(body.paidAt || new Date()),
        paidAt: body.paidAt ? new Date(body.paidAt) : new Date(),
        dueDate: body.paidAt ? new Date(body.paidAt) : new Date(),
        status: 'paid',
        receiptUrl: body.receiptUrl || null,
        notes: body.notes || null,
      },
    });

    // Crear el siguiente pago pendiente (para el próximo mes)
    const nextDueDate = new Date(payment.dueDate);
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);

    await prisma.payment.create({
      data: {
        subscriptionId: body.subscriptionId,
        amount: subscription.priceMonthly,
        dueDate: nextDueDate,
        period: new Date(nextDueDate.getFullYear(), nextDueDate.getMonth(), 1),
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}