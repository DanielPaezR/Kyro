const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de Kyro Platform...')
  
  try {
    // 1. Crear o verificar empresa
    let company = await prisma.company.findFirst()
    
    if (!company) {
      company = await prisma.company.create({
        data: {
          name: 'Kyro Platform',
          primaryColor: '#7C3AED',
          secondaryColor: '#4F46E5',
          currency: 'COP',
          timezone: 'America/Bogota'
        }
      })
      console.log(`✅ Empresa creada: ${company.name}`)
    } else {
      console.log('✅ Empresa ya existe')
    }
    
    // 2. Crear productos si no existen
    const products = await prisma.product.findMany()
    
    if (products.length === 0) {
      await prisma.product.createMany({
        data: [
          {
            companyId: company.id,
            slug: 'agendador',
            name: 'Agendador de Citas',
            description: 'Sistema automatizado de gestión de citas',
            icon: 'Calendar',
            isActive: true,
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
            description: 'Control de inventario y ventas',
            icon: 'ShoppingCart',
            isActive: true,
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
      console.log('✅ Productos base creados')
    } else {
      console.log('✅ Productos ya existen')
    }
    
    // 3. Crear usuario admin si no existe
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@kyro.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10)
      
      await prisma.user.create({
        data: {
          email: adminEmail,
          name: 'Administrador Kyro',
          password: hashedPassword,
          role: 'admin',
          emailVerified: new Date()
        }
      })
      console.log(`✅ Usuario admin creado: ${adminEmail} / ${adminPassword}`)
    } else {
      console.log('✅ Usuario admin ya existe')
    }
    
    // 4. Crear recordatorio por defecto
    const reminderExists = await prisma.reminder.findFirst({
      where: { companyId: company.id }
    })
    
    if (!reminderExists) {
      await prisma.reminder.create({
        data: {
          companyId: company.id,
          daysBefore: 3,
          templateSubject: 'Recordatorio de pago - {business_name}',
          templateBody: 'Estimado {contact_name},\n\nLe recordamos que el pago de su suscripción por ${amount} vence el {due_date}.\n\nSaludos,\nEquipo Kyro',
          isActive: true
        }
      })
      console.log('✅ Recordatorio por defecto creado')
    }
    
    console.log('🎉 Seed completado exitosamente!')
    
  } catch (error) {
    console.error('❌ Error durante el seed:', error.message)
    if (error.code) console.error('Código error:', error.code)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error fatal:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })