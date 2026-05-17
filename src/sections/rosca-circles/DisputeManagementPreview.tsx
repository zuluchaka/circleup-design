import { DisputeManagement } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type { Dispute, DisputeType } from '@/../product/sections/rosca-circles/types'

export default function DisputeManagementPreview() {
  const handleFileDispute = (againstId: string, type: DisputeType, subject: string, description: string) => {
    console.log('File dispute:', { againstId, type, subject, description })
  }

  const handleAddEvidence = (disputeId: string, file: File) => {
    console.log('Add evidence:', { disputeId, fileName: file.name })
  }

  const handleAcknowledge = (disputeId: string, note: string) => {
    console.log('Acknowledge dispute:', { disputeId, note })
  }

  const handleEscalate = (disputeId: string, note: string) => {
    console.log('Escalate dispute:', { disputeId, note })
  }

  const handleResolve = (disputeId: string, resolution: string) => {
    console.log('Resolve dispute:', { disputeId, resolution })
  }

  return (
    <DisputeManagement
      disputes={sampleData.disputes as Dispute[]}
      currentUserId="user-1"
      isOrganizer={true}
      onFileDispute={handleFileDispute}
      onAddEvidence={handleAddEvidence}
      onAcknowledge={handleAcknowledge}
      onEscalate={handleEscalate}
      onResolve={handleResolve}
    />
  )
}
