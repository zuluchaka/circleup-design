import data from '@/../product/sections/platform-administration/data.json'
import type {
  RBACMetrics,
  RBACauditEntry,
  PermissionAnomaly,
  AccessRequest,
  PeriodicReview,
} from '@/../product/sections/platform-administration/types'
import { RBACDashboard } from './components/RBACDashboard'

export default function RBACDashboardPreview() {
  return (
    <RBACDashboard
      metrics={data.rbacMetrics as RBACMetrics}
      recentAuditEntries={data.rbacAuditEntries as unknown as RBACauditEntry[]}
      anomalies={data.permissionAnomalies as unknown as PermissionAnomaly[]}
      pendingRequests={data.accessRequests as unknown as AccessRequest[]}
      pendingReviews={data.periodicReviews as unknown as PeriodicReview[]}
      onViewAuditTrail={() => console.log('View audit trail')}
      onViewRequests={() => console.log('View requests')}
      onViewAnomalies={() => console.log('View anomalies')}
      onStartReview={() => console.log('Start review')}
    />
  )
}
