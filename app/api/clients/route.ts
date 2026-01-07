// app/api/clients/route.ts - VERSIÓN COMPLETA
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Método GET para obtener todos los clientes
export async function GET(request: Request) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Buscar la compañía del usuario
    const company = await prisma.company.findFirst()
    if (!company) {
      return NextResponse.json(
        { error: 'No hay empresa configurada' },
        { status: 404 }
      )
    }

    // Obtener parámetros de búsqueda
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Construir filtro
    const where: any = {
      companyId: company.id
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (search) {
      where.OR = [
        { businessName: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Obtener clientes
    const clients = await prisma.client.findMany({
      where,
      select: {
        id: true,
        businessName: true,
        contactName: true,
        email: true,
        phone: true,
        status: true,
        city: true,
        department: true,
        createdAt: true,
        updatedAt: true,
        subscriptions: {
          where: { status: 'active' },
          select: { id: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(clients)
    
  } catch (error: any) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Método POST (ya lo tienes)
export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // 1. Verificar que existe empresa
    const company = await prisma.company.findFirst()
    if (!company) {
      return NextResponse.json(
        { error: 'Primero configura tu empresa en el sistema' },
        { status: 400 }
      )
    }
    
    // 2. Validar datos requeridos
    if (!data.businessName || !data.email) {
      return NextResponse.json(
        { error: 'Nombre del negocio y email son requeridos' },
        { status: 400 }
      )
    }
    
    // 3. Crear cliente
    const client = await prisma.client.create({
      data: {
        businessName: data.businessName,
        contactName: data.contactName || '',
        email: data.email,
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        department: data.department || '',
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        status: data.status || 'lead',
        companyId: company.id
      }
    })
    
    return NextResponse.json(client, { status: 201 })
    
  } catch (error: any) {
    console.error('Error creating client:', error)
    
    // Manejar errores de duplicado
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un cliente con este email' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
