// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Crear empresa (tú)
  const company = await prisma.company.create({
    data: {
      name: 'Kyro Software',
      primaryColor: '#7C3AED',
      secondaryColor: '#4F46E5',
      currency: 'COP'
    }
  })

  // Crear productos iniciales
  await prisma.product.createMany({
    data: [
      {
        companyId: company.id,
        slug: 'agendador',
        name: 'Wabot',
        description: 'Sistema automatizado de gestión de citas con múltiples tipos de usuario',
        icon: 'Calendar',
        basePriceMonthly: 99000,
        features: JSON.stringify([
          'Panel de administración',
          'Múltiples tipos de usuario',
          'Estadísticas en tiempo real',
          'Recordatorios automáticos'
        ])
      },
      {
        companyId: company.id,
        slug: 'ventas',
        name: 'Registrador de Ventas',
        description: 'Control de inventario y ventas para todo tipo de negocios',
        icon: 'ShoppingCart',
        basePriceMonthly: 119000,
        features: JSON.stringify([
          'Control de inventario',
          'Reportes de ventas',
          'Múltiples métodos de pago',
          'Backup automático'
        ])
      }
    ]
  })

  // Crear cliente de ejemplo
  await prisma.client.create({
    data: {
      companyId: company.id,
      businessName: 'Farmacia La Esperanza',
      contactName: 'María González',
      email: 'farmacia@ejemplo.com',
      phone: '3124567890',
      city: 'Medellín',
      department: 'Antioquia',
      latitude: 6.2442,
      longitude: -75.5812,
      status: 'active'
    }
  })

  console.log('✅ Datos iniciales creados exitosamente!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })