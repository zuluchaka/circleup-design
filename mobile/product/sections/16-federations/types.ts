export type FederationStatus = "Setup" | "Active" | "Winding down";

export type Federation = {
  id: string;
  name: string;
  crestHue: string;
  status: FederationStatus;
  founded: string;
  associations: number;
  totalMembers: number;
  totalCirculating: number;
  currency: string;
};

export type DuesStatus = "Current" | "Late · 1 month" | "Late · 2 months" | "Late · 3+";

export type FederatedAssociation = {
  id: string;
  name: string;
  members: number;
  duesStatus: DuesStatus | string;
  circles: number;
};

export type DuesRow = {
  associationId: string;
  association: string;
  monthly: number;
  outstanding: number;
  status: "OK" | "Late";
};

export type ConsolidatedFinance = {
  tabs: string[];
  dues: DuesRow[];
  federationFundBalance: number;
};
