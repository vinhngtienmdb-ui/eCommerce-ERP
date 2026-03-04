export enum SalesRole {
  ADMIN = "ADMIN",
  SALES_DIRECTOR = "SALES_DIRECTOR",
  REGIONAL_DIRECTOR = "REGIONAL_DIRECTOR",
  SALES_MANAGER = "SALES_MANAGER",
  SALES_STAFF = "SALES_STAFF",
  COLLABORATOR = "COLLABORATOR",
}

export interface SalesUser {
  id: string;
  name: string;
  role: SalesRole;
  teamId?: string;
  commissionRate: number;
  salesVolume: number;
}

export interface Team {
  id: string;
  name: string;
  leaderId: string;
  memberIds: string[];
}
