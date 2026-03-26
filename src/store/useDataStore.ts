import { create } from 'zustand'

export interface Employee {
  id: string
  name: string
  dept: string
  pos: string
  grade?: string
  status: "Active" | "Maternity" | "Resigned" | "Onboarding"
  email: string
  phone: string
  joinDate: string
  idCard: string
  taxCode: string
  socialInsuranceNo: string
  dependents: number
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
  type: "Probation" | "Labor" | "Service" | "Addendum" | "Termination"
  subType?: "Definite Term" | "Indefinite Term"
  startDate: string
  endDate: string
  status: "Active" | "Expired" | "Terminated"
  content?: string
  attachments?: string[]
}

export interface HRPolicy {
  id: string
  title: string
  type: "Regulation" | "Labor Rule" | "Policy"
  content: string
  updatedAt: string
  version: string
}

export interface SalaryScale {
  id: string
  grade: string
  level: string
  baseSalary: number
  allowances: { name: string, amount: number }[]
  description?: string
}

export interface AllowanceType {
  id: string
  name: string
  isTaxable: boolean
  taxLimit?: number
  isInsuranceSubject: boolean
  calculationBasis: "Monthly" | "Daily"
  isGradeBased: boolean
  gradeAmounts?: Record<string, number>
  amount?: number
  description?: string
}

export interface InsuranceRateConfig {
  id: string
  effectiveDate: string
  employeeRates: {
    bhxh: number
    bhyt: number
    bhtn: number
  }
  employerRates: {
    bhxh: number
    bhyt: number
    bhtn: number
    bhld_bnn: number
  }
}

export interface PITConfig {
  personalDeduction: number
  dependentDeduction: number
}

export interface InsuranceParticipant {
  employeeId: string
  isParticipant: boolean
}

