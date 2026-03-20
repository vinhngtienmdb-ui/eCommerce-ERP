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

interface RMATabProps {
  orders: any[];
}

export function RMATab({ orders }: RMATabProps) {
  const { t } = useTranslation()

  const rmaOrders = orders.filter(o => 
    o.status === 'return_requested' || 
    o.status === 'refund_requested' || 
    o.status === 'returned' || 
    o.status === 'refunded'
  )

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
              <TableHead>{t("orders.id")}</TableHead>
              <TableHead>{t("orders.customer")}</TableHead>
              <TableHead>{t("orders.rma.reason")}</TableHead>
              <TableHead className="text-right">{t("orders.rma.amount")}</TableHead>
              <TableHead>{t("orders.rma.status")}</TableHead>
              <TableHead className="text-right">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rmaOrders.map((rma) => (
              <TableRow key={rma.id}>
                <TableCell className="font-medium">{rma.id}</TableCell>
                <TableCell>{rma.customerName || rma.customer}</TableCell>
                <TableCell>{rma.returnReason || t("orders.rma.defaultReason")}</TableCell>
                <TableCell className="text-right">{formatVND(rma.total)}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      rma.status === "returned" ? "default" : 
                      rma.status === "return_requested" ? "secondary" : 
                      rma.status === "refunded" ? "outline" : "destructive"
                    }
                    className="flex w-fit items-center gap-1 text-[10px]"
                  >
                    {rma.status === "returned" && <CheckCircle2 className="h-3 w-3" />}
                    {rma.status === "refund_requested" && <AlertCircle className="h-3 w-3" />}
                    {rma.status === "return_requested" && <AlertCircle className="h-3 w-3" />}
                    {rma.status === "refunded" && <RotateCcw className="h-3 w-3" />}
                    {t(`orders.statuses.${rma.status}`)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {(rma.status === "return_requested" || rma.status === "refund_requested") && (
                      <>
                        <Button size="sm" variant="outline" className="h-8 text-xs">
                          {t("orders.rma.approve")}
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 text-xs text-destructive">
                          {t("orders.rma.reject")}
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost" className="h-8 text-xs">
                      {t("common.viewDetails")}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {rmaOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  {t("orders.noOrders")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
