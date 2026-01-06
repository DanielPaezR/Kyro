// scripts/seed-admin.js
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  try {
    // Verificar si ya existe
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@kyro.com' }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await prisma.user.create({
        data: {
          name: 'Admin Kyro',
          email: 'admin@kyro.com',
          password: hashedPassword,
          role: 'admin',
        },
      });
      console.log('✅ Usuario admin creado');
    } else {
      console.log('⚠️  Usuario admin ya existe');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();