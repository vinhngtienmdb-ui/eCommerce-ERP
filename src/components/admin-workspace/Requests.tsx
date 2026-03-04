import { useTranslation } from "react-i18next"
import { DollarSign, Plus, Search, Filter, FileText, CheckCircle2, Clock, XCircle } from "lucide-react"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"

export function Requests() {
  const { t } = useTranslation()

  const requests = [
    { id: "REQ-001", type: t("adminWorkspace.requests.purchase"), requester: "Phòng Marketing", amount: 15000000, date: "2026-03-04", status: "pending" },
    { id: "REQ-002", type: t("adminWorkspace.requests.payment"), requester: "Phòng Hành chính", amount: 2500000, date: "2026-03-02", status: "approved" },
    { id: "REQ-003", type: t("adminWorkspace.requests.travel"), requester: "Nguyễn Văn A (Sales)", amount: 5000000, date: "2026-02-28", status: "rejected" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary" className="bg-amber-100 text-amber-700"><Clock className="mr-1 h-3 w-3" />Chờ duyệt</Badge>
      case 'approved': return <Badge variant="default" className="bg-emerald-500"><CheckCircle2 className="mr-1 h-3 w-3" />Đã duyệt</Badge>
      case 'rejected': return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Từ chối</Badge>
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card rounded-xl border p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-lg">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tổng đề xuất</p>
            <h3 className="text-2xl font-bold">45</h3>
          </div>
        </div>
        <div className="bg-card rounded-xl border p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Chờ duyệt</p>
            <h3 className="text-2xl font-bold">8</h3>
          </div>
        </div>
        <div className="bg-card rounded-xl border p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã chi (Tháng này)</p>
            <h3 className="text-2xl font-bold text-emerald-600">125.5M ₫</h3>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t("common.search")} className="pl-9" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            {t("common.filters")}
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("adminWorkspace.requests.create")}
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("adminWorkspace.requests.requestId")}</TableHead>
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
              <TableRow key={req.id}>
                <TableCell className="font-medium font-mono text-xs">{req.id}</TableCell>
                <TableCell>{req.type}</TableCell>
                <TableCell>{req.requester}</TableCell>
                <TableCell className="text-right font-medium">{req.amount.toLocaleString()} ₫</TableCell>
                <TableCell>{req.date}</TableCell>
                <TableCell>{getStatusBadge(req.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">{t("common.viewDetails")}</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
