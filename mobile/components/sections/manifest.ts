// Maps `<section-slug>/<screen-slug>` → React component.
// If a key is missing, the dynamic route renders `_stub.tsx` instead, which
// links to the section's planning docs.

import type { ComponentType } from "react";

import { HomepageWelcome } from "./screens/HomepageWelcome";
import { AssociationsDashboard } from "./screens/AssociationsDashboard";
import { MembersDirectory } from "./screens/MembersDirectory";
import { RoscaMyCircles } from "./screens/RoscaMyCircles";
import { RoscaCircleDetail } from "./screens/RoscaCircleDetail";
import { RoscaContribute } from "./screens/RoscaContribute";
import { RoscaPayouts } from "./screens/RoscaPayouts";
import { RoscaTreasurer } from "./screens/RoscaTreasurer";
import { RoscaCirclePublic } from "./screens/RoscaCirclePublic";
import { RoscaJoinRequest } from "./screens/RoscaJoinRequest";
import { RoscaWaitlist } from "./screens/RoscaWaitlist";
import { RoscaInvitations } from "./screens/RoscaInvitations";
import { RoscaCreate } from "./screens/RoscaCreate";
import { RoscaRenewal } from "./screens/RoscaRenewal";
import { RoscaCycleProgress } from "./screens/RoscaCycleProgress";
import { RoscaCashCollection } from "./screens/RoscaCashCollection";
import { RoscaExceptionAction } from "./screens/RoscaExceptionAction";
import { RoscaPayForMember } from "./screens/RoscaPayForMember";
import { RoscaPositionSwap } from "./screens/RoscaPositionSwap";
import { RoscaBidding } from "./screens/RoscaBidding";
import { RoscaPayoutAdvance } from "./screens/RoscaPayoutAdvance";
import { RoscaAutoPay } from "./screens/RoscaAutoPay";
import { RoscaAnalytics } from "./screens/RoscaAnalytics";
import { RoscaRiskScores } from "./screens/RoscaRiskScores";
import { RoscaDisputes } from "./screens/RoscaDisputes";
import { RoscaDisputeDetail } from "./screens/RoscaDisputeDetail";
import { RoscaEmergencyFund } from "./screens/RoscaEmergencyFund";
import { RoscaSettings } from "./screens/RoscaSettings";
import { RoscaManagement } from "./screens/RoscaManagement";
import { RoscaInvite } from "./screens/RoscaInvite";
import { RoscaParticipants } from "./screens/RoscaParticipants";
import { RoscaMultiShare } from "./screens/RoscaMultiShare";
import { RoscaDocuments } from "./screens/RoscaDocuments";
import { RoscaCircleAccount } from "./screens/RoscaCircleAccount";
import { RoscaAdminMonitoring } from "./screens/RoscaAdminMonitoring";
import { DiscoverHub } from "./screens/DiscoverHub";
import { TreasuryOverview } from "./screens/TreasuryOverview";
import { GovernanceProposals } from "./screens/GovernanceProposals";
import { CommsInbox } from "./screens/CommsInbox";
import { AnalyticsPersonal } from "./screens/AnalyticsPersonal";
import { CreditScore } from "./screens/CreditScore";
import { InsightsFeed } from "./screens/InsightsFeed";
import { CampaignsList } from "./screens/CampaignsList";
import { LoginSignIn } from "./screens/LoginSignIn";
import { DocumentsLibrary } from "./screens/DocumentsLibrary";
import { FederationsOverview } from "./screens/FederationsOverview";

export const screenManifest: Record<string, ComponentType> = {
  "homepage/welcome": HomepageWelcome,
  "associations/dashboard": AssociationsDashboard,
  "members-and-trust/directory": MembersDirectory,
  "rosca-circles/my-circles": RoscaMyCircles,
  "rosca-circles/circle-detail": RoscaCircleDetail,
  "rosca-circles/contribute": RoscaContribute,
  "rosca-circles/payouts": RoscaPayouts,
  "rosca-circles/treasurer": RoscaTreasurer,
  "rosca-circles/circle-public": RoscaCirclePublic,
  "rosca-circles/join-request": RoscaJoinRequest,
  "rosca-circles/waitlist": RoscaWaitlist,
  "rosca-circles/invitations": RoscaInvitations,
  "rosca-circles/create": RoscaCreate,
  "rosca-circles/renewal": RoscaRenewal,
  "rosca-circles/cycle-progress": RoscaCycleProgress,
  "rosca-circles/cash-collection": RoscaCashCollection,
  "rosca-circles/exception-action": RoscaExceptionAction,
  "rosca-circles/pay-for-member": RoscaPayForMember,
  "rosca-circles/position-swap": RoscaPositionSwap,
  "rosca-circles/bidding": RoscaBidding,
  "rosca-circles/payout-advance": RoscaPayoutAdvance,
  "rosca-circles/auto-pay": RoscaAutoPay,
  "rosca-circles/analytics": RoscaAnalytics,
  "rosca-circles/risk-scores": RoscaRiskScores,
  "rosca-circles/disputes": RoscaDisputes,
  "rosca-circles/dispute-detail": RoscaDisputeDetail,
  "rosca-circles/emergency-fund": RoscaEmergencyFund,
  "rosca-circles/settings": RoscaSettings,
  "rosca-circles/management": RoscaManagement,
  "rosca-circles/invite": RoscaInvite,
  "rosca-circles/participants": RoscaParticipants,
  "rosca-circles/multi-share": RoscaMultiShare,
  "rosca-circles/documents": RoscaDocuments,
  "rosca-circles/circle-account": RoscaCircleAccount,
  "rosca-circles/admin-monitoring": RoscaAdminMonitoring,
  "rosca-circles/discover": DiscoverHub,
  "treasury-and-funds/overview": TreasuryOverview,
  "governance-and-voting/proposals": GovernanceProposals,
  "communication-and-events/inbox": CommsInbox,
  "documents/library": DocumentsLibrary,
  "analytics-and-reporting/personal": AnalyticsPersonal,
  "credit-and-lending/score": CreditScore,
  "ai-insights/feed": InsightsFeed,
  "projects-and-fundraising/campaigns": CampaignsList,
  "login/signin": LoginSignIn,
  "federations/overview": FederationsOverview,
};
