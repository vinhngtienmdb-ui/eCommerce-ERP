import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { 
  Plus, 
  Search, 
  Wrench, 
  ChevronDown, 
  ArrowUpDown, 
  LayoutGrid, 
  List, 
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { cn } from "@/src/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { toast } from "sonner"

const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const initialProducts = [
  { id: "PROD-001", name: "iPhone 15 Pro Max 256GB", category: "Điện thoại", seller: "Apple Flagship Store", price: 34990000, stock: 50, performance: "High", rating: 4.9 },
  { id: "PROD-002", name: "MacBook Pro M3 14 inch", category: "Laptop", seller: "Apple Flagship Store", price: 45990000, stock: 20, performance: "High", rating: 4.8 },
  { id: "PROD-003", name: "Tai nghe Sony WH-1000XM5", category: "Phụ kiện", seller: "Sony Center", price: 8490000, stock: 100, performance: "Medium", rating: 4.7 },
  { id: "PROD-004", name: "Bàn phím cơ Keychron K2", category: "Phụ kiện", seller: "GearVN", price: 2100000, stock: 30, performance: "Medium", rating: 4.6 },
  { id: "PROD-005", name: "Chuột Logitech MX Master 3S", category: "Phụ kiện", seller: "GearVN", price: 2500000, stock: 45, performance: "High", rating: 4.9 },
]

export function Products() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [activeSubTab, setActiveSubTab] = useState("all")
  const { t } = useTranslation()

  const filteredProducts = initialProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const tabs = [
    { id: "all", label: t("products.tabs.all"), count: filteredProducts.length },
    { id: "active", label: t("products.tabs.active"), count: filteredProducts.length },
    { id: "violations", label: t("products.tabs.violations"), count: 0 },
    { id: "pending", label: t("products.tabs.pending"), count: 0 },
    { id: "unpublished", label: t("products.tabs.unpublished"), count: 0 },
  ]

  const subTabs = [
    { id: "all", label: t("products.subTabs.all") },
    { id: "needsRestock", label: t("products.subTabs.needsRestock"), count: 0 },
    { id: "needsImprovement", label: t("products.subTabs.needsImprovement"), count: 0, hasDot: true },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("products.title")}</h2>
          <p className="text-muted-foreground">{t("products.description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => toast.info(t("common.featureComingSoon"))}>
            {t("products.productSettings")} <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => toast.info(t("common.featureComingSoon"))}>
            {t("products.batchTools")} <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link to="/products/add">
              <Plus className="mr-2 h-4 w-4" />
              {t("products.addProduct")}
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("products.stats.totalProducts")}</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialProducts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{t("products.stats.activeItems")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("products.stats.lowStock")}</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">{t("products.stats.needsRestock")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("products.stats.topRated")}</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">{t("products.stats.ratingDesc")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("products.stats.inactive")}</CardTitle>
            <div className="p-2 bg-red-100 rounded-full">
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">{t("products.stats.unpublished")}</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="border-b px-4">
          <div className="flex space-x-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "py-4 text-sm font-medium transition-colors relative whitespace-nowrap",
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label} {tab.count !== undefined && `(${tab.count})`}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-b space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Input
                type="search"
                placeholder={t("products.searchPlaceholder")}
                className="w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative flex-1 min-w-[200px]">
              <Input
                type="text"
                placeholder={t("products.filters.category")}
                className="w-full pr-8"
              />
              <Wrench className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="relative flex-1 min-w-[200px]">
              <Button variant="outline" className="w-full justify-between font-normal text-muted-foreground">
                {t("products.filters.flagship")}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => toast.info(t("common.featureComingSoon"))}>
                {t("products.filters.apply")}
              </Button>
              <Button variant="ghost" onClick={() => setSearchTerm("")}>
                {t("products.filters.reset")}
              </Button>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>{t("products.name")}</TableHead>
              <TableHead className="text-right">{t("products.price")} <ArrowUpDown className="inline h-3 w-3 ml-1 opacity-50" /></TableHead>
              <TableHead className="text-right">{t("products.stock")} <ArrowUpDown className="inline h-3 w-3 ml-1 opacity-50" /></TableHead>
              <TableHead className="text-right">{t("products.performance")} <ArrowUpDown className="inline h-3 w-3 ml-1 opacity-50" /></TableHead>
              <TableHead className="text-right">{t("products.rating")}</TableHead>
              <TableHead className="text-right">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Input type="checkbox" className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-xs text-muted-foreground">SKU: {product.id}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium text-primary">
                  {formatVND(product.price)}
                </TableCell>
                <TableCell className="text-right">{product.stock}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={product.performance === "High" ? "default" : "secondary"}>
                    {product.performance}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{product.rating} / 5.0</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => toast.info(t("common.featureComingSoon"))}>
                    {t("common.edit")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center">
                    <Package className="h-12 w-12 mb-4 opacity-20" />
                    <p>{t("products.noProducts")}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
