export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">
                🚀 Kyro Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/api/auth/signout"
                className="text-sm text-red-600 hover:text-red-800"
              >
                Cerrar sesión
              </a>
            </div>
          </div>
        </div>
      </nav>
      <div className="py-6">
        {children}
      </div>
    </div>
  )
}