import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
  change?: string
}

export default function StatsCards({ stats }: { stats: StatCardProps[] }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`border rounded-lg p-6 ${colorClasses[stat.color || 'blue']}`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">{stat.title}</h3>
            {stat.icon && <div>{stat.icon}</div>}
          </div>
          <p className="text-3xl font-bold">{stat.value}</p>
          {stat.change && (
            <p className="text-sm mt-2">{stat.change}</p>
          )}
        </div>
      ))}
    </div>
  )
}