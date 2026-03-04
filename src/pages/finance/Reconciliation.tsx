import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import {
  Search,
  Filter,
  FileText,
  Download
} from "lucide-react"

export function Reconciliation() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("reconciliation")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("finance.reconciliation.title")}</h1>
          <p className="text-muted-foreground">
            {t("finance.reconciliation.description")}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="reconciliation">{t("finance.reconciliation.title")}</TabsTrigger>
          <TabsTrigger value="invoice">{t("finance.invoice.title")}</TabsTrigger>
        </TabsList>

        <TabsContent value="reconciliation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("finance.reconciliation.title")}</CardTitle>
              <CardDescription>{t("finance.reconciliation.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={t("common.search")} className="pl-8" />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  {t("common.filters")}
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("finance.reconciliation.seller")}</TableHead>
                    <TableHead>{t("finance.reconciliation.orderId")}</TableHead>
                    <TableHead>{t("finance.reconciliation.transactionDate")}</TableHead>
                    <TableHead className="text-right">{t("finance.reconciliation.orderValue")}</TableHead>
                    <TableHead className="text-right">{t("finance.reconciliation.platformFee")}</TableHead>
                    <TableHead className="text-right">{t("finance.reconciliation.netPayment")}</TableHead>
                    <TableHead>{t("finance.reconciliation.status")}</TableHead>
                    <TableHead className="text-right">{t("finance.reconciliation.action")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: "ORD-7829", seller: "Fashion Store A", date: "2026-03-04", value: 1200000, fee: 60000, net: 1140000, status: "pending" },
                    { id: "ORD-7830", seller: "Tech Gadgets B", date: "2026-03-04", value: 4500000, fee: 225000, net: 4275000, status: "reconciled" },
                    { id: "ORD-7831", seller: "Home Decor C", date: "2026-03-03", value: 850000, fee: 42500, net: 807500, status: "pending" },
                  ].map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.seller}</TableCell>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell className="text-right">{item.value.toLocaleString()} ₫</TableCell>
                      <TableCell className="text-right text-red-500">-{item.fee.toLocaleString()} ₫</TableCell>
                      <TableCell className="text-right font-bold text-green-600">{item.net.toLocaleString()} ₫</TableCell>
                      <TableCell>
                        <Badge variant={item.status === "reconciled" ? "default" : "outline"}>
                          {item.status === "reconciled" ? t("finance.reconciliation.reconciled") : t("finance.reconciliation.pending")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.status === "pending" && (
                          <Button size="sm" variant="outline">{t("finance.reconciliation.reconcile")}</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("finance.invoice.title")}</CardTitle>
              <CardDescription>{t("finance.invoice.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={t("common.search")} className="pl-8" />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  {t("common.filters")}
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("finance.invoice.invoiceNumber")}</TableHead>
                    <TableHead>{t("finance.invoice.type")}</TableHead>
                    <TableHead>{t("finance.invoice.recipient")}</TableHead>
                    <TableHead className="text-right">{t("finance.invoice.amount")}</TableHead>
                    <TableHead>{t("finance.invoice.date")}</TableHead>
                    <TableHead>{t("finance.invoice.status")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: "INV-001", type: "vat", recipient: "Nguyen Van A", amount: 1250000, date: "2026-03-04", status: "Sent" },
                    { id: "INV-002", type: "commission", recipient: "Shop XYZ", amount: 450000, date: "2026-03-04", status: "Draft" },
                    { id: "INV-003", type: "vat", recipient: "Tran Thi B", amount: 890000, date: "2026-03-03", status: "Sent" },
                  ].map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.type === "vat" ? t("finance.invoice.vatInvoice") : t("finance.invoice.commissionInvoice")}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.recipient}</TableCell>
                      <TableCell className="text-right">{item.amount.toLocaleString()} ₫</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
