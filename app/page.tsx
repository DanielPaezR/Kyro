// app/page.tsx - PÚBLICA ELEGANTE
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
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar - Elegante y minimalista */}
      <nav className="fixed w-full bg-black/90 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image 
                  src="../public/kyro-logo.png" 
                  alt="Kyro Logo" 
                  width={40} 
                  height={40}
                  className="filter brightness-0 invert" 
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
        {/* Fondo con patrón sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-95"></div>
        
        {/* Elementos decorativos */}
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
            <a 
              href="#products" 
              className="px-8 py-4 bg-white text-black font-bold hover:bg-gray-200 transition duration-300 shadow-lg"
            >
              Ver Productos
            </a>
            <a 
              href="#contact" 
              className="px-8 py-4 border border-white text-white font-bold hover:bg-white hover:text-black transition duration-300"
            >
              Solicitar Demo
            </a>
          </div>
        </div>
      </section>

      {/* Sección de Características */}
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
              <p className="text-gray-400">
                Sistemas optimizados que ofrecen una experiencia rápida y sin interrupciones.
              </p>
            </div>

            <div className="bg-black p-8 rounded-xl border border-gray-800 hover:border-gray-600 transition group">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-700 transition">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Seguridad Absoluta</h3>
              <p className="text-gray-400">
                Protección de datos con la más alta seguridad y confidencialidad para tu tranquilidad.
              </p>
            </div>

            <div className="bg-black p-8 rounded-xl border border-gray-800 hover:border-gray-600 transition group">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-700 transition">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Confiabilidad Total</h3>
              <p className="text-gray-400">
                Sistemas estables con una disponibilidad del 99.9%, funcionando 24/7 para tu negocio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Productos */}
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
                let demoButton = null;
                
                if (product.name === "WABot") {
                  demoButton = (
                    <a 
                      href="https://wabot-directorio-production.up.railway.app/directorio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full py-3 bg-white text-black font-medium hover:bg-gray-200 transition"
                    >
                      Probar Demo
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  );
                } else if (product.name === "SmartPath") {
                  demoButton = (
                    <a 
                      href="https://manejoinventarios-production.up.railway.app/login"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full py-3 bg-white text-black font-medium hover:bg-gray-200 transition"
                    >
                      Probar Demo
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  );
                } else {
                  demoButton = (
                    <button className="w-full py-3 border border-gray-700 text-gray-400 font-medium cursor-not-allowed">
                      Demo Próximamente
                    </button>
                  );
                }

                return (
                  <div key={product.id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition group">
                    <div className="p-8">
                      <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-gray-700 transition">
                        {product.icon ? (
                          <div className="text-xl">{product.icon}</div>
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

                      {demoButton}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-gray-900 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Productos en Desarrollo</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Estamos preparando nuestros sistemas con la elegancia y precisión que mereces.
                Vuelve pronto para ver nuestras soluciones.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Sección de Precios */}
      <section id="pricing" className="py-20 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Planes de Suscripción</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Precios transparentes para negocios que valoran la excelencia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Plan Básico */}
            <div className="bg-black p-8 rounded-xl border border-gray-800">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Esencial</h3>
                <div className="flex justify-center items-baseline mb-4">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-gray-400 ml-2">/mes</span>
                </div>
                <p className="text-gray-400 text-sm">Perfecto para comenzar</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  1 Sistema principal
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Soporte por email
                </li>
                <li className="flex items-center text-gray-400">
                  <svg className="w-5 h-5 text-gray-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Personalización avanzada
                </li>
              </ul>
              
              <button className="w-full py-3 border border-gray-700 text-white font-medium hover:bg-gray-800 transition">
                Comenzar Prueba
              </button>
            </div>

            {/* Plan Profesional */}
            <div className="bg-black p-8 rounded-xl border-2 border-white relative transform scale-105 shadow-2xl">
              <div className="absolute top-0 right-0 bg-white text-black px-4 py-1 text-sm font-bold">
                MÁS POPULAR
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Profesional</h3>
                <div className="flex justify-center items-baseline mb-4">
                  <span className="text-4xl font-bold">$199</span>
                  <span className="text-gray-400 ml-2">/mes</span>
                </div>
                <p className="text-gray-400 text-sm">Para negocios establecidos</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  3 Sistemas principales
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Soporte prioritario 24/7
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Personalización básica
                </li>
              </ul>
              
              <button className="w-full py-3 bg-white text-black font-bold hover:bg-gray-200 transition">
                Comenzar Ahora
              </button>
            </div>

            {/* Plan Empresarial */}
            <div className="bg-black p-8 rounded-xl border border-gray-800">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Empresarial</h3>
                <div className="flex justify-center items-baseline mb-4">
                  <span className="text-4xl font-bold">$499</span>
                  <span className="text-gray-400 ml-2">/mes</span>
                </div>
                <p className="text-gray-400 text-sm">Soluciones completas</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Sistemas ilimitados
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Gerente de cuenta dedicado
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Personalización completa
                </li>
              </ul>
              
              <button className="w-full py-3 border border-gray-700 text-white font-medium hover:bg-gray-800 transition">
                Contactar Ventas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Contacto */}
      <section id="contact" className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">¿Listo para Transformar tu Negocio?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Solicita una demo hoy y descubre cómo Kyro puede ayudar a tu negocio.
            </p>
          </div>

          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nombre</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white text-white"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Empresa</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white text-white"
                    placeholder="Nombre de tu empresa"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white text-white"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white text-white"
                    placeholder="+57 300 123 4567"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mensaje</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white text-white"
                  placeholder="Cuéntanos sobre tu negocio y necesidades..."
                ></textarea>
              </div>
              
              <div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-white text-black font-bold hover:bg-gray-200 transition"
                >
                  Solicitar Demo Personalizada
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-black rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">KYRO</h3>
                  <p className="text-sm text-gray-400">Elegant Solutions</p>
                </div>
              </div>
              <p className="text-gray-400 max-w-md">
                Soluciones de software empresarial diseñadas con elegancia, precisión y un profundo entendimiento de los negocios.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition">Características</a></li>
                <li><a href="#products" className="text-gray-400 hover:text-white transition">Productos</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition">Precios</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition">Contacto</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>kyrodeployments@gmail.com</li>
                <li>+57 3225968095</li>
                <li>Medellín, Colombia</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Kyro Platform. Todos los derechos reservados.</p>
            <p className="mt-2">Diseñado con elegancia y precisión.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}