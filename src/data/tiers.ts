export interface Tier {
  id: string;
  name: string;
  commission: number;
}

export const initialTiers: Tier[] = [
  { id: "T-001", name: "Sales Manager", commission: 15 },
  { id: "T-002", name: "Sales Staff", commission: 10 },
  { id: "T-003", name: "Collaborator", commission: 5 },
];
