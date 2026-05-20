export type TrendDir = "up" | "down" | "flat";
export type Tone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

export type KpiTile = {
  id: string;
  label: string;
  value: string;
  trend?: TrendDir;
  tone?: Tone;
};

export type StatementScope = "Personal" | "Circle · Main CHF" | "Association";

export type Statement = {
  id: string;
  scope: string;
  period: string;
  generated: string;
  format: "PDF" | "CSV";
  size: string;
};
