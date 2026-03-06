import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Search, Filter, Plus, Users, CheckCircle, Briefcase, Edit, Trash2, Settings, FileText, TrendingUp, Network } from "lucide-react"

interface Employee {
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
}

interface Contract {
  id: string
  empName: string
  type: "Probation" | "Definite Term" | "Indefinite Term"
  startDate: string
  endDate: string
  status: "Active" | "Expired"
}

export function Employees() {
  const { t } = useTranslation()

  const [userRole, setUserRole] = useState<"Admin" | "HR Manager" | "Employee">("HR Manager")
  const canEdit = userRole === "Admin" || userRole === "HR Manager"

  const [employees, setEmployees] = useState<Employee[]>([
    { id: "EMP-001", name: "Nguyen Van A", dept: "Engineering", pos: "Senior Dev", status: "Active", email: "a.nguyen@company.com", phone: "0901234567", joinDate: "2022-03-15", idCard: "001090123456", taxCode: "8012345678", socialInsuranceNo: "7912345678" },
    { id: "EMP-002", name: "Tran Thi B", dept: "Marketing", pos: "Marketing Lead", status: "Active", email: "b.tran@company.com", phone: "0909876543", joinDate: "2021-06-01", idCard: "002090987654", taxCode: "8023456789", socialInsuranceNo: "7923456789" },
    { id: "EMP-003", name: "Le Van C", dept: "Sales", pos: "Sales Executive", status: "Onboarding", email: "c.le@company.com", phone: "0912345678", joinDate: "2023-10-01", idCard: "003091234567", taxCode: "8034567890", socialInsuranceNo: "7934567890" },
    { id: "EMP-004", name: "Pham Thi D", dept: "HR", pos: "Recruiter", status: "Maternity", email: "d.pham@company.com", phone: "0987654321", joinDate: "2020-11-20", idCard: "004098765432", taxCode: "8045678901", socialInsuranceNo: "7945678901" },
  ])

  const [contracts] = useState<Contract[]>([
    { id: "CT-001", empName: "Nguyen Van A", type: "Indefinite Term", startDate: "2022-03-15", endDate: "-", status: "Active" },
    { id: "CT-002", empName: "Tran Thi B", type: "Definite Term", startDate: "2021-06-01", endDate: "2023-06-01", status: "Active" },
    { id: "CT-003", empName: "Le Van C", type: "Probation", startDate: "2023-10-01", endDate: "2023-12-01", status: "Active" },
  ])

  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: "",
    dept: "",
    pos: "",
    email: "",
    phone: "",
    idCard: "",
    taxCode: "",
    socialInsuranceNo: "",
    status: "Onboarding",
    joinDate: new Date().toISOString().split('T')[0]
  })

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.dept && newEmployee.pos) {
      if (editingEmployee) {
        setEmployees(employees.map(emp => emp.id === editingEmployee.id ? { ...emp, ...newEmployee } as Employee : emp))
      } else {
        const id = `EMP-${(employees.length + 1).toString().padStart(3, '0')}`
        setEmployees([...employees, { ...newEmployee, id } as Employee])
      }
      setIsAddEmployeeOpen(false)
      setEditingEmployee(null)
      setNewEmployee({
        name: "",
        dept: "",
        pos: "",
        email: "",
        phone: "",
        idCard: "",
        taxCode: "",
        socialInsuranceNo: "",
        status: "Onboarding",
        joinDate: new Date().toISOString().split('T')[0]
      })
    }
  }

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp)
    setNewEmployee(emp)
    setIsAddEmployeeOpen(true)
  }

  const handleDelete = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("hr.tabs.employees")}</h1>
          <p className="text-muted-foreground">{t("hr.core.employeeListDesc")}</p>
        </div>
        <div className="flex gap-2 items-center">
          <Select value={userRole} onValueChange={(v: any) => setUserRole(v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="HR Manager">HR Manager</SelectItem>
              <SelectItem value="Employee">Employee</SelectItem>
            </SelectContent>
          </Select>
          
          {canEdit && (
            <>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Cấu hình
              </Button>
              <Dialog open={isAddEmployeeOpen} onOpenChange={(open) => {
                setIsAddEmployeeOpen(open)
                if (!open) {
                  setEditingEmployee(null)
                  setNewEmployee({
                    name: "", dept: "", pos: "", email: "", phone: "", idCard: "", taxCode: "", socialInsuranceNo: "", status: "Onboarding", joinDate: new Date().toISOString().split('T')[0]
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
                <DialogTitle>{t("hr.core.addEmployee")}</DialogTitle>
                <DialogDescription>
                  {t("hr.core.employeeListDesc")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    {t("hr.core.name")}
                  </Label>
                  <Input
                    id="name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dept" className="text-right">
                    {t("hr.core.department")}
                  </Label>
                  <Select 
                    value={newEmployee.dept} 
                    onValueChange={(value) => setNewEmployee({ ...newEmployee, dept: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={t("hr.core.department")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pos" className="text-right">
                    {t("hr.core.position")}
                  </Label>
                  <Input
                    id="pos"
                    value={newEmployee.pos}
                    onChange={(e) => setNewEmployee({ ...newEmployee, pos: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="idCard" className="text-right">
                    {t("hr.core.idCard")}
                  </Label>
                  <Input
                    id="idCard"
                    value={newEmployee.idCard}
                    onChange={(e) => setNewEmployee({ ...newEmployee, idCard: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="taxCode" className="text-right">
                    {t("hr.core.taxCode")}
                  </Label>
                  <Input
                    id="taxCode"
                    value={newEmployee.taxCode}
                    onChange={(e) => setNewEmployee({ ...newEmployee, taxCode: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddEmployee}>{t("common.save") || "Save"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </>
          )}
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Danh sách nhân sự</TabsTrigger>
          <TabsTrigger value="org">Sơ đồ tổ chức</TabsTrigger>
          <TabsTrigger value="docs">Hồ sơ & Tài liệu</TabsTrigger>
          <TabsTrigger value="career">Lộ trình công danh</TabsTrigger>
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
                  <TableCell>{item.dept}</TableCell>
                  <TableCell>{item.pos}</TableCell>
                  <TableCell>{item.idCard}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "Active" ? "default" : item.status === "Onboarding" ? "secondary" : item.status === "Maternity" ? "outline" : "destructive"}>
                      {item.status === "Active" ? t("hr.core.working") : item.status === "Maternity" ? t("hr.core.maternity") : item.status === "Resigned" ? t("hr.core.resigned") : item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {canEdit ? (
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
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

      <Card>
        <CardHeader>
          <CardTitle>{t("hr.core.contracts")}</CardTitle>
          <CardDescription>Manage employee labor contracts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("hr.core.name")}</TableHead>
                <TableHead>{t("hr.core.contractType")}</TableHead>
                <TableHead>{t("hr.core.startDate")}</TableHead>
                <TableHead>{t("hr.core.endDate")}</TableHead>
                <TableHead>{t("hr.core.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.empName}</TableCell>
                  <TableCell>
                    {item.type === "Probation" ? t("hr.core.probation") : 
                     item.type === "Definite Term" ? t("hr.core.definiteTerm") : 
                     t("hr.core.indefiniteTerm")}
                  </TableCell>
                  <TableCell>{item.startDate}</TableCell>
                  <TableCell>{item.endDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.status}</Badge>
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
            <CardTitle>Sơ đồ tổ chức</CardTitle>
            <CardDescription>Cấu trúc phòng ban và nhân sự công ty</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
            <div className="text-center space-y-2">
              <Network className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="font-medium">Sơ đồ tổ chức đang được cập nhật</h3>
              <p className="text-sm text-muted-foreground">Tính năng này sẽ cho phép kéo thả và quản lý cấu trúc công ty trực quan.</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="docs" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Hồ sơ & Tài liệu</CardTitle>
            <CardDescription>Quản lý hợp đồng, quyết định và các tài liệu nhân sự khác</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên tài liệu</TableHead>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Hợp đồng lao động - Nguyen Van A</TableCell>
                  <TableCell>Nguyen Van A</TableCell>
                  <TableCell><Badge variant="outline">Hợp đồng</Badge></TableCell>
                  <TableCell>2023-01-15</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm"><FileText className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Quyết định bổ nhiệm - Tran Thi B</TableCell>
                  <TableCell>Tran Thi B</TableCell>
                  <TableCell><Badge variant="outline">Quyết định</Badge></TableCell>
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
            <CardTitle>Lộ trình công danh</CardTitle>
            <CardDescription>Theo dõi và phát triển sự nghiệp của nhân viên</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
            <div className="text-center space-y-2">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="font-medium">Lộ trình công danh đang được cập nhật</h3>
              <p className="text-sm text-muted-foreground">Tính năng này giúp thiết lập mục tiêu và theo dõi sự thăng tiến của từng cá nhân.</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    </div>
  )
}
