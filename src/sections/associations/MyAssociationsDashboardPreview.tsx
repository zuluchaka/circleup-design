import { MyAssociationsDashboard } from './components/MyAssociationsDashboard'
import data from '@/../product/sections/associations/data.json'
import type { Association, ReceivedInvitation, SentJoinRequest } from '@/../product/sections/associations/types'

const dataset = data as unknown as {
  associations: Association[]
  receivedInvitations?: ReceivedInvitation[]
  sentJoinRequests?: SentJoinRequest[]
}

export default function MyAssociationsDashboardPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MyAssociationsDashboard
        associations={dataset.associations}
        receivedInvitations={dataset.receivedInvitations ?? []}
        sentJoinRequests={dataset.sentJoinRequests ?? []}
        canCreate={true}
        onViewAssociation={(id: string) => console.log('View:', id)}
        onCreateAssociation={() => console.log('Create')}
        onDiscoverAssociations={() => console.log('Discover')}
        onAcceptInvitation={(id) => console.log('Accept invitation:', id)}
        onDeclineInvitation={(id) => console.log('Decline invitation:', id)}
        onCancelJoinRequest={(id) => console.log('Cancel join request:', id)}
      />
    </div>
  )
}
