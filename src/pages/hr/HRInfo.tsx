import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { 
  Upload, ScanLine, QrCode, FileSpreadsheet, ShieldCheck, 
  Search, Filter, Plus, Users, CheckCircle, Briefcase, 
  Edit, Trash2, Settings, FileText, TrendingUp, Network 
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { useDataStore, Employee } from "@/src/store/useDataStore"
import { toast } from "sonner"

interface EmployeeInfoRecord {
  id: string
  empId: string
  idCard: string
  phone: string
  email: string
  address: string
  status: "Verified" | "Pending"
}

export function HRInfo() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { employees, addEmployee, updateEmployee, deleteEmployee, syncEmployeeToUser } = useDataStore()

  // Employee Management State (from Employees.tsx)
  const [userRole, setUserRole] = useState<"Admin" | "HR Manager" | "Employee">("HR Manager")
  const canEdit = userRole === "Admin" || userRole === "HR Manager"
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: "",
    dept: "",
    pos: "",
    grade: "",
    email: "",
    phone: "",
    idCard: "",
    taxCode: "",
    socialInsuranceNo: "",
    dependents: 0,
    status: "Onboarding",
    joinDate: new Date().toISOString().split('T')[0]
  })

  // HR Info Records State (from original HRInfo.tsx)
  const [records, setRecords] = useState<EmployeeInfoRecord[]>([
    { id: "REC-001", empId: employees[0]?.id || "EMP-001", idCard: "079123456789", phone: "0901234567", email: "a.nguyen@company.com", address: "Quận 1, TP.HCM", status: "Verified" },
    { id: "REC-002", empId: employees[1]?.id || "EMP-002", idCard: "079987654321", phone: "0987654321", email: "b.tran@company.com", address: "Quận 3, TP.HCM", status: "Verified" },
    { id: "REC-003", empId: employees[2]?.id || "EMP-003", idCard: "079456123789", phone: "0912345678", email: "c.le@company.com", address: "Quận 7, TP.HCM", status: "Pending" },
  ])

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)
  const [newRecord, setNewRecord] = useState({
    empId: "",
    idCard: "",
    phone: "",
    email: "",
    address: ""
  })

  const getEmployeeName = (empId: string) => {
    const emp = employees.find(e => e.id === empId)
    return emp ? emp.name : empId
  }

  // Employee Handlers
  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.dept && newEmployee.pos) {
      if (editingEmployee) {
        updateEmployee(editingEmployee.id, newEmployee as Employee)
        syncEmployeeToUser({ ...editingEmployee, ...newEmployee } as Employee)
        toast.success(t("hr.core.toasts.updateSuccess"))
      } else {
        const id = `EMP-${(employees.length + 1).toString().padStart(3, '0')}`
        const emp = { ...newEmployee, id } as Employee
        addEmployee(emp)
        syncEmployeeToUser(emp)
        toast.success(t("hr.core.toasts.addSuccess"))
      }
      setIsAddEmployeeOpen(false)
      setEditingEmployee(null)
      setNewEmployee({
        name: "", dept: "", pos: "", grade: "", email: "", phone: "", idCard: "", taxCode: "", socialInsuranceNo: "", dependents: 0, status: "Onboarding", joinDate: new Date().toISOString().split('T')[0]
      })
    } else {
      toast.error(t("hr.core.toasts.requiredFields"))
    }
  }

  const handleEditEmployee = (emp: Employee) => {
    setEditingEmployee(emp)
    setNewEmployee(emp)
    setIsAddEmployeeOpen(true)
  }

  const handleDeleteEmployee = (id: string) => {
    deleteEmployee(id)
    toast.success(t("hr.core.toasts.deleteSuccess"))
  }

  // Record Handlers
  const handleUploadDoc = () => {
    if (!newRecord.empId || !newRecord.idCard) {
      toast.error(t("hr.info.toasts.fillInfo"))
      return
    }

    const record: EmployeeInfoRecord = {
      id: `REC-${(records.length + 1).toString().padStart(3, '0')}`,
      empId: newRecord.empId,
      idCard: newRecord.idCard,
      phone: newRecord.phone,
      email: newRecord.email,
      address: newRecord.address,
      status: "Pending"
    }

    setRecords([record, ...records])
    setIsRecordModalOpen(false)
    setNewRecord({ empId: "", idCard: "", phone: "", email: "", address: "" })
    toast.success(t("hr.info.toasts.addSuccess"))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("hr.tabs.info")}</h1>
          <p className="text-muted-foreground">{t("hrDashboard.hrInfoDesc")}</p>
        </div>
        <div className="flex gap-2 items-center">
          <Select value={userRole} onValueChange={(v: any) => setUserRole(v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t("hr.core.role")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">{t("hr.core.admin")}</SelectItem>
              <SelectItem value="HR Manager">{t("hr.core.hrManager")}</SelectItem>
              <SelectItem value="Employee">{t("hr.core.employee")}</SelectItem>
            </SelectContent>
          </Select>
          
          {canEdit && (
            <>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                {t("hr.core.config")}
              </Button>
              <Dialog open={isAddEmployeeOpen} onOpenChange={(open) => {
                setIsAddEmployeeOpen(open)
                if (!open) {
                  setEditingEmployee(null)
                  setNewEmployee({
                    name: "", dept: "", pos: "", grade: "", email: "", phone: "", idCard: "", taxCode: "", socialInsuranceNo: "", status: "Onboarding", joinDate: new Date().toISOString().split('T')[0]
                  })
                }
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("hr.core.addEmployee")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{editingEmployee ? t("hr.core.editEmployee") : t("hr.core.addEmployee")}</DialogTitle>
                    <DialogDescription>
                      {t("hr.core.employeeListDesc")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    <Tabs defaultValue="personal" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="personal">{t("hr.core.personal")}</TabsTrigger>
                        <TabsTrigger value="work">{t("hr.core.work")}</TabsTrigger>
                        <TabsTrigger value="finance">{t("hr.core.finance")}</TabsTrigger>
                      </TabsList>
                      <TabsContent value="personal" className="space-y-4 pt-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">{t("hr.core.fullName")}</Label>
                          <Input id="name" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="idCard" className="text-right">{t("hr.core.idCard", "CCCD/CMND")}</Label>
                          <Input id="idCard" value={newEmployee.idCard} onChange={(e) => setNewEmployee({ ...newEmployee, idCard: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">{t("common.email", "Email")}</Label>
                          <Input id="email" type="email" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="phone" className="text-right">{t("hr.core.phone", "Số điện thoại")}</Label>
                          <Input id="phone" value={newEmployee.phone} onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="dob" className="text-right">{t("hr.core.dob")}</Label>
                          <Input id="dob" type="date" value={newEmployee.dob} onChange={(e) => setNewEmployee({ ...newEmployee, dob: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="gender" className="text-right">{t("hr.core.gender")}</Label>
                          <Select value={newEmployee.gender} onValueChange={(v: any) => setNewEmployee({ ...newEmployee, gender: v })}>
                            <SelectTrigger className="col-span-3"><SelectValue placeholder={t("hr.core.gender")} /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">{t("hr.core.male")}</SelectItem>
                              <SelectItem value="Female">{t("hr.core.female")}</SelectItem>
                              <SelectItem value="Other">{t("hr.core.other")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="address" className="text-right">{t("hr.core.address")}</Label>
                          <Input id="address" value={newEmployee.address} onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="emergencyContactName" className="text-right">{t("hr.core.emergencyContactName", "Tên người liên hệ khẩn cấp")}</Label>
                          <Input id="emergencyContactName" value={newEmployee.emergencyContactName || ""} onChange={(e) => setNewEmployee({ ...newEmployee, emergencyContactName: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="emergencyContactPhone" className="text-right">{t("hr.core.emergencyContactPhone", "SĐT khẩn cấp")}</Label>
                          <Input id="emergencyContactPhone" value={newEmployee.emergencyContactPhone || ""} onChange={(e) => setNewEmployee({ ...newEmployee, emergencyContactPhone: e.target.value })} className="col-span-3" />
                        </div>
                      </TabsContent>
                      <TabsContent value="work" className="space-y-4 pt-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="dept" className="text-right">{t("hr.core.department")}</Label>
                          <Select value={newEmployee.dept} onValueChange={(v) => setNewEmployee({ ...newEmployee, dept: v })}>
                            <SelectTrigger className="col-span-3"><SelectValue placeholder={t("hr.core.department")} /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Engineering">{t("hr.core.engineering")}</SelectItem>
                              <SelectItem value="Marketing">{t("hr.core.marketing")}</SelectItem>
                              <SelectItem value="Sales">{t("hr.core.sales")}</SelectItem>
                              <SelectItem value="HR">{t("hr.core.hr")}</SelectItem>
                              <SelectItem value="Finance">{t("hr.core.finance")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="pos" className="text-right">{t("hr.core.position")}</Label>
                          <Input id="pos" value={newEmployee.pos} onChange={(e) => setNewEmployee({ ...newEmployee, pos: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="grade" className="text-right">{t("hr.core.grade", "Bậc lương")}</Label>
                          <Input id="grade" value={newEmployee.grade || ""} onChange={(e) => setNewEmployee({ ...newEmployee, grade: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="joinDate" className="text-right">{t("hr.core.joinDate")}</Label>
                          <Input id="joinDate" type="date" value={newEmployee.joinDate} onChange={(e) => setNewEmployee({ ...newEmployee, joinDate: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="status" className="text-right">{t("hr.core.status")}</Label>
                          <Select value={newEmployee.status} onValueChange={(v: any) => setNewEmployee({ ...newEmployee, status: v })}>
                            <SelectTrigger className="col-span-3"><SelectValue placeholder={t("hr.core.status")} /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">{t("hr.core.status.active", "Đang làm việc")}</SelectItem>
                              <SelectItem value="Onboarding">{t("hr.core.status.onboarding", "Thử việc")}</SelectItem>
                              <SelectItem value="Maternity">{t("hr.core.status.maternity", "Thai sản")}</SelectItem>
                              <SelectItem value="Resigned">{t("hr.core.status.resigned", "Đã nghỉ việc")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TabsContent>
                      <TabsContent value="finance" className="space-y-4 pt-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="taxCode" className="text-right">{t("hr.core.taxCode")}</Label>
                          <Input id="taxCode" value={newEmployee.taxCode} onChange={(e) => setNewEmployee({ ...newEmployee, taxCode: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="socialInsuranceNo" className="text-right">{t("hr.core.socialInsuranceNo", "Số sổ BHXH")}</Label>
                          <Input id="socialInsuranceNo" value={newEmployee.socialInsuranceNo} onChange={(e) => setNewEmployee({ ...newEmployee, socialInsuranceNo: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="bankName" className="text-right">{t("hr.core.bankName")}</Label>
                          <Input id="bankName" value={newEmployee.bankName} onChange={(e) => setNewEmployee({ ...newEmployee, bankName: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="bankAccount" className="text-right">{t("hr.core.bankAccount")}</Label>
                          <Input id="bankAccount" value={newEmployee.bankAccount} onChange={(e) => setNewEmployee({ ...newEmployee, bankAccount: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="dependents" className="text-right">{t("hr.core.dependents", "Số người phụ thuộc")}</Label>
                          <Input id="dependents" type="number" value={newEmployee.dependents} onChange={(e) => setNewEmployee({ ...newEmployee, dependents: parseInt(e.target.value) || 0 })} className="col-span-3" />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleAddEmployee}>{t("common.save")}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">{t("hr.core.employeeList")}</TabsTrigger>
          <TabsTrigger value="info">{t("hr.info.tabs.list")}</TabsTrigger>
          <TabsTrigger value="org">{t("hr.core.orgChart")}</TabsTrigger>
          <TabsTrigger value="docs">{t("hr.core.documents")}</TabsTrigger>
          <TabsTrigger value="career">{t("hr.core.careerPath")}</TabsTrigger>
          <TabsTrigger value="import">{t("hr.info.tabs.import")}</TabsTrigger>
          <TabsTrigger value="verification">{t("hr.info.tabs.verification")}</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("hr.core.totalEmployees")}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.length}</div>
                <p className="text-xs text-muted-foreground">+12 {t("hr.core.thisMonth")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("hr.core.onboarding")}</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.filter(e => e.status === "Onboarding").length}</div>
                <p className="text-xs text-muted-foreground">{t("hr.core.inProgress")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("hr.core.departments")}</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{new Set(employees.map(e => e.dept)).size}</div>
                <p className="text-xs text-muted-foreground">{t("hr.core.active")}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("hr.core.employeeList")}</CardTitle>
              <CardDescription>{t("hr.core.employeeListDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={t("common.search")} className="pl-8" />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  {t("common.filters")}
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("hr.core.employeeId")}</TableHead>
                    <TableHead>{t("hr.core.name")}</TableHead>
                    <TableHead>{t("hr.core.department")}</TableHead>
                    <TableHead>{t("hr.core.position")}</TableHead>
                    <TableHead>{t("hr.core.idCard")}</TableHead>
                    <TableHead>{t("hr.core.status")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.email}</div>
                      </TableCell>
                      <TableCell>{t(`hr.core.${item.dept.toLowerCase()}`, item.dept)}</TableCell>
                      <TableCell>{item.pos}</TableCell>
                      <TableCell>{item.idCard}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === "Active" ? "default" : item.status === "Onboarding" ? "secondary" : item.status === "Maternity" ? "outline" : "destructive"}>
                          {item.status === "Active" ? t("hr.core.working") : 
                           item.status === "Maternity" ? t("hr.core.maternity") : 
                           item.status === "Resigned" ? t("hr.core.resigned") : 
                           item.status === "Onboarding" ? t("hr.core.onboarding") : 
                           item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {canEdit ? (
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditEmployee(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteEmployee(item.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm">{t("common.viewDetails")}</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.info.title")}</CardTitle>
              <CardDescription>{t("hr.info.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button onClick={() => setIsRecordModalOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  {t("hr.info.uploadDoc")}
                </Button>
                <Button variant="outline">
                  <ScanLine className="mr-2 h-4 w-4" />
                  {t("hr.info.extractOcr")}
                </Button>
                <Button variant="outline">
                  <QrCode className="mr-2 h-4 w-4" />
                  {t("hr.info.scanQr")}
                </Button>
              </div>

              <Dialog open={isRecordModalOpen} onOpenChange={setIsRecordModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{t("hr.info.records.addTitle")}</DialogTitle>
                    <DialogDescription>
                      {t("hr.info.records.addDesc")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="recEmpId" className="text-right">{t("hr.info.records.employee")}</Label>
                      <Select value={newRecord.empId} onValueChange={(val) => setNewRecord({...newRecord, empId: val})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder={t("hr.info.records.selectEmployee")} />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map(emp => (
                            <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="recIdCard" className="text-right">{t("hr.info.records.idCard")}</Label>
                      <Input 
                        id="recIdCard" 
                        value={newRecord.idCard} 
                        onChange={(e) => setNewRecord({...newRecord, idCard: e.target.value})}
                        className="col-span-3" 
                        placeholder={t("hr.info.placeholders.idCard")}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="recPhone" className="text-right">{t("hr.info.records.phone")}</Label>
                      <Input 
                        id="recPhone" 
                        value={newRecord.phone} 
                        onChange={(e) => setNewRecord({...newRecord, phone: e.target.value})}
                        className="col-span-3" 
                        placeholder={t("hr.info.placeholders.phone")}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="recEmail" className="text-right">{t("hr.info.records.email")}</Label>
                      <Input 
                        id="recEmail" 
                        type="email"
                        value={newRecord.email} 
                        onChange={(e) => setNewRecord({...newRecord, email: e.target.value})}
                        className="col-span-3" 
                        placeholder={t("hr.info.placeholders.email")}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="recAddress" className="text-right">{t("hr.info.records.address")}</Label>
                      <Input 
                        id="recAddress" 
                        value={newRecord.address} 
                        onChange={(e) => setNewRecord({...newRecord, address: e.target.value})}
                        className="col-span-3" 
                        placeholder={t("hr.info.placeholders.address")}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsRecordModalOpen(false)}>{t("hr.info.records.cancel")}</Button>
                    <Button onClick={handleUploadDoc}>{t("hr.info.records.save")}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("hr.core.name")}</TableHead>
                    <TableHead>{t("hr.core.idCard")}</TableHead>
                    <TableHead>{t("hr.info.records.phone")}</TableHead>
                    <TableHead>{t("hr.info.records.email")}</TableHead>
                    <TableHead>{t("hr.info.records.address")}</TableHead>
                    <TableHead>{t("hr.core.status")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{getEmployeeName(item.empId)}</TableCell>
                      <TableCell>{item.idCard}</TableCell>
                      <TableCell>{item.phone}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.address}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === "Verified" ? "default" : "secondary"}>
                          {item.status === "Verified" ? t("hr.info.status.verified") : t("hr.info.status.pending")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">{t("common.viewDetails")}</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="org" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.core.orgChart")}</CardTitle>
              <CardDescription>{t("hr.core.orgChartDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <Network className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">{t("hr.core.orgChartUpdating")}</h3>
                <p className="text-sm text-muted-foreground">{t("hr.core.orgChartFeatureDesc")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.core.documents")}</CardTitle>
              <CardDescription>{t("hr.core.documentsDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("hr.core.documentName")}</TableHead>
                    <TableHead>{t("hr.core.employee")}</TableHead>
                    <TableHead>{t("hr.core.documentType")}</TableHead>
                    <TableHead>{t("hr.core.documentDate")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{t("hr.core.docs.laborContract")} - Nguyen Van A</TableCell>
                    <TableCell>Nguyen Van A</TableCell>
                    <TableCell><Badge variant="outline">{t("hr.core.contract")}</Badge></TableCell>
                    <TableCell>2023-01-15</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm"><FileText className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t("hr.core.docs.appointmentDecision")} - Tran Thi B</TableCell>
                    <TableCell>Tran Thi B</TableCell>
                    <TableCell><Badge variant="outline">{t("hr.core.decision")}</Badge></TableCell>
                    <TableCell>2023-06-01</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm"><FileText className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="career" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.core.careerPath")}</CardTitle>
              <CardDescription>{t("hr.core.careerPathDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">{t("hr.core.careerPathUpdating")}</h3>
                <p className="text-sm text-muted-foreground">{t("hr.core.careerPathFeatureDesc")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.info.importTab.title")}</CardTitle>
              <CardDescription>{t("hr.info.importTab.description")}</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <FileSpreadsheet className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">{t("hr.info.importTab.updating")}</h3>
                <p className="text-sm text-muted-foreground">{t("hr.info.importTab.featureDesc")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.info.verificationTab.title")}</CardTitle>
              <CardDescription>{t("hr.info.verificationTab.description")}</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">{t("hr.info.verificationTab.updating")}</h3>
                <p className="text-sm text-muted-foreground">{t("hr.info.verificationTab.featureDesc")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
