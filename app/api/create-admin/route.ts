// app/api/create-admin/route.ts
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Verificar si ya existe
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@kyro.com' }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await prisma.user.create({
        data: {
          name: 'Admin Kyro',
          email: 'admin@kyro.com',
          password: hashedPassword,
          role: 'admin',
        },
      });
      
      return NextResponse.json({ 
        success: true, 
        message: '✅ Usuario admin creado' 
      });
    } else {
      return NextResponse.json({ 
        success: true, 
        message: '⚠️ Usuario admin ya existe' 
      });
    }
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}