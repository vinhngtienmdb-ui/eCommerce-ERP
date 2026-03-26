import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Download, FileText, Settings, Edit, Trash2, Calculator, DollarSign, PieChart, Plus, ShieldCheck, UserCheck, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import { Checkbox } from "@/src/components/ui/checkbox"
import { Switch } from "@/src/components/ui/switch"
import { useDataStore, AllowanceType, PITConfig, InsuranceParticipant, PayrollRecord, InsuranceRateConfig } from "@/src/store/useDataStore"
import { toast } from "sonner"
import { format } from "date-fns"

export function Payroll() {
  const { t } = useTranslation()
  const { 
    employees, 
    salaryScales,
    allowanceTypes, 
    insuranceRateConfigs,
    pitConfig, 
    insuranceParticipants, 
    payrollRecords,
    addAllowanceType,
    updateAllowanceType,
    deleteAllowanceType,
    addInsuranceRateConfig,
    updateInsuranceRateConfig,
    deleteInsuranceRateConfig,
    updatePITConfig,
    updateInsuranceParticipant,
    addPayrollRecord
  } = useDataStore()

  const [userRole, setUserRole] = useState<"Admin" | "HR Manager" | "Employee">("HR Manager")
  const canEdit = userRole === "Admin" || userRole === "HR Manager"

  const [activeTab, setActiveTab] = useState("periods")
  const [isAllowanceModalOpen, setIsAllowanceModalOpen] = useState(false)
  const [editingAllowance, setEditingAllowance] = useState<AllowanceType | null>(null)
  const [newAllowance, setNewAllowance] = useState<Partial<AllowanceType>>({
    name: "",
    isTaxable: true,
    taxLimit: undefined,
    isInsuranceSubject: true,
    calculationBasis: "Monthly",
    isGradeBased: false,
    gradeAmounts: {},
    amount: 0,
    description: ""
  })

  const [isInsuranceRateModalOpen, setIsInsuranceRateModalOpen] = useState(false)
  const [editingInsuranceRate, setEditingInsuranceRate] = useState<InsuranceRateConfig | null>(null)
  const [newInsuranceRate, setNewInsuranceRate] = useState<Partial<InsuranceRateConfig>>({
    effectiveDate: format(new Date(), "yyyy-MM-dd"),
    employeeRates: { bhxh: 8, bhyt: 1.5, bhtn: 1 },
    employerRates: { bhxh: 17, bhyt: 3, bhtn: 1, bhld_bnn: 0.5 }
  })

  const [selectedPeriod, setSelectedPeriod] = useState<string>(format(new Date(), "yyyy-MM"))
  const [activeReport, setActiveReport] = useState<"payroll" | "insurance" | "pit">("payroll")

  // Helper to get employee name
  const getEmployeeName = (empId: string) => {
    const emp = employees.find(e => e.id === empId)
    return emp ? emp.name : empId
  }

  // Allowance Management
  const handleSaveAllowance = () => {
    if (!newAllowance.name) {
      toast.error(t("hr.payroll.toasts.fillInfo"))
      return
    }

    if (editingAllowance) {
      updateAllowanceType(editingAllowance.id, newAllowance as AllowanceType)
      toast.success(t("common.saveSuccess"))
    } else {
      addAllowanceType({
        ...newAllowance,
        id: `ALW-${Date.now()}`
      } as AllowanceType)
      toast.success(t("common.createSuccess"))
    }
    setIsAllowanceModalOpen(false)
    setEditingAllowance(null)
    setNewAllowance({ 
      name: "", 
      isTaxable: true, 
      taxLimit: undefined,
      isInsuranceSubject: true, 
      calculationBasis: "Monthly",
      isGradeBased: false,
      gradeAmounts: {},
      amount: 0, 
      description: "" 
    })
  }

  // Insurance Rate Management
  const handleSaveInsuranceRate = () => {
    if (!newInsuranceRate.effectiveDate) {
      toast.error(t("hr.payroll.toasts.fillInfo"))
      return
    }

    if (editingInsuranceRate) {
      updateInsuranceRateConfig(editingInsuranceRate.id, newInsuranceRate as InsuranceRateConfig)
      toast.success(t("common.saveSuccess"))
    } else {
      addInsuranceRateConfig({
        ...newInsuranceRate,
        id: `IRC-${Date.now()}`
      } as InsuranceRateConfig)
      toast.success(t("common.createSuccess"))
    }
    setIsInsuranceRateModalOpen(false)
    setEditingInsuranceRate(null)
  }

  // PIT Config Management
  const handleUpdatePIT = (field: keyof PITConfig, value: string) => {
    const numValue = parseInt(value.replace(/,/g, "")) || 0
    updatePITConfig({ ...pitConfig, [field]: numValue })
  }

  // Insurance Participant Management
  const toggleInsurance = (empId: string) => {
    const current = insuranceParticipants.find(p => p.employeeId === empId)
    updateInsuranceParticipant(empId, !current?.isParticipant)
  }

  // Mock Payroll Calculation
  const calculatePayroll = () => {
    toast.info(t("hr.payroll.runPayroll") + "...")
    
    // Get latest insurance rates
    const sortedRates = [...insuranceRateConfigs].sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate))
    const currentRates = sortedRates[0] || {
      employeeRates: { bhxh: 8, bhyt: 1.5, bhtn: 1 },
      employerRates: { bhxh: 17, bhyt: 3, bhtn: 1, bhld_bnn: 0.5 }
    }

    employees.forEach(emp => {
      const scale = salaryScales.find(s => s.grade === emp.grade)
      const basicSalary = scale ? scale.baseSalary : 0
      
      // Calculate allowances
      const allowances = allowanceTypes.reduce((sum, alw) => {
        let alwAmount = 0
        if (alw.isGradeBased) {
          // Find employee grade from salary scale or employee record
          alwAmount = alw.gradeAmounts?.[emp.grade || ""] || 0
        } else {
          alwAmount = alw.amount || 0
        }
        
        // If daily, multiply by work days (mock 22 days)
        if (alw.calculationBasis === "Daily") {
          alwAmount = (alwAmount / 26) * 22 // Mock 22/26 days
        }
        
        return sum + alwAmount
      }, 0)

      // Calculate Insurance Deduction
      const isInsured = insuranceParticipants.find(p => p.employeeId === emp.id)?.isParticipant
      
      const insuranceSubjectAllowances = allowanceTypes.reduce((sum, alw) => {
        if (!alw.isInsuranceSubject) return sum
        let alwAmount = alw.isGradeBased ? (alw.gradeAmounts?.[emp.grade || ""] || 0) : (alw.amount || 0)
        if (alw.calculationBasis === "Daily") {
          alwAmount = (alwAmount / 26) * 22 // Mock 22/26 days
        }
        return sum + alwAmount
      }, 0)

      const empInsRate = isInsured ? (currentRates.employeeRates.bhxh + currentRates.employeeRates.bhyt + currentRates.employeeRates.bhtn) / 100 : 0
      const insuranceDeduction = (basicSalary + insuranceSubjectAllowances) * empInsRate
      
      // Calculate taxable income
      const taxableAllowances = allowanceTypes.reduce((sum, alw) => {
        if (!alw.isTaxable) return sum
        let alwAmount = alw.isGradeBased ? (alw.gradeAmounts?.[emp.grade || ""] || 0) : (alw.amount || 0)
        
        // If daily, multiply by work days (mock 22 days)
        if (alw.calculationBasis === "Daily") {
          alwAmount = (alwAmount / 26) * 22 // Mock 22/26 days
        }

        if (alw.taxLimit && alwAmount > alw.taxLimit) {
          return sum + (alwAmount - alw.taxLimit) // Tax the amount exceeding the limit
        } else if (alw.taxLimit && alwAmount <= alw.taxLimit) {
          return sum // Fully exempt
        }
        return sum + alwAmount
      }, 0)

      const taxableIncome = (basicSalary + taxableAllowances) - insuranceDeduction - pitConfig.personalDeduction - (pitConfig.dependentDeduction * (emp.dependents || 0))
      const pit = taxableIncome > 0 ? taxableIncome * 0.1 : 0 // Simple 10% for demo
      
      const record: PayrollRecord = {
        id: `PR-${emp.id}-${selectedPeriod}`,
        employeeId: emp.id,
        period: selectedPeriod,
        basicSalary,
        allowances,
        deductions: insuranceDeduction,
        tax: pit,
        netSalary: (basicSalary + allowances) - insuranceDeduction - pit,
        status: "Draft",
        createdAt: new Date().toISOString()
      }
      addPayrollRecord(record)
    })
    toast.success(t("hr.payroll.toasts.addSuccess"))
  }

  // Report Data
  const currentPeriodRecords = useMemo(() => {
    return payrollRecords.filter(r => r.period === selectedPeriod)
  }, [payrollRecords, selectedPeriod])

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
              <SelectValue placeholder={t("hr.core.role")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">{t("hr.core.admin")}</SelectItem>
              <SelectItem value="HR Manager">{t("hr.core.hrManager")}</SelectItem>
              <SelectItem value="Employee">{t("hr.core.employee")}</SelectItem>
            </SelectContent>
          </Select>
          
          <Input 
            type="month" 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-[180px]"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto">
          <TabsTrigger value="periods">{t("hr.payroll.tabs.periods")}</TabsTrigger>
          <TabsTrigger value="salary">{t("hr.payroll.tabs.salaryStructure")}</TabsTrigger>
          <TabsTrigger value="allowances">{t("hr.payroll.tabs.allowances")}</TabsTrigger>
          <TabsTrigger value="pitInsurance">{t("hr.payroll.tabs.pitInsurance")}</TabsTrigger>
          <TabsTrigger value="reports">{t("hr.payroll.tabs.reports")}</TabsTrigger>
          <TabsTrigger value="payslips">{t("hr.payroll.tabs.payslips")}</TabsTrigger>
        </TabsList>

        {/* Periods Tab */}
        <TabsContent value="periods" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("hr.payroll.overview.totalFund", "Tổng quỹ lương tháng này")}</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentPeriodRecords.reduce((sum, r) => sum + r.netSalary, 0).toLocaleString()} ₫
                  </div>
                  <p className="text-xs text-muted-foreground">{t("hr.payroll.overview.vsLastMonth", { value: "+1.2%" })}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("hr.payroll.overview.estimatedPit", "Thuế TNCN dự kiến")}</CardTitle>
                  <PieChart className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentPeriodRecords.reduce((sum, r) => sum + r.tax, 0).toLocaleString()} ₫
                  </div>
                  <p className="text-xs text-muted-foreground">{t("hr.payroll.overview.autoDeducted", "Đã khấu trừ tự động")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("hr.payroll.overview.socialInsurance", "Bảo hiểm xã hội")}</CardTitle>
                  <ShieldCheck className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentPeriodRecords.reduce((sum, r) => sum + r.deductions, 0).toLocaleString()} ₫
                  </div>
                  <p className="text-xs text-muted-foreground">{t("hr.payroll.overview.companyContribution", "Công ty đóng 21.5%")}</p>
                </CardContent>
              </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("hr.payroll.period")} {selectedPeriod}</CardTitle>
                <CardDescription>{t("hr.payroll.description")}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={calculatePayroll}>
                  <Calculator className="mr-2 h-4 w-4" />
                  {t("hr.payroll.runPayroll")}
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  {t("hr.payroll.exportReport")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("hr.core.name", "Họ tên")}</TableHead>
                    <TableHead>{t("hr.payroll.basicSalary", "Lương cơ bản")}</TableHead>
                    <TableHead>{t("hr.payroll.allowances", "Phụ cấp")}</TableHead>
                    <TableHead>{t("hr.payroll.deductions", "Khấu trừ")}</TableHead>
                    <TableHead>{t("hr.payroll.tax", "Thuế")}</TableHead>
                    <TableHead>{t("hr.payroll.netSalary", "Lương thực nhận")}</TableHead>
                    <TableHead>{t("hr.payroll.status", "Trạng thái")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPeriodRecords.length > 0 ? (
                    currentPeriodRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{getEmployeeName(record.employeeId)}</TableCell>
                        <TableCell>{record.basicSalary.toLocaleString()} ₫</TableCell>
                        <TableCell className="text-green-600">+{record.allowances.toLocaleString()} ₫</TableCell>
                        <TableCell className="text-red-600">-{record.deductions.toLocaleString()} ₫</TableCell>
                        <TableCell className="text-red-600">-{record.tax.toLocaleString()} ₫</TableCell>
                        <TableCell className="font-bold">{record.netSalary.toLocaleString()} ₫</TableCell>
                        <TableCell>
                          <Badge variant={record.status === "Paid" ? "default" : "secondary"}>
                            {t(`hr.payroll.payrollStatus.${record.status.toLowerCase()}`, record.status)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {t("hr.payroll.reports.noData", "Không có dữ liệu cho kỳ lương này")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Allowances Tab */}
        <TabsContent value="allowances" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("hr.payroll.allowanceConfig.title")}</CardTitle>
                <CardDescription>{t("hr.payroll.allowanceConfig.description")}</CardDescription>
              </div>
              {canEdit && (
                <Button onClick={() => {
                  setEditingAllowance(null)
                  setNewAllowance({ 
                    name: "", 
                    isTaxable: true, 
                    taxLimit: undefined,
                    isInsuranceSubject: true, 
                    calculationBasis: "Monthly",
                    isGradeBased: false,
                    gradeAmounts: {},
                    amount: 0, 
                    description: "" 
                  })
                  setIsAllowanceModalOpen(true)
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("hr.payroll.allowanceConfig.add")}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("hr.payroll.allowanceConfig.name", "Tên phụ cấp")}</TableHead>
                    <TableHead>{t("hr.payroll.allowanceConfig.amount", "Mức tiền mặc định")}</TableHead>
                    <TableHead>{t("hr.payroll.allowanceConfig.isTaxable", "Chịu thuế TNCN")}</TableHead>
                    <TableHead>{t("hr.payroll.allowanceConfig.isInsuranceSubject", "Đóng BHXH")}</TableHead>
                    <TableHead>{t("hr.payroll.allowanceConfig.description", "Mô tả")}</TableHead>
                    {canEdit && <TableHead className="text-right">{t("common.actions", "Thao tác")}</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allowanceTypes.map((alw) => (
                    <TableRow key={alw.id}>
                      <TableCell className="font-medium">{alw.name}</TableCell>
                      <TableCell>{alw.amount?.toLocaleString()} ₫</TableCell>
                      <TableCell>
                        <Badge variant={alw.isTaxable ? "default" : "secondary"}>
                          {alw.isTaxable ? t("hr.core.yes", "Có") : t("hr.core.no", "Không")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={alw.isInsuranceSubject ? "default" : "secondary"}>
                          {alw.isInsuranceSubject ? t("hr.core.yes", "Có") : t("hr.core.no", "Không")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{alw.description}</TableCell>
                      {canEdit && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => {
                              setEditingAllowance(alw)
                              setNewAllowance(alw)
                              setIsAllowanceModalOpen(true)
                            }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteAllowanceType(alw.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog open={isAllowanceModalOpen} onOpenChange={setIsAllowanceModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingAllowance ? t("common.edit") : t("hr.payroll.allowanceConfig.add")}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>{t("hr.payroll.allowanceConfig.name", "Tên phụ cấp")}</Label>
                  <Input 
                    value={newAllowance.name} 
                    onChange={(e) => setNewAllowance({...newAllowance, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t("hr.payroll.allowanceConfig.amount", "Mức tiền mặc định")}</Label>
                  <Input 
                    type="number"
                    value={newAllowance.amount} 
                    onChange={(e) => setNewAllowance({...newAllowance, amount: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between space-x-2 border p-2 rounded-md">
                    <Label className="cursor-pointer" htmlFor="isTaxable">{t("hr.payroll.allowanceConfig.isTaxable", "Chịu thuế TNCN")}</Label>
                    <Switch 
                      id="isTaxable"
                      checked={newAllowance.isTaxable} 
                      onCheckedChange={(checked) => setNewAllowance({...newAllowance, isTaxable: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2 border p-2 rounded-md">
                    <Label className="cursor-pointer" htmlFor="isInsuranceSubject">{t("hr.payroll.allowanceConfig.isInsuranceSubject", "Đóng BHXH")}</Label>
                    <Switch 
                      id="isInsuranceSubject"
                      checked={newAllowance.isInsuranceSubject} 
                      onCheckedChange={(checked) => setNewAllowance({...newAllowance, isInsuranceSubject: checked})}
                    />
                  </div>
                </div>

                {newAllowance.isTaxable && (
                  <div className="grid gap-2">
                    <Label>{t("hr.payroll.allowanceConfig.taxLimit", "Hạn mức miễn thuế (nếu có)")}</Label>
                    <Input 
                      type="number"
                      placeholder={t("hr.payroll.allowanceConfig.unlimited", "Không giới hạn")}
                      value={newAllowance.taxLimit || ""} 
                      onChange={(e) => setNewAllowance({...newAllowance, taxLimit: parseInt(e.target.value) || undefined})}
                    />
                  </div>
                )}

                <div className="grid gap-2">
                  <Label>{t("hr.payroll.allowanceConfig.calculationBasis", "Hình thức tính")}</Label>
                  <Select 
                    value={newAllowance.calculationBasis} 
                    onValueChange={(v: any) => setNewAllowance({...newAllowance, calculationBasis: v})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">{t("hr.payroll.allowanceConfig.monthly", "Theo tháng")}</SelectItem>
                      <SelectItem value="Daily">{t("hr.payroll.allowanceConfig.daily", "Theo ngày công")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between space-x-2 border p-2 rounded-md">
                  <Label className="cursor-pointer" htmlFor="isGradeBased">{t("hr.payroll.allowanceConfig.isGradeBased", "Tính theo cấp bậc")}</Label>
                  <Switch 
                    id="isGradeBased"
                    checked={newAllowance.isGradeBased} 
                    onCheckedChange={(checked) => setNewAllowance({...newAllowance, isGradeBased: checked})}
                  />
                </div>

                {newAllowance.isGradeBased ? (
                  <div className="space-y-2 border p-3 rounded-md bg-muted/30">
                    <Label className="text-xs font-bold uppercase">{t("hr.payroll.allowanceConfig.gradeAmounts", "Số tiền theo cấp bậc")}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["M1", "M2", "S1", "S2", "E1", "E2"].map(grade => (
                        <div key={grade} className="flex items-center gap-2">
                          <span className="text-xs font-mono w-8">{grade}:</span>
                          <Input 
                            type="number"
                            className="h-8 text-xs"
                            value={newAllowance.gradeAmounts?.[grade] || ""}
                            onChange={(e) => {
                              const amounts = { ...newAllowance.gradeAmounts }
                              amounts[grade] = parseInt(e.target.value) || 0
                              setNewAllowance({ ...newAllowance, gradeAmounts: amounts })
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Label>{t("hr.payroll.allowanceConfig.amount", "Mức tiền mặc định")}</Label>
                    <Input 
                      type="number"
                      value={newAllowance.amount} 
                      onChange={(e) => setNewAllowance({...newAllowance, amount: parseInt(e.target.value) || 0})}
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label>{t("hr.payroll.allowanceConfig.description", "Mô tả")}</Label>
                  <Input 
                    value={newAllowance.description} 
                    onChange={(e) => setNewAllowance({...newAllowance, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAllowanceModalOpen(false)}>{t("common.cancel", "Hủy")}</Button>
                <Button onClick={handleSaveAllowance}>{t("common.save", "Lưu")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* PIT & Insurance Tab */}
        <TabsContent value="pitInsurance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("hr.payroll.pitConfig.title", "Cấu hình Thuế TNCN")}</CardTitle>
                <CardDescription>{t("hr.payroll.pitConfig.lawNote", "Mức giảm trừ gia cảnh được áp dụng theo Nghị quyết 954/2020/UBTVQH14.")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>{t("hr.payroll.pitConfig.personalDeduction", "Giảm trừ bản thân")}</Label>
                  <Input 
                    value={pitConfig.personalDeduction.toLocaleString()} 
                    onChange={(e) => handleUpdatePIT("personalDeduction", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t("hr.payroll.pitConfig.dependentDeduction", "Giảm trừ người phụ thuộc")}</Label>
                  <Input 
                    value={pitConfig.dependentDeduction.toLocaleString()} 
                    onChange={(e) => handleUpdatePIT("dependentDeduction", e.target.value)}
                  />
                </div>
                <div className="pt-4 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    {t("hr.payroll.pitConfig.lawNote", "Mức giảm trừ gia cảnh được áp dụng theo Nghị quyết 954/2020/UBTVQH14.")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t("hr.payroll.insurance.ratesTitle", "Cấu hình tỷ lệ BHXH")}</CardTitle>
                  <CardDescription>{t("hr.payroll.insurance.ratesDesc", "Tỷ lệ trích đóng theo quy định pháp luật")}</CardDescription>
                </div>
                {canEdit && (
                  <Button size="sm" onClick={() => {
                    setEditingInsuranceRate(null)
                    setNewInsuranceRate({
                      effectiveDate: format(new Date(), "yyyy-MM-dd"),
                      employeeRates: { bhxh: 8, bhyt: 1.5, bhtn: 1 },
                      employerRates: { bhxh: 17, bhyt: 3, bhtn: 1, bhld_bnn: 0.5 }
                    })
                    setIsInsuranceRateModalOpen(true)
                  }}>
                    <Plus className="h-4 w-4 mr-1" />
                    {t("common.add")}
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("hr.payroll.insurance.effectiveDate", "Ngày áp dụng")}</TableHead>
                      <TableHead>{t("hr.payroll.insurance.empRate", "NLĐ đóng (%)")}</TableHead>
                      <TableHead>{t("hr.payroll.insurance.employerRateShort", "DN đóng (%)")}</TableHead>
                      {canEdit && <TableHead className="text-right"></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {insuranceRateConfigs.sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate)).map(config => (
                      <TableRow key={config.id}>
                        <TableCell>{config.effectiveDate}</TableCell>
                        <TableCell>{config.employeeRates.bhxh + config.employeeRates.bhyt + config.employeeRates.bhtn}%</TableCell>
                        <TableCell>{config.employerRates.bhxh + config.employerRates.bhyt + config.employerRates.bhtn + config.employerRates.bhld_bnn}%</TableCell>
                        {canEdit && (
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => {
                              setEditingInsuranceRate(config)
                              setNewInsuranceRate(config)
                              setIsInsuranceRateModalOpen(true)
                            }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("hr.payroll.insurance.title")}</CardTitle>
              <CardDescription>{t("hr.payroll.insurance.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("hr.core.name")}</TableHead>
                    <TableHead>{t("hr.payroll.insurance.participant")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((emp) => {
                    const participant = insuranceParticipants.find(p => p.employeeId === emp.id)
                    return (
                      <TableRow key={emp.id}>
                        <TableCell className="font-medium">{emp.name}</TableCell>
                        <TableCell>
                          <Switch 
                            checked={participant?.isParticipant} 
                            onCheckedChange={() => toggleInsurance(emp.id)}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Insurance Rate Modal */}
          <Dialog open={isInsuranceRateModalOpen} onOpenChange={setIsInsuranceRateModalOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingInsuranceRate ? t("common.edit") : t("common.add")}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>{t("hr.payroll.insurance.effectiveDate", "Ngày áp dụng")}</Label>
                  <Input 
                    type="date"
                    value={newInsuranceRate.effectiveDate} 
                    onChange={(e) => setNewInsuranceRate({...newInsuranceRate, effectiveDate: e.target.value})}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-sm font-bold">{t("hr.payroll.insurance.empRate", "Tỷ lệ đóng của NLĐ (%)")}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase">BHXH</Label>
                      <Input type="number" step="0.1" value={newInsuranceRate.employeeRates?.bhxh} onChange={(e) => setNewInsuranceRate({...newInsuranceRate, employeeRates: {...newInsuranceRate.employeeRates!, bhxh: parseFloat(e.target.value) || 0}})} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase">BHYT</Label>
                      <Input type="number" step="0.1" value={newInsuranceRate.employeeRates?.bhyt} onChange={(e) => setNewInsuranceRate({...newInsuranceRate, employeeRates: {...newInsuranceRate.employeeRates!, bhyt: parseFloat(e.target.value) || 0}})} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase">BHTN</Label>
                      <Input type="number" step="0.1" value={newInsuranceRate.employeeRates?.bhtn} onChange={(e) => setNewInsuranceRate({...newInsuranceRate, employeeRates: {...newInsuranceRate.employeeRates!, bhtn: parseFloat(e.target.value) || 0}})} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold">{t("hr.payroll.insurance.employerRate", "Tỷ lệ đóng của Doanh nghiệp (%)")}</Label>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase">BHXH</Label>
                      <Input type="number" step="0.1" value={newInsuranceRate.employerRates?.bhxh} onChange={(e) => setNewInsuranceRate({...newInsuranceRate, employerRates: {...newInsuranceRate.employerRates!, bhxh: parseFloat(e.target.value) || 0}})} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase">BHYT</Label>
                      <Input type="number" step="0.1" value={newInsuranceRate.employerRates?.bhyt} onChange={(e) => setNewInsuranceRate({...newInsuranceRate, employerRates: {...newInsuranceRate.employerRates!, bhyt: parseFloat(e.target.value) || 0}})} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase">BHTN</Label>
                      <Input type="number" step="0.1" value={newInsuranceRate.employerRates?.bhtn} onChange={(e) => setNewInsuranceRate({...newInsuranceRate, employerRates: {...newInsuranceRate.employerRates!, bhtn: parseFloat(e.target.value) || 0}})} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase">BHLĐ</Label>
                      <Input type="number" step="0.1" value={newInsuranceRate.employerRates?.bhld_bnn} onChange={(e) => setNewInsuranceRate({...newInsuranceRate, employerRates: {...newInsuranceRate.employerRates!, bhld_bnn: parseFloat(e.target.value) || 0}})} />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInsuranceRateModalOpen(false)}>{t("common.cancel")}</Button>
                <Button onClick={handleSaveInsuranceRate}>{t("common.save")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setActiveReport("payroll")}>
              <CardHeader>
                <FileText className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">{t("hr.payroll.reports.companyPayroll", "Bảng lương toàn công ty")}</CardTitle>
                <CardDescription>{t("hr.payroll.reports.generate", "Tạo báo cáo")}</CardDescription>
              </CardHeader>
            </Card>
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setActiveReport("insurance")}>
              <CardHeader>
                <ShieldCheck className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle className="text-lg">{t("hr.payroll.reports.insuranceReport", "Báo cáo BHXH")}</CardTitle>
                <CardDescription>{t("hr.payroll.reports.generate", "Tạo báo cáo")}</CardDescription>
              </CardHeader>
            </Card>
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setActiveReport("pit")}>
              <CardHeader>
                <UserCheck className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle className="text-lg">{t("hr.payroll.reports.pitDeclaration", "Tờ khai thuế TNCN")}</CardTitle>
                <CardDescription>{t("hr.payroll.reports.generate", "Tạo báo cáo")}</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {activeReport === "payroll" && (
            <Card>
              <CardHeader>
                <CardTitle>{t("hr.payroll.reports.companyPayroll")} - {selectedPeriod}</CardTitle>
              </CardHeader>
              <CardContent>
                {currentPeriodRecords.length > 0 ? (
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
                      {currentPeriodRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{getEmployeeName(record.employeeId)}</TableCell>
                          <TableCell>{record.basicSalary.toLocaleString()} ₫</TableCell>
                          <TableCell>{record.allowances.toLocaleString()} ₫</TableCell>
                          <TableCell>{record.deductions.toLocaleString()} ₫</TableCell>
                          <TableCell>{record.tax.toLocaleString()} ₫</TableCell>
                          <TableCell className="font-bold">{record.netSalary.toLocaleString()} ₫</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-bold">
                        <TableCell>{t("common.total")}</TableCell>
                        <TableCell>{currentPeriodRecords.reduce((s, r) => s + r.basicSalary, 0).toLocaleString()} ₫</TableCell>
                        <TableCell>{currentPeriodRecords.reduce((s, r) => s + r.allowances, 0).toLocaleString()} ₫</TableCell>
                        <TableCell>{currentPeriodRecords.reduce((s, r) => s + r.deductions, 0).toLocaleString()} ₫</TableCell>
                        <TableCell>{currentPeriodRecords.reduce((s, r) => s + r.tax, 0).toLocaleString()} ₫</TableCell>
                        <TableCell>{currentPeriodRecords.reduce((s, r) => s + r.netSalary, 0).toLocaleString()} ₫</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    {t("hr.payroll.reports.noData")}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeReport === "insurance" && (
            <Card>
              <CardHeader>
                <CardTitle>{t("hr.payroll.reports.insuranceReport")} - {selectedPeriod}</CardTitle>
              </CardHeader>
              <CardContent>
                {currentPeriodRecords.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("hr.core.name")}</TableHead>
                        <TableHead>{t("hr.payroll.basicSalary")}</TableHead>
                        <TableHead>{t("hr.socialInsurance.employeeRate")}</TableHead>
                        <TableHead>{t("hr.socialInsurance.employerRate")}</TableHead>
                        <TableHead>{t("common.total")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentPeriodRecords.map((record) => {
                        const employerContribution = record.basicSalary * 0.215
                        return (
                          <TableRow key={record.id}>
                            <TableCell>{getEmployeeName(record.employeeId)}</TableCell>
                            <TableCell>{record.basicSalary.toLocaleString()} ₫</TableCell>
                            <TableCell>{record.deductions.toLocaleString()} ₫</TableCell>
                            <TableCell>{employerContribution.toLocaleString()} ₫</TableCell>
                            <TableCell className="font-bold">{(record.deductions + employerContribution).toLocaleString()} ₫</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    {t("hr.payroll.reports.noData")}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeReport === "pit" && (
            <Card>
              <CardHeader>
                <CardTitle>{t("hr.payroll.reports.pitDeclaration")} - {selectedPeriod}</CardTitle>
              </CardHeader>
              <CardContent>
                {currentPeriodRecords.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("hr.core.name")}</TableHead>
                        <TableHead>{t("hr.payroll.overview.totalFund")}</TableHead>
                        <TableHead>{t("hr.payroll.pitConfig.personalDeduction")}</TableHead>
                        <TableHead>{t("hr.payroll.tax")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentPeriodRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{getEmployeeName(record.employeeId)}</TableCell>
                          <TableCell>{(record.basicSalary + record.allowances).toLocaleString()} ₫</TableCell>
                          <TableCell>{pitConfig.personalDeduction.toLocaleString()} ₫</TableCell>
                          <TableCell className="font-bold">{record.tax.toLocaleString()} ₫</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    {t("hr.payroll.reports.noData")}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Salary Structure Tab (Simplified for now) */}
        <TabsContent value="salary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.payroll.tabs.salaryStructure")}</CardTitle>
              <CardDescription>{t("hr.payroll.structure.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("hr.core.name")}</TableHead>
                    <TableHead>{t("hr.payroll.basicSalary")}</TableHead>
                    <TableHead>{t("hr.payroll.allowances")}</TableHead>
                    <TableHead>{t("hr.payroll.insurance.participant")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((emp) => {
                    const isInsured = insuranceParticipants.find(p => p.employeeId === emp.id)?.isParticipant
                    return (
                      <TableRow key={emp.id}>
                        <TableCell className="font-medium">{emp.name}</TableCell>
                        <TableCell>15,000,000 ₫</TableCell>
                        <TableCell>{allowanceTypes.reduce((s, a) => s + (a.amount || 0), 0).toLocaleString()} ₫</TableCell>
                        <TableCell>
                          <Badge variant={isInsured ? "default" : "secondary"}>
                            {isInsured ? t("hr.core.yes") : t("hr.core.no")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payslips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.payroll.payslips")}</CardTitle>
              <CardDescription>{t("hr.payroll.payslipsTab.description")}</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">{t("hr.payroll.payslipsTab.updating")}</h3>
                <p className="text-sm text-muted-foreground">{t("hr.payroll.payslipsTab.featureDesc")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
