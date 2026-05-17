import data from '@/../product/sections/associations/data.json'
import { PolicyManager } from './components/PolicyManager'
import type { FederationPolicy } from '@/../product/sections/associations/types'

export default function PolicyManagerPreview() {
  const policies = data.federationPolicies as FederationPolicy[]

  return (
    <PolicyManager
      policies={policies}
      onCreatePolicy={() => console.log('Create policy')}
      onEditPolicy={(id) => console.log('Edit policy:', id)}
      onViewAcknowledgments={(id) => console.log('View acknowledgments for policy:', id)}
      onArchivePolicy={(id) => console.log('Archive policy:', id)}
      onDeletePolicy={(id) => console.log('Delete policy:', id)}
      onExportPolicy={(id) => console.log('Export policy:', id)}
      onBack={() => console.log('Go back')}
    />
  )
}
