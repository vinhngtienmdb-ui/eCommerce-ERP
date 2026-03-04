import { useTranslation } from "react-i18next"
import { PenTool, Plus, Search, Filter, Box, CheckCircle2, Clock, Truck } from "lucide-react"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"

export function Stationery() {
  const { t } = useTranslation()

  const requests = [
    { id: "VPP-001", item: "Giấy A4 Double A", qty: 5, unit: "Ram", dept: "Marketing", status: "pending" },
    { id: "VPP-002", item: "Bút bi Thiên Long", qty: 20, unit: "Hộp", dept: "Sales", status: "approved" },
    { id: "VPP-003", item: "Sổ tay nhân viên", qty: 10, unit: "Cuốn", dept: "HR", status: "delivered" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary" className="bg-amber-100 text-amber-700"><Clock className="mr-1 h-3 w-3" />{t("adminWorkspace.stationery.pending")}</Badge>
      case 'approved': return <Badge variant="default" className="bg-blue-500"><CheckCircle2 className="mr-1 h-3 w-3" />{t("adminWorkspace.stationery.approved")}</Badge>
      case 'delivered': return <Badge variant="default" className="bg-emerald-500"><Truck className="mr-1 h-3 w-3" />{t("adminWorkspace.stationery.delivered")}</Badge>
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card rounded-xl border p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-lg">
            <Box className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tổng yêu cầu tháng</p>
            <h3 className="text-2xl font-bold">145</h3>
          </div>
        </div>
        <div className="bg-card rounded-xl border p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Chờ duyệt</p>
            <h3 className="text-2xl font-bold">12</h3>
          </div>
        </div>
        <div className="bg-card rounded-xl border p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã giao</p>
            <h3 className="text-2xl font-bold">118</h3>
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
            {t("adminWorkspace.stationery.request")}
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>{t("adminWorkspace.stationery.item")}</TableHead>
              <TableHead>{t("adminWorkspace.stationery.quantity")}</TableHead>
              <TableHead>{t("adminWorkspace.stationery.unit")}</TableHead>
              <TableHead>{t("adminWorkspace.stationery.department")}</TableHead>
              <TableHead>{t("adminWorkspace.stationery.status")}</TableHead>
              <TableHead className="text-right">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-medium font-mono text-xs">{req.id}</TableCell>
                <TableCell>{req.item}</TableCell>
                <TableCell>{req.qty}</TableCell>
                <TableCell>{req.unit}</TableCell>
                <TableCell>{req.dept}</TableCell>
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
