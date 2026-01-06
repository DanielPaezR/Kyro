// lib/auth.ts - VERSIÓN COMPLETA Y CORRECTA
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
        console.log("=== INICIO DEBUG LOGIN ===");
        console.log("Email recibido:", credentials?.email);
        console.log("Password recibido:", credentials?.password);
        
        // 1. Validar que hay credenciales
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ No hay credenciales");
          return null;
        }

        // 2. Verificar email CON variables de entorno
        const adminEmail = process.env.ADMIN_EMAIL || "admin@kyro.com";
        console.log("✅ Email configurado:", adminEmail);
        
        if (credentials.email !== adminEmail) {
          console.log(`❌ Email incorrecto: ${credentials.email} vs ${adminEmail}`);
          return null;
        }

        // 3. Obtener hash de las variables de entorno
        const adminHash = process.env.ADMIN_PASSWORD_HASH;
        console.log("✅ Hash cargado:", adminHash ? "SÍ" : "NO");
        
        if (!adminHash) {
          console.error("❌ ERROR: ADMIN_PASSWORD_HASH no configurado");
          return null;
        }

        // 4. Comparar contraseña SIN base de datos
        const isValid = await bcrypt.compare(credentials.password, adminHash);
        console.log("✅ Comparación bcrypt:", isValid ? "VÁLIDA" : "INVÁLIDA");
        
        if (!isValid) {
          console.log("❌ Contraseña incorrecta");
          return null;
        }

        // 5. Login exitoso
        console.log(`✅ Login exitoso: ${credentials.email}`);
        return {
          id: "admin-kyro-001",
          email: credentials.email,
          name: "Administrador Kyro",
          role: "admin"
        };
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
  debug: process.env.NODE_ENV === "development"
};