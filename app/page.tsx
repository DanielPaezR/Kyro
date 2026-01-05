export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        🚀 Kyro Platform - Funcionando
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Base de datos y estructura configurada correctamente
      </p>
      <div className="space-y-3">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
          ✅ Prisma 5.10.2 instalado
        </div>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
          ✅ Next.js 14.0.4 funcionando
        </div>
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded">
          ⏳ Base de datos pendiente de conectar
        </div>
      </div>
    </div>
  )
}