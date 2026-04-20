// app/page.tsx - VERSIÓN DEFINITIVA
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  demoUrl: string | null;
  icon: string | null;
  features: string[];
}

// Productos de respaldo por si falla la API
const fallbackProducts: Product[] = [
  {
    id: '1',
    name: 'WABot',
    description: 'Sistema de gestión de citas y directorio para barberías y spas.',
    demoUrl: 'https://wabot-directorio-production.up.railway.app/directorio',
    icon: null,
    features: ['Agendamiento automático por WhatsApp', 'Directorio con mapa', 'Perfiles de profesionales']
  },
  {
    id: '2',
    name: 'SmartPath',
    description: 'Sistema de inventarios y gestión para pequeños negocios.',
    demoUrl: 'https://manejoinventarios-production.up.railway.app/login',
    icon: null,
    features: ['Control de inventario', 'Gestión de ventas', 'Reportes en tiempo real']
  }
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/public/products');
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          // Si la API devuelve vacío, usamos fallback
          setProducts(fallbackProducts);
        }
      } else {
        // Si la API falla, usamos fallback
        setProducts(fallbackProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener la URL del demo según el nombre (insensible a mayúsculas)
  const getDemoUrl = (productName: string) => {
    const name = productName.toLowerCase();
    if (name === 'wabot') {
      return 'https://wabot-directorio-production.up.railway.app/directorio';
    }
    if (name === 'smartpath') {
      return 'https://manejoinventarios-production.up.railway.app/login';
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="fixed w-full bg-black/90 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo - CORREGIDO: ruta absoluta desde public */}
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image 
                  src="/kyro-logo.png" 
                  alt="Kyro Logo" 
                  width={40} 
                  height={40}
                  className="filter brightness-0 invert" 
                  onError={(e) => {
                    // Si no carga el logo, mostrar un fallback
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    // Podrías agregar un div con el texto "K" como respaldo
                  }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">KYRO</h1>
                <p className="text-xs text-gray-400">Elegant Solutions</p>
              </div>
            </div>

            {/* Menú de navegación */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition">Características</a>
              <a href="#products" className="text-gray-300 hover:text-white transition">Productos</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition">Precios</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition">Contacto</a>
            </div>

            {/* Botón Login */}
            <Link 
              href="/admin/login" 
              className="px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition duration-300 font-medium"
            >
              Panel Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-95"></div>
        <div className="absolute top-20 right-10 w-64 h-64 border border-gray-700 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 border border-gray-700 rounded-full opacity-20"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center border border-gray-700 shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Soluciones de Software
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mt-2">
              Elegantes y Poderosas
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Kyro ofrece soluciones de software empresarial que combinan un diseño elegante con la máxima eficiencia. 
            Nuestros sistemas son robustos, intuitivos y están diseñados para impulsar tu negocio.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#products" className="px-8 py-4 bg-white text-black font-bold hover:bg-gray-200 transition duration-300 shadow-lg">
              Ver Productos
            </a>
            <a href="#contact" className="px-8 py-4 border border-white text-white font-bold hover:bg-white hover:text-black transition duration-300">
              Solicitar Demo
            </a>
          </div>
        </div>
      </section>

      {/* Sección de Características (igual) */}
      <section id="features" className="py-20 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Elegancia en Cada Detalle</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Diseñamos sistemas que no solo funcionan perfectamente, sino que también inspiran confianza y profesionalismo.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black p-8 rounded-xl border border-gray-800 hover:border-gray-600 transition group">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-700 transition">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Rendimiento Excepcional</h3>
              <p className="text-gray-400">Sistemas optimizados que ofrecen una experiencia rápida y sin interrupciones.</p>
            </div>
            <div className="bg-black p-8 rounded-xl border border-gray-800 hover:border-gray-600 transition group">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-700 transition">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Seguridad Absoluta</h3>
              <p className="text-gray-400">Protección de datos con la más alta seguridad y confidencialidad.</p>
            </div>
            <div className="bg-black p-8 rounded-xl border border-gray-800 hover:border-gray-600 transition group">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-700 transition">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Confiabilidad Total</h3>
              <p className="text-gray-400">Sistemas estables con disponibilidad 24/7 para tu negocio.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Productos - CORREGIDA con enlaces directos */}
      <section id="products" className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nuestros Productos</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Sistemas diseñados para negocios que buscan excelencia y elegancia.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="mt-4 text-gray-400">Cargando productos...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                const demoUrl = getDemoUrl(product.name);
                return (
                  <div key={product.id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition group">
                    <div className="p-8">
                      <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-gray-700 transition">
                        {product.icon ? (
                          <div className="text-xl">📊</div>
                        ) : (
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3">{product.name}</h3>
                      <p className="text-gray-400 mb-6">{product.description}</p>
                      
                      {product.features && product.features.length > 0 && (
                        <ul className="space-y-2 mb-6">
                          {product.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-300">
                              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}

                      {demoUrl ? (
                        <a 
                          href={demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full py-3 bg-white text-black font-medium hover:bg-gray-200 transition"
                        >
                          Probar Demo
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      ) : (
                        <button className="w-full py-3 border border-gray-700 text-gray-400 font-medium cursor-not-allowed">
                          Demo Próximamente
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Las secciones de Precios, Contacto y Footer se mantienen igual (no tienen errores) */}
      {/* ... (copia el resto de tu código de pricing, contacto y footer desde arriba) ... */}
    </div>
  );
}