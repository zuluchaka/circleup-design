import { ReconciliationConsole } from './components'
import sampleData from '@/../product/sections/treasury-and-funds/data.json'
import type { ReconciliationRecord } from '@/../product/sections/treasury-and-funds/types'

export default function ReconciliationConsolePreview() {
  const handleApproveMatch = (discrepancyId: string) => {
    console.log('Approve match:', discrepancyId)
  }

  const handleFlagForReview = (discrepancyId: string, notes: string) => {
    console.log('Flag for review:', discrepancyId, notes)
  }

  const handleManualAdjust = (discrepancyId: string, adjustment: number, notes: string) => {
    console.log('Manual adjust:', discrepancyId, adjustment, notes)
  }

  const handleViewHistory = () => {
    console.log('View history')
  }

  const handleConfigureSchedule = () => {
    console.log('Configure schedule')
  }

  return (
    <ReconciliationConsole
      records={sampleData.reconciliationRecords as ReconciliationRecord[]}
      onApproveMatch={handleApproveMatch}
      onFlagForReview={handleFlagForReview}
      onManualAdjust={handleManualAdjust}
      onViewHistory={handleViewHistory}
      onConfigureSchedule={handleConfigureSchedule}
    />
  )
}
