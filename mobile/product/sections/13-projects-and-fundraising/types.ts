export type Matching = {
  partner: string;
  multiplier: number;
  cap: number;
  matched: number;
};

export type Campaign = {
  id: string;
  title: string;
  raised: number;
  goal: number;
  currency: string;
  donors: number;
  daysLeft: number;
  accent: string;
  matching: Matching | null;
  impact: string;
  story: string;
};

export type Donation = {
  name: string;
  amount: number;
  at: string;
};

export type ImpactStory = {
  id: string;
  title: string;
  body: string;
  photoHue: string;
};
