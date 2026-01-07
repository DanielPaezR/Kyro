// app/api/public/products/route.ts - VERSIÓN CON TIPO MANUAL
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Tipo manual para los productos públicos
type PublicProduct = {
  id: string;
  name: string;
  description: string | null;
  demoUrl: string | null;
  icon: string | null;
  features: any;
  basePriceMonthly?: number;
};

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
        demoUrl: true,
        icon: true,
        features: true,
        basePriceMonthly: true,
      },
      orderBy: {
        name: 'asc',
      },
    }) as unknown as PublicProduct[]; // 👈 Cast manual

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching public products:', error);
    return NextResponse.json(
      { error: 'Error al cargar productos' },
      { status: 500 }
    );
  }
}