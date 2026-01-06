import ClientForm from '@/components/client-form'

export default function NewClientPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Nuevo Cliente</h1>
        <p className="text-gray-600 mt-2">Registra un nuevo cliente en el sistema</p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <ClientForm />
      </div>
    </div>
  )
}