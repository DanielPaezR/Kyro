// lib/prisma.ts - VERSIÓN FINAL CORREGIDA
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// URL de Railway REAL
const databaseUrl = process.env.DATABASE_URL || '';

// DIAGNÓSTICO: Ver qué URL está recibiendo
console.log('🔍 Prisma URL recibida:', databaseUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

// FIX: Si la URL contiene 'postgres.railway.internal', reemplazarla por la REAL
let correctedUrl = databaseUrl;
if (databaseUrl.includes('postgres.railway.internal')) {
  // Tu URL REAL es: shinkansen.proxy.rlwy.net:48629
  correctedUrl = 'postgresql://postgres:ydWczGeQRVImjZvvcnbSgklfCUnCJNse@shinkansen.proxy.rlwy.net:48629/railway';
  console.log('🔧 URL corregida:', correctedUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: correctedUrl,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma