import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
} from "lucide-react"

export function PnL() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("finance.pnl.title")}</h1>
          <p className="text-muted-foreground">
            {t("finance.pnl.description")}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("finance.pnl.revenue")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₫ 580,000,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("finance.pnl.cogs")}</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₫ 320,000,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("finance.pnl.operatingExpenses")}</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₫ 85,000,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("finance.pnl.netProfit")}</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₫ 175,000,000</div>
            <p className="text-xs text-muted-foreground">30.1% {t("finance.pnl.margin")}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("finance.pnl.title")}</CardTitle>
          <CardDescription>{t("finance.pnl.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("finance.pnl.product")}</TableHead>
                <TableHead className="text-right">{t("finance.pnl.qtySold")}</TableHead>
                <TableHead className="text-right">{t("finance.pnl.avgSellPrice")}</TableHead>
                <TableHead className="text-right">{t("finance.pnl.avgImportPrice")}</TableHead>
                <TableHead className="text-right">{t("finance.pnl.revenue")}</TableHead>
                <TableHead className="text-right">{t("finance.pnl.cogs")}</TableHead>
                <TableHead className="text-right">{t("finance.pnl.grossProfit")}</TableHead>
                <TableHead className="text-right">{t("finance.pnl.margin")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { name: "Áo thun Cotton Premium", qty: 150, sell: 250000, import: 120000 },
                { name: "Quần Jeans Slimfit", qty: 80, sell: 550000, import: 280000 },
                { name: "Giày Sneaker Basic", qty: 45, sell: 890000, import: 450000 },
                { name: "Balo Laptop Chống nước", qty: 60, sell: 420000, import: 190000 },
              ].map((item, index) => {
                const revenue = item.qty * item.sell;
                const cogs = item.qty * item.import;
                const profit = revenue - cogs;
                const margin = (profit / revenue) * 100;
                
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">{item.qty}</TableCell>
                    <TableCell className="text-right">{item.sell.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.import.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{revenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-red-400">-{cogs.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-bold text-green-600">{profit.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{margin.toFixed(1)}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
