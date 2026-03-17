import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Download, Plus, Settings, Edit, Trash2, FileText, Percent } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import { useDataStore } from "@/src/store/useDataStore"
import { toast } from "sonner"

interface InsuranceRecord {
  id: string
  empId: string
  insuranceNo: string
  salaryBase: string
  employeeRate: string
  employerRate: string
  status: "Active" | "Pending" | "Closed"
}

export function SocialInsurance() {
  const { t } = useTranslation()
  const { employees } = useDataStore()

  const [userRole, setUserRole] = useState<"Admin" | "HR Manager" | "Employee">("HR Manager")
  const canEdit = userRole === "Admin" || userRole === "HR Manager"

  const [records, setRecords] = useState<InsuranceRecord[]>([
    { id: "INS-001", empId: "EMP-001", insuranceNo: "7912345678", salaryBase: "25,000,000", employeeRate: "2,625,000", employerRate: "5,375,000", status: "Active" },
    { id: "INS-002", empId: "EMP-002", insuranceNo: "7923456789", salaryBase: "30,000,000", employeeRate: "3,150,000", employerRate: "6,450,000", status: "Active" },
    { id: "INS-003", empId: "EMP-003", insuranceNo: "7934567890", salaryBase: "15,000,000", employeeRate: "1,575,000", employerRate: "3,225,000", status: "Pending" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newRecord, setNewRecord] = useState({
    empId: "",
    insuranceNo: "",
    salaryBase: "",
  })

  const getEmployeeName = (empId: string) => {
    const emp = employees.find(e => e.id === empId)
    return emp ? emp.name : empId
  }

  const handleCreateRecord = () => {
    if (!newRecord.empId || !newRecord.insuranceNo || !newRecord.salaryBase) {
      toast.error("Vui lòng điền đầy đủ thông tin")
      return
    }

    const salary = parseInt(newRecord.salaryBase.replace(/,/g, ''))
    if (isNaN(salary)) {
      toast.error("Lương cơ bản không hợp lệ")
      return
    }

    const employeeRate = (salary * 0.105).toLocaleString()
    const employerRate = (salary * 0.215).toLocaleString()

    const record: InsuranceRecord = {
      id: `INS-${(records.length + 1).toString().padStart(3, '0')}`,
      empId: newRecord.empId,
      insuranceNo: newRecord.insuranceNo,
      salaryBase: salary.toLocaleString(),
      employeeRate,
      employerRate,
      status: "Pending"
    }

    setRecords([record, ...records])
    setIsModalOpen(false)
    setNewRecord({ empId: "", insuranceNo: "", salaryBase: "" })
    toast.success("Đã thêm hồ sơ bảo hiểm")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("hr.tabs.socialInsurance")}</h1>
          <p className="text-muted-foreground">{t("hrDashboard.hrSocialInsuranceDesc")}</p>
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
      
      <Tabs defaultValue="records" className="space-y-4">
        <TabsList>
          <TabsTrigger value="records">Hồ sơ bảo hiểm</TabsTrigger>
          <TabsTrigger value="claims">Giải quyết chế độ</TabsTrigger>
          <TabsTrigger value="config">Cấu hình mức đóng</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.socialInsurance.title")}</CardTitle>
              <CardDescription>{t("hr.socialInsurance.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm hồ sơ
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  {t("hr.payroll.exportReport")}
                </Button>
              </div>

              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Thêm hồ sơ bảo hiểm</DialogTitle>
                    <DialogDescription>
                      Điền thông tin để tạo hồ sơ bảo hiểm mới cho nhân viên.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="empId" className="text-right">Nhân viên</Label>
                      <Select value={newRecord.empId} onValueChange={(val) => setNewRecord({...newRecord, empId: val})}>
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
                      <Label htmlFor="insuranceNo" className="text-right">Số sổ BHXH</Label>
                      <Input 
                        id="insuranceNo" 
                        value={newRecord.insuranceNo} 
                        onChange={(e) => setNewRecord({...newRecord, insuranceNo: e.target.value})}
                        className="col-span-3" 
                        placeholder="VD: 7912345678"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="salaryBase" className="text-right">Lương cơ bản</Label>
                      <Input 
                        id="salaryBase" 
                        value={newRecord.salaryBase} 
                        onChange={(e) => setNewRecord({...newRecord, salaryBase: e.target.value})}
                        className="col-span-3" 
                        placeholder="VD: 25000000"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
                    <Button onClick={handleCreateRecord}>Thêm hồ sơ</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("hr.core.name")}</TableHead>
                    <TableHead>{t("hr.socialInsurance.insuranceNo")}</TableHead>
                    <TableHead>{t("hr.socialInsurance.salaryBase")}</TableHead>
                    <TableHead>{t("hr.socialInsurance.employeeRate")}</TableHead>
                    <TableHead>{t("hr.socialInsurance.employerRate")}</TableHead>
                    <TableHead>{t("hr.socialInsurance.status")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{getEmployeeName(item.empId)}</TableCell>
                      <TableCell>{item.insuranceNo}</TableCell>
                      <TableCell>{item.salaryBase} ₫</TableCell>
                      <TableCell className="text-red-600">-{item.employeeRate} ₫</TableCell>
                      <TableCell className="text-blue-600">+{item.employerRate} ₫</TableCell>
                      <TableCell>
                        <Badge variant={item.status === "Active" ? "default" : item.status === "Pending" ? "secondary" : "outline"}>
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
        </TabsContent>

        <TabsContent value="claims" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Giải quyết chế độ (Ốm đau, Thai sản...)</CardTitle>
              <CardDescription>Quản lý hồ sơ và tiến độ giải quyết chế độ bảo hiểm cho nhân viên</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">Quản lý chế độ đang được cập nhật</h3>
                <p className="text-sm text-muted-foreground">Tính năng này sẽ cho phép theo dõi các hồ sơ ốm đau, thai sản, dưỡng sức.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cấu hình mức đóng BHXH, BHYT, BHTN</CardTitle>
              <CardDescription>Thiết lập tỷ lệ đóng bảo hiểm theo quy định mới nhất</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <Percent className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">Cấu hình mức đóng đang được cập nhật</h3>
                <p className="text-sm text-muted-foreground">Tính năng này sẽ cho phép tùy chỉnh tỷ lệ đóng BHXH cho DN và NLĐ.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
