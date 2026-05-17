import { CircleSettings } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type { Circle } from '@/../product/sections/rosca-circles/types'

export default function CircleSettingsPreview() {
  const circle = sampleData.circles[0] as Circle

  return (
    <CircleSettings
      circle={circle}
      isOrganizer={true}
      onBack={() => console.log('Back')}
      onPauseCircle={() => console.log('Pause')}
      onResumeCircle={() => console.log('Resume')}
      onExtendCircle={(cycles) => console.log('Extend by', cycles)}
    />
  )
}
