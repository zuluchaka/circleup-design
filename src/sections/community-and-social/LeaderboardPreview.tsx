import data from '@/../product/sections/community-and-social/data.json'
import { Leaderboard } from './components/Leaderboard'

export default function LeaderboardPreview() {
  return (
    <Leaderboard
      entries={data.leaderboardEntries as any}
      settings={data.leaderboardSettings as any}
      currentUserId="user-001"
      onUpdateSettings={(settings) => console.log('Update settings:', settings)}
      onFilterCategory={(category) => console.log('Filter category:', category)}
      onFilterScope={(scope, scopeId) => console.log('Filter scope:', scope, scopeId)}
      onFilterPeriod={(period) => console.log('Filter period:', period)}
    />
  )
}
