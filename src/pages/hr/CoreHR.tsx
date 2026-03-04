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
import { Search, Filter, Plus, Users, CheckCircle, Briefcase } from "lucide-react"

interface Employee {
  id: string
  name: string
  dept: string
  pos: string
  status: "Active" | "Onboarding" | "Offboarding" | "Inactive"
  email: string
  phone: string
  joinDate: string
}

interface Contract {
  id: string
  empName: string
  type: string
  startDate: string
  endDate: string
  status: "Active" | "Expired"
}

export function CoreHR() {
  const { t } = useTranslation()

  const [employees, setEmployees] = useState<Employee[]>([
    { id: "EMP-001", name: "Nguyen Van A", dept: "Engineering", pos: "Senior Dev", status: "Active", email: "a.nguyen@company.com", phone: "0901234567", joinDate: "2022-03-15" },
    { id: "EMP-002", name: "Tran Thi B", dept: "Marketing", pos: "Marketing Lead", status: "Active", email: "b.tran@company.com", phone: "0909876543", joinDate: "2021-06-01" },
    { id: "EMP-003", name: "Le Van C", dept: "Sales", pos: "Sales Executive", status: "Onboarding", email: "c.le@company.com", phone: "0912345678", joinDate: "2023-10-01" },
    { id: "EMP-004", name: "Pham Thi D", dept: "HR", pos: "Recruiter", status: "Offboarding", email: "d.pham@company.com", phone: "0987654321", joinDate: "2020-11-20" },
  ])

  const [contracts] = useState<Contract[]>([
    { id: "CT-001", empName: "Nguyen Van A", type: "Indefinite", startDate: "2022-03-15", endDate: "-", status: "Active" },
    { id: "CT-002", empName: "Tran Thi B", type: "2 Years", startDate: "2021-06-01", endDate: "2023-06-01", status: "Active" },
  ])

  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: "",
    dept: "",
    pos: "",
    email: "",
    phone: "",
    status: "Onboarding",
    joinDate: new Date().toISOString().split('T')[0]
  })

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.dept && newEmployee.pos) {
      const id = `EMP-${(employees.length + 1).toString().padStart(3, '0')}`
      setEmployees([...employees, { ...newEmployee, id } as Employee])
      setIsAddEmployeeOpen(false)
      setNewEmployee({
        name: "",
        dept: "",
        pos: "",
        email: "",
        phone: "",
        status: "Onboarding",
        joinDate: new Date().toISOString().split('T')[0]
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("hr.tabs.core")}</h1>
          <p className="text-muted-foreground">{t("hr.core.employeeListDesc")}</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
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
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddEmployee}>{t("common.save") || "Save"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
                  <TableCell>
                    <Badge variant={item.status === "Active" ? "default" : item.status === "Onboarding" ? "secondary" : "destructive"}>
                      {item.status}
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
                  <TableCell>{item.type}</TableCell>
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
    </div>
  )
}
