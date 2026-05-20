export type OperatorKpi = {
  id: string;
  label: string;
  value: string;
  trend: "up" | "down" | "flat";
};

export type KycApplicant = {
  id: string;
  name: string;
  country: string;
  risk: number;
  submitted: string;
  docs: string[];
};

export type TicketPriority = "High" | "Medium" | "Low";

export type SupportTicket = {
  id: string;
  subject: string;
  priority: TicketPriority;
  sla: string;
  owner: string;
  status: "Open" | "In progress" | "Awaiting member" | "Resolved";
};

export type FeatureFlag = {
  id: string;
  name: string;
  state: "on" | "off";
  cohort: string;
  owner: string;
};
