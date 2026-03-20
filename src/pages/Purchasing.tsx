import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  ShoppingCart,
  Truck,
  Package,
  FileText,
  TrendingUp,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
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
import { Badge } from "@/src/components/ui/badge"
import { Progress } from "@/src/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { toast } from "sonner"

export function Purchasing() {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newRequisition, setNewRequisition] = useState({
    requester: "",
    item: "",
    quantity: "",
    priority: "medium"
  })

  // Mock Data for Requisitions
  const [requisitions, setRequisitions] = useState([
    { id: "PR-2024-001", requester: "IT Department", item: "MacBook Pro M3", quantity: 5, date: "2024-03-01", status: "pending", priority: "high" },
    { id: "PR-2024-002", requester: "Marketing", item: "Printing Paper A4", quantity: 50, date: "2024-03-02", status: "approved", priority: "medium" },
    { id: "PR-2024-003", requester: "HR", item: "Office Chairs", quantity: 10, date: "2024-03-03", status: "rejected", priority: "low" },
  ])

  const handleCreateRequisition = () => {
    if (!newRequisition.requester || !newRequisition.item || !newRequisition.quantity) {
      toast.error("Vui lòng điền đầy đủ thông tin")
      return
    }

    const req = {
      id: `PR-2024-${(requisitions.length + 1).toString().padStart(3, '0')}`,
      requester: newRequisition.requester,
      item: newRequisition.item,
      quantity: parseInt(newRequisition.quantity),
      date: new Date().toISOString().split('T')[0],
      status: "pending",
      priority: newRequisition.priority
    }

    setRequisitions([req, ...requisitions])
    setIsModalOpen(false)
    setNewRequisition({ requester: "", item: "", quantity: "", priority: "medium" })
    toast.success("Đã tạo yêu cầu mua hàng mới")
  }

  // Mock Data for Suppliers
  const [suppliers] = useState([
    { id: 1, name: "TechZone Suppliers", category: "Electronics", rating: 4.8, status: "active", lastOrder: "2024-02-28" },
    { id: 2, name: "Office Essentials Co.", category: "Stationery", rating: 4.2, status: "active", lastOrder: "2024-03-01" },
    { id: 3, name: "Global Logistics Ltd.", category: "Logistics", rating: 3.5, status: "review", lastOrder: "2024-01-15" },
  ])

  // Mock Data for Inventory
  const [inventory] = useState([
    { id: "SKU-001", name: "Wireless Mouse", stock: 150, safetyStock: 50, status: "ok" },
    { id: "SKU-002", name: "Mechanical Keyboard", stock: 20, safetyStock: 30, status: "low" },
    { id: "SKU-003", name: "Monitor 27 inch", stock: 5, safetyStock: 10, status: "critical" },
    { id: "SKU-004", name: "USB-C Hub", stock: 200, safetyStock: 40, status: "overstock" },
  ])

  // Mock Data for Forecasting
  const [forecasts] = useState([
    { id: 1, item: "Wireless Mouse", currentStock: 150, predictedDemand: 180, suggestedOrder: 50, confidence: 92 },
    { id: 2, item: "Mechanical Keyboard", currentStock: 20, predictedDemand: 60, suggestedOrder: 50, confidence: 85 },
    { id: 3, item: "Monitor 27 inch", currentStock: 5, predictedDemand: 25, suggestedOrder: 25, confidence: 88 },
  ])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("purchasing.title")}</h2>
          <p className="text-muted-foreground">
            {t("purchasing.description")}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> {t("purchasing.requisitions.create")}
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tạo yêu cầu mua hàng</DialogTitle>
            <DialogDescription>
              Điền thông tin chi tiết để tạo yêu cầu mua sắm mới.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="requester" className="text-right">Phòng ban</Label>
              <Input 
                id="requester" 
                value={newRequisition.requester} 
                onChange={(e) => setNewRequisition({...newRequisition, requester: e.target.value})}
                className="col-span-3" 
                placeholder="VD: IT Department"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item" className="text-right">Mặt hàng</Label>
              <Input 
                id="item" 
                value={newRequisition.item} 
                onChange={(e) => setNewRequisition({...newRequisition, item: e.target.value})}
                className="col-span-3" 
                placeholder="VD: MacBook Pro M3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">Số lượng</Label>
              <Input 
                id="quantity" 
                type="number"
                value={newRequisition.quantity} 
                onChange={(e) => setNewRequisition({...newRequisition, quantity: e.target.value})}
                className="col-span-3" 
                placeholder="VD: 5"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">Độ ưu tiên</Label>
              <Select value={newRequisition.priority} onValueChange={(val) => setNewRequisition({...newRequisition, priority: val})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn độ ưu tiên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button onClick={handleCreateRequisition}>Tạo yêu cầu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="requisitions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requisitions">{t("purchasing.tabs.requisitions")}</TabsTrigger>
          <TabsTrigger value="suppliers">{t("purchasing.tabs.suppliers")}</TabsTrigger>
          <TabsTrigger value="inventory">{t("purchasing.tabs.inventory")}</TabsTrigger>
          <TabsTrigger value="reports">{t("purchasing.tabs.reports")}</TabsTrigger>
          <TabsTrigger value="forecasting">{t("purchasing.tabs.forecasting")}</TabsTrigger>
        </TabsList>

        {/* Requisitions Tab */}
        <TabsContent value="requisitions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("purchasing.requisitions.pending")}</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">{t("purchasing.requisitions.requiresApproval")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("purchasing.requisitions.approvedMonth")}</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">{t("purchasing.requisitions.vsLastMonth", { value: "+10%" })}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("purchasing.requisitions.totalSpend")}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,450</div>
                <p className="text-xs text-muted-foreground">{t("purchasing.requisitions.forApproved")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("purchasing.requisitions.rejected")}</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">{t("purchasing.requisitions.thisMonth")}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("purchasing.requisitions.listTitle")}</CardTitle>
              <CardDescription>
                {t("purchasing.requisitions.listDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Input placeholder={t("purchasing.requisitions.searchPlaceholder")} className="w-[300px]" />
                  <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("purchasing.requisitions.id")}</TableHead>
                    <TableHead>{t("purchasing.requisitions.requester")}</TableHead>
                    <TableHead>{t("purchasing.requisitions.item")}</TableHead>
                    <TableHead>{t("purchasing.requisitions.quantity")}</TableHead>
                    <TableHead>{t("purchasing.requisitions.date")}</TableHead>
                    <TableHead>{t("purchasing.requisitions.priority")}</TableHead>
                    <TableHead>{t("purchasing.requisitions.status")}</TableHead>
                    <TableHead className="text-right">{t("purchasing.requisitions.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requisitions.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.id}</TableCell>
                      <TableCell>{req.requester}</TableCell>
                      <TableCell>{req.item}</TableCell>
                      <TableCell>{req.quantity}</TableCell>
                      <TableCell>{req.date}</TableCell>
                      <TableCell>
                        <Badge variant={req.priority === "high" ? "destructive" : req.priority === "medium" ? "default" : "secondary"}>
                          {req.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={req.status === "approved" ? "default" : req.status === "pending" ? "outline" : "secondary"}>
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("purchasing.requisitions.actions")}</DropdownMenuLabel>
                            <DropdownMenuItem>{t("purchasing.requisitions.viewDetails")}</DropdownMenuItem>
                            <DropdownMenuItem>{t("purchasing.requisitions.approve")}</DropdownMenuItem>
                            <DropdownMenuItem>{t("purchasing.requisitions.reject")}</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("purchasing.suppliers.title")}</CardTitle>
              <CardDescription>
                {t("purchasing.suppliers.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("purchasing.suppliers.name")}</TableHead>
                    <TableHead>{t("purchasing.suppliers.category")}</TableHead>
                    <TableHead>{t("purchasing.suppliers.rating")}</TableHead>
                    <TableHead>{t("purchasing.suppliers.status")}</TableHead>
                    <TableHead>{t("purchasing.suppliers.lastOrder")}</TableHead>
                    <TableHead className="text-right">{t("purchasing.suppliers.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-bold mr-1">{supplier.rating}</span>
                          <span className="text-muted-foreground">/ 5.0</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={supplier.status === "active" ? "default" : "destructive"}>
                          {supplier.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{supplier.lastOrder}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">{t("purchasing.suppliers.evaluate")}</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
             <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t("purchasing.inventory.totalItems")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t("purchasing.inventory.lowStockAlerts")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">15</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t("purchasing.inventory.value")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$450,000</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("purchasing.inventory.title")}</CardTitle>
              <CardDescription>
                {t("purchasing.inventory.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("purchasing.inventory.sku")}</TableHead>
                    <TableHead>{t("purchasing.inventory.productName")}</TableHead>
                    <TableHead>{t("purchasing.inventory.currentStock")}</TableHead>
                    <TableHead>{t("purchasing.inventory.safetyStock")}</TableHead>
                    <TableHead>{t("purchasing.inventory.status")}</TableHead>
                    <TableHead className="text-right">{t("purchasing.inventory.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.stock}</TableCell>
                      <TableCell>{item.safetyStock}</TableCell>
                      <TableCell>
                        <Badge variant={
                          item.status === "ok" ? "default" :
                          item.status === "low" ? "destructive" :
                          item.status === "critical" ? "destructive" : "secondary"
                        }>
                          {item.status === "critical" && <AlertTriangle className="mr-1 h-3 w-3" />}
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">{t("purchasing.inventory.adjust")}</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("purchasing.reports.title")}</CardTitle>
              <CardDescription>
                {t("purchasing.reports.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <BarChart3 className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">{t("purchasing.reports.chartPlaceholder")}</p>
                  <Button variant="outline" className="mt-4">
                    <Download className="mr-2 h-4 w-4" /> {t("purchasing.reports.export")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forecasting Tab */}
        <TabsContent value="forecasting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("purchasing.forecasting.title")}</CardTitle>
              <CardDescription>
                {t("purchasing.forecasting.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("purchasing.forecasting.item")}</TableHead>
                    <TableHead>{t("purchasing.forecasting.currentStock")}</TableHead>
                    <TableHead>{t("purchasing.forecasting.predictedDemand")}</TableHead>
                    <TableHead>{t("purchasing.forecasting.suggestedOrder")}</TableHead>
                    <TableHead>{t("purchasing.forecasting.confidence")}</TableHead>
                    <TableHead className="text-right">{t("purchasing.forecasting.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forecasts.map((forecast) => (
                    <TableRow key={forecast.id}>
                      <TableCell className="font-medium">{forecast.item}</TableCell>
                      <TableCell>{forecast.currentStock}</TableCell>
                      <TableCell>{forecast.predictedDemand}</TableCell>
                      <TableCell className="font-bold text-blue-600">{forecast.suggestedOrder}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={forecast.confidence} className="w-[60px]" />
                          <span className="text-xs">{forecast.confidence}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm">{t("purchasing.forecasting.createPO")}</Button>
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
