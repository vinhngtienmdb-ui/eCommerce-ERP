import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Clock, CheckCircle, XCircle, Wifi, MapPin, ScanFace, QrCode, Settings, Edit, Trash2, Plus, Calendar as CalendarIcon } from "lucide-react"

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
  empName: string
  date: string
  hours: number
  status: "Pending" | "Approved"
}

export function TimeAttendance() {
  const { t } = useTranslation()

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

  const [otRequests] = useState<OTRequest[]>([
    { id: "OT-001", empName: "Nguyen Van A", date: "2023-10-25", hours: 2, status: "Approved" },
    { id: "OT-002", empName: "Le Van C", date: "2023-10-26", hours: 4, status: "Pending" },
  ])



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
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="timesheet">Bảng chấm công</TabsTrigger>
          <TabsTrigger value="locations">Địa điểm làm việc</TabsTrigger>
          <TabsTrigger value="shifts">Ca làm việc & OT</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("hr.time.wifi")}</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">HQ Office</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("hr.time.gps")}</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">Radius: 50m</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("hr.time.faceId")}</CardTitle>
            <ScanFace className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">Devices: 2</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("hr.time.qrCode")}</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
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
            <CardTitle>Bảng chấm công chi tiết</CardTitle>
            <CardDescription>Xem và quản lý dữ liệu chấm công hàng ngày của nhân viên</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
            <div className="text-center space-y-2">
              <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="font-medium">Bảng chấm công đang được cập nhật</h3>
              <p className="text-sm text-muted-foreground">Tính năng này sẽ hiển thị lưới chấm công chi tiết theo tháng.</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="locations" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Địa điểm làm việc</CardTitle>
              <CardDescription>Cấu hình các địa điểm làm việc và chấm công</CardDescription>
            </div>
            {canEdit && (
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Thêm địa điểm
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên địa điểm</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Loại</TableHead>
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
                Thêm ca
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
          <CardHeader>
            <CardTitle>{t("hr.time.otRequests")}</CardTitle>
            <CardDescription>Overtime registration.</CardDescription>
          </CardHeader>
          <CardContent>
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
                    <TableCell className="font-medium">{item.empName}</TableCell>
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