export interface PayrollRecord {
  id: string
  employeeId: string
  period: string
  basicSalary: number
  allowances: number
  deductions: number
  tax: number
  netSalary: number
  status: "Draft" | "Approved" | "Paid"
  createdAt: string
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

export interface PaymentRequestData {
  id: string
  transactionType: string
  serviceTypeId: string
  vendorId: string
  period: string
  invoiceNumber: string
  department: string
  requester: string
  content: string
  totalAmount: string
  advanceAmount: string
  bankAccount: string
  beneficiary: string
  bankName: string
  paymentMethod: string
  status: string
  createdAt: string
}

export interface Vendor {
  id: string
  name: string
  taxCode: string
  address: string
  bankAccount: string
  bankName: string
  beneficiary: string
  contactPerson: string
  email: string
  phone: string
  serviceTypeId?: string
}

export interface ServiceType {
  id: string
  name: string
  description: string
}

interface DataState {
  employees: Employee[]
  users: User[]
  contracts: Contract[]
  eContracts: EContract[]
  paymentRequests: PaymentRequestData[]
  vendors: Vendor[]
  serviceTypes: ServiceType[]
  hrPolicies: HRPolicy[]
  salaryScales: SalaryScale[]
  allowanceTypes: AllowanceType[]
  insuranceRateConfigs: InsuranceRateConfig[]
  pitConfig: PITConfig
  insuranceParticipants: InsuranceParticipant[]
  payrollRecords: PayrollRecord[]
  addEmployee: (emp: Employee) => void
  updateEmployee: (id: string, data: Partial<Employee>) => void
  deleteEmployee: (id: string) => void
  addContract: (contract: Contract) => void
  updateContract: (id: string, data: Partial<Contract>) => void
  deleteContract: (id: string) => void
  addEContract: (contract: EContract) => void
  addUser: (user: User) => void
  updateUser: (id: string, data: Partial<User>) => void
  deleteUser: (id: string) => void
  syncEmployeeToUser: (emp: Employee) => void
  addPaymentRequest: (req: PaymentRequestData) => void
  updatePaymentRequest: (id: string, data: Partial<PaymentRequestData>) => void
  addVendor: (vendor: Vendor) => void
  updateVendor: (id: string, data: Partial<Vendor>) => void
  deleteVendor: (id: string) => void
  addServiceType: (st: ServiceType) => void
  addHRPolicy: (policy: HRPolicy) => void
  updateHRPolicy: (id: string, data: Partial<HRPolicy>) => void
  addSalaryScale: (scale: SalaryScale) => void
  updateSalaryScale: (id: string, data: Partial<SalaryScale>) => void
  addAllowanceType: (at: AllowanceType) => void
  updateAllowanceType: (id: string, data: Partial<AllowanceType>) => void
  deleteAllowanceType: (id: string) => void
  addInsuranceRateConfig: (config: InsuranceRateConfig) => void
  updateInsuranceRateConfig: (id: string, data: Partial<InsuranceRateConfig>) => void
  deleteInsuranceRateConfig: (id: string) => void
  updatePITConfig: (data: Partial<PITConfig>) => void
  updateInsuranceParticipant: (employeeId: string, isParticipant: boolean) => void
  addPayrollRecord: (record: PayrollRecord) => void
}

const initialEmployees: Employee[] = [
  { id: "EMP-001", name: "Nguyễn Văn A", dept: "Engineering", pos: "Giám đốc", grade: "M1", status: "Active", email: "vana@example.com", phone: "0901234567", joinDate: "2022-03-15", idCard: "001090123456", taxCode: "8012345678", socialInsuranceNo: "7912345678", dependents: 2 },
  { id: "EMP-002", name: "Trần Thị B", dept: "Sales", pos: "Trưởng phòng", grade: "M1", status: "Active", email: "thib@example.com", phone: "0909876543", joinDate: "2021-06-01", idCard: "002090987654", taxCode: "8023456789", socialInsuranceNo: "7923456789", dependents: 1 },
  { id: "EMP-003", name: "Lê Văn C", dept: "HR", pos: "Chuyên viên", grade: "S1", status: "Onboarding", email: "vanc@example.com", phone: "0912345678", joinDate: "2023-10-01", idCard: "003091234567", taxCode: "8034567890", socialInsuranceNo: "7934567890", dependents: 0 },
  { id: "EMP-004", name: "Phạm Thị D", dept: "Marketing", pos: "Nhân viên", grade: "S1", status: "Maternity", email: "thid@example.com", phone: "0987654321", joinDate: "2020-11-20", idCard: "004098765432", taxCode: "8045678901", socialInsuranceNo: "7945678901", dependents: 3 },
]

const initialContracts: Contract[] = [
  { id: "CT-001", empId: "EMP-001", type: "Labor", subType: "Indefinite Term", startDate: "2022-03-15", endDate: "-", status: "Active" },
  { id: "CT-002", empId: "EMP-002", type: "Labor", subType: "Definite Term", startDate: "2021-06-01", endDate: "2023-06-01", status: "Active" },
  { id: "CT-003", empId: "EMP-003", type: "Probation", startDate: "2023-10-01", endDate: "2023-12-01", status: "Active" },
]

const initialHRPolicies: HRPolicy[] = [
  { id: "POL-001", title: "Nội quy lao động", type: "Labor Rule", content: "Nội dung nội quy lao động...", updatedAt: "2024-01-01", version: "1.0" },
  { id: "POL-002", title: "Quy chế lương thưởng", type: "Regulation", content: "Nội dung quy chế lương thưởng...", updatedAt: "2024-01-01", version: "1.1" },
]

const initialSalaryScales: SalaryScale[] = [
  { id: "SS-001", grade: "M1", level: "1", baseSalary: 20000000, allowances: [{ name: "Ăn trưa", amount: 730000 }] },
  { id: "SS-002", grade: "S1", level: "1", baseSalary: 10000000, allowances: [{ name: "Ăn trưa", amount: 730000 }] },
]

const initialAllowanceTypes: AllowanceType[] = [
  { 
    id: "AL-001", 
    name: "Ăn trưa", 
    isTaxable: false, 
    isInsuranceSubject: false, 
    calculationBasis: "Daily",
    isGradeBased: false,
    amount: 730000, 
    description: "Phụ cấp ăn trưa theo ngày công" 
  },
  { 
    id: "AL-002", 
    name: "Điện thoại", 
    isTaxable: true, 
    taxLimit: 500000,
    isInsuranceSubject: false, 
    calculationBasis: "Monthly",
    isGradeBased: false,
    amount: 500000, 
    description: "Hỗ trợ chi phí điện thoại" 
  },
  { 
    id: "AL-003", 
    name: "Trách nhiệm", 
    isTaxable: true, 
    isInsuranceSubject: true, 
    calculationBasis: "Monthly",
    isGradeBased: true,
    gradeAmounts: {
      "M1": 5000000,
      "M2": 3000000,
      "S1": 1000000
    },
    description: "Phụ cấp trách nhiệm quản lý" 
  },
]

const initialInsuranceRateConfigs: InsuranceRateConfig[] = [
  {
    id: "IRC-001",
    effectiveDate: "2024-01-01",
    employeeRates: { bhxh: 8, bhyt: 1.5, bhtn: 1 },
    employerRates: { bhxh: 17, bhyt: 3, bhtn: 1, bhld_bnn: 0.5 }
  }
]

const initialPITConfig: PITConfig = {
  personalDeduction: 11000000,
  dependentDeduction: 4400000,
}

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

const initialPaymentRequests: PaymentRequestData[] = [
  {
    id: "PR-001",
    transactionType: "payment",
    serviceTypeId: "ST-001",
    vendorId: "V-001",
    period: "Tháng 03/2026",
    invoiceNumber: "PE0413-000123",
    department: "PHÒNG TCTH",
    requester: "Hoàng Văn Long",
    content: "Thanh toán tiền điện Tháng 03/2026",
    totalAmount: "1500000",
    advanceAmount: "0",
    bankAccount: "123456789",
    beneficiary: "EVN HCMC",
    bankName: "VietinBank",
    paymentMethod: "transfer",
    status: "pending_sign",
    createdAt: "2026-03-20T10:00:00Z"
  }
]

const initialVendors: Vendor[] = [
  {
    id: "V-001",
    name: "Tổng Cty Điện lực TP.HCM (EVNHCMC)",
    taxCode: "0300634048",
    address: "356 Lý Tự Trọng, Quận 1, TP.HCM",
    bankAccount: "123456789",
    bankName: "VietinBank",
    beneficiary: "EVN HCMC",
    contactPerson: "Nguyễn Văn Điện",
    email: "contact@evnhcmc.vn",
    phone: "19001122"
  },
  {
    id: "V-002",
    name: "Công ty Cổ phần Cấp nước Sài Gòn",
    taxCode: "0300508039",
    address: "1 Công trường Quốc tế, Quận 3, TP.HCM",
    bankAccount: "987654321",
    bankName: "Vietcombank",
    beneficiary: "SAWACO",
    contactPerson: "Trần Văn Nước",
    email: "info@sawaco.com.vn",
    phone: "19001006"
  }
]

const initialServiceTypes: ServiceType[] = [
  { id: "ST-001", name: "Tiền điện", description: "Chi phí điện năng tiêu thụ" },
  { id: "ST-002", name: "Tiền nước", description: "Chi phí nước sinh hoạt" },
  { id: "ST-003", name: "Internet/Viễn thông", description: "Cước phí internet và điện thoại" },
  { id: "ST-004", name: "Văn phòng phẩm", description: "Mua sắm đồ dùng văn phòng" },
  { id: "ST-005", name: "Sửa chữa/Bảo trì", description: "Chi phí sửa chữa thiết bị" },
]

export const useDataStore = create<DataState>((set) => ({
  employees: initialEmployees,
  users: initialUsers,
  contracts: initialContracts,
  eContracts: initialEContracts,
  paymentRequests: initialPaymentRequests,
  vendors: initialVendors,
  serviceTypes: initialServiceTypes,
  hrPolicies: initialHRPolicies,
  salaryScales: initialSalaryScales,
  allowanceTypes: initialAllowanceTypes,
  insuranceRateConfigs: initialInsuranceRateConfigs,
  pitConfig: initialPITConfig,
  insuranceParticipants: [],
  payrollRecords: [],
  addEmployee: (emp) => set((state) => ({ employees: [...state.employees, emp] })),
  updateEmployee: (id, data) => set((state) => ({
    employees: state.employees.map(e => e.id === id ? { ...e, ...data } : e)
  })),
  deleteEmployee: (id) => set((state) => ({
    employees: state.employees.filter(e => e.id !== id)
  })),
  addContract: (contract) => set((state) => ({ contracts: [...state.contracts, contract] })),
  updateContract: (id, data) => set((state) => ({
    contracts: state.contracts.map(c => c.id === id ? { ...c, ...data } : c)
  })),
  deleteContract: (id) => set((state) => ({ contracts: state.contracts.filter(c => c.id !== id) })),
  addEContract: (contract) => set((state) => ({ eContracts: [...state.eContracts, contract] })),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (id, data) => set((state) => ({
    users: state.users.map(u => u.id === id ? { ...u, ...data } : u)
  })),
  deleteUser: (id) => set((state) => ({
    users: state.users.filter(u => u.id !== id)
  })),
  addPaymentRequest: (req) => set((state) => ({ paymentRequests: [...state.paymentRequests, req] })),
  updatePaymentRequest: (id, data) => set((state) => ({
    paymentRequests: state.paymentRequests.map(r => r.id === id ? { ...r, ...data } : r)
  })),
  addVendor: (vendor) => set((state) => ({ vendors: [...state.vendors, vendor] })),
  updateVendor: (id, data) => set((state) => ({
    vendors: state.vendors.map(v => v.id === id ? { ...v, ...data } : v)
  })),
  deleteVendor: (id) => set((state) => ({
    vendors: state.vendors.filter(v => v.id !== id)
  })),
  addServiceType: (st) => set((state) => ({ serviceTypes: [...state.serviceTypes, st] })),
  addHRPolicy: (policy) => set((state) => ({ hrPolicies: [...state.hrPolicies, policy] })),
  updateHRPolicy: (id, data) => set((state) => ({
    hrPolicies: state.hrPolicies.map(p => p.id === id ? { ...p, ...data } : p)
  })),
  addSalaryScale: (scale) => set((state) => ({ salaryScales: [...state.salaryScales, scale] })),
  updateSalaryScale: (id, data) => set((state) => ({
    salaryScales: state.salaryScales.map(s => s.id === id ? { ...s, ...data } : s)
  })),
  addAllowanceType: (at) => set((state) => ({ allowanceTypes: [...state.allowanceTypes, at] })),
  updateAllowanceType: (id, data) => set((state) => ({
    allowanceTypes: state.allowanceTypes.map(at => at.id === id ? { ...at, ...data } : at)
  })),
  deleteAllowanceType: (id) => set((state) => ({
    allowanceTypes: state.allowanceTypes.filter(at => at.id !== id)
  })),
  addInsuranceRateConfig: (config) => set((state) => ({ insuranceRateConfigs: [...state.insuranceRateConfigs, config] })),
  updateInsuranceRateConfig: (id, data) => set((state) => ({
    insuranceRateConfigs: state.insuranceRateConfigs.map(c => c.id === id ? { ...c, ...data } : c)
  })),
  deleteInsuranceRateConfig: (id) => set((state) => ({
    insuranceRateConfigs: state.insuranceRateConfigs.filter(c => c.id !== id)
  })),
  updatePITConfig: (data) => set((state) => ({
    pitConfig: { ...state.pitConfig, ...data }
  })),
  updateInsuranceParticipant: (employeeId, isParticipant) => set((state) => {
    const exists = state.insuranceParticipants.find(p => p.employeeId === employeeId)
    if (exists) {
      return {
        insuranceParticipants: state.insuranceParticipants.map(p => p.employeeId === employeeId ? { ...p, isParticipant } : p)
      }
    } else {
      return {
        insuranceParticipants: [...state.insuranceParticipants, { employeeId, isParticipant }]
      }
    }
  }),
  addPayrollRecord: (record) => set((state) => ({ payrollRecords: [...state.payrollRecords, record] })),
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
