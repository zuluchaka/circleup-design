import data from '@/../product/sections/platform-administration/data.json'
import type {
  RBACauditEntry,
  PeriodicReview,
  SoDRule,
} from '@/../product/sections/platform-administration/types'
import { RBACAuditTrail } from './components/RBACAuditTrail'

export default function RBACAuditTrailPreview() {
  return (
    <RBACAuditTrail
      entries={data.rbacAuditEntries as unknown as RBACauditEntry[]}
      reviews={data.periodicReviews as unknown as PeriodicReview[]}
      sodRules={data.sodRules as unknown as SoDRule[]}
      onExport={(format) => console.log('Export:', format)}
      onStartReview={() => console.log('Start review')}
      onViewReview={(id) => console.log('View review:', id)}
    />
  )
}
