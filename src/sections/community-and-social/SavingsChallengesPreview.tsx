import data from '@/../product/sections/community-and-social/data.json'
import { SavingsChallenges } from './components/SavingsChallenges'

export default function SavingsChallengesPreview() {
  return (
    <SavingsChallenges
      challenges={data.savingsChallenges as any}
      enrollments={data.challengeEnrollments as any}
      onEnroll={(id) => console.log('Enroll in challenge:', id)}
      onViewChallenge={(id) => console.log('View challenge:', id)}
      onViewLeaderboard={(id) => console.log('View leaderboard:', id)}
    />
  )
}
