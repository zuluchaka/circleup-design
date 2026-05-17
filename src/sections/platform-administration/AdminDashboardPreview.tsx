import data from '@/../product/sections/platform-administration/data.json'
import { AdminDashboard } from './components/AdminDashboard'
import type { SystemMetrics, ServiceHealth, ComplianceAlert, SupportTicket } from '@/../product/sections/platform-administration/types'

export default function AdminDashboardPreview() {
  const metrics = data.systemMetrics as SystemMetrics
  const services = data.services as ServiceHealth[]
  const recentAlerts = data.complianceAlerts as ComplianceAlert[]
  const recentTickets = data.supportTickets as SupportTicket[]

  return (
    <AdminDashboard
      metrics={metrics}
      recentAlerts={recentAlerts}
      recentTickets={recentTickets}
      services={services}
      onAlertClick={(id) => console.log('View alert:', id)}
      onTicketClick={(id) => console.log('View ticket:', id)}
    />
  )
}
