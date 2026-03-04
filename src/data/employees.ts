export interface Employee {
  id: string;
  customerId: string;
  name: string;
  role: string;
  status: string;
}

export const initialEmployees: Employee[] = [
  { id: "EMP-001", customerId: "CUS-003", name: "Lê Văn C", role: "Sales Manager", status: "active" },
];
