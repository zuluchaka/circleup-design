// Cross-section sample data used by screen designs.
// All sections import from here so a single edit propagates across designs.

export const association = {
  id: "assoc_diaspora_geneva",
  name: "Diaspora Circle Geneva",
  description: "A Swiss-French diaspora savings & welfare association serving 184 members across Geneva and Lausanne.",
  country: "Switzerland",
  city: "Geneva",
  language: "FR",
  currency: "CHF",
  brandHue: "#4f46e5",
  founded: "2019-03-15",
  members: 184,
  active: 162,
  trustAverage: 712,
};

export const currentMember = {
  id: "mem_amara_ofori",
  firstName: "Amara",
  lastName: "Ofori",
  fullName: "Amara Ofori",
  role: "Treasurer" as const,
  initials: "AO",
  trustScore: 824,
  joinedAt: "2020-09-12",
  email: "amara@example.org",
  phone: "+41 76 555 02 18",
  city: "Geneva",
  language: "EN",
  avatarHue: "#4f46e5",
  shares: 2,
};

export const members = [
  { id: "mem_amara", name: "Amara Ofori", role: "Treasurer", trust: 824, status: "Active", joined: "2020-09-12" },
  { id: "mem_kofi", name: "Kofi Mensah", role: "President", trust: 891, status: "Active", joined: "2019-04-02" },
  { id: "mem_zara", name: "Zara Bekele", role: "Secretary", trust: 776, status: "Active", joined: "2021-01-22" },
  { id: "mem_dembele", name: "Aïssatou Dembélé", role: "Member", trust: 689, status: "Active", joined: "2022-02-18" },
  { id: "mem_pham", name: "Linh Pham", role: "Member", trust: 615, status: "Active", joined: "2022-06-04" },
  { id: "mem_okoye", name: "Chinedu Okoye", role: "Member", trust: 558, status: "Active", joined: "2023-01-09" },
  { id: "mem_rahimi", name: "Mariam Rahimi", role: "Auditor", trust: 802, status: "Active", joined: "2020-11-30" },
  { id: "mem_dasilva", name: "João da Silva", role: "Member", trust: 482, status: "Pending", joined: "2024-08-14" },
  { id: "mem_okafor", name: "Ngozi Okafor", role: "Organizer", trust: 731, status: "Active", joined: "2021-07-19" },
  { id: "mem_haile", name: "Selam Haile", role: "Member", trust: 644, status: "Active", joined: "2022-10-03" },
];

export const circles = [
  {
    id: "circle_main_chf",
    name: "Main CHF Circle",
    contribution: 200,
    currency: "CHF",
    frequency: "Monthly",
    members: 12,
    cycle: 8,
    cycleLength: 12,
    nextPayoutTo: "Kofi Mensah",
    nextPayoutDate: "2026-05-25",
    nextContributionDate: "2026-05-20",
    healthScore: 94,
    emergencyFund: 4_320,
    riskLevel: "Low",
  },
  {
    id: "circle_welfare",
    name: "Welfare Booster",
    contribution: 50,
    currency: "CHF",
    frequency: "Monthly",
    members: 24,
    cycle: 4,
    cycleLength: 24,
    nextPayoutTo: "Zara Bekele",
    nextPayoutDate: "2026-05-28",
    nextContributionDate: "2026-05-22",
    healthScore: 88,
    emergencyFund: 2_410,
    riskLevel: "Low",
  },
  {
    id: "circle_youth",
    name: "Youth Starter",
    contribution: 25,
    currency: "CHF",
    frequency: "Bi-weekly",
    members: 8,
    cycle: 2,
    cycleLength: 8,
    nextPayoutTo: "Linh Pham",
    nextPayoutDate: "2026-05-19",
    nextContributionDate: "2026-05-18",
    healthScore: 71,
    emergencyFund: 220,
    riskLevel: "Medium",
  },
];

export const events = [
  {
    id: "evt_agm_2026",
    title: "Annual General Meeting 2026",
    date: "2026-06-08T18:00",
    location: "Maison des Associations, Geneva",
    rsvp: { yes: 92, no: 14, maybe: 11 },
    cover: "#4f46e5",
    description: "Yearly meeting to review the 2025 reports, vote on the 2026 budget, and elect committee seats.",
    requiresPayment: false,
  },
  {
    id: "evt_summerfest",
    title: "Summer Cultural Festival",
    date: "2026-07-12T12:00",
    location: "Parc des Bastions",
    rsvp: { yes: 64, no: 6, maybe: 22 },
    cover: "#f59e0b",
    description: "Family day with music, food, and a circle members reunion.",
    requiresPayment: true,
    price: 15,
  },
  {
    id: "evt_workshop",
    title: "Financial Literacy Workshop",
    date: "2026-05-24T10:00",
    location: "Online · Zoom",
    rsvp: { yes: 38, no: 2, maybe: 9 },
    cover: "#10b981",
    description: "Diaspora finance and credit-building best practices, led by Nadia A.",
    requiresPayment: false,
  },
];

