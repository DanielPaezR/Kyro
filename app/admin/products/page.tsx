// app/admin/products/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      subscriptions: {
        include: {
          client: {
            select: {
              businessName: true,
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          + Nuevo Producto
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{product.slug}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              
              <p className="text-gray-700 mb-4">
                {product.description || "Sin descripción"}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${product.basePriceMonthly.toFixed(2)}
                  </p>
                  <p className="text-gray-500 text-sm">/mes</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-blue-600">
                    {product.subscriptions.length}
                  </p>
                  <p className="text-gray-500 text-sm">suscripciones</p>
                </div>
              </div>

              {product.features && typeof product.features === 'string' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-gray-700 mb-2">Características:</h4>
                  <ul className="text-sm text-gray-600">
                    {product.features.split('\n').map((feature, idx) => (
                      <li key={idx} className="flex items-start mb-1">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 flex justify-between">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Editar
                </Link>
                <span className="text-gray-500 text-sm">
                  Creado: {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}