// lib/auth.ts - VERSIÓN DEFINITIVA
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Validar
        if (!credentials?.email || !credentials?.password) return null;
        
        // 2. Email debe coincidir
        if (credentials.email !== process.env.ADMIN_EMAIL) return null;
        
        // 3. Obtener hash de Railway
        const adminHash = process.env.ADMIN_PASSWORD_HASH;
        if (!adminHash) return null;
        
        // 4. Comparar contraseña
        const isValid = await bcrypt.compare(credentials.password, adminHash);
        if (!isValid) return null;
        
        // 5. Éxito
        return {
          id: "1",
          email: credentials.email,
          name: "Admin Kyro",
          role: "admin"
        };
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login", error: "/admin/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.sub;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};