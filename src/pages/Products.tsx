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
  XCircle,
  TrendingDown,
  Sparkles,
  Loader2
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { cn } from "@/src/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { toast } from "sonner"
import { GoogleGenAI } from "@google/genai"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import Markdown from "react-markdown"

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
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { t } = useTranslation()

  const runAiAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
      const inventoryData = initialProducts.map(p => ({
        name: p.name,
        stock: p.stock,
        performance: p.performance
      }))

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this inventory data and provide strategic recommendations for restocking, promotions, or liquidating slow-moving items.
        Data: ${JSON.stringify(inventoryData)}
        Language: ${t("common.languageCode") || "Vietnamese"}
        Format: Markdown with clear sections.`,
      })

      if (response.text) {
        setAnalysisResult(response.text)
        setIsDialogOpen(true)
      }
    } catch (error) {
      console.error("AI Analysis Error:", error)
      toast.error(t("products.forecasting.analysisError"))
    } finally {
      setIsAnalyzing(false)
    }
  }

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

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-blue-700">
              <Sparkles className="h-5 w-5" />
              {t("products.forecasting.title")}
            </CardTitle>
            <CardDescription className="text-blue-600/80">
              {t("products.forecasting.description")}
            </CardDescription>
          </div>
          <Button 
            onClick={runAiAnalysis} 
            disabled={isAnalyzing}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {t("products.forecasting.analyzeAll")}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "iPhone 15 Pro Max", stock: 50, velocity: 12, daysLeft: 4, trend: "up" },
              { name: "MacBook Pro M3", stock: 20, velocity: 5, daysLeft: 4, trend: "stable" },
              { name: "Sony WH-1000XM5", stock: 100, velocity: 25, daysLeft: 4, trend: "up" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-blue-100">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] h-4 bg-white">
                      {item.stock} in stock
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {item.velocity} units/day
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-rose-600 flex items-center justify-end">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    {item.daysLeft} days left
                  </p>
                  <Button variant="link" size="sm" className="h-auto p-0 text-[10px] text-blue-600">
                    {t("products.forecasting.restockNow")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              {t("products.forecasting.analysisResult")}
            </DialogTitle>
            <DialogDescription>
              {t("products.forecasting.analysisSubtitle")}
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm dark:prose-invert max-w-none mt-4">
            <Markdown>{analysisResult || ""}</Markdown>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
