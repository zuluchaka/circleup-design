// The 17 sections of the CircleUp mobile app. The gallery on the index screen
// iterates over this list; the screenshot capture script also uses it to drive
// navigation to each screen route.

export type SectionMeta = {
  slug: string;
  index: number;
  title: string;
  blurb: string;
  screens: { slug: string; label: string }[];
};

export const sectionsCatalog: SectionMeta[] = [
  {
    slug: "homepage",
    index: 0,
    title: "Homepage",
    blurb: "Public landing, ROSCA education, readiness quiz, pricing, sign-up paths.",
    screens: [
      { slug: "welcome", label: "Welcome" },
      { slug: "discover", label: "Discover ROSCAs" },
      { slug: "quiz", label: "Readiness Quiz" },
      { slug: "pricing", label: "Pricing" },
    ],
  },
  {
    slug: "associations",
    index: 1,
    title: "Associations",
    blurb: "Create, brand, configure, and migrate an association.",
    screens: [
      { slug: "dashboard", label: "Association Hub" },
      { slug: "create", label: "Create Association" },
      { slug: "settings", label: "Settings" },
      { slug: "migration", label: "Migration Wizard" },
    ],
  },
  {
    slug: "members-and-trust",
    index: 2,
    title: "Members & Trust",
    blurb: "Member directory, profiles, roles, Trust Score breakdown.",
    screens: [
      { slug: "directory", label: "Member Directory" },
      { slug: "profile", label: "Member Profile" },
      { slug: "trust", label: "Trust Score Detail" },
      { slug: "invite", label: "Invite Members" },
    ],
  },
  {
    slug: "rosca-circles",
    index: 3,
    title: "ROSCA Circles",
    blurb: "My circles, contribute, payouts, emergency fund.",
    screens: [
      { slug: "discover", label: "Discover Circles" },
      { slug: "my-circles", label: "My Circles" },
      { slug: "circle-detail", label: "Circle Detail" },
      { slug: "contribute", label: "Make Contribution" },
      { slug: "payouts", label: "Payout Schedule" },
      { slug: "treasurer", label: "Treasurer Dashboard" },
    ],
  },
  {
    slug: "treasury-and-funds",
    index: 4,
    title: "Treasury & Funds",
    blurb: "Multi-fund ledger, welfare requests, application workflows.",
    screens: [
      { slug: "overview", label: "Treasury Overview" },
      { slug: "fund-detail", label: "Fund Detail" },
      { slug: "request", label: "Request Welfare Aid" },
      { slug: "approvals", label: "Approvals Queue" },
    ],
  },
  {
    slug: "governance-and-voting",
    index: 5,
    title: "Governance & Voting",
    blurb: "Proposals, voting, elections, committees.",
    screens: [
      { slug: "proposals", label: "Proposals" },
      { slug: "ballot", label: "Cast Ballot" },
      { slug: "elections", label: "Elections" },
      { slug: "committees", label: "Committees" },
    ],
  },
  {
    slug: "communication-and-events",
    index: 6,
    title: "Communication & Events",
    blurb: "Inbox, threads, events, RSVPs, QR check-in.",
    screens: [
      { slug: "inbox", label: "Inbox" },
      { slug: "thread", label: "Thread" },
      { slug: "events", label: "Events" },
      { slug: "event-detail", label: "Event Detail" },
      { slug: "qr", label: "QR Check-in" },
    ],
  },
  {
    slug: "documents",
    index: 7,
    title: "Documents",
    blurb: "Library, viewer, version history, share permissions.",
    screens: [
      { slug: "library", label: "Document Library" },
      { slug: "viewer", label: "Document Viewer" },
      { slug: "share", label: "Share Document" },
    ],
  },
  {
    slug: "analytics-and-reporting",
    index: 8,
    title: "Analytics & Reporting",
    blurb: "Personal dashboard, circle health, statements.",
    screens: [
      { slug: "personal", label: "Personal Dashboard" },
      { slug: "circle-health", label: "Circle Health" },
      { slug: "statements", label: "Statements" },
    ],
  },
  {
    slug: "credit-and-lending",
    index: 9,
    title: "Credit & Lending",
    blurb: "Credit score, payout advance, personal loan, bureau reporting.",
    screens: [
      { slug: "score", label: "CircleUp Credit" },
      { slug: "advance", label: "Payout Advance" },
      { slug: "loan", label: "Personal Loan" },
      { slug: "bureau", label: "Bureau Reporting" },
    ],
  },
  {
    slug: "ai-insights",
    index: 10,
    title: "AI Insights",
    blurb: "Recommendations, risk, fraud detection, finance assistant.",
    screens: [
      { slug: "feed", label: "Insights Feed" },
      { slug: "assistant", label: "AI Assistant" },
      { slug: "risk", label: "Risk & Fraud" },
    ],
  },
  {
    slug: "community-and-social",
    index: 11,
    title: "Community & Social",
    blurb: "Referrals, badges, leaderboards, challenges.",
    screens: [
      { slug: "feed", label: "Community Feed" },
      { slug: "badges", label: "Badges & Achievements" },
      { slug: "leaderboard", label: "Leaderboards" },
      { slug: "referrals", label: "Referrals" },
    ],
  },
  {
    slug: "multi-share",
    index: 12,
    title: "Multi-Share",
    blurb: "Hold multiple ROSCA shares; eligibility and requests.",
    screens: [
      { slug: "my-shares", label: "My Shares" },
      { slug: "request", label: "Request More Shares" },
      { slug: "monitor", label: "Platform Monitor" },
    ],
  },
  {
    slug: "projects-and-fundraising",
    index: 13,
    title: "Projects & Fundraising",
    blurb: "Campaigns, donations, impact reporting.",
    screens: [
      { slug: "campaigns", label: "Campaigns" },
      { slug: "campaign-detail", label: "Campaign Detail" },
      { slug: "donate", label: "Donate" },
      { slug: "impact", label: "Impact Report" },
    ],
  },
  {
    slug: "platform-administration",
    index: 14,
    title: "Platform Administration",
    blurb: "Operator console: KYC, FINMA, support, disputes.",
    screens: [
      { slug: "console", label: "Operator Console" },
      { slug: "kyc", label: "KYC Queue" },
      { slug: "support", label: "Support Tickets" },
      { slug: "flags", label: "Feature Flags" },
    ],
  },
  {
    slug: "login",
    index: 15,
    title: "Login & Onboarding",
    blurb: "Sign in, register, verify, onboarding wizard.",
    screens: [
      { slug: "signin", label: "Sign In" },
      { slug: "signup", label: "Create Account" },
      { slug: "verify", label: "Verify Email" },
      { slug: "onboarding", label: "Onboarding Wizard" },
    ],
  },
  {
    slug: "federations",
    index: 16,
    title: "Federations",
    blurb: "Multi-association governance and consolidated finance.",
    screens: [
      { slug: "overview", label: "Federation Overview" },
      { slug: "associations", label: "Member Associations" },
      { slug: "consolidated", label: "Consolidated Finance" },
    ],
  },
];
