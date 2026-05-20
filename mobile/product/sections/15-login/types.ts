export type SignInProvider = "email" | "google" | "apple";

export type SignUpIntent = "member" | "organizer" | "starter";

export type OnboardingStepId = "profile" | "identity" | "prefs" | "firstcircle";

export type OnboardingStep = {
  id: OnboardingStepId;
  label: string;
  fields: string[];
};

export type RecommendedCircle = {
  id: string;
  name: string;
  contribution: number;
  cadence: string;
  reason: string;
};

export type AuthSession = {
  userId: string;
  email: string;
  verifiedAt: string | null;
  onboardingComplete: boolean;
};
