// Onboarding checklist sample data. Mirrors the Rails OnboardingChecklist model.
// Auto-created when a CmContract is signed; one per BR.

export type OnboardingStepKey =
  | "association_profile"
  | "account_activation"
  | "dues_config"
  | "member_invitations"
  | "first_circle";

export type OnboardingStepStatus = "pending" | "in_progress" | "completed";

export type OnboardingChecklistStatus = "in_progress" | "completed" | "escalated";

export type OnboardingEscalationLevel = "amber" | "red" | null;

export type OnboardingStep = {
  key: OnboardingStepKey;
  status: OnboardingStepStatus;
  completedAt: string | null;
  completedByName: string | null;
};

export type OnBehalfEntry = {
  step: OnboardingStepKey;
  completedBy: string;
  consentNote: string;
  completedAt: string;
};

export type OnboardingChecklist = {
  id: string;
  brId: string; // BR this checklist belongs to
  prospectName: string;
  contractReference: string; // CT-XXXXXXXX
  status: OnboardingChecklistStatus;
  escalationLevel: OnboardingEscalationLevel;
  steps: Record<OnboardingStepKey, OnboardingStep>;
  completedOnBehalf: OnBehalfEntry[];
  completionPercentage: number;
  createdAt: string;
  updatedAt: string;
};

export const STEP_ORDER: OnboardingStepKey[] = [
  "association_profile",
  "account_activation",
  "dues_config",
  "member_invitations",
  "first_circle",
];

export const STEP_LABEL: Record<OnboardingStepKey, { label: string; description: string }> = {
  association_profile: {
    label: "Association profile",
    description: "Create the association profile on the platform.",
  },
  account_activation: {
    label: "Account activation",
    description: "Activate the primary CHF account with CHF 0.00 balance.",
  },
  dues_config: {
    label: "Dues configuration",
    description: "Set membership dues amount, frequency, grace period, and late fees.",
  },
  member_invitations: {
    label: "Member invitations",
    description: "Send invitations to founding members with role assignments.",
  },
  first_circle: {
    label: "First circle",
    description: "Create the first savings circle and onboard founding participants.",
  },
};

function pct(steps: Record<OnboardingStepKey, OnboardingStep>): number {
  const total = STEP_ORDER.length;
  const done = STEP_ORDER.filter((k) => steps[k].status === "completed").length;
  return Math.round((done / total) * 100);
}

function step(
  key: OnboardingStepKey,
  status: OnboardingStepStatus,
  completedAt: string | null = null,
  completedByName: string | null = null,
): OnboardingStep {
  return { key, status, completedAt, completedByName };
}

const CHECKLISTS: OnboardingChecklist[] = [
  // br3 just signed and activated — partial onboarding, amber escalation
  {
    id: "ob-br3",
    brId: "br3",
    prospectName: "Indian Professionals Zurich",
    contractReference: "CT-G4VLPQ22",
    status: "in_progress",
    escalationLevel: "amber",
    steps: {
      association_profile: step(
        "association_profile",
        "completed",
        "2026-05-15T10:00:00Z",
        "Aminata Diallo",
      ),
      account_activation: step(
        "account_activation",
        "completed",
        "2026-05-15T10:30:00Z",
        "System",
      ),
      dues_config: step("dues_config", "completed", "2026-05-17T14:22:00Z", "Aminata Diallo"),
      member_invitations: step("member_invitations", "in_progress"),
      first_circle: step("first_circle", "pending"),
    },
    completedOnBehalf: [
      {
        step: "dues_config",
        completedBy: "Aminata Diallo",
        consentNote: "Dues confirmed by Arun on call 2026-05-17. CHF 250/mo, monthly cycle.",
        completedAt: "2026-05-17T14:22:00Z",
      },
    ],
    completionPercentage: 60,
    createdAt: "2026-05-14T09:00:00Z",
    updatedAt: "2026-05-17T14:22:00Z",
  },
  // br1 — fully onboarded, success state
  {
    id: "ob-br1",
    brId: "br1",
    prospectName: "Senegalese Union of Switzerland",
    contractReference: "CT-7K2NQ4XF",
    status: "completed",
    escalationLevel: null,
    steps: {
      association_profile: step(
        "association_profile",
        "completed",
        "2025-02-11T09:00:00Z",
        "Aminata Diallo",
      ),
      account_activation: step(
        "account_activation",
        "completed",
        "2025-02-11T09:30:00Z",
        "System",
      ),
      dues_config: step("dues_config", "completed", "2025-02-12T11:14:00Z", "Cheikh Diop"),
      member_invitations: step(
        "member_invitations",
        "completed",
        "2025-02-13T15:20:00Z",
        "Cheikh Diop",
      ),
      first_circle: step("first_circle", "completed", "2025-02-15T08:00:00Z", "Cheikh Diop"),
    },
    completedOnBehalf: [],
    completionPercentage: 100,
    createdAt: "2025-02-10T12:00:00Z",
    updatedAt: "2025-02-15T08:00:00Z",
  },
];

export function findOnboardingChecklistByBrId(brId: string): OnboardingChecklist | undefined {
  return CHECKLISTS.find((c) => c.brId === brId);
}

export function hasOnboardingChecklist(brId: string): boolean {
  return !!findOnboardingChecklistByBrId(brId);
}

// Build a fresh checklist (all steps pending) for newly-activated BRs that don't have one yet.
export function buildFreshChecklist(brId: string, prospectName: string): OnboardingChecklist {
  return {
    id: `ob-${brId}-fresh`,
    brId,
    prospectName,
    contractReference: `CT-NEW${brId.toUpperCase().padEnd(6, "X")}`,
    status: "in_progress",
    escalationLevel: null,
    steps: {
      association_profile: step("association_profile", "pending"),
      account_activation: step("account_activation", "pending"),
      dues_config: step("dues_config", "pending"),
      member_invitations: step("member_invitations", "pending"),
      first_circle: step("first_circle", "pending"),
    },
    completedOnBehalf: [],
    completionPercentage: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Helper for state mutations on confirm
export function applyStepComplete(
  checklist: OnboardingChecklist,
  stepKey: OnboardingStepKey,
  byName: string,
  onBehalf: boolean,
  consentNote: string,
): OnboardingChecklist {
  const now = new Date().toISOString();
  const nextSteps: Record<OnboardingStepKey, OnboardingStep> = {
    ...checklist.steps,
    [stepKey]: step(stepKey, "completed", now, byName),
  };
  const nextPct = pct(nextSteps);
  const completed = nextPct === 100;
  return {
    ...checklist,
    steps: nextSteps,
    completionPercentage: nextPct,
    status: completed ? "completed" : checklist.status,
    completedOnBehalf: onBehalf
      ? [
          ...checklist.completedOnBehalf,
          { step: stepKey, completedBy: byName, consentNote, completedAt: now },
        ]
      : checklist.completedOnBehalf,
    updatedAt: now,
  };
}
