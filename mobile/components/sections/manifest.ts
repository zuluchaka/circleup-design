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
