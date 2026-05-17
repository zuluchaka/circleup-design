import { DonorManagement } from './components/DonorManagement'
import data from '@/../product/sections/projects-and-fundraising/data.json'

export default function DonorManagementPreview() {
  return (
    <DonorManagement
      donors={data.donors as any}
      stats={data.donorStats as any}
      onDonorClick={(id) => console.log('Donor:', id)}
      onExport={() => console.log('Export')}
      onSendThankYou={(id) => console.log('Thank:', id)}
    />
  )
}
