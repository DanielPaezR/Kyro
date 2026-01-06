// scripts/init-database.js - TODO EN UNO
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Creando base de datos completa...');
  
  // 1. Empresa
  const company = await prisma.company.create({
    data: {
      name: 'Kyro Platform',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      currency: 'COP',
      timezone: 'America/Bogota',
    }
  });
  console.log('✅ Empresa creada');
  
  // 2. Usuario admin (para la BD, no para login)
  const hashedPassword = await bcrypt.hash('1004926020Paezzito', 10);
  await prisma.user.create({
    data: {
      name: 'Admin Kyro',
      email: 'admin@kyro.com',
      password: hashedPassword,
      role: 'admin',
    }
  });
  console.log('✅ Usuario admin creado en BD');
  
  // 3. Productos
  const products = [
    {
      slug: 'agendador-citas',
      name: 'Wabot',
      description: 'Sistema profesional de agendamiento',
      icon: '📅',
      basePriceMonthly: 29.99,
      companyId: company.id,
    },
    {
      slug: 'registro-ventas',
      name: 'Registro de Ventas',
      description: 'Control de inventario y facturación',
      icon: '💰',
      basePriceMonthly: 39.99,
      companyId: company.id,
    }
  ];
  
  for (const product of products) {
    await prisma.product.create({ data: product });
    console.log(`✅ Producto: ${product.name}`);
  }
  
  console.log('🎉 ¡BASE DE DATOS LISTA!');
  console.log('\n📋 Para login:');
  console.log('   Email: admin@kyro.com');
  console.log('   Password: 1004926020Paezzito');
}

main()
  .catch(e => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());