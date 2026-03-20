import { useState, useEffect } from "react"
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
  Loader2,
  Trash2,
  Edit
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
import { db, auth } from "@/src/lib/firebase"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors"

const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const initialProducts = [
  { id: "PROD-001", name: "iPhone 15 Pro Max 256GB", category: "Điện thoại", seller: "Apple Flagship Store", currentPrice: 34990000, suggestedPrice: 35990000, costPrice: 30000000, platformFee: 1500000, stock: 50, performance: "High", rating: 4.9 },
  { id: "PROD-002", name: "MacBook Pro M3 14 inch", category: "Laptop", seller: "Apple Flagship Store", currentPrice: 45990000, suggestedPrice: 46990000, costPrice: 40000000, platformFee: 2000000, stock: 20, performance: "High", rating: 4.8 },
  { id: "PROD-003", name: "Tai nghe Sony WH-1000XM5", category: "Phụ kiện", seller: "Sony Center", currentPrice: 8490000, suggestedPrice: 8990000, costPrice: 7000000, platformFee: 400000, stock: 100, performance: "Medium", rating: 4.7 },
  { id: "PROD-004", name: "Bàn phím cơ Keychron K2", category: "Phụ kiện", seller: "GearVN", currentPrice: 2100000, suggestedPrice: 2300000, costPrice: 1500000, platformFee: 100000, stock: 30, performance: "Medium", rating: 4.6 },
  { id: "PROD-005", name: "Chuột Logitech MX Master 3S", category: "Phụ kiện", seller: "GearVN", currentPrice: 2500000, suggestedPrice: 2700000, costPrice: 1800000, platformFee: 120000, stock: 45, performance: "High", rating: 4.9 },
]

