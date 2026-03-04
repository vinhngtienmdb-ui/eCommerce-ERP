import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Clock, CheckCircle, XCircle } from "lucide-react"

interface LeaveRequest {
  id: string
  empName: string
  type: string
  dates: string
  status: "Pending" | "Approved" | "Rejected"
  reason: string
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

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    { id: "LR-001", empName: "Nguyen Van A", type: "Annual Leave", dates: "2023-11-01 - 2023-11-03", status: "Pending", reason: "Family vacation" },
    { id: "LR-002", empName: "Tran Thi B", type: "Sick Leave", dates: "2023-10-30", status: "Approved", reason: "Flu" },
    { id: "LR-003", empName: "Le Van C", type: "Personal Leave", dates: "2023-11-05", status: "Pending", reason: "Personal matters" },
  ])

  const [shifts] = useState<Shift[]>([
    { id: "SH-001", name: "Morning Shift", start: "08:00", end: "17:00" },
    { id: "SH-002", name: "Evening Shift", start: "13:00", end: "22:00" },
  ])

  const [otRequests] = useState<OTRequest[]>([
    { id: "OT-001", empName: "Nguyen Van A", date: "2023-10-25", hours: 2, status: "Approved" },
    { id: "OT-002", empName: "Le Van C", date: "2023-10-26", hours: 1.5, status: "Pending" },
  ])

  const handleApproveLeave = (id: string) => {
    setLeaveRequests(leaveRequests.map(req => 
      req.id === id ? { ...req, status: "Approved" } : req
    ))
  }

  const handleRejectLeave = (id: string) => {
    setLeaveRequests(leaveRequests.map(req => 
      req.id === id ? { ...req, status: "Rejected" } : req
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("hr.tabs.time")}</h1>
          <p className="text-muted-foreground">{t("hr.time.attendanceOverview")}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("hr.time.leaveRequests")}</CardTitle>
            <CardDescription>{t("hr.time.leaveRequestsDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("hr.time.employee")}</TableHead>
                  <TableHead>{t("hr.time.type")}</TableHead>
                  <TableHead>{t("hr.time.dates")}</TableHead>
                  <TableHead>{t("hr.time.status")}</TableHead>
                  <TableHead className="text-right">{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.empName}</div>
                      <div className="text-xs text-muted-foreground">{item.reason}</div>
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.dates}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "Approved" ? "default" : item.status === "Pending" ? "secondary" : "destructive"}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.status === "Pending" && (
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleApproveLeave(item.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRejectLeave(item.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("hr.time.shifts")}</CardTitle>
            <CardDescription>Manage working shifts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("hr.time.shiftName")}</TableHead>
                  <TableHead>{t("hr.time.startTime")}</TableHead>
                  <TableHead>{t("hr.time.endTime")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.start}</TableCell>
                    <TableCell>{item.end}</TableCell>
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
    </div>
  )
}
