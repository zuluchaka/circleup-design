import data from '@/../product/sections/associations/data.json'
import { AssociationDashboard } from './components/AssociationDashboard'

export default function AssociationDashboardPreview() {
  // Use the first association (Igbo Cultural Association) for the preview
  const association = data.associations[0]
  const recentMembers = data.members.slice(0, 5)

  return (
    <AssociationDashboard
      association={association}
      announcements={data.announcements}
      activityItems={data.activityItems}
      recentMembers={recentMembers}
      onManageMembers={() => console.log('Manage members')}
      onManageSettings={() => console.log('Manage settings')}
      onInviteMembers={() => console.log('Invite members')}
      onCreateAnnouncement={() => console.log('Create announcement')}
      onEditAnnouncement={(id) => console.log('Edit announcement:', id)}
      onDeleteAnnouncement={(id) => console.log('Delete announcement:', id)}
      onViewAllActivity={() => console.log('View all activity')}
      onViewCircles={() => console.log('View circles')}
      onViewFunds={() => console.log('View funds')}
      onBack={() => console.log('Go back')}
    />
  )
}
