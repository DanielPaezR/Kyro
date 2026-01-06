// app/api/clients/map/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      select: {
        id: true,
        businessName: true,
        contactName: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        department: true,
        latitude: true,
        longitude: true,
        status: true,
      },
      where: {
        
        email: { not: "" },
      },
      orderBy: {
        businessName: "asc",
      },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients for map:", error);
    return NextResponse.json(
      { error: "Error al cargar clientes para el mapa" },
      { status: 500 }
    );
  }
}