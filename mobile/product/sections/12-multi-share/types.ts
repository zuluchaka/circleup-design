export type ShareHolding = {
  circleId: string;
  circleName: string;
  shares: number;
  maxEligible: number;
  circleCap: number;
  concentration: number;
};

export type EligibilityCheck = {
  id: string;
  label: string;
  ok: boolean;
  value: string;
};

export type ShareRequest = {
  id: string;
  circleId: string;
  requestedShares: number;
  status: "Draft" | "Submitted" | "In review" | "Approved" | "Declined";
};

export type ConcentrationRow = {
  name: string;
  shares: number;
  share: number;
  cap: number;
  status: "OK" | "Near cap" | "Over cap";
};
