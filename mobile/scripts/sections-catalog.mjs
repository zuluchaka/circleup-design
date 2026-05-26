// Shared section catalog for capture-android.mjs + capture-ios.mjs.
// Mirrors mobile/data/sectionsCatalog.ts. Keep in sync when adding routes.

export const sectionsCatalog = [
  { index: 0,  slug: "homepage",                 screens: ["welcome", "discover", "quiz", "pricing"] },
  {
    index: 1,
    slug: "associations",
    // Section 1 routes live under /associations and /associations/[id]/*.
    // Creation/migration moved into the BR creation wizard (Section 17, step 1).
    routes: {
      list: "/associations",
      "list-empty": "/associations-empty",
      dashboard: "/associations/ma1",
      settings: "/associations/ma1/settings",
    },
    screens: ["list", "list-empty", "dashboard", "settings"],
  },
  { index: 2,  slug: "members-and-trust",        screens: ["directory", "profile", "trust", "invite", "directory-empty"] },
  {
    index: 3,
    slug: "rosca-circles",
    // Spec lives at mobile/product/sections/03-rosca-circles/spec.md.
    // Phases 2–8 are stub-rendered until the matching component lands.
    screens: [
      // Phase 1 — built
      "my-circles", "circle-detail", "contribute", "payouts", "treasurer",
      // Phase 2 — discovery & joining
      "circle-public", "join-request", "waitlist", "invitations",
      // Phase 3 — creating & renewing
      "create", "renewal",
      // Phase 4 — live cycle ops
      "cycle-progress", "cash-collection", "exception-action",
      // Phase 5 — member-action sheets
      "pay-for-member", "position-swap", "bidding", "payout-advance", "auto-pay",
      // Phase 6 — health, risk & moderation
      "analytics", "risk-scores", "disputes", "dispute-detail", "emergency-fund",
      // Phase 7 — settings & governance
      "settings", "management", "invite", "participants", "multi-share", "documents",
      // Phase 8 — account & admin
      "circle-account", "admin-monitoring",
      // Phase 2 (appended) — public-circle browse, lives here so existing
      // numbering 01–32 stays stable. Logical position is start of Phase 2.
      "discover",
    ],
  },
  {
    index: 4,
    slug: "treasury-and-funds",
    // Spec lives at mobile/product/sections/04-treasury-and-funds/spec.md.
    // Phases 2–5 are stub-rendered until the matching component lands.
    screens: [
      // Phase 1 — core treasurer loop
      "overview", "fund-detail", "request", "approvals",
      // Phase 2 — ledger & reconciliation
      "ledger", "entry-detail", "reconciliation",
      // Phase 3 — reporting & compliance
      "reports", "audit-report", "statements",
      // Phase 4 — currency & investments
      "multi-currency", "investments",
      // Phase 5 — Swiss-specific integrations
      "postfinance-import", "external-accounts",
    ],
  },
  { index: 5,  slug: "governance-and-voting",    screens: ["proposals", "ballot", "elections", "committees", "proposals-empty"] },
  {
    index: 6,
    slug: "communication-and-events",
    screens: [
      "inbox",
      "thread",
      "events",
      "event-detail",
      "association-events",
      "create-event",
      "invite-attendees",
      "announcement-composer",
      "qr",
    ],
  },
  { index: 7,  slug: "documents",                screens: ["library", "viewer", "share", "library-empty"] },
  { index: 8,  slug: "analytics-and-reporting",  screens: ["personal", "circle-health", "statements", "personal-empty"] },
  { index: 9,  slug: "credit-and-lending",       screens: ["score", "advance", "loan", "bureau", "score-low"] },
  { index: 10, slug: "ai-insights",              screens: ["feed", "assistant", "risk", "feed-empty"] },
  { index: 11, slug: "community-and-social",     screens: ["feed", "badges", "leaderboard", "referrals"] },
  { index: 12, slug: "multi-share",              screens: ["my-shares", "request", "monitor"] },
  { index: 13, slug: "projects-and-fundraising", screens: ["campaigns", "campaign-detail", "donate", "impact", "campaigns-empty", "campaigns-empty-member"] },
  { index: 14, slug: "platform-administration",  screens: ["console", "kyc", "support", "flags"] },
  { index: 15, slug: "login",                    screens: ["signin", "signup", "verify", "onboarding"] },
  { index: 16, slug: "federations",              screens: ["overview", "associations", "consolidated"] },
  {
    index: 17,
    slug: "business-relationships",
    routes: {
      list: "/business-relationships",
      detail: "/business-relationships/br1",
      new: "/business-relationships/new",
      dashboard: "/business-relationships/dashboard",
    },
    screens: ["list", "detail", "new", "dashboard"],
  },
  {
    index: 18,
    slug: "association-accounts",
    routes: {
      overview: "/association-accounts/ASS-7K2N-PRI",
      restricted: "/association-accounts/ASS-4F12-PRI",
      frozen: "/association-accounts/ASS-FROZ-PRI",
      empty: "/association-accounts/ASS-NEW1-PRI",
    },
    screens: ["overview", "restricted", "frozen", "empty"],
  },
  {
    index: 19,
    slug: "onboarding",
    routes: {
      checklist: "/business-relationships/br3/onboarding",
      completed: "/business-relationships/br1/onboarding",
      "escalated-red": "/business-relationships/br-red/onboarding",
      "fresh-zero": "/business-relationships/br-fresh/onboarding",
    },
    screens: ["checklist", "completed", "escalated-red", "fresh-zero"],
  },
  {
    index: 20,
    slug: "profile",
    routes: {
      hub: "/profile",
      "personal-info": "/profile/personal-info",
      identity: "/profile/identity",
      "payment-methods": "/profile/payment-methods",
      security: "/profile/security",
      notifications: "/profile/notifications",
      language: "/profile/language",
      subscription: "/profile/subscription",
      help: "/profile/help",
      "legal-about": "/profile/legal-about",
      "identity-basic": "/profile/identity-basic",
      "identity-rejected": "/profile/identity-rejected",
      "payment-methods-empty": "/profile/payment-methods-empty",
      "subscription-past-due": "/profile/subscription-past-due",
      "subscription-trial": "/profile/subscription-trial",
      "subscription-cancels-soon": "/profile/subscription-cancels-soon",
      "subscription-cancelled": "/profile/subscription-cancelled",
      "subscription-confirm-cancel": "/profile/subscription-confirm-cancel",
      "security-confirm-sign-out-all": "/profile/security-confirm-sign-out-all",
      "security-confirm-delete": "/profile/security-confirm-delete",
      "personal-info-photo-sheet": "/profile/personal-info-photo-sheet",
      "hub-confirm-sign-out": "/profile/hub-confirm-sign-out",
      "hub-past-due": "/profile/hub-past-due",
      "notifications-dirty": "/profile/notifications-dirty",
      "hub-association-switcher": "/profile/hub-association-switcher",
      "subscription-cancel-snackbar": "/profile/subscription-cancel-snackbar",
    },
    screens: [
      "hub",
      "personal-info",
      "identity",
      "payment-methods",
      "security",
      "notifications",
      "language",
      "subscription",
      "help",
      "legal-about",
      "identity-basic",
      "identity-rejected",
      "payment-methods-empty",
      "subscription-past-due",
      "subscription-trial",
      "subscription-cancels-soon",
      "subscription-cancelled",
      "subscription-confirm-cancel",
      "security-confirm-sign-out-all",
      "security-confirm-delete",
      "personal-info-photo-sheet",
      "hub-confirm-sign-out",
      "hub-past-due",
      "notifications-dirty",
      "hub-association-switcher",
      "subscription-cancel-snackbar",
    ],
  },
];
