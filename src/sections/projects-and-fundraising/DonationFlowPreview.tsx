import { DonationFlow } from './components/DonationFlow'
import data from '@/../product/sections/projects-and-fundraising/data.json'

export default function DonationFlowPreview() {
  const campaign = data.campaigns[0] as any
  return (
    <DonationFlow
      campaign={campaign}
      suggestedAmounts={[10, 25, 50, 100, 250]}
      onSubmit={(d) => console.log('Donate:', d)}
      onCancel={() => console.log('Cancel')}
    />
  )
}
