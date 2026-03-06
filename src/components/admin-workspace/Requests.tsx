import { useTranslation } from "react-i18next"
import { DollarSign, Plus, Search, Filter, FileText, CheckCircle2, Clock, XCircle } from "lucide-react"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Card, CardContent } from "@/src/components/ui/card"

export function Requests() {
  const { t } = useTranslation()

  const requests = [
    { id: "REQ-001", type: t("adminWorkspace.requests.purchase"), requester: "Phòng Marketing", amount: 15000000, date: "2026-03-04", status: "pending", priority: "High" },
    { id: "REQ-002", type: t("adminWorkspace.requests.payment"), requester: "Phòng Hành chính", amount: 2500000, date: "2026-03-02", status: "approved", priority: "Medium" },
    { id: "REQ-003", type: t("adminWorkspace.requests.travel"), requester: "Nguyễn Văn A (Sales)", amount: 5000000, date: "2026-02-28", status: "rejected", priority: "Low" },
    { id: "REQ-004", type: t("adminWorkspace.requests.purchase"), requester: "Phòng IT", amount: 45000000, date: "2026-03-05", status: "pending", priority: "High" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 font-medium"><Clock className="mr-1 h-3 w-3" />Chờ duyệt</Badge>
      case 'approved': return <Badge variant="default" className="bg-emerald-500 font-medium"><CheckCircle2 className="mr-1 h-3 w-3" />Đã duyệt</Badge>
      case 'rejected': return <Badge variant="destructive" className="font-medium"><XCircle className="mr-1 h-3 w-3" />Từ chối</Badge>
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 bg-blue-500 text-white rounded-xl shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Tổng đề xuất</p>
              <h3 className="text-xl font-bold">45</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-sm">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Chờ duyệt</p>
              <h3 className="text-xl font-bold">8</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-sm">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Đã chi (Tháng)</p>
              <h3 className="text-xl font-bold text-emerald-700">125.5M ₫</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50/50 border-red-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 bg-red-500 text-white rounded-xl shadow-sm">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Từ chối</p>
              <h3 className="text-xl font-bold">4</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t("common.search")} className="pl-9 h-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-10">
            <Filter className="mr-2 h-4 w-4" />
            {t("common.filters")}
          </Button>
          <Button className="h-10 shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            {t("adminWorkspace.requests.create")}
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-sm">
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[120px]">{t("adminWorkspace.requests.requestId")}</TableHead>
                <TableHead>{t("adminWorkspace.requests.type")}</TableHead>
                <TableHead>{t("adminWorkspace.requests.requester")}</TableHead>
                <TableHead className="text-right">{t("adminWorkspace.requests.amount")}</TableHead>
                <TableHead>{t("adminWorkspace.requests.date")}</TableHead>
                <TableHead>{t("adminWorkspace.requests.status")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id} className="group hover:bg-muted/30">
                  <TableCell className="font-medium font-mono text-[10px] text-muted-foreground">{req.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{req.type}</span>
                      <span className={`text-[10px] ${req.priority === 'High' ? 'text-red-500' : 'text-muted-foreground'}`}>
                        Priority: {req.priority}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{req.requester}</TableCell>
                  <TableCell className="text-right font-bold text-blue-600">{req.amount.toLocaleString()} ₫</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{req.date}</TableCell>
                  <TableCell>{getStatusBadge(req.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      {t("common.viewDetails")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
