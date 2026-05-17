import data from '@/../product/sections/associations/data.json'
import { AssociationAdministration } from './components/AssociationAdministration'
import type { AssociationAdministrationAlert, FederationMembership } from '@/../product/sections/associations/types'

export default function AssociationAdministrationPreview() {
  // Use the first association (Igbo Cultural Association) for the preview - user has president role
  const association = data.associations[0]

  // Cast alerts to the correct type
  const alerts = data.administrationAlerts as AssociationAdministrationAlert[]

  // Cast federation membership to the correct type (can be null)
  const federationMembership = data.currentAssociationFederationMembership as FederationMembership | null

  return (
    <AssociationAdministration
      association={association}
      members={data.members}
      pendingInvitations={data.pendingInvitations}
      joinRequests={data.joinRequests}
      alerts={alerts}
      federationMembership={federationMembership}
      onManageMembers={() => console.log('Navigate to member directory')}
      onManageSettings={() => console.log('Navigate to settings')}
      onManageBranding={() => console.log('Navigate to branding')}
      onViewInvitations={() => console.log('Navigate to invitations')}
      onViewJoinRequests={() => console.log('Navigate to join requests')}
      onViewAnalytics={() => console.log('Navigate to analytics')}
      onManageCommunication={() => console.log('Navigate to communication')}
      onViewFederation={() => console.log('Navigate to federation dashboard')}
      onInviteMembers={() => console.log('Navigate to invite members')}
      onAlertAction={(alertId, actionId) => console.log('Alert action:', alertId, actionId)}
      onDismissAlert={(alertId) => console.log('Dismiss alert:', alertId)}
      onCreateAnnouncement={() => console.log('Create announcement')}
      onExportData={() => console.log('Export data')}
      onViewAuditLog={() => console.log('View audit log')}
      onBack={() => console.log('Go back')}
    />
  )
}
