import { create } from 'zustand'

export interface Employee {
  id: string
  name: string
  dept: string
  pos: string
  status: "Active" | "Maternity" | "Resigned" | "Onboarding"
  email: string
  phone: string
  joinDate: string
  idCard: string
  taxCode: string
  socialInsuranceNo: string
  dob?: string
  gender?: "Male" | "Female" | "Other"
  address?: string
  bankName?: string
  bankAccount?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
}

export interface User {
  id: string
  employeeId?: string
  name: string
  email: string
  role: string
  department: string
  status: "active" | "inactive"
  lastActive: string
  avatar?: string
}

export interface Contract {
  id: string
  empId: string
  type: "Probation" | "Definite Term" | "Indefinite Term"
  startDate: string
  endDate: string
  status: "Active" | "Expired"
}

export interface EContract {
  id: string
  title: string
  type: string
  party: string
  status: string
  date: string
  security: string
}

interface DataState {
  employees: Employee[]
  users: User[]
  contracts: Contract[]
  eContracts: EContract[]
  addEmployee: (emp: Employee) => void
  updateEmployee: (id: string, data: Partial<Employee>) => void
  deleteEmployee: (id: string) => void
  addContract: (contract: Contract) => void
  deleteContract: (id: string) => void
  addEContract: (contract: EContract) => void
  addUser: (user: User) => void
  updateUser: (id: string, data: Partial<User>) => void
  deleteUser: (id: string) => void
  syncEmployeeToUser: (emp: Employee) => void
}

const initialEmployees: Employee[] = [
  { id: "EMP-001", name: "Nguyễn Văn A", dept: "Ban Giám Đốc", pos: "Giám đốc", status: "Active", email: "vana@example.com", phone: "0901234567", joinDate: "2022-03-15", idCard: "001090123456", taxCode: "8012345678", socialInsuranceNo: "7912345678" },
  { id: "EMP-002", name: "Trần Thị B", dept: "Phòng Kinh Doanh", pos: "Trưởng phòng", status: "Active", email: "thib@example.com", phone: "0909876543", joinDate: "2021-06-01", idCard: "002090987654", taxCode: "8023456789", socialInsuranceNo: "7923456789" },
  { id: "EMP-003", name: "Lê Văn C", dept: "Phòng Nhân Sự", pos: "Chuyên viên", status: "Onboarding", email: "vanc@example.com", phone: "0912345678", joinDate: "2023-10-01", idCard: "003091234567", taxCode: "8034567890", socialInsuranceNo: "7934567890" },
  { id: "EMP-004", name: "Phạm Thị D", dept: "Phòng Marketing", pos: "Nhân viên", status: "Maternity", email: "thid@example.com", phone: "0987654321", joinDate: "2020-11-20", idCard: "004098765432", taxCode: "8045678901", socialInsuranceNo: "7945678901" },
]

const initialContracts: Contract[] = [
  { id: "CT-001", empId: "EMP-001", type: "Indefinite Term", startDate: "2022-03-15", endDate: "-", status: "Active" },
  { id: "CT-002", empId: "EMP-002", type: "Definite Term", startDate: "2021-06-01", endDate: "2023-06-01", status: "Active" },
  { id: "CT-003", empId: "EMP-003", type: "Probation", startDate: "2023-10-01", endDate: "2023-12-01", status: "Active" },
]

const initialEContracts: EContract[] = [
  { id: "CTR-2026-001", title: "Employment Agreement - John Doe", type: "HR", party: "John Doe", status: "pending_me", date: "2026-03-15", security: "High" },
  { id: "CTR-2026-002", title: "Supplier Master Agreement", type: "Purchasing", party: "Global Logistics Ltd", status: "signed", date: "2026-03-10", security: "Encrypted" },
  { id: "CTR-2026-003", title: "Seller Terms & Conditions", type: "Legal", party: "FashionHub Store", status: "waiting_others", date: "2026-03-16", security: "Blockchain Verified" },
  { id: "CTR-2026-004", title: "Non-Disclosure Agreement", type: "Legal", party: "Tech Partners Inc", status: "expired", date: "2026-01-05", security: "Standard" },
]

const initialUsers: User[] = [
  { id: "1", employeeId: "EMP-001", name: "Nguyễn Văn A", email: "vana@example.com", role: "Admin", department: "Ban Giám Đốc", status: "active", lastActive: "Vừa xong" },
  { id: "2", employeeId: "EMP-002", name: "Trần Thị B", email: "thib@example.com", role: "Sales", department: "Phòng Kinh Doanh", status: "active", lastActive: "2 giờ trước" },
  { id: "3", employeeId: "EMP-003", name: "Lê Văn C", email: "vanc@example.com", role: "HR", department: "Phòng Nhân Sự", status: "inactive", lastActive: "3 ngày trước" },
  { id: "4", employeeId: "EMP-004", name: "Phạm Thị D", email: "thid@example.com", role: "Marketing", department: "Phòng Marketing", status: "active", lastActive: "1 giờ trước" },
]

export const useDataStore = create<DataState>((set) => ({
  employees: initialEmployees,
  users: initialUsers,
  contracts: initialContracts,
  eContracts: initialEContracts,
  addEmployee: (emp) => set((state) => ({ employees: [...state.employees, emp] })),
  updateEmployee: (id, data) => set((state) => ({
    employees: state.employees.map(e => e.id === id ? { ...e, ...data } : e)
  })),
  deleteEmployee: (id) => set((state) => ({
    employees: state.employees.filter(e => e.id !== id)
  })),
  addContract: (contract) => set((state) => ({ contracts: [...state.contracts, contract] })),
  deleteContract: (id) => set((state) => ({ contracts: state.contracts.filter(c => c.id !== id) })),
  addEContract: (contract) => set((state) => ({ eContracts: [...state.eContracts, contract] })),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (id, data) => set((state) => ({
    users: state.users.map(u => u.id === id ? { ...u, ...data } : u)
  })),
  deleteUser: (id) => set((state) => ({
    users: state.users.filter(u => u.id !== id)
  })),
  syncEmployeeToUser: (emp) => set((state) => {
    const existingUser = state.users.find(u => u.employeeId === emp.id)
    if (existingUser) {
      return {
        users: state.users.map(u => u.employeeId === emp.id ? {
          ...u,
          name: emp.name,
          email: emp.email,
          department: emp.dept,
          status: emp.status === "Active" ? "active" : "inactive"
        } : u)
      }
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        employeeId: emp.id,
        name: emp.name,
        email: emp.email,
        role: "Employee",
        department: emp.dept,
        status: emp.status === "Active" ? "active" : "inactive",
        lastActive: "Chưa đăng nhập"
      }
      return { users: [...state.users, newUser] }
    }
  })
}))
