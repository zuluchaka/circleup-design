import { PresidentDashboardWidgets } from './components/PresidentDashboardWidgets'
import data from '@/../product/sections/associations/data.json'
import type { JoinRequest } from '@/../product/sections/associations/types'

const dataset = data as unknown as { joinRequests?: JoinRequest[] }
const pendingJoinRequests = (dataset.joinRequests ?? []).filter(r => r.status === 'pending')

export default function PresidentDashboardWidgetsPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <PresidentDashboardWidgets
        associationId="assoc-001"
        onNavigate={(view: string) => console.log('Navigate:', view)}
        onSendMessage={() => console.log('Send message')}
        pendingJoinRequests={pendingJoinRequests}
        pendingTransactionApprovalsCount={2}
        pendingDuesDisputesCount={1}
        onApproveJoinRequest={(id) => console.log('Approve join request:', id)}
        onRejectJoinRequest={(id, reason) => console.log('Reject join request:', id, 'reason:', reason)}
      />
    </div>
  )
}
