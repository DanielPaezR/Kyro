// app/admin/layout.tsx - SOLO UI, SIN LÓGICA DE AUTENTICACIÓN
'use client';

import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Si estamos en login, mostrar solo el contenido
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Si no hay sesión, no mostrar nada (el middleware redirigirá)
  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/admin/login' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-xl font-bold text-gray-800">
                Kyro Platform
              </Link>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link href="/admin" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                  Dashboard
                </Link>
                <Link href="/admin/clients" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                  Clientes
                </Link>
                <Link href="/admin/subscriptions" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                  Suscripciones
                </Link>
                <Link href="/admin/payments" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                  Pagos
                </Link>
                <Link href="/admin/products" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                  Productos
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {session?.user?.name || session?.user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}