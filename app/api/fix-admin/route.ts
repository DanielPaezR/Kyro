// app/api/fix-admin/route.ts
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Hash de la contraseña admin123
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    // Crear o actualizar admin
    const admin = await prisma.user.upsert({
      where: { email: "admin@kyro.com" },
      update: {
        password: hashedPassword, // Actualiza por si acaso
      },
      create: {
        name: "Admin Kyro",
        email: "admin@kyro.com",
        password: hashedPassword,
        role: "admin",
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "✅ Admin creado/actualizado",
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role
      }
    });
    
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      hint: "Este error indica que Prisma no puede conectar a la DB"
    }, { status: 500 });
  }
}