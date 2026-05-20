export type AssociationStatus = "active" | "migrating" | "archived";
export type GovernanceModel = "committee" | "consensus" | "founder";
export type Terminology = "rosca" | "susu" | "tanda" | "paluwagan" | "tontine";
export type Language = "EN" | "FR" | "DE" | "IT" | "PT";

export type Association = {
  id: string;
  name: string;
  tagline?: string;
  country: string;
  city: string;
  language: Language;
  currency: string;
  brandHue: string;
  founded: string;
  status: AssociationStatus;
  members: number;
  activeMembers: number;
  circles: number;
  fundsBalance: number;
  trustAverage: number;
  emergencyFundRate: number;
  terminology: Terminology;
  governance: GovernanceModel;
};

export type QuickAction = {
  id: string;
  label: string;
  icon: string;
};

export type ActivityKind =
  | "contribution"
  | "payout"
  | "join_request"
  | "vote"
  | "document"
  | "announcement";

export type ActivityItem = {
  id: string;
  kind: ActivityKind;
  actor: string;
  message: string;
  at: string;
};

export type WizardStep = { id: string; label: string };

export type MigrationValidation = {
  valid: number;
  warnings: number;
  errors: number;
  warningSamples: string[];
  errorSamples: string[];
};

export type SettingsRow = { label: string; value: string };
export type SettingsGroup = { id: string; label: string; rows: SettingsRow[] };
