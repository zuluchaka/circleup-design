export type InsightKind = "Recommendation" | "Risk" | "Fraud";

export type InsightAction = { label: string; target: string };

export type Insight = {
  id: string;
  kind: InsightKind;
  title: string;
  body: string;
  action: InsightAction;
  dataInputs: string[];
};

export type ChatRole = "user" | "assistant";

export type Citation = { label: string; target: string };

export type ChatMessage = {
  role: ChatRole;
  content: string;
  citations?: Citation[];
};

export type RiskTile = {
  id: string;
  label: string;
  value: string;
  tone: "neutral" | "warning" | "danger";
};
