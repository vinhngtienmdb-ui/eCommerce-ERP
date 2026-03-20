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
      toast.error(t("hr.core.toasts.requiredFields"))
      return
    }

    const salary = parseInt(newRecord.salaryBase.replace(/,/g, ''))
    if (isNaN(salary)) {
      toast.error(t("hr.socialInsurance.records.invalidSalary"))
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
    toast.success(t("hr.socialInsurance.records.addSuccess"))
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
              <SelectValue placeholder={t("hr.core.role")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">{t("hr.core.admin")}</SelectItem>
              <SelectItem value="HR Manager">{t("hr.core.hrManager")}</SelectItem>
              <SelectItem value="Employee">{t("hr.core.employee")}</SelectItem>
            </SelectContent>
          </Select>
          
          {canEdit && (
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              {t("hr.core.config")}
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="records" className="space-y-4">
        <TabsList>
          <TabsTrigger value="records">{t("hr.socialInsurance.tabs.records")}</TabsTrigger>
          <TabsTrigger value="claims">{t("hr.socialInsurance.tabs.claims")}</TabsTrigger>
          <TabsTrigger value="config">{t("hr.socialInsurance.tabs.config")}</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.socialInsurance.records.title")}</CardTitle>
              <CardDescription>{t("hr.socialInsurance.records.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("hr.socialInsurance.records.add")}
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  {t("hr.payroll.exportReport")}
                </Button>
              </div>

              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{t("hr.socialInsurance.records.addTitle")}</DialogTitle>
                    <DialogDescription>
                      {t("hr.socialInsurance.records.addDesc")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="empId" className="text-right">{t("hr.socialInsurance.records.employee")}</Label>
                      <Select value={newRecord.empId} onValueChange={(val) => setNewRecord({...newRecord, empId: val})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder={t("hr.socialInsurance.records.selectEmployee")} />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map(emp => (
                            <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="insuranceNo" className="text-right">{t("hr.socialInsurance.records.insuranceNo")}</Label>
                      <Input 
                        id="insuranceNo" 
                        value={newRecord.insuranceNo} 
                        onChange={(e) => setNewRecord({...newRecord, insuranceNo: e.target.value})}
                        className="col-span-3" 
                        placeholder={t("hr.socialInsurance.placeholders.insuranceNo")}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="salaryBase" className="text-right">{t("hr.socialInsurance.records.salaryBase")}</Label>
                      <Input 
                        id="salaryBase" 
                        value={newRecord.salaryBase} 
                        onChange={(e) => setNewRecord({...newRecord, salaryBase: e.target.value})}
                        className="col-span-3" 
                        placeholder={t("hr.socialInsurance.placeholders.salaryBase")}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>{t("hr.socialInsurance.records.cancel")}</Button>
                    <Button onClick={handleCreateRecord}>{t("hr.socialInsurance.records.save")}</Button>
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
                          {item.status === "Active" ? t("hr.socialInsurance.insuranceStatus.active") : 
                           item.status === "Pending" ? t("hr.socialInsurance.insuranceStatus.pending") : 
                           t("hr.socialInsurance.insuranceStatus.closed")}
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
              <CardTitle>{t("hr.socialInsurance.claimsTab.title")}</CardTitle>
              <CardDescription>{t("hr.socialInsurance.claimsTab.description")}</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">{t("hr.socialInsurance.claimsTab.updating")}</h3>
                <p className="text-sm text-muted-foreground">{t("hr.socialInsurance.claimsTab.featureDesc")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.socialInsurance.configTab.title")}</CardTitle>
              <CardDescription>{t("hr.socialInsurance.configTab.description")}</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <Percent className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">{t("hr.socialInsurance.configTab.updating")}</h3>
                <p className="text-sm text-muted-foreground">{t("hr.socialInsurance.configTab.featureDesc")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
