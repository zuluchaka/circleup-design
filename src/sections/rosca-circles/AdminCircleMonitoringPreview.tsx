import { AdminCircleMonitoring } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type { Circle } from '@/../product/sections/rosca-circles/types'

interface MonitoringRow {
  circle: Circle
  healthScore: number
  openDisputes: number
  flagsCount: number
  lastActivity: string
}

export default function AdminCircleMonitoringPreview() {
  const circles = sampleData.adminMonitoring as unknown as MonitoringRow[]

  return (
    <AdminCircleMonitoring
      circles={circles}
      onViewCircle={(id) => console.log('View circle:', id)}
      onFreezeAccount={(id, reason) => console.log('Freeze:', id, reason)}
      onFlagCircle={(id, reason) => console.log('Flag:', id, reason)}
    />
  )
}
