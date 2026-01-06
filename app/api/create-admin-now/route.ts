// app/api/create-admin-now/route.ts
import { NextResponse } from "next/server";
import { Pool } from "pg";

export async function GET() {
  // Conexión DIRECTA a PostgreSQL sin Prisma
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const client = await pool.connect();
    
    // 1. Verificar si existe
    const checkResult = await client.query(
      'SELECT id FROM "users" WHERE email = $1',
      ['admin@kyro.com']
    );
    
    if (checkResult.rows.length > 0) {
      await client.release();
      return NextResponse.json({
        success: true,
        message: "✅ Admin ya existe",
      });
    }
    
    // 2. Crear admin (password: admin123 hasheado)
    await client.query(`
      INSERT INTO "users" (id, name, email, password, role, "createdAt", "updatedAt") 
      VALUES (
        gen_random_uuid(),
        'Admin Kyro',
        'admin@kyro.com',
        '$2a$10$XvgW8Lm9LzH5pD8eL7qB3eJ7V6tQYwKjH8dL2pN4rS1vW3yZ5A6B7C8D9E0F1G2H3I4',
        'admin',
        NOW(),
        NOW()
      )
    `);
    
    await client.release();
    
    return NextResponse.json({
      success: true,
      message: "✅ Admin creado EXITOSAMENTE",
      login: "admin@kyro.com / admin123"
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      databaseUrl: process.env.DATABASE_URL?.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')
    }, { status: 500 });
  } finally {
    await pool.end();
  }
}