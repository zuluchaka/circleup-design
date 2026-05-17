import { CreditScoreDashboard } from './components'
import data from '@/../product/sections/credit-and-lending/data.json'

export default function CreditScoreDashboardPreview() {
  return (
    <CreditScoreDashboard
      creditScore={data.creditScore}
      simulatorScenarios={data.simulatorScenarios}
      creditTips={data.creditTips}
      onRunSimulation={(scenarioId) => console.log('Run simulation:', scenarioId)}
      onTipAction={(tip) => console.log('Tip action:', tip)}
    />
  )
}
