import { InvestmentManager } from './components'
import sampleData from '@/../product/sections/treasury-and-funds/data.json'
import type { Investment, InvestmentInstrument, AllocationChange } from '@/../product/sections/treasury-and-funds/types'

export default function InvestmentManagerPreview() {
  const handleAllocate = (instrumentId: string, amount: number) => {
    console.log('Allocate:', instrumentId, amount)
  }

  const handleWithdraw = (investmentId: string, amount: number) => {
    console.log('Withdraw:', investmentId, amount)
  }

  const handleAdjustAllocation = (allocations: AllocationChange[]) => {
    console.log('Adjust allocation:', allocations)
  }

  return (
    <InvestmentManager
      investments={sampleData.investments as Investment[]}
      instruments={sampleData.investmentInstruments as InvestmentInstrument[]}
      availableBalance={sampleData.dashboardSummary.totalAvailableBalance}
      onAllocate={handleAllocate}
      onWithdraw={handleWithdraw}
      onAdjustAllocation={handleAdjustAllocation}
    />
  )
}
