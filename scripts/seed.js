const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')
  
  try {
    // 1. Verificar o crear empresa
    let company = await prisma.company.findFirst()
    
    if (!company) {
      company = await prisma.company.create({
        data: {
          name: 'Kyro Platform',
          primaryColor: '#3B82F6',
          secondaryColor: '#1E40AF',
          currency: 'COP',
          timezone: 'America/Bogota'
        }
      })
      console.log(`✅ Empresa creada: ${company.name}`)
      
      // 2. Crear productos solo si se creó empresa nueva
      await Promise.all([
        prisma.product.create({
          data: {
            companyId: company.id,
            slug: 'agendador',
            name: 'Wabot',
            description: 'Sistema de gestión de citas automatizado',
            icon: 'Calendar',
            isActive: true,
            basePriceMonthly: 0,
            features: JSON.stringify([])
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
      console.log('✅ Productos base creados')
      
      // 3. Crear configuración de recordatorios
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
    } else {
      console.log('✅ Empresa ya existe')
    }
    
    // 4. SIEMPRE verificar/crear usuario admin (esto se ejecuta siempre)
    const adminEmail = 'admin@kyro.com'
    const adminPassword = 'admin123'

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
      // Actualizar contraseña si ya existe (por si cambiaste la contraseña en el código)
      const hashedPassword = await bcrypt.hash(adminPassword, 10)
      await prisma.user.update({
        where: { email: adminEmail },
        data: { 
          password: hashedPassword,
          role: 'admin' 
        }
      })
      console.log(`✅ Usuario admin actualizado: ${adminEmail} / ${adminPassword}`)
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