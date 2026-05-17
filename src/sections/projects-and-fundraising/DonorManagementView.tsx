import data from '@/../product/sections/projects-and-fundraising/data.json'
import { DonorManagement } from './components/DonorManagement'

export default function DonorManagementView() {
  return (
    <DonorManagement
      donors={data.donors}
      stats={data.donorStats}
      onDonorClick={(id) => console.log('View donor:', id)}
      onExport={() => console.log('Export donors')}
      onSendThankYou={(ids) => console.log('Send thank you to:', ids)}
    />
  )
}
