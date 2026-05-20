export type DocumentCategory = "Governance" | "Finance" | "Minutes" | "Forms" | "Other";
export type DocumentVisibility = "All members" | "Committee" | "Organisers" | "Public link";

export type DocumentItem = {
  id: string;
  title: string;
  category: DocumentCategory;
  version: string;
  updated: string;
  size: string;
  visibility: DocumentVisibility;
  owners: string[];
};

export type DocumentVersion = {
  version: string;
  at: string;
  by: string;
  change: string;
};
