import data from '@/../product/sections/associations/data.json'
import { AssociationAnalytics } from './components/AssociationAnalytics'
import type { Association, AssociationAnalytics as Analytics } from '@/../product/sections/associations/types'

export default function AssociationAnalyticsPreview() {
  // Use the first association (Igbo Cultural Association)
  const association = data.associations[0] as Association
  const analytics = data.associationAnalytics as Analytics

  return (
    <AssociationAnalytics
      association={association}
      analytics={analytics}
      onExportReport={() => console.log('Export analytics report')}
      onViewMember={(id) => console.log('View member:', id)}
      onBack={() => console.log('Go back')}
    />
  )
}