export const proposals = [
  {
    id: "prop_2026_budget",
    title: "2026 Operating Budget",
    summary: "Approve CHF 48,000 budget across welfare, events, and admin lines.",
    status: "Voting" as const,
    endsAt: "2026-05-25",
    quorum: { current: 124, required: 138 },
    votes: { yes: 87, no: 14, abstain: 23 },
  },
  {
    id: "prop_chair_extension",
    title: "Extend Chair Term to 2 years",
    summary: "Move from 1-year to 2-year chair terms to improve continuity.",
    status: "Discussion" as const,
    endsAt: "2026-06-12",
    quorum: { current: 0, required: 138 },
    votes: { yes: 0, no: 0, abstain: 0 },
  },
];

export const fundraisers = [
  {
    id: "fund_school_bus",
    title: "School Bus for Tamale Children",
    raised: 12_400,
    goal: 25_000,
    currency: "CHF",
    donors: 84,
    daysLeft: 22,
    matching: { partner: "Geneva Diaspora Foundation", multiplier: 1 },
    impact: "Daily transport for 38 children across the 2026/27 school year.",
  },
  {
    id: "fund_emergency_quake",
    title: "Emergency Aid · Marrakech Quake",
    raised: 5_900,
    goal: 10_000,
    currency: "CHF",
    donors: 142,
    daysLeft: 4,
    matching: null,
    impact: "Direct shelter and food relief to 80 affected families.",
  },
];

export const announcements = [
  {
    id: "ann_payout_reminder",
    title: "Contribution due May 20",
    body: "Members of Main CHF Circle, the May contribution is due Thursday. Auto-debit runs at 09:00 CET.",
    sentAt: "2026-05-15T08:30",
    channel: "Push + Email",
    audience: "Main CHF Circle",
  },
  {
    id: "ann_agm",
    title: "AGM 2026 — Save the date",
    body: "Save the date for the AGM on June 8, 18:00. RSVP opens this Friday.",
    sentAt: "2026-05-12T17:00",
    channel: "In-app",
    audience: "All members",
  },
];

export const credit = {
  score: 706,
  band: "Strong",
  factors: [
    { label: "On-time contributions", weight: 35, status: "Excellent" },
    { label: "Tenure & engagement", weight: 20, status: "Strong" },
    { label: "Verified identity", weight: 15, status: "Verified" },
    { label: "Welfare repayment record", weight: 15, status: "No history" },
    { label: "Peer endorsements", weight: 15, status: "Building" },
  ],
  advanceLimit: 1_800,
  advanceAvailable: 1_200,
  loanLimit: 6_000,
};

export const insights = [
  {
    id: "ins_payout_recommend",
    kind: "Recommendation",
    title: "Consider doubling your share next cycle",
    body: "Based on 14 months of perfect payments, your projected default risk is below 2%. Doubling your share would unlock a CHF 2,400 payout in August.",
  },
  {
    id: "ins_risk_warning",
    kind: "Risk",
    title: "2 members likely to miss June payment",
    body: "Linh P. and Chinedu O. show late-payment signals. Reach out before the due date to reduce default risk.",
  },
  {
    id: "ins_fraud",
    kind: "Fraud",
    title: "Unusual login from a new device",
    body: "A login from Lagos was detected on Kofi Mensah's account. Already mitigated — session revoked.",
  },
];

export const documents = [
  { id: "doc_bylaws", title: "Bylaws · v3.2", category: "Governance", updated: "2026-02-14", size: "412 KB" },
  { id: "doc_minutes", title: "Board minutes · April 2026", category: "Minutes", updated: "2026-04-30", size: "184 KB" },
  { id: "doc_audit_2025", title: "Annual audit · 2025", category: "Finance", updated: "2026-03-02", size: "1.2 MB" },
  { id: "doc_membership_form", title: "Membership form", category: "Forms", updated: "2025-09-01", size: "92 KB" },
];

export const federations = {
  id: "fed_swiss_west",
  name: "Swiss West Diaspora Federation",
  members: 12,
  associations: ["Diaspora Circle Geneva", "Lausanne Cultural Circle", "Vevey Susu Network", "Fribourg Welfare Ring"],
  totalMembers: 942,
  totalContribution: 218_400,
  currency: "CHF",
};

export const tickets = [
  { id: "tic_kyc_review", subject: "KYC review backlog · 38 pending", priority: "High", owner: "Compliance", status: "Open" },
  { id: "tic_payment_issue", subject: "Payment retries failing for 4 members", priority: "Medium", owner: "Support", status: "In progress" },
  { id: "tic_dispute", subject: "Dispute · circle_main_chf payout mismatch", priority: "High", owner: "Operations", status: "Open" },
];
