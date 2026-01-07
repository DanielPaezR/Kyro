// app/api/public/products/route.ts - VERSIÓN CORREGIDA
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Solo productos activos para el público
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        demoUrl: true,       // ✅ Ahora sí existe
        icon: true,
        features: true,
        basePriceMonthly: true, // Puedes agregar este si lo necesitas
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching public products:', error);
    return NextResponse.json(
      { error: 'Error al cargar productos' },
      { status: 500 }
    );
  }
}