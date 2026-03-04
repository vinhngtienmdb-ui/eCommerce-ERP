import { useTranslation } from "react-i18next"
import { Button } from "@/src/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { CheckCircle2, XCircle, AlertCircle, RotateCcw } from "lucide-react"

const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const rmaData = [
  { id: "RMA-1001", orderId: "ORD-7350", reason: "Sản phẩm lỗi", amount: 3990000, status: "Pending" },
  { id: "RMA-1002", orderId: "ORD-7349", reason: "Gửi sai hàng", amount: 450000, status: "Approved" },
  { id: "RMA-1003", orderId: "ORD-7348", reason: "Đổi ý", amount: 2100000, status: "Rejected" },
]

export function RMATab() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-xl font-bold">{t("orders.rma.title")}</h3>
        <p className="text-sm text-muted-foreground">{t("orders.rma.description")}</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>RMA ID</TableHead>
              <TableHead>{t("orders.rma.orderId")}</TableHead>
              <TableHead>{t("orders.rma.reason")}</TableHead>
              <TableHead className="text-right">{t("orders.rma.amount")}</TableHead>
              <TableHead>{t("orders.rma.status")}</TableHead>
              <TableHead className="text-right">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rmaData.map((rma) => (
              <TableRow key={rma.id}>
                <TableCell className="font-medium">{rma.id}</TableCell>
                <TableCell>{rma.orderId}</TableCell>
                <TableCell>{rma.reason}</TableCell>
                <TableCell className="text-right">{formatVND(rma.amount)}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      rma.status === "Approved" ? "default" : 
                      rma.status === "Pending" ? "secondary" : 
                      rma.status === "Refunded" ? "outline" : "destructive"
                    }
                    className="flex w-fit items-center gap-1"
                  >
                    {rma.status === "Approved" && <CheckCircle2 className="h-3 w-3" />}
                    {rma.status === "Rejected" && <XCircle className="h-3 w-3" />}
                    {rma.status === "Pending" && <AlertCircle className="h-3 w-3" />}
                    {rma.status === "Refunded" && <RotateCcw className="h-3 w-3" />}
                    {rma.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {rma.status === "Pending" && (
                      <>
                        <Button size="sm" variant="outline" className="h-8 text-xs">
                          {t("orders.rma.approve")}
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 text-xs text-destructive">
                          {t("orders.rma.reject")}
                        </Button>
                      </>
                    )}
                    {rma.status === "Approved" && (
                      <Button size="sm" variant="default" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700">
                        {t("orders.rma.refund")}
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="h-8 text-xs">
                      {t("common.viewDetails")}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
