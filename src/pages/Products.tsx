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
import { Plus, Search, Settings, Wrench, ChevronDown, ArrowUpDown, LayoutGrid, List, Package } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { cn } from "@/src/lib/utils"

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
          <h2 className="text-2xl font-semibold tracking-tight">{t("products.title")}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-muted-foreground">
            {t("products.productSettings")} <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="text-muted-foreground">
            {t("products.batchTools")} <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button asChild className="bg-[#ee4d2d] hover:bg-[#d73211] text-white">
            <Link to="/products/add">
              <Plus className="mr-2 h-4 w-4" />
              {t("products.addProduct")}
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex space-x-6 border-b overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "pb-3 text-sm font-medium transition-colors relative whitespace-nowrap",
              activeTab === tab.id
                ? "text-[#ee4d2d] border-b-2 border-[#ee4d2d]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label} {tab.count !== undefined && `(${tab.count})`}
          </button>
        ))}
      </div>

      <div className="bg-[#e8f8f5] border border-[#b2dfdb] rounded-md p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#009688]">
          <span className="text-xl">✨</span>
          <span className="text-sm font-medium">Tận hưởng dịch vụ Chương Trình "Hỗ Trợ Kinh Phí Hiệu Suất khi sử dụng chế độ Tối Đa Doanh Thu Tùy chỉnh ROAS</span>
        </div>
        <Button variant="default" className="bg-[#009688] hover:bg-[#00796b] text-white h-8 text-xs">
          Xem Chi Tiết
        </Button>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="border-b px-4">
          <div className="flex space-x-6 overflow-x-auto">
            {subTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={cn(
                  "py-3 text-sm font-medium transition-colors relative flex items-center gap-1 whitespace-nowrap",
                  activeSubTab === tab.id
                    ? "text-[#ee4d2d] border-b-2 border-[#ee4d2d]"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label} {tab.count !== undefined && `(${tab.count})`}
                {tab.hasDot && <span className="w-2 h-2 rounded-full bg-[#ee4d2d] inline-block ml-1"></span>}
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
              <Button variant="outline" className="text-[#ee4d2d] border-[#ee4d2d] hover:bg-[#fff0ed]">
                {t("products.filters.apply")}
              </Button>
              <Button variant="ghost">
                {t("products.filters.reset")}
              </Button>
              <Button variant="ghost" className="text-muted-foreground">
                {t("products.filters.expand")} <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm font-medium">
              {filteredProducts.length} Sản Phẩm <Badge variant="secondary" className="ml-2 font-normal text-xs">Tiềm năng Dịch Vụ Hiển Thị</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <ArrowUpDown className="mr-2 h-3 w-3" />
                Sắp xếp theo gợi ý
              </Button>
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none rounded-l-md">
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none rounded-r-md bg-muted">
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" className="h-8 text-xs text-[#ee4d2d] border-[#ee4d2d]">
                ✨ Công cụ Tối ưu AI
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
                <TableCell className="text-right font-medium text-[#ee4d2d]">
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
                  <Button variant="ghost" size="sm" className="text-[#ee4d2d]">
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
