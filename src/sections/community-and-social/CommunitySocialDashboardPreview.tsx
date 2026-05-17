import data from '@/../product/sections/community-and-social/data.json'
import { CommunitySocialDashboard } from './components/CommunitySocialDashboard'

export default function CommunitySocialDashboardPreview() {
  return (
    <CommunitySocialDashboard
      // Referrals
      referralStats={data.referralStats as any}
      // Badges
      userBadges={data.userBadges as any}
      badgeProgress={data.badgeProgress as any}
      // Leaderboards
      leaderboardEntries={data.leaderboardEntries as any}
      currentUserId="user-001"
      // Challenges
      savingsChallenges={data.savingsChallenges as any}
      challengeEnrollments={data.challengeEnrollments as any}
      // Milestones
      milestones={data.milestones as any}
      // Mentorship
      mentorMatches={data.mentorMatches as any}
      // Accountability
      accountabilityPartners={data.accountabilityPartners as any}
      // Impact
      communityImpact={data.communityImpact as any}
      socialProofNotifications={data.socialProofNotifications as any}
      // Stories
      successStories={data.successStories as any}
      // Events
      communityEvents={data.communityEvents as any}
      eventRsvps={data.eventRsvps as any}
      // Callbacks
      onShareReferralLink={(channel) => console.log('Share referral link via:', channel)}
      onCopyReferralLink={() => console.log('Copy referral link')}
      onViewBadges={() => console.log('View badges')}
      onViewLeaderboard={() => console.log('View leaderboard')}
      onViewChallenges={() => console.log('View challenges')}
      onEnrollChallenge={(id) => console.log('Enroll in challenge:', id)}
      onViewStories={() => console.log('View stories')}
      onViewEvents={() => console.log('View events')}
      onRsvpEvent={(id) => console.log('RSVP event:', id)}
      onViewMentorship={() => console.log('View mentorship')}
      onViewPartners={() => console.log('View partners')}
      onDismissNotification={(id) => console.log('Dismiss notification:', id)}
    />
  )
}
