// Step 1 candidates for the BR Creation Wizard.
// Two sources:
//  - prospects: in the CM's pipeline, not yet under contract
//  - discoverable: existing associations on the platform with no active BR

export type ProspectStage =
  | "lead"
  | "contacted"
  | "demo_scheduled"
  | "proposal_sent"
  | "contract_pending";

export type ProspectAssociationType =
  | "cultural"
  | "religious"
  | "professional"
  | "savings"
  | "social"
  | "family";

export type Candidate = {
  id: string;
  source: "prospect" | "discoverable";
  associationName: string;
  presidentName?: string;
  presidentEmail?: string;
  associationType: ProspectAssociationType;
  region: string;
  memberCount: number;
  logo: string;
  // Prospect-only
  stage?: ProspectStage;
  estimatedValue?: number;
  daysInStage?: number;
};

export const CANDIDATES: Candidate[] = [
  {
    id: "prospect-1",
    source: "prospect",
    associationName: "Tamil Cultural Society Zurich",
    presidentName: "Arun Selvanathan",
    presidentEmail: "arun@tcs-zurich.ch",
    associationType: "cultural",
    region: "Zurich · CH",
    memberCount: 312,
    logo: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=200&h=200&fit=crop",
    stage: "demo_scheduled",
    estimatedValue: 2400,
    daysInStage: 4,
  },
  {
    id: "prospect-2",
    source: "prospect",
    associationName: "Kenyan Diaspora Geneva",
    presidentName: "Wanjiku Kamau",
    presidentEmail: "wanjiku@kdg.ch",
    associationType: "savings",
    region: "Geneva · CH",
    memberCount: 89,
    logo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop",
    stage: "proposal_sent",
    estimatedValue: 960,
    daysInStage: 8,
  },
  {
    id: "prospect-3",
    source: "prospect",
    associationName: "Brazilian Community Lausanne",
    presidentName: "Joana Pereira",
    presidentEmail: "joana@brc-vd.ch",
    associationType: "social",
    region: "Lausanne · CH",
    memberCount: 145,
    logo: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=200&h=200&fit=crop",
    stage: "contacted",
    estimatedValue: 1440,
    daysInStage: 11,
  },
  {
    id: "disc-1",
    source: "discoverable",
    associationName: "Ethiopian Welfare Association",
    associationType: "social",
    region: "Bern · CH",
    memberCount: 210,
    logo: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=200&h=200&fit=crop",
  },
  {
    id: "disc-2",
    source: "discoverable",
    associationName: "Portuguese Workers Network",
    associationType: "professional",
    region: "Geneva · CH",
    memberCount: 415,
    logo: "https://images.unsplash.com/photo-1542223616-9de9adb5e3e8?w=200&h=200&fit=crop",
  },
];

export const PROSPECT_STAGE_LABEL: Record<ProspectStage, string> = {
  lead: "Lead",
  contacted: "Contacted",
  demo_scheduled: "Demo scheduled",
  proposal_sent: "Proposal sent",
  contract_pending: "Contract pending",
};
