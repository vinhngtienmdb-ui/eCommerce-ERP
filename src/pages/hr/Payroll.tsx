import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Download, FileText, Settings, Edit, Trash2, Calculator, DollarSign, PieChart, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import { useDataStore } from "@/src/store/useDataStore"
import { toast } from "sonner"

interface PayrollPeriod {
  id: string
  period: string
  count: number
  amount: string
  status: "Draft" | "Completed" | "Processing"
}

interface SalaryConfig {
  id: string
  empId: string
  basic: string
  allowance: string
  deduction: string
  tax: string
  net: string
}

export function Payroll() {
  const { t } = useTranslation()
  const { employees } = useDataStore()

  const [userRole, setUserRole] = useState<"Admin" | "HR Manager" | "Employee">("HR Manager")
  const canEdit = userRole === "Admin" || userRole === "HR Manager"

  const [payrolls, setPayrolls] = useState<PayrollPeriod[]>([
    { id: "PR-2023-10", period: "October 2023", count: employees.length, amount: "15,400,000,000 ₫", status: "Completed" },
    { id: "PR-2023-11", period: "November 2023", count: employees.length, amount: "15,600,000,000 ₫", status: "Draft" },
  ])

  const [salaries, setSalaries] = useState<SalaryConfig[]>([
    { id: "SAL-001", empId: employees[0]?.id || "EMP-001", basic: "25,000,000", allowance: "2,000,000", deduction: "2,625,000", tax: "1,500,000", net: "22,875,000" },
    { id: "SAL-002", empId: employees[1]?.id || "EMP-002", basic: "30,000,000", allowance: "3,000,000", deduction: "3,150,000", tax: "2,500,000", net: "27,350,000" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newSalary, setNewSalary] = useState({
    empId: "",
    basic: "",
    allowance: "0",
  })

  const getEmployeeName = (empId: string) => {
    const emp = employees.find(e => e.id === empId)
    return emp ? emp.name : empId
  }

  const handleCreateSalary = () => {
    if (!newSalary.empId || !newSalary.basic) {
      toast.error("Vui lòng điền đầy đủ thông tin")
      return
    }

    const basic = parseInt(newSalary.basic.replace(/,/g, ''))
    const allowance = parseInt(newSalary.allowance.replace(/,/g, '')) || 0

    if (isNaN(basic)) {
      toast.error("Lương cơ bản không hợp lệ")
      return
    }

    // Simplified calculations for demo
    const deduction = basic * 0.105
    const taxable = (basic + allowance) - deduction - 11000000
    const tax = taxable > 0 ? taxable * 0.1 : 0
    const net = (basic + allowance) - deduction - tax

    const record: SalaryConfig = {
      id: `SAL-${(salaries.length + 1).toString().padStart(3, '0')}`,
      empId: newSalary.empId,
      basic: basic.toLocaleString(),
      allowance: allowance.toLocaleString(),
      deduction: deduction.toLocaleString(),
      tax: tax.toLocaleString(),
      net: net.toLocaleString()
    }

    setSalaries([record, ...salaries])
    setIsModalOpen(false)
    setNewSalary({ empId: "", basic: "", allowance: "0" })
    toast.success("Đã thêm cấu trúc lương")
  }

  const handleRunPayroll = (id: string) => {
    setPayrolls(payrolls.map(p => 
      p.id === id ? { ...p, status: "Processing" } : p
    ))
    // Simulate processing
    setTimeout(() => {
      setPayrolls(payrolls.map(p => 
        p.id === id ? { ...p, status: "Completed" } : p
      ))
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("hr.tabs.payroll")}</h1>
          <p className="text-muted-foreground">{t("hr.payroll.description")}</p>
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
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Cấu hình
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Kỳ lương</TabsTrigger>
          <TabsTrigger value="salary">Cấu trúc lương</TabsTrigger>
          <TabsTrigger value="payslips">Phiếu lương</TabsTrigger>
          <TabsTrigger value="config">Cấu hình & Công thức</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng quỹ lương tháng này</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15,600,000,000 ₫</div>
                <p className="text-xs text-muted-foreground">+1.2% so với tháng trước</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Thuế TNCN dự kiến</CardTitle>
                <PieChart className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,200,000,000 ₫</div>
                <p className="text-xs text-muted-foreground">Đã khấu trừ tự động</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bảo hiểm xã hội</CardTitle>
                <FileText className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">850,000,000 ₫</div>
                <p className="text-xs text-muted-foreground">Công ty đóng 21.5%</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("hr.payroll.title")}</CardTitle>
              <CardDescription>{t("hr.payroll.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="space-x-2">
                  <Button>{t("hr.payroll.runPayroll")}</Button>
                  <Button variant="outline">{t("hr.payroll.configFormulas")}</Button>
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  {t("hr.payroll.exportReport")}
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("hr.payroll.period")}</TableHead>
                    <TableHead>{t("hr.payroll.totalEmployees")}</TableHead>
                    <TableHead>{t("hr.payroll.totalAmount")}</TableHead>
                    <TableHead>{t("hr.payroll.status")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrolls.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.period}</TableCell>
                      <TableCell>{item.count}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === "Completed" ? "default" : item.status === "Processing" ? "outline" : "secondary"}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.status === "Draft" ? (
                          <Button size="sm" onClick={() => handleRunPayroll(item.id)}>
                            {t("hr.payroll.runPayroll")}
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            {t("hr.payroll.payslips")}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.payroll.salaryStructure")}</CardTitle>
              <CardDescription>Employee salary configuration.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm cấu trúc lương
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  {t("hr.payroll.exportReport")}
                </Button>
              </div>

              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Thêm cấu trúc lương</DialogTitle>
                    <DialogDescription>
                      Thiết lập cấu trúc lương cơ bản và phụ cấp cho nhân viên.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="empId" className="text-right">Nhân viên</Label>
                      <Select value={newSalary.empId} onValueChange={(val) => setNewSalary({...newSalary, empId: val})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Chọn nhân viên" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map(emp => (
                            <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="basic" className="text-right">Lương cơ bản</Label>
                      <Input 
                        id="basic" 
                        value={newSalary.basic} 
                        onChange={(e) => setNewSalary({...newSalary, basic: e.target.value})}
                        className="col-span-3" 
                        placeholder="VD: 25000000"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="allowance" className="text-right">Phụ cấp</Label>
                      <Input 
                        id="allowance" 
                        value={newSalary.allowance} 
                        onChange={(e) => setNewSalary({...newSalary, allowance: e.target.value})}
                        className="col-span-3" 
                        placeholder="VD: 2000000"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
                    <Button onClick={handleCreateSalary}>Lưu cấu trúc</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("hr.core.name")}</TableHead>
                    <TableHead>{t("hr.payroll.basicSalary")}</TableHead>
                    <TableHead>{t("hr.payroll.allowances")}</TableHead>
                    <TableHead>{t("hr.payroll.deductions")}</TableHead>
                    <TableHead>{t("hr.payroll.tax")}</TableHead>
                    <TableHead>{t("hr.payroll.netSalary")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salaries.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{getEmployeeName(item.empId)}</TableCell>
                      <TableCell>{item.basic} ₫</TableCell>
                      <TableCell className="text-green-600">+{item.allowance} ₫</TableCell>
                      <TableCell className="text-red-600">-{item.deduction} ₫</TableCell>
                      <TableCell className="text-red-600">-{item.tax} ₫</TableCell>
                      <TableCell className="font-bold">{item.net} ₫</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payslips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phiếu lương điện tử</CardTitle>
              <CardDescription>Quản lý và gửi phiếu lương cho nhân viên</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">Phiếu lương đang được cập nhật</h3>
                <p className="text-sm text-muted-foreground">Tính năng này sẽ cho phép xem trước và gửi phiếu lương hàng loạt qua email.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cấu hình & Công thức lương</CardTitle>
              <CardDescription>Thiết lập các khoản phụ cấp, khấu trừ và công thức tính thuế</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <Calculator className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">Cấu hình lương đang được cập nhật</h3>
                <p className="text-sm text-muted-foreground">Tính năng này sẽ cho phép tùy chỉnh công thức lương động (Excel-like formulas).</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
