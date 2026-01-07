// app/api/subscriptions/route.ts
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

    const subscriptions = await prisma.subscription.findMany({
      include: {
        client: true,
        product: true,
        payments: {
          orderBy: {
            dueDate: 'desc',
          },
          take: 5,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
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
    
    // Obtener la compañía del usuario
    const company = await prisma.company.findFirst();
    if (!company) {
      return NextResponse.json({ error: 'Compañía no encontrada' }, { status: 404 });
    }

    // Verificar que el cliente exista
    const client = await prisma.client.findUnique({
      where: { id: body.clientId },
    });
    
    if (!client) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    // Verificar que el producto exista
    const product = await prisma.product.findUnique({
      where: { id: body.productId },
    });
    
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    const subscription = await prisma.subscription.create({
      data: {
        clientId: body.clientId,
        productId: body.productId,
        companyId: company.id,
        priceMonthly: parseFloat(body.priceMonthly),
        billingDay: parseInt(body.billingDay),
        status: body.status,
        startsAt: new Date(body.startsAt),
        endsAt: body.endsAt ? new Date(body.endsAt) : null,
        paymentMethod: body.paymentMethod || null,
        instanceUrl: body.instanceUrl || null,
      },
    });

    // Crear el primer pago pendiente - CORREGIDO
    const today = new Date();
    const dueDate = new Date(today.getFullYear(), today.getMonth(), parseInt(body.billingDay));
    
    // Si el día de facturación ya pasó este mes, programar para el próximo mes
    if (dueDate < today) {
      dueDate.setMonth(dueDate.getMonth() + 1);
    }

    // Verificar si ya existe un pago para esa fecha
    const existingPayment = await prisma.payment.findFirst({
      where: {
        subscriptionId: subscription.id,
        dueDate: dueDate,
      },
    });

    if (!existingPayment) {
      await prisma.payment.create({
        data: {
          subscriptionId: subscription.id,
          amount: parseFloat(body.priceMonthly),
          dueDate: dueDate,
          period: new Date(dueDate.getFullYear(), dueDate.getMonth(), 1),
          status: 'pending',
        },
      });
    }

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}