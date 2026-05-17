import data from '../../../product/sections/governance-and-voting/data.json'
import { GovernanceSettings } from './components/GovernanceSettings'

export default function GovernanceSettingsPreview() {
  return (
    <GovernanceSettings
      settings={data.governanceSettings[0]}
      onUpdateSettings={(updates) => console.log('Update settings:', updates)}
      onSelectPreset={(preset) => console.log('Select preset:', preset)}
    />
  )
}
