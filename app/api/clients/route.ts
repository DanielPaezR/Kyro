import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

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

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID de cliente requerido' },
        { status: 400 }
      )
    }

    const client = await prisma.client.update({
      where: { id },
      data: {
        businessName: data.businessName,
        contactName: data.contactName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        department: data.department,
        latitude: data.latitude,
        longitude: data.longitude,
        status: data.status
      }
    })
    
    return NextResponse.json(client)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Error al actualizar cliente' },
      { status: 500 }
    )
  }
}