import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Button } from "@/src/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Download, Plus, Settings, Edit, Trash2, Users, FileCheck } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import { useDataStore } from "@/src/store/useDataStore"
import { toast } from "sonner"

interface PITRecord {
  id: string
  empId: string
  taxCode: string
  dependents: number
  totalIncome: string
  taxableIncome: string
  taxAmount: string
}

export function PIT() {
  const { t } = useTranslation()
  const { employees } = useDataStore()

  const [userRole, setUserRole] = useState<"Admin" | "HR Manager" | "Employee">("HR Manager")
  const canEdit = userRole === "Admin" || userRole === "HR Manager"

  const [records, setRecords] = useState<PITRecord[]>([
    { id: "PIT-001", empId: "EMP-001", taxCode: "8012345678", dependents: 1, totalIncome: "25,000,000", taxableIncome: "9,100,000", taxAmount: "1,500,000" },
    { id: "PIT-002", empId: "EMP-002", taxCode: "8023456789", dependents: 2, totalIncome: "30,000,000", taxableIncome: "11,200,000", taxAmount: "2,500,000" },
    { id: "PIT-003", empId: "EMP-003", taxCode: "8034567890", dependents: 0, totalIncome: "15,000,000", taxableIncome: "4,000,000", taxAmount: "200,000" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newRecord, setNewRecord] = useState({
    empId: "",
    taxCode: "",
    dependents: "0",
    totalIncome: "",
  })

  const getEmployeeName = (empId: string) => {
    const emp = employees.find(e => e.id === empId)
    return emp ? emp.name : empId
  }

  const handleCreateRecord = () => {
    if (!newRecord.empId || !newRecord.taxCode || !newRecord.totalIncome) {
      toast.error(t("hr.pit.toasts.fillInfo"))
      return
    }

    const income = parseInt(newRecord.totalIncome.replace(/,/g, ''))
    if (isNaN(income)) {
      toast.error(t("hr.pit.toasts.invalidIncome"))
      return
    }

    const dependentsCount = parseInt(newRecord.dependents) || 0
    // Simplified tax calculation for demo
    const deduction = 11000000 + (dependentsCount * 4400000)
    let taxable = income - deduction
    if (taxable < 0) taxable = 0
    
    // Simplified tax amount (10% flat rate for demo)
    const tax = taxable * 0.1

    const record: PITRecord = {
      id: `PIT-${(records.length + 1).toString().padStart(3, '0')}`,
      empId: newRecord.empId,
      taxCode: newRecord.taxCode,
      dependents: dependentsCount,
      totalIncome: income.toLocaleString(),
      taxableIncome: taxable.toLocaleString(),
      taxAmount: tax.toLocaleString()
    }

    setRecords([record, ...records])
    setIsModalOpen(false)
    setNewRecord({ empId: "", taxCode: "", dependents: "0", totalIncome: "" })
    toast.success(t("hr.pit.toasts.addSuccess"))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("hr.tabs.pit")}</h1>
          <p className="text-muted-foreground">{t("hrDashboard.hrPitDesc")}</p>
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
      
      <Tabs defaultValue="tax" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tax">{t("hr.pit.tabs.tax")}</TabsTrigger>
          <TabsTrigger value="dependents">{t("hr.pit.tabs.dependents")}</TabsTrigger>
          <TabsTrigger value="finalization">{t("hr.pit.tabs.finalization")}</TabsTrigger>
        </TabsList>

        <TabsContent value="tax" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.pit.title")}</CardTitle>
              <CardDescription>{t("hr.pit.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("hr.pit.records.add")}
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  {t("hr.payroll.exportReport")}
                </Button>
              </div>

              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{t("hr.pit.records.addTitle")}</DialogTitle>
                    <DialogDescription>
                      {t("hr.pit.records.addDesc")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="empId" className="text-right">{t("hr.pit.records.employee")}</Label>
                      <Select value={newRecord.empId} onValueChange={(val) => setNewRecord({...newRecord, empId: val})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder={t("hr.pit.records.selectEmployee")} />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map(emp => (
                            <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="taxCode" className="text-right">{t("hr.pit.records.taxCode")}</Label>
                      <Input 
                        id="taxCode" 
                        value={newRecord.taxCode} 
                        onChange={(e) => setNewRecord({...newRecord, taxCode: e.target.value})}
                        className="col-span-3" 
                        placeholder={t("hr.pit.placeholders.taxCode")}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="dependents" className="text-right">{t("hr.pit.records.dependents")}</Label>
                      <Input 
                        id="dependents" 
                        type="number"
                        value={newRecord.dependents} 
                        onChange={(e) => setNewRecord({...newRecord, dependents: e.target.value})}
                        className="col-span-3" 
                        placeholder={t("hr.pit.placeholders.dependents")}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="totalIncome" className="text-right">{t("hr.pit.records.totalIncome")}</Label>
                      <Input 
                        id="totalIncome" 
                        value={newRecord.totalIncome} 
                        onChange={(e) => setNewRecord({...newRecord, totalIncome: e.target.value})}
                        className="col-span-3" 
                        placeholder={t("hr.pit.placeholders.totalIncome")}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>{t("hr.pit.records.cancel")}</Button>
                    <Button onClick={handleCreateRecord}>{t("hr.pit.records.save")}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("hr.core.name")}</TableHead>
                    <TableHead>{t("hr.pit.taxCode")}</TableHead>
                    <TableHead>{t("hr.pit.dependents")}</TableHead>
                    <TableHead>{t("hr.pit.totalIncome")}</TableHead>
                    <TableHead>{t("hr.pit.taxableIncome")}</TableHead>
                    <TableHead>{t("hr.pit.taxAmount")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{getEmployeeName(item.empId)}</TableCell>
                      <TableCell>{item.taxCode}</TableCell>
                      <TableCell>{item.dependents}</TableCell>
                      <TableCell>{item.totalIncome} ₫</TableCell>
                      <TableCell>{item.taxableIncome} ₫</TableCell>
                      <TableCell className="text-red-600 font-bold">{item.taxAmount} ₫</TableCell>
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

        <TabsContent value="dependents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.pit.dependentsTab.title")}</CardTitle>
              <CardDescription>{t("hr.pit.dependentsTab.description")}</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <Users className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">{t("hr.pit.dependentsTab.updating")}</h3>
                <p className="text-sm text-muted-foreground">{t("hr.pit.dependentsTab.featureDesc")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finalization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.pit.finalizationTab.title")}</CardTitle>
              <CardDescription>{t("hr.pit.finalizationTab.description")}</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <FileCheck className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">{t("hr.pit.finalizationTab.updating")}</h3>
                <p className="text-sm text-muted-foreground">{t("hr.pit.finalizationTab.featureDesc")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
