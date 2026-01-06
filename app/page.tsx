import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-blue-600">Kyro</span> Platform
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Software empresarial diseñado para automatizar y optimizar tu negocio. 
              Sistemas de citas, ventas, inventario y más.
            </p>
            <div className="space-x-4">
              <Link 
                href="/admin/login"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 text-lg font-medium inline-block"
              >
                Acceder al Panel
              </Link>
              <Link 
                href="#products"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-50 text-lg font-medium inline-block border border-blue-600"
              >
                Ver Productos
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div id="products" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Nuestros Productos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">📅</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Wabot - Agendador Inteligente</h3>
              <p className="text-gray-600 mb-6">
                Sistema completo de gestión de citas con WhatsApp integrado, 
                recordatorios automáticos y panel de administración multi-usuario.
              </p>
              <ul className="space-y-2 mb-8">
                {['Reservas online 24/7', 'Recordatorios automáticos', 'Múltiples profesionales', 'Estadísticas en tiempo real'].map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                href="/admin/login"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block"
              >
                Solicitar Demo
              </Link>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🛒</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Registrador de Ventas</h3>
              <p className="text-gray-600 mb-6">
                Control total de inventario, ventas y reportes financieros. 
                Ideal para retail, restaurantes y todo tipo de negocios.
              </p>
              <ul className="space-y-2 mb-8">
                {['Control de inventario', 'Reportes de ventas', 'Múltiples métodos de pago', 'Backup automático'].map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                href="/admin/login"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 inline-block"
              >
                Solicitar Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">¿Listo para digitalizar tu negocio?</h2>
          <p className="text-xl text-gray-300 mb-10">
            Miles de negocios confían en Kyro para optimizar sus operaciones.
          </p>
          <div className="space-x-4">
            <Link 
              href="/admin/login"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 text-lg font-medium inline-block"
            >
              Comenzar Ahora
            </Link>
            <Link 
              href="mailto:contacto@kyro.com"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-gray-900 text-lg font-medium inline-block"
            >
              Contactar Ventas
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white">Kyro Platform</h3>
              <p className="mt-2">Software empresarial a tu medida</p>
            </div>
            <div className="text-center md:text-right">
              <p>© {new Date().getFullYear()} Kyro Platform. Todos los derechos reservados.</p>
              <p className="mt-2">
                <a href="mailto:soporte@kyro.com" className="text-blue-400 hover:text-blue-300">
                  soporte@kyro.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}