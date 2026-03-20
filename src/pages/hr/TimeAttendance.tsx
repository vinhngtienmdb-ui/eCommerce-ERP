import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Clock, CheckCircle, XCircle, Wifi, MapPin, ScanFace, QrCode, Settings, Edit, Trash2, Plus, Calendar as CalendarIcon } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import { useDataStore } from "@/src/store/useDataStore"
import { toast } from "sonner"

interface WorkLocation {
  id: string
  name: string
  address: string
  type: "Office" | "Branch" | "Remote"
}

interface Shift {
  id: string
  name: string
  start: string
  end: string
}

interface OTRequest {
  id: string
  empId: string
  date: string
  hours: number
  status: "Pending" | "Approved"
}

export function TimeAttendance() {
  const { t } = useTranslation()
  const { employees } = useDataStore()

  const [userRole, setUserRole] = useState<"Admin" | "HR Manager" | "Employee">("HR Manager")
  const canEdit = userRole === "Admin" || userRole === "HR Manager"

  const [locations] = useState<WorkLocation[]>([
    { id: "LOC-001", name: "Trụ sở chính", address: "123 Nguyễn Văn Linh, Đà Nẵng", type: "Office" },
    { id: "LOC-002", name: "Chi nhánh Hà Nội", address: "456 Cầu Giấy, Hà Nội", type: "Branch" },
    { id: "LOC-003", name: "Chi nhánh TP.HCM", address: "789 Quận 1, TP.HCM", type: "Branch" },
  ])

  const [shifts] = useState<Shift[]>([
    { id: "SH-001", name: "Hành chính", start: "08:00", end: "17:00" },
    { id: "SH-002", name: "Ca sáng", start: "06:00", end: "14:00" },
    { id: "SH-003", name: "Ca chiều", start: "14:00", end: "22:00" },
  ])

  const [otRequests, setOtRequests] = useState<OTRequest[]>([
    { id: "OT-001", empId: employees[0]?.id || "EMP-001", date: "2023-10-25", hours: 2, status: "Approved" },
    { id: "OT-002", empId: employees[2]?.id || "EMP-003", date: "2023-10-26", hours: 4, status: "Pending" },
  ])

  const [isOtModalOpen, setIsOtModalOpen] = useState(false)
  const [newOt, setNewOt] = useState({
    empId: "",
    date: "",
    hours: "1",
  })

  const getEmployeeName = (empId: string) => {
    const emp = employees.find(e => e.id === empId)
    return emp ? emp.name : empId
  }

  const handleCreateOt = () => {
    if (!newOt.empId || !newOt.date || !newOt.hours) {
      toast.error(t("hr.time.toasts.fillInfo"))
      return
    }

    const hours = parseFloat(newOt.hours)
    if (isNaN(hours) || hours <= 0) {
      toast.error(t("hr.time.toasts.invalidHours"))
      return
    }

    const record: OTRequest = {
      id: `OT-${(otRequests.length + 1).toString().padStart(3, '0')}`,
      empId: newOt.empId,
      date: newOt.date,
      hours: hours,
      status: "Pending"
    }

    setOtRequests([record, ...otRequests])
    setIsOtModalOpen(false)
    setNewOt({ empId: "", date: "", hours: "1" })
    toast.success(t("hr.time.toasts.addSuccess"))
  }



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("hr.tabs.time")}</h1>
          <p className="text-muted-foreground">{t("hr.time.attendanceOverview")}</p>
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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t("hr.time.tabs.overview")}</TabsTrigger>
          <TabsTrigger value="timesheet">{t("hr.time.tabs.timesheet")}</TabsTrigger>
          <TabsTrigger value="locations">{t("hr.time.tabs.locations")}</TabsTrigger>
          <TabsTrigger value="shifts">{t("hr.time.tabs.shifts")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("hr.time.wifi")}</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{t("hr.time.active")}</div>
            <p className="text-xs text-muted-foreground">HQ Office</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("hr.time.gps")}</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{t("hr.time.active")}</div>
            <p className="text-xs text-muted-foreground">Radius: 50m</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("hr.time.faceId")}</CardTitle>
            <ScanFace className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{t("hr.time.active")}</div>
            <p className="text-xs text-muted-foreground">Devices: 2</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("hr.time.qrCode")}</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{t("hr.time.active")}</div>
            <p className="text-xs text-muted-foreground">Dynamic QR</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>{t("hr.time.attendanceOverview")}</CardTitle>
            <CardDescription>{t("hr.time.todayStats")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>{t("hr.time.present")}</span>
                <span className="font-bold text-green-600">95%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t("hr.time.late")}</span>
                <span className="font-bold text-yellow-600">3%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t("hr.time.absent")}</span>
                <span className="font-bold text-red-600">2%</span>
              </div>
              <div className="pt-4 border-t">
                <Button className="w-full" variant="outline">
                  <Clock className="mr-2 h-4 w-4" />
                  {t("hr.time.viewTimesheet")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </TabsContent>

      <TabsContent value="timesheet" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("hr.time.timesheetTab.title")}</CardTitle>
            <CardDescription>{t("hr.time.timesheetTab.description")}</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
            <div className="text-center space-y-2">
              <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="font-medium">{t("hr.time.timesheetTab.updating")}</h3>
              <p className="text-sm text-muted-foreground">{t("hr.time.timesheetTab.featureDesc")}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="locations" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t("hr.time.locationsTab.title")}</CardTitle>
              <CardDescription>{t("hr.time.locationsTab.description")}</CardDescription>
            </div>
            {canEdit && (
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {t("hr.time.locationsTab.add")}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("hr.time.locationsTab.name")}</TableHead>
                  <TableHead>{t("hr.time.locationsTab.address")}</TableHead>
                  <TableHead>{t("hr.time.locationsTab.type")}</TableHead>
                  {canEdit && <TableHead className="text-right">{t("common.actions")}</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.address}</TableCell>
                    <TableCell>
                      <Badge variant={item.type === "Office" ? "default" : item.type === "Branch" ? "secondary" : "outline"}>
                        {item.type}
                      </Badge>
                    </TableCell>
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
      </TabsContent>

      <TabsContent value="shifts" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t("hr.time.shifts")}</CardTitle>
              <CardDescription>{t("hr.time.assignShifts")}</CardDescription>
            </div>
            {canEdit && (
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {t("hr.time.shiftsTab.add")}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("hr.time.shiftName")}</TableHead>
                  <TableHead>{t("hr.time.startTime")}</TableHead>
                  <TableHead>{t("hr.time.endTime")}</TableHead>
                  <TableHead className="text-right">{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.start}</TableCell>
                    <TableCell>{item.end}</TableCell>
                    <TableCell className="text-right">
                      {canEdit ? (
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
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
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t("hr.time.otRequests")}</CardTitle>
              <CardDescription>{t("hr.time.leaveRequestsDesc")}</CardDescription>
            </div>
            <Button size="sm" onClick={() => setIsOtModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("hr.time.otModal.save")}
            </Button>
          </CardHeader>
          <CardContent>
            <Dialog open={isOtModalOpen} onOpenChange={setIsOtModalOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{t("hr.time.otModal.title")}</DialogTitle>
                  <DialogDescription>
                    {t("hr.time.otModal.description")}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="empId" className="text-right">{t("hr.time.otModal.employee")}</Label>
                    <Select value={newOt.empId} onValueChange={(val) => setNewOt({...newOt, empId: val})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder={t("hr.time.otModal.selectEmployee")} />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map(emp => (
                          <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">{t("hr.time.otModal.date")}</Label>
                    <Input 
                      id="date" 
                      type="date"
                      value={newOt.date} 
                      onChange={(e) => setNewOt({...newOt, date: e.target.value})}
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="hours" className="text-right">{t("hr.time.otModal.hours")}</Label>
                    <Input 
                      id="hours" 
                      type="number"
                      step="0.5"
                      value={newOt.hours} 
                      onChange={(e) => setNewOt({...newOt, hours: e.target.value})}
                      className="col-span-3" 
                      placeholder={t("hr.time.placeholders.hours")}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsOtModalOpen(false)}>{t("hr.time.otModal.cancel")}</Button>
                  <Button onClick={handleCreateOt}>{t("hr.time.otModal.save")}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("hr.time.employee")}</TableHead>
                  <TableHead>{t("hr.time.dates")}</TableHead>
                  <TableHead>{t("hr.time.otHours")}</TableHead>
                  <TableHead>{t("hr.time.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {otRequests.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{getEmployeeName(item.empId)}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.hours}h</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "Approved" ? "default" : "secondary"}>{item.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      </TabsContent>
      </Tabs>
    </div>
  )
}
