import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('=== INICIO DEBUG LOGIN ===');
        console.log('Email recibido:', credentials?.email);
        console.log('Password recibido:', credentials?.password);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Credenciales incompletas');
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          console.log('Usuario encontrado en DB:', user ? 'SÍ' : 'NO');
          
          if (!user) {
            console.log('❌ Usuario no existe');
            return null;
          }

          console.log('ID usuario:', user.id);
          console.log('Password en DB:', user.password);
          console.log('Tipo password:', typeof user.password);
          console.log('Longitud password DB:', user.password?.length);

          // DEBUG: Mostrar primeros y últimos caracteres
          if (user.password) {
            console.log('Primeros 10 chars:', user.password.substring(0, 10));
            console.log('Últimos 10 chars:', user.password.substring(user.password.length - 10));
          }

          // Comparación EXACTA
          const isExactMatch = credentials.password === user.password;
          console.log('¿Coincidencia exacta?:', isExactMatch);
          
          // Comparación trim (por si hay espacios)
          const isTrimMatch = credentials.password.trim() === user.password?.trim();
          console.log('¿Coincidencia con trim?:', isTrimMatch);

          // Verificar si hay espacios o saltos de línea
          console.log('Password input char codes:', 
            Array.from(credentials.password).map(c => c.charCodeAt(0)));
          
          if (user.password) {
            console.log('Password DB char codes:', 
              Array.from(user.password).map(c => c.charCodeAt(0)));
          }

          if (!user.password || credentials.password !== user.password) {
            console.log('❌ Password no coincide');
            console.log('Input:', JSON.stringify(credentials.password));
            console.log('DB:', JSON.stringify(user.password));
            return null;
          }

          console.log('✅ LOGIN EXITOSO');
          console.log('=== FIN DEBUG LOGIN ===');
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
          
        } catch (error) {
          console.log('❌ Error en authorize:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.sub as string
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}