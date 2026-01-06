// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// URL para producción en Railway (interna)
const productionUrl = process.env.DATABASE_URL?.includes('railway.internal') 
  ? process.env.DATABASE_URL
  : process.env.DATABASE_URL?.replace(/@[^/]+/, '@postgres.railway.internal');

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.NODE_ENV === 'production' 
        ? productionUrl 
        : process.env.DATABASE_URL,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma