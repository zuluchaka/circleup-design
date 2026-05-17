import data from '@/../product/sections/platform-administration/data.json'
import type {
  AccessRequest,
  FeatureDefinition,
} from '@/../product/sections/platform-administration/types'
import { AccessRequests } from './components/AccessRequests'

export default function AccessRequestsPreview() {
  return (
    <AccessRequests
      requests={data.accessRequests as unknown as AccessRequest[]}
      features={data.featureRegistry as unknown as FeatureDefinition[]}
      onApprove={(id, comment, isTemp, expires) =>
        console.log('Approve:', id, comment, isTemp, expires)
      }
      onDeny={(id, comment) => console.log('Deny:', id, comment)}
      onCreateRequest={() => console.log('Create request')}
    />
  )
}
