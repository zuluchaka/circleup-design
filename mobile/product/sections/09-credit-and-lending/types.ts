export type CreditBand = "Limited" | "Building" | "Strong" | "Excellent";

export type CreditFactor = {
  id: string;
  label: string;
  weight: number;
  score: number;
  status: string;
};

export type CreditSummary = {
  score: number;
  band: CreditBand | string;
  range: { min: number; max: number };
  factors: CreditFactor[];
};

export type AdvanceOffer = {
  max: number;
  feePct: number;
  repayDate: string;
  repaySource: string;
  currency: string;
  currentAdvance: { amount: number; repayDate: string } | null;
};

export type LoanScheduleRow = { month: number; principal: number; interest: number };

export type LoanOffer = {
  preApprovedAmount: number;
  rateApr: number;
  termsMonths: number[];
  schedulePreview: LoanScheduleRow[];
};

export type BureauStatus = "Eligible" | "Reporting active" | "Paused" | "Unavailable";

export type BureauReporting = {
  partner: string;
  status: BureauStatus;
  lastReport: string | null;
  benefits: string[];
};
