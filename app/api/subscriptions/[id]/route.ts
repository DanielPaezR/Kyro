// app/api/subscriptions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: params.id },
      include: {
        client: {
          select: {
            id: true,
            businessName: true,
            contactName: true,
            email: true,
            phone: true,
            city: true,
            department: true,
            status: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            basePriceMonthly: true,
          },
        },
      },
    });

    if (!subscription) {
      return NextResponse.json({ error: 'Suscripción no encontrada' }, { status: 404 });
    }

    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();

    const subscription = await prisma.subscription.update({
      where: { id: params.id },
      data: {
        clientId: body.clientId,
        productId: body.productId,
        priceMonthly: body.priceMonthly,
        billingDay: body.billingDay,
        status: body.status,
        startsAt: new Date(body.startsAt),
        endsAt: body.endsAt ? new Date(body.endsAt) : null,
        paymentMethod: body.paymentMethod || null,
        instanceUrl: body.instanceUrl || null,
      },
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}