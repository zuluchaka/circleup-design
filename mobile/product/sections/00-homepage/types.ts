// Section 0 — Homepage types.
// Public content only; no authenticated context.

export type HeroStat = { value: string; label: string };

export type Hero = {
  eyebrow: string;
  title: string;
  subtitle: string;
  stats: HeroStat[];
};

export type DiscoverCard = {
  id: string;
  title: string;
  body: string;
};

export type QuizOption = { value: string; label: string };

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
};

export type QuizOutcomeId = "ready_to_join" | "ready_to_organize" | "build_trust";

export type QuizOutcome = {
  id: QuizOutcomeId;
  title: string;
  body: string;
  cta: string;
};

export type Quiz = {
  questions: QuizQuestion[];
  outcomes: QuizOutcome[];
};

export type PricingTier = {
  id: "free" | "pro" | "federation";
  name: string;
  tagline: string;
  price: string;
  cadence: string;
  features: string[];
  highlighted: boolean;
};

export type HomepageContent = {
  hero: Hero;
  discover: DiscoverCard[];
  quiz: Quiz;
  pricing: PricingTier[];
  feeDisclosure: string;
};
