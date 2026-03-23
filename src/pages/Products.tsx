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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-slate-900">{t("products.title")}</h2>
          <p className="text-muted-foreground text-lg font-medium">{t("products.description")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="rounded-2xl h-11 border-slate-200 hover:bg-slate-50 transition-all shadow-sm" onClick={() => toast.success(t("common.settingsSuccess", "Đã mở cài đặt sản phẩm"))}>
            {t("products.productSettings")} <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="rounded-2xl h-11 border-slate-200 hover:bg-slate-50 transition-all shadow-sm" onClick={() => toast.success(t("common.batchSuccess", "Đã mở công cụ xử lý hàng loạt"))}>
            {t("products.batchTools")} <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl h-11 px-6 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
            <Link to="/products/add">
              <Plus className="mr-2 h-5 w-5" />
              {t("products.addProduct")}
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: t("products.stats.totalProducts"), value: products.length, icon: Package, color: "blue", desc: t("products.stats.activeItems") },
          { title: t("products.stats.lowStock"), value: 2, icon: AlertTriangle, color: "amber", desc: t("products.stats.needsRestock") },
          { title: t("products.stats.topRated"), value: 3, icon: CheckCircle2, color: "emerald", desc: t("products.stats.ratingDesc") },
          { title: t("products.stats.inactive"), value: 0, icon: XCircle, color: "rose", desc: t("products.stats.unpublished") },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500">{stat.title}</CardTitle>
              <div className={cn(
                "p-3 rounded-2xl transition-transform group-hover:scale-110 duration-500",
                stat.color === "blue" && "bg-blue-50 text-blue-600 shadow-lg shadow-blue-500/10",
                stat.color === "amber" && "bg-amber-50 text-amber-600 shadow-lg shadow-amber-500/10",
                stat.color === "emerald" && "bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-500/10",
                stat.color === "rose" && "bg-rose-50 text-rose-600 shadow-lg shadow-rose-500/10"
              )}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tight text-slate-900">{stat.value}</div>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-2xl shadow-primary/5 rounded-[40px] overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 relative group">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
          <Sparkles className="w-48 h-48 text-white" />
        </div>
        <CardHeader className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <CardTitle className="text-3xl font-black flex items-center gap-3 text-white">
              <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              {t("products.forecasting.title")}
            </CardTitle>
            <CardDescription className="text-blue-100/80 text-lg font-medium max-w-2xl">
              {t("products.forecasting.description")}
            </CardDescription>
          </div>
          <Button 
            onClick={runAiAnalysis} 
            disabled={isAnalyzing}
            className="bg-white hover:bg-blue-50 text-blue-700 rounded-2xl h-14 px-8 font-black text-lg shadow-2xl shadow-black/20 gap-3 transition-all active:scale-95"
          >
            {isAnalyzing ? <Loader2 className="h-6 w-6 animate-spin" /> : <Sparkles className="h-6 w-6" />}
            {t("products.forecasting.analyzeAll")}
          </Button>
        </CardHeader>
        <CardContent className="p-8 pt-4 relative z-10">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "iPhone 15 Pro Max", stock: 50, velocity: 12, daysLeft: 4, trend: "up" },
              { name: "MacBook Pro M3", stock: 20, velocity: 5, daysLeft: 4, trend: "stable" },
              { name: "Sony WH-1000XM5", stock: 100, velocity: 25, daysLeft: 4, trend: "up" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-white/10 backdrop-blur-md rounded-[24px] border border-white/20 group/item hover:bg-white/20 transition-all duration-300">
                <div className="space-y-2">
                  <p className="text-base font-black text-white">{item.name}</p>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-white/20 text-white border-none text-[10px] font-black uppercase tracking-widest px-2.5 py-1">
                      {item.stock} {t("products.inStock")}
                    </Badge>
                    <span className="text-[10px] font-bold text-blue-100/70 uppercase tracking-widest">
                      {item.velocity} {t("products.unitsPerDay")}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/20 rounded-full border border-rose-500/30 mb-2">
                    <TrendingDown className="h-3 w-3 text-rose-300" />
                    <span className="text-xs font-black text-rose-100">
                      {item.daysLeft} {t("products.daysLeft")}
                    </span>
                  </div>
                  <Button variant="link" size="sm" className="h-auto p-0 text-[10px] font-black uppercase tracking-widest text-white hover:text-blue-200 transition-colors block ml-auto">
                    {t("products.forecasting.restockNow")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="rounded-[40px] border-none bg-white shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="border-b border-slate-100 px-8 bg-slate-50/50">
          <div className="flex space-x-10 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "py-6 text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab.label} {tab.count !== undefined && <span className="ml-1 opacity-50">({tab.count})</span>}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8 border-b border-slate-100 space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[300px] group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input
                type="search"
                placeholder={t("products.searchPlaceholder")}
                className="w-full h-14 rounded-2xl bg-slate-100 border-none pl-12 pr-6 font-bold text-lg focus-visible:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative flex-1 min-w-[200px]">
              <Input
                type="text"
                placeholder={t("products.filters.category")}
                className="w-full h-14 rounded-2xl bg-slate-100 border-none px-6 font-bold focus-visible:ring-primary/20"
              />
              <Wrench className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="h-14 rounded-2xl px-6 font-bold border-slate-200 hover:bg-slate-50 transition-all shadow-sm" onClick={() => toast.success(t("common.applySuccess", "Đã áp dụng bộ lọc"))}>
                {t("products.filters.apply")}
              </Button>
              <Button variant="ghost" className="h-14 rounded-2xl px-6 font-bold text-slate-500 hover:text-slate-700" onClick={() => setSearchTerm("")}>
                {t("products.filters.reset")}
              </Button>
              <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 p-1.5 shadow-inner">
                <Button 
                  variant={viewMode === "grid" ? "secondary" : "ghost"} 
                  size="icon" 
                  className={cn("h-10 w-10 rounded-xl transition-all", viewMode === "grid" && "bg-white shadow-md text-primary")}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-5 w-5" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "secondary" : "ghost"} 
                  size="icon" 
                  className={cn("h-10 w-10 rounded-xl transition-all", viewMode === "list" && "bg-white shadow-md text-primary")}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {viewMode === "list" ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-[60px] pl-8"></TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">{t("products.name")}</TableHead>
                  <TableHead className="text-right font-black uppercase tracking-widest text-[10px] text-slate-400">
                    <Button variant="ghost" onClick={() => handleSort('price')} className="hover:bg-transparent p-0 font-black uppercase tracking-widest text-[10px] text-slate-400 ml-auto h-8">
                      {t("products.table.price", "Giá bán")}
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right font-black uppercase tracking-widest text-[10px] text-slate-400">
                    <Button variant="ghost" onClick={() => handleSort('stock')} className="hover:bg-transparent p-0 font-black uppercase tracking-widest text-[10px] text-slate-400 ml-auto h-8">
                      {t("products.table.stock", "Kho hàng")}
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right font-black uppercase tracking-widest text-[10px] text-slate-400 hidden lg:table-cell">
                    <Button variant="ghost" onClick={() => handleSort('performance')} className="hover:bg-transparent p-0 font-black uppercase tracking-widest text-[10px] text-slate-400 ml-auto h-8">
                      {t("products.performance", "Hiệu suất")}
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right font-black uppercase tracking-widest text-[10px] text-slate-400 hidden xl:table-cell">{t("products.table.category", "Ngành hàng")}</TableHead>
                  <TableHead className="text-right font-black uppercase tracking-widest text-[10px] text-slate-400 hidden md:table-cell">{t("products.table.status", "Trạng thái")}</TableHead>
                  <TableHead className="text-right font-black uppercase tracking-widest text-[10px] text-slate-400 pr-8">{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-96 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Loader2 className="h-12 w-12 animate-spin mb-6 text-primary/30" />
                        <p className="font-bold uppercase tracking-widest text-xs">{t("products.table.loading", "Đang tải dữ liệu...")}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : sortedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-96 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-24 w-24 bg-slate-50 rounded-[32px] flex items-center justify-center mb-6">
                          <Package className="h-12 w-12 opacity-20" />
                        </div>
                        <p className="font-bold uppercase tracking-widest text-xs">{t("products.noProducts")}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedProducts.map((product) => {
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
                      <TableRow key={product.id} className="group hover:bg-slate-50/80 transition-all border-slate-100">
                        <TableCell className="pl-8">
                          <Input type="checkbox" className="h-5 w-5 rounded-lg border-slate-200 text-primary focus:ring-primary/20" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-5 py-2">
                            <div className="h-16 w-16 rounded-2xl border border-slate-100 bg-white overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-xl group-hover:scale-105 transition-all duration-500">
                              {product.images && product.images.length > 0 ? (
                                <img src={product.images[0].url} alt={product.productName} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-slate-50">
                                  <Package className="h-8 w-8 text-slate-200" />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col min-w-0 space-y-1">
                              <span className="font-black text-base text-slate-900 leading-tight truncate max-w-[200px] md:max-w-[300px] group-hover:text-primary transition-colors" title={product.productName}>
                                {product.productName}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                  ID: {product.id.substring(0, 8).toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end gap-1">
                            <span className="font-black text-base text-primary tracking-tight">
                              {displayPrice}
                            </span>
                            {product.suggestedPrice && product.price && product.price < product.suggestedPrice && (
                              <span className="text-[10px] font-bold text-slate-400 line-through">
                                {formatVND(product.suggestedPrice)}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end gap-1">
                            <span className={cn(
                              "font-black text-base tracking-tight",
                              totalStock < 10 ? "text-rose-600" : "text-slate-900"
                            )}>
                              {totalStock}
                            </span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              {t("products.inStock")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right hidden lg:table-cell">
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "font-black text-[10px] px-3 py-1 rounded-lg uppercase tracking-widest border-none shadow-sm",
                              product.performance === "High" && "bg-emerald-100 text-emerald-700 shadow-emerald-500/10",
                              product.performance === "Medium" && "bg-sky-100 text-sky-700 shadow-sky-500/10",
                              product.performance === "Low" && "bg-amber-100 text-amber-700 shadow-amber-500/10"
                            )}
                          >
                            {product.performance || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right hidden xl:table-cell">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {product.category?.[product.category.length - 1] || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                            {t("products.table.active", "Đang bán")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 transition-all" asChild>
                              <Link to={`/products/edit/${product.id}`}>
                                <Edit className="h-5 w-5" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-destructive hover:bg-destructive/5 transition-all" onClick={() => handleDelete(product.id)}>
                              <Trash2 className="h-5 w-5" />
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
        ) : (
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {isLoading ? (
              <div className="col-span-full h-96 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="h-12 w-12 animate-spin mb-6 text-primary/30" />
                <p className="font-bold uppercase tracking-widest text-xs">{t("products.table.loading", "Đang tải dữ liệu...")}</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="col-span-full h-96 flex flex-col items-center justify-center text-slate-400">
                <div className="h-24 w-24 bg-slate-50 rounded-[32px] flex items-center justify-center mb-6">
                  <Package className="h-12 w-12 opacity-20" />
                </div>
                <p className="font-bold uppercase tracking-widest text-xs">{t("products.noProducts")}</p>
              </div>
            ) : (
              sortedProducts.map((product) => {
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
                  <Card key={product.id} className="group overflow-hidden border-none shadow-xl shadow-slate-200/50 rounded-[32px] bg-white hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 transform hover:-translate-y-1">
                    <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0].url} alt={product.productName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-16 w-16 text-slate-200" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
                        {product.category && product.category.length > 0 && (
                          <Badge className="bg-white/90 backdrop-blur-md shadow-xl text-[10px] font-black uppercase tracking-widest text-slate-900 px-3 py-1 rounded-lg border-none">
                            {product.category[product.category.length - 1]}
                          </Badge>
                        )}
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge 
                          className={cn(
                            "backdrop-blur-md shadow-xl text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border-none",
                            product.performance === "High" && "bg-emerald-500/90 text-white",
                            product.performance === "Medium" && "bg-sky-500/90 text-white",
                            product.performance === "Low" && "bg-amber-500/90 text-white"
                          )}
                        >
                          {product.performance || "N/A"}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="flex gap-2">
                          <Button className="flex-1 rounded-xl font-bold h-10 shadow-lg shadow-primary/30" asChild>
                            <Link to={`/products/edit/${product.id}`}>
                              <Edit className="h-4 w-4 mr-2" /> {t("common.edit")}
                            </Link>
                          </Button>
                          <Button variant="destructive" size="icon" className="rounded-xl h-10 w-10 shadow-lg shadow-destructive/30" onClick={() => handleDelete(product.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="mb-5">
                        <h3 className="font-black text-lg text-slate-900 line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors" title={product.productName}>
                          {product.productName}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                            ID: {product.id.substring(0, 8).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-end pt-4 border-t border-slate-100">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("products.table.price", "Giá bán")}</p>
                          <p className="font-black text-xl text-primary tracking-tight leading-none">{displayPrice}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("products.table.stock", "Kho hàng")}</p>
                          <p className={cn("font-black text-xl tracking-tight leading-none", totalStock < 10 ? "text-rose-600" : "text-slate-900")}>
                            {totalStock}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        )}
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
