import data from '@/../product/sections/projects-and-fundraising/data.json'
import { DonationFlow } from './components/DonationFlow'

export default function DonationFlowView() {
  const campaign = data.campaigns[0]

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
      <DonationFlow
        campaign={campaign}
        suggestedAmounts={campaign.suggestedAmounts}
        onSubmit={(donation) => console.log('Submit donation:', donation)}
        onCancel={() => console.log('Cancel donation')}
      />
    </div>
  )
}
