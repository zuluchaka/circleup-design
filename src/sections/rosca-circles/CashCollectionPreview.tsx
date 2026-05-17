import { CashCollection } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type { Circle, Participant, CashCollectionRecord } from '@/../product/sections/rosca-circles/types'

export default function CashCollectionPreview() {
  const circle = sampleData.circles[0] as Circle

  const handleRecordCollection = (participantId: string, amount: number, location: string, notes?: string) => {
    console.log('Record collection:', { participantId, amount, location, notes })
  }

  const handleReconcile = (recordId: string) => {
    console.log('Reconcile record:', recordId)
  }

  const handlePrintReceipt = (recordId: string) => {
    console.log('Print receipt:', recordId)
  }

  return (
    <CashCollection
      circle={circle}
      participants={sampleData.participants as Participant[]}
      currentCycle={circle.currentCycle}
      records={sampleData.cashCollectionRecords as CashCollectionRecord[]}
      onRecordCollection={handleRecordCollection}
      onReconcile={handleReconcile}
      onPrintReceipt={handlePrintReceipt}
    />
  )
}