export function Products() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [activeSubTab, setActiveSubTab] = useState("all")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({ key: '', direction: null })
  const { t } = useTranslation()

  useEffect(() => {
    if (auth.currentUser) {
      fetchProducts()
    }
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, "products"))
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      // Sort by createdAt descending
      productsData.sort((a: any, b: any) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      setProducts(productsData)
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, "products")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm(t("products.deleteConfirm"))) {
      try {
        await deleteDoc(doc(db, "products", id))
        toast.success(t("products.deleteSuccess"))
        setProducts(products.filter(p => p.id !== id))
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `products/${id}`)
      }
    }
  }

  const runAiAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
      const inventoryData = products.map(p => ({
        name: p.productName,
        stock: p.stock || 0,
        price: p.price || p.suggestedPrice || 0
      }))

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `${t("products.forecasting.aiPrompt")}
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

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const filteredProducts = products.filter(product => 
    (product.productName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (product.id?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) return 0
    
    let aValue: any = a[sortConfig.key]
    let bValue: any = b[sortConfig.key]

    // Special handling for price
    if (sortConfig.key === 'price') {
      aValue = a.price || a.suggestedPrice || 0
      bValue = b.price || b.suggestedPrice || 0
    }

    // Special handling for stock
    if (sortConfig.key === 'stock') {
      aValue = a.stock || 0
      if (a.combinations && a.combinations.length > 0) {
        aValue = a.combinations.reduce((sum: number, comb: any) => sum + (Number(comb.stock) || 0), 0)
      }
      bValue = b.stock || 0
      if (b.combinations && b.combinations.length > 0) {
        bValue = b.combinations.reduce((sum: number, comb: any) => sum + (Number(comb.stock) || 0), 0)
      }
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1
    }
    return 0
  })

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
          <Button variant="outline" onClick={() => toast.success(t("common.settingsSuccess", "Đã mở cài đặt sản phẩm"))}>
            {t("products.productSettings")} <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => toast.success(t("common.batchSuccess", "Đã mở công cụ xử lý hàng loạt"))}>
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
            <div className="text-2xl font-bold">{products.length}</div>
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
                      {item.stock} {t("products.inStock")}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {item.velocity} {t("products.unitsPerDay")}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-rose-600 flex items-center justify-end">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    {item.daysLeft} {t("products.daysLeft")}
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
              <Button variant="outline" onClick={() => toast.success(t("common.applySuccess", "Đã áp dụng bộ lọc"))}>
                {t("products.filters.apply")}
              </Button>
              <Button variant="ghost" onClick={() => setSearchTerm("")}>
                {t("products.filters.reset")}
              </Button>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="font-semibold">{t("products.name")}</TableHead>
              <TableHead className="text-right font-semibold">
                <Button variant="ghost" onClick={() => handleSort('price')} className="hover:bg-transparent p-0 font-semibold ml-auto h-8">
                  {t("products.table.price", "Giá bán")}
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right font-semibold">
                <Button variant="ghost" onClick={() => handleSort('stock')} className="hover:bg-transparent p-0 font-semibold ml-auto h-8">
                  {t("products.table.stock", "Kho hàng")}
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right font-semibold hidden lg:table-cell">
                <Button variant="ghost" onClick={() => handleSort('performance')} className="hover:bg-transparent p-0 font-semibold ml-auto h-8">
                  {t("products.performance", "Hiệu suất")}
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right font-semibold hidden xl:table-cell">{t("products.table.category", "Ngành hàng")}</TableHead>
              <TableHead className="text-right font-semibold hidden md:table-cell">{t("products.table.status", "Trạng thái")}</TableHead>
              <TableHead className="text-right font-semibold">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                    <p>{t("products.table.loading", "Đang tải dữ liệu...")}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : sortedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-64 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center">
                    <Package className="h-12 w-12 mb-4 opacity-20" />
                    <p>{t("products.noProducts")}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedProducts.map((product) => {
                // Calculate total stock if combinations exist
                let totalStock = product.stock || 0;
                let displayPrice = (product.price || product.suggestedPrice) ? formatVND(product.price || product.suggestedPrice) : "N/A";
                
                if (product.combinations && product.combinations.length > 0) {
                  totalStock = product.combinations.reduce((sum: number, comb: any) => sum + (Number(comb.stock) || 0), 0);
                  const prices = product.combinations.map((c: any) => Number(c.price) || 0).filter((p: number) => p > 0);
                  if (prices.length > 0) {
                    const minPrice = Math.min(...prices);
                    const maxPrice = Math.max(...prices);
                    displayPrice = minPrice === maxPrice ? formatVND(minPrice) : `${formatVND(minPrice)} - ${formatVND(maxPrice)}`;
                  }
                }

                return (
                  <TableRow key={product.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <Input type="checkbox" className="h-4 w-4 rounded border-muted-foreground/30" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg border bg-white overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                          {product.images && product.images.length > 0 ? (
                            <img src={product.images[0].url} alt={product.productName} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-muted">
                              <Package className="h-6 w-6 text-muted-foreground/40" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-sm text-foreground leading-tight truncate max-w-[200px] md:max-w-[300px]" title={product.productName}>
                            {product.productName}
                          </span>
                          <span className="text-[11px] font-mono text-muted-foreground mt-1">
                            ID: {product.id.substring(0, 8).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-sm text-primary">
                          {displayPrice}
                        </span>
                        {product.suggestedPrice && product.price && product.price < product.suggestedPrice && (
                          <span className="text-[10px] text-muted-foreground line-through">
                            {formatVND(product.suggestedPrice)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className={cn(
                          "font-medium text-sm",
                          totalStock < 10 ? "text-rose-600" : "text-foreground"
                        )}>
                          {totalStock}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                          {t("products.inStock")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right hidden lg:table-cell">
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "font-semibold text-[10px] px-2 py-0 h-5 uppercase tracking-wider",
                          product.performance === "High" && "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200",
                          product.performance === "Medium" && "bg-sky-100 text-sky-700 hover:bg-sky-100 border-sky-200",
                          product.performance === "Low" && "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200"
                        )}
                      >
                        {product.performance || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right hidden xl:table-cell">
                      <span className="text-xs text-muted-foreground font-medium">
                        {product.category?.[product.category.length - 1] || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell">
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[10px] font-bold uppercase tracking-tighter">
                        {t("products.table.active", "Đang bán")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" asChild>
                          <Link to={`/products/edit/${product.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
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
