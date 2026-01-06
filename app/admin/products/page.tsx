import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      _count: {
        select: { subscriptions: true }
      }
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Productos</h1>
        <Link 
          href="/admin/products/new"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          + Nuevo Producto
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{product.description}</p>
            
            <div className="mb-4">
              <div className="text-2xl font-bold text-blue-600">
                ${product.basePriceMonthly.toLocaleString('es-CO')}
                <span className="text-sm text-gray-500 font-normal"> /mes</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{product._count.subscriptions} suscripciones</span>
              <span>Slug: {product.slug}</span>
            </div>

            <div className="mt-6 flex space-x-3">
              <Link 
                href={`/admin/products/${product.id}/edit`}
                className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 text-center py-2 rounded"
              >
                Editar
              </Link>
              <Link 
                href={`/admin/subscriptions/new?product=${product.id}`}
                className="flex-1 bg-green-600 text-white hover:bg-green-700 text-center py-2 rounded"
              >
                Vender
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}