// Section 19 — Onboarding Checklist
//
// Portable typings. Mirrors the Rails `OnboardingChecklist` model and
// `app/javascript/components/b2b/types.ts:OnboardingChecklist`.

export type OnboardingStepKey =
  | "association_profile"
  | "account_activation"
  | "dues_config"
  | "member_invitations"
  | "first_circle";

export type OnboardingStepStatus = "pending" | "in_progress" | "completed";

export type OnboardingChecklistStatus = "in_progress" | "completed" | "escalated";

export type OnboardingEscalationLevel = "amber" | "red" | null;

export interface OnboardingStep {
  key: OnboardingStepKey;
  status: OnboardingStepStatus;
  completedAt: string | null;
  completedByName: string | null;
}

export interface OnBehalfEntry {
  step: OnboardingStepKey;
  completedBy: string;
  consentNote: string;
  completedAt: string;
}

export interface OnboardingChecklist {
  id: string;
  brId: string;
  prospectName: string;
  contractReference: string; // CT-XXXXXXXX
  status: OnboardingChecklistStatus;
  escalationLevel: OnboardingEscalationLevel;
  steps: Record<OnboardingStepKey, OnboardingStep>;
  completedOnBehalf: OnBehalfEntry[];
  completionPercentage: number;
  createdAt: string;
  updatedAt: string;
}
