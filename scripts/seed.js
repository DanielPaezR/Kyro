const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')
  
  // 1. Verificar si ya existe la empresa
  const existingCompany = await prisma.company.findFirst()
  
  if (existingCompany) {
    console.log('✅ La empresa ya existe, saltando creación...')
    return
  }
  
  // 2. Crear empresa base (sin datos específicos)
  const company = await prisma.company.create({
    data: {
      name: 'Kyro Platform',
      // El usuario llenará estos datos desde el panel admin
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      currency: 'COP',
      timezone: 'America/Bogota'
    }
  })
  
  console.log(`✅ Empresa creada: ${company.name}`)
  
  // 3. Crear productos base (sin precios específicos)
  const products = await Promise.all([
    prisma.product.create({
      data: {
        companyId: company.id,
        slug: 'agendador',
        name: 'Wabot',
        description: 'Sistema de gestión de citas automatizado',
        icon: 'Calendar',
        isActive: true,
        basePriceMonthly: 0, // El usuario definirá el precio
        features: JSON.stringify([]) // Se llenará desde el admin
      }
    }),
    prisma.product.create({
      data: {
        companyId: company.id,
        slug: 'ventas',
        name: 'Registrador de Ventas',
        description: 'Sistema de control de inventario y ventas',
        icon: 'ShoppingCart',
        isActive: true,
        basePriceMonthly: 0,
        features: JSON.stringify([])
      }
    })
  ])
  
  console.log(`✅ ${products.length} productos base creados`)
  
  // 4. Crear configuración de recordatorios por defecto
  await prisma.reminder.create({
    data: {
      companyId: company.id,
      daysBefore: 3,
      templateSubject: 'Recordatorio de pago - {business_name}',
      templateBody: 'Estimado {contact_name}, le recordamos que su pago de ${amount} vence el {due_date}.',
      isActive: true
    }
  })
  
  console.log('✅ Configuración de recordatorios creada')
  
  console.log('🎉 Seed completado exitosamente!')
  console.log('\n📋 Pasos siguientes:')
  console.log('1. Inicia sesión en el panel admin')
  console.log('2. Configura los precios de tus productos')
  console.log('3. Personaliza los colores de tu empresa')
  console.log('4. Añade tu primer cliente')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })