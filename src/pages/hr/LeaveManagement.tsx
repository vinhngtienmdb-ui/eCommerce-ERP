import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Plus, Settings, Edit, Trash2, Check, X, Calendar, PieChart } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import { useDataStore } from "@/src/store/useDataStore"
import { toast } from "sonner"

interface LeaveRule {
  id: string
  type: string
  daysPerYear: number
  carryOver: boolean
  description: string
}

interface Holiday {
  id: string
  name: string
  date: string
  duration: number
}

interface LeaveRequest {
  id: string
  empId: string
  type: string
  dates: string
  status: "Pending" | "Approved" | "Rejected"
  reason: string
}

export function LeaveManagement() {
  const { t } = useTranslation()
  const { employees } = useDataStore()

  const [userRole, setUserRole] = useState<"Admin" | "HR Manager" | "Employee">("HR Manager")
  const canEdit = userRole === "Admin" || userRole === "HR Manager"

  const [rules] = useState<LeaveRule[]>([
    { id: "LR-01", type: t("hr.time.annualLeave"), daysPerYear: 12, carryOver: true, description: t("hr.core.laborLawDesc") },
    { id: "LR-02", type: t("hr.time.sickLeave"), daysPerYear: 30, carryOver: false, description: t("hr.core.socialInsuranceDesc") },
    { id: "LR-03", type: t("hr.time.maternityLeave"), daysPerYear: 180, carryOver: false, description: t("hr.core.maternityLawDesc") },
  ])

  const [holidays] = useState<Holiday[]>([
    { id: "HOL-01", name: "Tết Dương lịch", date: "2024-01-01", duration: 1 },
    { id: "HOL-02", name: "Tết Nguyên Đán", date: "2024-02-08 - 2024-02-14", duration: 7 },
    { id: "HOL-03", name: "Giỗ tổ Hùng Vương", date: "2024-04-18", duration: 1 },
    { id: "HOL-04", name: "Giải phóng miền Nam", date: "2024-04-30", duration: 1 },
    { id: "HOL-05", name: "Quốc tế Lao động", date: "2024-05-01", duration: 1 },
    { id: "HOL-06", name: "Quốc khánh", date: "2024-09-02 - 2024-09-03", duration: 2 },
  ])

  const [requests, setRequests] = useState<LeaveRequest[]>([
    { id: "REQ-001", empId: "EMP-001", type: t("hr.time.annualLeave"), dates: "2023-11-01 - 2023-11-03", status: "Pending", reason: t("hr.core.familyVacation") },
    { id: "REQ-002", empId: "EMP-002", type: t("hr.time.sickLeave"), dates: "2023-10-30", status: "Approved", reason: t("hr.core.flu") },
    { id: "REQ-003", empId: "EMP-003", type: t("hr.time.maternityLeave"), dates: "2023-11-05 - 2024-05-05", status: "Pending", reason: t("hr.core.maternityReason") },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newRequest, setNewRequest] = useState({
    empId: "",
    type: "",
    dates: "",
    reason: ""
  })

  const handleApprove = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: "Approved" } : r))
  }

  const handleReject = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: "Rejected" } : r))
  }

  const handleCreateRequest = () => {
    if (!newRequest.empId || !newRequest.type || !newRequest.dates || !newRequest.reason) {
      toast.error(t("hr.core.toasts.requiredFields"))
      return
    }

    const request: LeaveRequest = {
      id: `REQ-${(requests.length + 1).toString().padStart(3, '0')}`,
      empId: newRequest.empId,
      type: newRequest.type,
      dates: newRequest.dates,
      reason: newRequest.reason,
      status: "Pending"
    }

    setRequests([request, ...requests])
    setIsModalOpen(false)
    setNewRequest({ empId: "", type: "", dates: "", reason: "" })
    toast.success(t("hr.core.toasts.leaveRequestSuccess"))
  }

  const getEmployeeName = (empId: string) => {
    const emp = employees.find(e => e.id === empId)
    return emp ? emp.name : empId
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("hr.core.leaveManagement")}</h1>
          <p className="text-muted-foreground">{t("hr.core.holidaysDesc")}</p>
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
              {t("hr.core.generalConfig")}
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">{t("hr.core.leaveRequests")}</TabsTrigger>
          <TabsTrigger value="rules">{t("hr.core.leaveConfig")}</TabsTrigger>
          <TabsTrigger value="balance">{t("hr.core.leaveBalance")}</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("hr.core.leaveRequests")}</CardTitle>
                <CardDescription>{t("hr.core.manageLeaveRequests")}</CardDescription>
              </div>
              <Button size="sm" onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t("hr.core.createLeaveRequest")}
              </Button>
            </CardHeader>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{t("hr.core.createLeaveRequest")}</DialogTitle>
                  <DialogDescription>
                    {t("hr.core.leaveRequestInfoDesc")}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="empId" className="text-right">{t("hr.core.employee")}</Label>
                    <Select value={newRequest.empId} onValueChange={(val) => setNewRequest({...newRequest, empId: val})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder={t("hr.core.selectEmployee")} />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map(emp => (
                          <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">{t("hr.core.leaveType")}</Label>
                    <Select value={newRequest.type} onValueChange={(val) => setNewRequest({...newRequest, type: val})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder={t("hr.core.selectLeaveType")} />
                      </SelectTrigger>
                      <SelectContent>
                        {rules.map(rule => (
                          <SelectItem key={rule.id} value={rule.type}>{rule.type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dates" className="text-right">{t("hr.time.dates")}</Label>
                    <Input 
                      id="dates" 
                      value={newRequest.dates} 
                      onChange={(e) => setNewRequest({...newRequest, dates: e.target.value})}
                      className="col-span-3" 
                      placeholder={t("hr.core.placeholders.dates")}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reason" className="text-right">{t("hr.core.reason")}</Label>
                    <Input 
                      id="reason" 
                      value={newRequest.reason} 
                      onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
                      className="col-span-3" 
                      placeholder={t("hr.core.placeholders.reason")}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>{t("common.cancel") || "Hủy"}</Button>
                  <Button onClick={handleCreateRequest}>{t("hr.core.sendRequest")}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("hr.core.name")}</TableHead>
                    <TableHead>{t("hr.core.leaveType")}</TableHead>
                    <TableHead>{t("hr.time.dates")}</TableHead>
                    <TableHead>{t("hr.core.reason")}</TableHead>
                    <TableHead>{t("hr.core.status")}</TableHead>
                    {canEdit && <TableHead className="text-right">{t("hr.core.approveReject")}</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{getEmployeeName(item.empId)}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.dates}</TableCell>
                      <TableCell>{item.reason}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === "Approved" ? "default" : item.status === "Pending" ? "secondary" : "destructive"}>
                          {item.status === "Approved" ? t("hr.core.approved") : item.status === "Pending" ? t("hr.core.pending") : t("hr.core.rejected")}
                        </Badge>
                      </TableCell>
                      {canEdit && (
                        <TableCell className="text-right">
                          {item.status === "Pending" && (
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => handleApprove(item.id)}>
                                <Check className="h-4 w-4 mr-1" />
                                {t("hr.core.approve")}
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => handleReject(item.id)}>
                                <X className="h-4 w-4 mr-1" />
                                {t("hr.core.reject")}
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t("hr.core.leaveRuleTitle")}</CardTitle>
                  <CardDescription>{t("hr.core.leaveRuleDesc")}</CardDescription>
                </div>
                {canEdit && (
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    {t("hr.core.addLeaveType")}
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("hr.core.leaveType")}</TableHead>
                      <TableHead>{t("hr.core.daysPerYear")}</TableHead>
                      <TableHead>{t("hr.core.carryOver")}</TableHead>
                      {canEdit && <TableHead className="text-right">{t("common.actions")}</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rules.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.type}</TableCell>
                        <TableCell>{item.daysPerYear}</TableCell>
                        <TableCell>{item.carryOver ? t("hr.core.yes") : t("hr.core.no")}</TableCell>
                        {canEdit && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-red-500" />
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t("hr.core.holidayTitle")}</CardTitle>
                  <CardDescription>{t("hr.core.holidayDesc")}</CardDescription>
                </div>
                {canEdit && (
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    {t("hr.core.addHoliday")}
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("hr.core.holidayName")}</TableHead>
                      <TableHead>{t("hr.time.dates")}</TableHead>
                      <TableHead>{t("hr.core.holidayDuration")}</TableHead>
                      {canEdit && <TableHead className="text-right">{t("common.actions")}</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {holidays.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.duration}</TableCell>
                        {canEdit && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-red-500" />
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
          </div>
        </TabsContent>

        <TabsContent value="balance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.core.employeeLeaveBalance")}</CardTitle>
              <CardDescription>{t("hr.core.employeeLeaveBalanceDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <PieChart className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">{t("hr.core.leaveBalanceUpdating")}</h3>
                <p className="text-sm text-muted-foreground">{t("hr.core.leaveBalanceFeatureDesc")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
