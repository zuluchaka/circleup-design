export type MemberStatus = "Active" | "Pending" | "Suspended" | "Inactive";
export type MemberRole = "President" | "Treasurer" | "Secretary" | "Organizer" | "Auditor" | "Member" | "Admin";

export type Member = {
  id: string;
  name: string;
  role: MemberRole;
  trust: number;
  status: MemberStatus;
  joined: string;
  city: string;
  missed: number;
  contributions: number;
};

export type TrustFactorId = "ontime" | "tenure" | "identity" | "welfare" | "endorsements";

export type TrustFactor = {
  id: TrustFactorId;
  label: string;
  weight: number;
  score: number;
  status: string;
  tip: string;
};

export type InviteChannel = "link" | "email" | "sms";
