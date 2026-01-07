// scripts/cleanup-duplicate-payments.js - VERSIÓN CORREGIDA
const { PrismaClient } = require('@prisma/client');
require('dotenv').config(); // 👈 IMPORTANTE: Cargar variables de entorno

const prisma = new PrismaClient();

async function cleanupDuplicatePayments() {
  try {
    console.log('🔍 Buscando pagos duplicados...');
    
    // Encontrar todos los pagos agrupados por suscripción y mes
    const allPayments = await prisma.payment.findMany({
      include: {
        subscription: {
          include: {
            client: true,
          },
        },
      },
      orderBy: [
        { subscriptionId: 'asc' },
        { dueDate: 'asc' },
      ],
    });

    console.log(`📊 Total de pagos encontrados: ${allPayments.length}`);
    
    // Agrupar pagos por suscripción y mes
    const paymentsBySubscription = new Map();
    
    for (const payment of allPayments) {
      if (!paymentsBySubscription.has(payment.subscriptionId)) {
        paymentsBySubscription.set(payment.subscriptionId, []);
      }
      paymentsBySubscription.get(payment.subscriptionId).push(payment);
    }

    let deletedCount = 0;
    let updatedCount = 0;

    // Procesar cada suscripción
    for (const [subscriptionId, payments] of paymentsBySubscription) {
      const paymentsByMonth = new Map();
      
      // Identificar duplicados por mes
      for (const payment of payments) {
        const dueDate = new Date(payment.dueDate);
        const monthKey = `${dueDate.getFullYear()}-${dueDate.getMonth()}`;
        
        if (paymentsByMonth.has(monthKey)) {
          // Hay duplicado
          const existingPayment = paymentsByMonth.get(monthKey);
          
          // Mantener el más reciente o el que esté pagado
          if (payment.status === 'paid' && existingPayment.status !== 'paid') {
            // Eliminar el existente y mantener este
            console.log(`❌ Eliminando pago ${existingPayment.id} (${existingPayment.status}) en favor de ${payment.id} (${payment.status})`);
            await prisma.payment.delete({
              where: { id: existingPayment.id },
            });
            deletedCount++;
            paymentsByMonth.set(monthKey, payment);
          } else {
            // Eliminar este duplicado
            console.log(`❌ Eliminando pago duplicado: ${payment.id} para suscripción ${subscriptionId} en ${monthKey}`);
            await prisma.payment.delete({
              where: { id: payment.id },
            });
            deletedCount++;
          }
        } else {
          // Primer pago de este mes
          paymentsByMonth.set(monthKey, payment);
        }
      }

      // Corregir estados incorrectos
      for (const payment of paymentsByMonth.values()) {
        if (payment.paidAt && payment.status !== 'paid') {
          console.log(`🔄 Actualizando estado de pago ${payment.id} a 'paid'`);
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'paid' },
          });
          updatedCount++;
        } else if (!payment.paidAt && payment.dueDate < new Date() && payment.status === 'pending') {
          console.log(`🔄 Actualizando estado de pago ${payment.id} a 'overdue'`);
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'overdue' },
          });
          updatedCount++;
        }
      }
    }

    console.log('\n✅ Limpieza completada:');
    console.log(`   - Pagos eliminados: ${deletedCount}`);
    console.log(`   - Pagos actualizados: ${updatedCount}`);
    console.log(`   - Pagos restantes: ${allPayments.length - deletedCount}`);
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la limpieza
cleanupDuplicatePayments();