import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // En producción, buscarías el usuario en tu DB
        // Por ahora, usamos un admin temporal
        const validEmail = process.env.ADMIN_EMAIL || 'admin@kyro.com'
        const validPassword = process.env.ADMIN_PASSWORD || 'admin123'
        
        if (credentials.email === validEmail && credentials.password === validPassword) {
          return {
            id: '1',
            email: credentials.email,
            name: 'Admin Kyro',
            role: 'admin'
          }
        }
        
        return null
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/admin/login'
  }
})

export { handler as GET, handler as POST }