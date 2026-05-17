import data from '@/../product/sections/platform-administration/data.json'
import type {
  UserPermissionSummary,
  FeatureDefinition,
  PermissionSimulation,
  AccessMode,
} from '@/../product/sections/platform-administration/types'
import { PermissionSimulator } from './components/PermissionSimulator'

// Create a sample completed simulation for preview
const sampleSimulation: PermissionSimulation = {
  id: 'sim-001',
  userId: 'user-5847',
  userName: 'Elena Rossi',
  proposedChanges: [
    {
      featureId: 'feat-assoc-analytics',
      featureName: 'Analytics & Reporting',
      currentMode: 'none',
      proposedMode: 'read',
    },
    {
      featureId: 'feat-assoc-treasury',
      featureName: 'Treasury & Funds',
      currentMode: 'read_write',
      proposedMode: 'read',
    },
  ],
  effectiveBefore: {
    'association.members': 'read',
    'association.circles': 'read',
    'association.treasury': 'read_write',
    'association.analytics': 'none',
  },
  effectiveAfter: {
    'association.members': 'read',
    'association.circles': 'read',
    'association.treasury': 'read',
    'association.analytics': 'read',
  },
  gainedFeatures: ['Analytics & Reporting (Read)'],
  lostFeatures: ['Treasury & Funds (Write)'],
  conflicts: [],
  createdAt: '2026-01-13T10:00:00Z',
  createdBy: 'admin-001',
}

export default function PermissionSimulatorPreview() {
  return (
    <PermissionSimulator
      users={data.userPermissionSummaries as unknown as UserPermissionSummary[]}
      features={(data.featureRegistry as unknown as FeatureDefinition[]).filter(
        (f) => !f.parentId
      )}
      simulation={sampleSimulation}
      onSelectUser={(id) => console.log('Select user:', id)}
      onAddChange={(featureId, mode) => console.log('Add change:', featureId, mode)}
      onRunSimulation={() => console.log('Run simulation')}
      onApplySimulation={() => console.log('Apply simulation')}
      onClear={() => console.log('Clear simulation')}
    />
  )
}
