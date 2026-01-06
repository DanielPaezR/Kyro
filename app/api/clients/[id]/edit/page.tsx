import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ClientForm from '@/components/client-form'

export const dynamic = 'force-dynamic'

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const client = await prisma.client.findUnique({
    where: { id: params.id }
  })

  if (!client) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Editar Cliente</h1>
        <p className="text-gray-600 mt-2">Actualiza la información de {client.businessName}</p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <ClientForm initialData={client} />
      </div>
    </div>
  )
}