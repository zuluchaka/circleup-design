import { MyAssociationsDashboard } from './components/MyAssociationsDashboard'

export default function MyAssociationsDashboardEmptyPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MyAssociationsDashboard
        associations={[]}
        receivedInvitations={[]}
        sentJoinRequests={[]}
        canCreate={true}
        onViewAssociation={(id: string) => console.log('View:', id)}
        onCreateAssociation={() => console.log('Create')}
        onDiscoverAssociations={() => console.log('Discover')}
      />
    </div>
  )
}
