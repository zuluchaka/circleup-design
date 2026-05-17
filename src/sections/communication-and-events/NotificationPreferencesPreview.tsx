import { NotificationPreferences } from './components'
import data from '@/../product/sections/communication-and-events/data.json'

export default function NotificationPreferencesPreview() {
  return (
    <NotificationPreferences
      preferences={data.notificationPreferences as any}
      onUpdate={() => {}}
      onSaveAll={() => {}}
    />
  )
}
