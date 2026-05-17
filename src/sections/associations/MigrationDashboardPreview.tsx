import data from '@/../product/sections/associations/data.json'
import { MigrationDashboard } from './components'
import type {
  MigrationSession,
  ImportedAssociation,
  ColumnMapping,
  ImportedMember,
  ImportedCircle,
  PaymentMatrixEntry,
  ImportedContribution,
  ImportedPayout,
  ValidationReport,
  MemberVerification,
  AuditEntry,
  InvitationFunnel,
  GoLiveConfig,
  RoleMapping,
} from '@/../product/sections/associations/types'

const migration = (data as Record<string, unknown>).migration as Record<string, unknown>

export default function MigrationDashboardPreview() {
  return (
    <MigrationDashboard
      session={migration.migrationSession as MigrationSession}
      association={migration.importedAssociation as ImportedAssociation}
      columnMappings={migration.columnMappings as ColumnMapping[]}
      members={migration.importedMembers as ImportedMember[]}
      circles={migration.importedCircles as ImportedCircle[]}
      paymentMatrix={migration.paymentMatrix as PaymentMatrixEntry[]}
      contributions={migration.importedContributions as ImportedContribution[]}
      payouts={migration.importedPayouts as ImportedPayout[]}
      validationReport={migration.validationReport as unknown as ValidationReport}
      verifications={migration.memberVerifications as MemberVerification[]}
      auditTrail={migration.auditTrail as AuditEntry[]}
      invitationFunnel={migration.invitationFunnel as InvitationFunnel}
      goLiveConfig={migration.goLiveConfig as GoLiveConfig}
      roleMapping={migration.roleMapping as RoleMapping[]}
      onNavigatePhase={(phase) => console.log('Navigate to phase:', phase)}
      onResendInvitation={(id, channel) => console.log('Resend invitation:', id, channel)}
      onEditMember={(id, field, value) => console.log('Edit member:', id, field, value)}
      onGenerateCode={(id) => console.log('Generate code:', id)}
      onConfirmCircleState={(id) => console.log('Confirm circle state:', id)}
      onImportAnotherCircle={() => console.log('Import another circle')}
      onFinalizeAllCircles={() => console.log('Finalize all circles')}
      onRunValidation={() => console.log('Run validation')}
      onAcknowledgeWarning={(id, reason) => console.log('Acknowledge warning:', id, reason)}
      onResolveDispute={(id, accepted, resolution) => console.log('Resolve dispute:', id, accepted, resolution)}
      onGoLive={() => console.log('Go live!')}
      onScheduleGoLive={(date) => console.log('Schedule go-live:', date)}
      onEmergencyPause={() => console.log('Emergency pause')}
      onExportReport={(format) => console.log('Export report:', format)}
    />
  )
}
