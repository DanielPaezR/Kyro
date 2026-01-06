// scripts/init-db.js - SCRIPT CORREGIDO CON TU URL
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:ydWczGeQRVImjZvvcnbSgklfCUnCJNse@shinkansen.proxy.rlwy.net:48629/railway'
    }
  }
});

async function main() {
  console.log('🔧 Inicializando base de datos Kyro...');
  
  try {
    // 1. Crear empresa si no existe
    const company = await prisma.company.upsert({
      where: { name: 'Kyro Platform' },
      update: {},
      create: {
        name: 'Kyro Platform',
        logoUrl: null,
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        currency: 'COP',
        timezone: 'America/Bogota',
      },
    });
    console.log('✅ Empresa:', company.name);
    
    // 2. Crear usuario admin (admin@kyro.com / admin123)
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@kyro.com' },
      update: { password: hashedPassword }, // Actualizar por si la contraseña cambió
      create: {
        name: 'Admin Kyro',
        email: 'admin@kyro.com',
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log('✅ Admin:', admin.email);
    
    // 3. Crear productos de ejemplo
    const products = [
      {
        slug: 'agendador-citas',
        name: 'Agendador de Citas',
        description: 'Sistema para agendar citas profesionales',
        icon: '📅',
        basePriceMonthly: 29.99,
        features: JSON.stringify(['Agenda online', 'Recordatorios SMS/Email', 'Pagos integrados']),
        companyId: company.id,
      },
      {
        slug: 'registro-ventas',
        name: 'Registro de Ventas',
        description: 'Control de inventario y ventas',
        icon: '💰',
        basePriceMonthly: 39.99,
        features: JSON.stringify(['Inventario', 'Facturación', 'Reportes']),
        companyId: company.id,
      },
    ];
    
    for (const productData of products) {
      const product = await prisma.product.upsert({
        where: { slug: productData.slug },
        update: {},
        create: productData,
      });
      console.log(`✅ Producto: ${product.name}`);
    }
    
    console.log('🎉 Base de datos inicializada correctamente!');
    console.log('\n📋 Credenciales para login:');
    console.log('   Email: admin@kyro.com');
    console.log('   Password: admin123');
    console.log('\n🔗 URL del admin: https://kyro-production.up.railway.app/admin');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Información de diagnóstico
    console.log('\n🔍 Diagnóstico:');
    console.log('URL usada:', process.env.DATABASE_URL || 'No encontrada en env');
    console.log('¿Tienes acceso a la BD desde tu PC?');
    console.log('Host: shinkansen.proxy.rlwy.net');
    console.log('Puerto: 48629');
    
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar
main();