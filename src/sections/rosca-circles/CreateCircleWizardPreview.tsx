import { CreateCircleWizard } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type { AIConfigSuggestions, Circle, CircleFrequency } from '@/../product/sections/rosca-circles/types'

export default function CreateCircleWizardPreview() {
  const handleSubmit = (circle: Partial<Circle>) => {
    console.log('Create circle:', circle)
  }

  const handleCancel = () => {
    console.log('Cancel create circle')
  }

  const handleGetSuggestions = (params: { amount: number; frequency: CircleFrequency; duration: number }) => {
    console.log('Get AI suggestions:', params)
  }

  return (
    <CreateCircleWizard
      aiSuggestions={sampleData.aiConfigSuggestions as AIConfigSuggestions}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      onGetSuggestions={handleGetSuggestions}
    />
  )
}
