import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "motion/react"
import { collection, getDocs, query, orderBy, onSnapshot } from "firebase/firestore"
import { db, auth } from "../lib/firebase"
import { handleFirestoreError, OperationType } from "../lib/firestore-errors"
import { toast } from "sonner"
import { cn } from "@/src/lib/utils"
import { 
  Truck, 
  MapPin, 
  Clock, 
  Package, 
  ShieldCheck, 
  AlertCircle, 
  Search,
  Navigation,
  BarChart3,
  ArrowUpRight,
  Filter,
  MoreHorizontal,
  Warehouse,
  Settings,
  RefreshCw,
  Plus,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Switch } from "@/src/components/ui/switch"

const Logistics = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [inventory, setInventory] = useState<any[]>([])
  const [loadingInventory, setLoadingInventory] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success(t("logistics.syncSuccess", "Đồng bộ tồn kho thành công!"));
    }, 2000);
  };

  const handleAddWarehouse = () => {
    toast.info(t("logistics.addWarehouseInfo", "Tính năng thêm kho hàng đang được phát triển."));
  };

  const handleConfigure = (name: string) => {
    toast.info(t("logistics.configureInfo", "Đang mở cấu hình cho {{name}}...", { name }));
  };

  const handleConnect = (name: string) => {
    toast.success(t("logistics.connectSuccess", "Đã kết nối thành công với {{name}}!", { name }));
  };

  useEffect(() => {
    const fetchInventory = async () => {
      setLoadingInventory(true)
      try {
        const querySnapshot = await getDocs(collection(db, "products"))
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setInventory(productsData)
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, "products")
      } finally {
        setLoadingInventory(false)
      }
    }

    if (activeTab === "inventory") {
      fetchInventory()
    }
  }, [activeTab])

  const [shipments, setShipments] = useState<any[]>([])
  const [loadingShipments, setLoadingShipments] = useState(true)
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [loadingWarehouses, setLoadingWarehouses] = useState(true)

  useEffect(() => {
    if (!auth.currentUser) return

    const qShipments = query(collection(db, "shipments"), orderBy("lastUpdate", "desc"))
    const unsubscribeShipments = onSnapshot(qShipments, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setShipments(docs)
      setLoadingShipments(false)
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "shipments")
      setLoadingShipments(false)
    })

    const qWarehouses = query(collection(db, "warehouses"), orderBy("name", "asc"))
    const unsubscribeWarehouses = onSnapshot(qWarehouses, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setWarehouses(docs)
      setLoadingWarehouses(false)
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "warehouses")
      setLoadingWarehouses(false)
    })

    return () => {
      unsubscribeShipments()
      unsubscribeWarehouses()
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Navigation className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t("logistics.title", "Logistics Control Tower")}</h1>
              <p className="text-slate-500 text-sm">{t("logistics.description", "Quản lý kho vận, tồn kho và đồng bộ đơn vị vận chuyển.")}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleSync} disabled={isSyncing}>
              <RefreshCw className={cn("mr-2 h-4 w-4", isSyncing && "animate-spin")} /> 
              {isSyncing ? t("logistics.syncing", "Đang đồng bộ...") : t("logistics.syncNow", "Đồng bộ ngay")}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border shadow-sm">
            <TabsTrigger value="dashboard">{t("logistics.tabs.dashboard", "Tổng quan")}</TabsTrigger>
            <TabsTrigger value="warehouses">{t("logistics.tabs.warehouses", "Quản lý Kho")}</TabsTrigger>
            <TabsTrigger value="inventory">{t("logistics.tabs.inventory", "Tồn kho")}</TabsTrigger>
            <TabsTrigger value="integrations">{t("logistics.tabs.integrations", "Kết nối WMS")}</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8 animate-in fade-in duration-300">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">{t("logistics.dashboard.activeShipments")}</p>
                <p className="text-2xl font-bold text-slate-900">1,248</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">{t("logistics.dashboard.onTimeRate")}</p>
                <p className="text-2xl font-bold text-slate-900">96.4%</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">{t("logistics.dashboard.avgDeliveryTime")}</p>
                <p className="text-2xl font-bold text-slate-900">1.8 Days</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">{t("logistics.dashboard.delayedOrders")}</p>
                <p className="text-2xl font-bold text-slate-900">14</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Map/Tracking Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{t("logistics.dashboard.liveTrackingMap")}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100">842 {t("logistics.dashboard.moving")}</Badge>
                    <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-100">406 {t("logistics.dashboard.idle")}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] bg-slate-100 relative flex items-center justify-center overflow-hidden">
                  {/* Mock Map Background */}
                  <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/seed/map/1200/800')] bg-cover" />
                  <div className="relative z-10 text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center text-white animate-pulse">
                        <Navigation className="h-8 w-8" />
                      </div>
                    </div>
                    <p className="text-slate-500 font-medium">{t("logistics.dashboard.interactiveMapLoading")}</p>
                  </div>
                  
                  {/* Floating Tracking Card */}
                  <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 bg-white p-4 rounded-xl shadow-xl border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{t("logistics.dashboard.activeRoute")}</span>
                      <Badge className="bg-blue-100 text-blue-700 border-none">{t("logistics.dashboard.fastest")}</Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-slate-300" />
                        <p className="text-sm font-medium text-slate-900">Warehouse A (Hanoi)</p>
                      </div>
                      <div className="ml-1 w-0.5 h-6 bg-slate-100" />
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-indigo-600" />
                        <p className="text-sm font-medium text-slate-900">Customer (District 7, HCMC)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">{t("logistics.dashboard.shipmentStatusOverview")}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead>{t("logistics.dashboard.shipmentId")}</TableHead>
                      <TableHead>{t("logistics.dashboard.customer")}</TableHead>
                      <TableHead>{t("logistics.dashboard.carrier")}</TableHead>
                      <TableHead>{t("logistics.dashboard.status")}</TableHead>
                      <TableHead>{t("logistics.dashboard.eta")}</TableHead>
                      <TableHead className="text-right">{t("logistics.dashboard.action")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shipments.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell className="font-mono text-xs font-bold">{shipment.id}</TableCell>
                        <TableCell className="text-sm">{shipment.customer}</TableCell>
                        <TableCell className="text-sm">{shipment.carrier}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={
                              shipment.status === "Delivered" ? "bg-emerald-50 text-emerald-700" :
                              shipment.status === "Delayed" ? "bg-red-50 text-red-700" :
                              "bg-blue-50 text-blue-700"
                            }
                          >
                            {shipment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">{shipment.eta}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Insights */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-slate-900 text-white">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest text-slate-400">{t("logistics.dashboard.aiOptimizationInsight")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase">{t("logistics.dashboard.costSavingOpportunity")}</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    {t("logistics.dashboard.costSavingDesc")}
                  </p>
                  <Button size="sm" variant="link" className="text-emerald-400 p-0 h-auto">{t("logistics.dashboard.applyOptimization")} <ArrowUpRight className="ml-1 h-3 w-3" /></Button>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-orange-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase">{t("logistics.dashboard.weatherAlert")}</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    {t("logistics.dashboard.weatherAlertDesc")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest text-slate-500">{t("logistics.carrierPerformance", "Hiệu suất ĐVVC")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "GHTK", score: 98, color: "bg-emerald-500" },
                  { name: "GHN", score: 92, color: "bg-blue-500" },
                  { name: "J&T", score: 85, color: "bg-orange-500" },
                ].map((carrier) => (
                  <div key={carrier.name} className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{carrier.name}</span>
                      <span>{carrier.score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${carrier.color}`} style={{ width: `${carrier.score}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
        </TabsContent>

        <TabsContent value="warehouses" className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t("logistics.warehouses.title", "Danh sách Kho hàng")}</h2>
            <Button onClick={handleAddWarehouse}><Plus className="mr-2 h-4 w-4" /> {t("logistics.warehouses.add", "Thêm Kho mới")}</Button>
          </div>
          <Card className="border-none shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>{t("logistics.warehouses.name", "Tên Kho")}</TableHead>
                    <TableHead>{t("logistics.warehouses.type", "Loại Kho")}</TableHead>
                    <TableHead>{t("logistics.warehouses.location", "Vị trí")}</TableHead>
                    <TableHead>{t("logistics.warehouses.capacity", "Sức chứa")}</TableHead>
                    <TableHead>{t("logistics.warehouses.status", "Trạng thái")}</TableHead>
                    <TableHead className="text-right">{t("common.actions", "Hành động")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehouses.map((wh) => (
                    <TableRow key={wh.id}>
                      <TableCell className="font-medium">{wh.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={wh.type === 'fulfillment' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}>
                          {wh.type === 'fulfillment' ? 'Fulfillment' : 'Thông thường'}
                        </Badge>
                      </TableCell>
                      <TableCell>{wh.location}</TableCell>
                      <TableCell>{wh.capacity}</TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-50 text-emerald-700 border-none">{t("common.active", "Hoạt động")}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => toast.success(t("common.editSuccess", "Đang mở giao diện chỉnh sửa..."))}>{t("common.edit", "Chỉnh sửa")}</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t("logistics.inventory.title", "Quản lý Tồn kho")}</h2>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder={t("common.search", "Tìm kiếm...")} className="pl-8 bg-white" />
              </div>
              <Button variant="outline" className="bg-white"><Filter className="mr-2 h-4 w-4" /> {t("common.filter", "Bộ lọc")}</Button>
            </div>
          </div>
          <Card className="border-none shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>{t("logistics.inventory.product", "Sản phẩm")}</TableHead>
                    <TableHead>{t("common.sku", "SKU")}</TableHead>
                    <TableHead>{t("logistics.inventory.warehouse", "Kho hàng")}</TableHead>
                    <TableHead className="text-right">{t("logistics.inventory.stock", "Tồn kho")}</TableHead>
                    <TableHead className="text-right">{t("logistics.inventory.reserved", "Đang giao dịch")}</TableHead>
                    <TableHead className="text-right">{t("logistics.inventory.available", "Có thể bán")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingInventory ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        {t("common.loading", "Đang tải...")}
                      </TableCell>
                    </TableRow>
                  ) : inventory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        {t("common.noData", "Không có dữ liệu")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    inventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="text-muted-foreground">{item.sku || "N/A"}</TableCell>
                        <TableCell>{item.warehouse || "N/A"}</TableCell>
                        <TableCell className="text-right font-medium">{item.stock || 0}</TableCell>
                        <TableCell className="text-right text-orange-600">{item.reserved || 0}</TableCell>
                        <TableCell className="text-right text-emerald-600 font-bold">{(item.stock || 0) - (item.reserved || 0)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t("logistics.integrations.title", "Kết nối Phần mềm Quản lý Kho (WMS)")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-bold text-xl">K</div>
                    <div>
                      <CardTitle className="text-base">KiotViet</CardTitle>
                      <CardDescription>{t("logistics.integrations.syncInventoryOrders", "Đồng bộ tồn kho & đơn hàng")}</CardDescription>
                    </div>
                  </div>
                  <Switch checked={true} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-slate-500">
                  {t("logistics.integrations.kiotVietDesc", "Tự động trừ tồn kho trên KiotViet khi có đơn hàng mới. Cập nhật tồn kho từ KiotViet về hệ thống mỗi 5 phút.")}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleConfigure("KiotViet")}><Settings className="mr-2 h-4 w-4" /> {t("logistics.integrations.configure", "Cấu hình")}</Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={handleSync} disabled={isSyncing}>
                    <RefreshCw className={cn("mr-2 h-4 w-4", isSyncing && "animate-spin")} /> 
                    {isSyncing ? t("logistics.syncing", "Đang đồng bộ...") : t("logistics.integrations.syncNow", "Đồng bộ ngay")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center text-green-700 font-bold text-xl">S</div>
                    <div>
                      <CardTitle className="text-base">Sapo</CardTitle>
                      <CardDescription>{t("logistics.integrations.syncInventoryOrders", "Đồng bộ tồn kho & đơn hàng")}</CardDescription>
                    </div>
                  </div>
                  <Switch checked={false} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-slate-500">
                  {t("logistics.integrations.sapoDesc", "Tự động trừ tồn kho trên Sapo khi có đơn hàng mới. Cập nhật tồn kho từ Sapo về hệ thống mỗi 5 phút.")}
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => handleConnect("Sapo")}>{t("logistics.integrations.connect", "Kết nối")}</Button>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-700 font-bold text-xl">N</div>
                    <div>
                      <CardTitle className="text-base">Nhanh.vn</CardTitle>
                      <CardDescription>{t("logistics.integrations.syncInventoryOrders", "Đồng bộ tồn kho & đơn hàng")}</CardDescription>
                    </div>
                  </div>
                  <Switch checked={false} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-slate-500">
                  {t("logistics.integrations.nhanhVnDesc", "Tự động trừ tồn kho trên Nhanh.vn khi có đơn hàng mới. Cập nhật tồn kho từ Nhanh.vn về hệ thống mỗi 5 phút.")}
                </div>
                <Button variant="outline" size="sm" className="w-full">{t("logistics.integrations.connect", "Kết nối")}</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}

export default Logistics
