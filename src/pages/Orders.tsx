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
  Search, 
  Filter, 
  MoreHorizontal, 
  Download, 
  Package, 
  Truck, 
  RotateCcw, 
  Eye, 
  Printer, 
  RefreshCw,
  Clock
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog"
import { useTranslation } from "react-i18next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { FulfillmentTab } from "@/src/components/orders/FulfillmentTab"
import { RMATab } from "@/src/components/orders/RMATab"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { toast } from "sonner"

const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const initialOrders = [
  { 
    id: "ORD-7352", 
    customer: "Nguyễn Văn A", 
    phone: "0901234567",
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    productName: "iPhone 15 Pro Max 256GB",
    productImage: "https://picsum.photos/seed/iphone/100/100",
    shopName: "Apple Flagship Store",
    date: "2026-03-02 14:30", 
    total: 34990000, 
    status: "pending_confirmation", 
    items: 1,
    trackingNumber: ""
  },
  { 
    id: "ORD-7351", 
    customer: "Trần Thị B", 
    phone: "0912345678",
    address: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    productName: "Tai nghe Sony WH-1000XM5",
    productImage: "https://picsum.photos/seed/sony/100/100",
    shopName: "Sony Center",
    date: "2026-03-02 10:15", 
    total: 8490000, 
    status: "shipping", 
    items: 1,
    trackingNumber: "GHTK123456789",
    carrier: "Giao Hàng Tiết Kiệm"
  },
  { 
    id: "ORD-7350", 
    customer: "Lê Văn C", 
    phone: "0923456789",
    address: "789 Đường CMT8, Quận 3, TP.HCM",
    productName: "MacBook Pro M3 14 inch",
    productImage: "https://picsum.photos/seed/macbook/100/100",
    shopName: "Apple Flagship Store",
    date: "2026-03-01 16:45", 
    total: 45990000, 
    status: "delivered", 
    items: 1,
    trackingNumber: "GHN987654321",
    carrier: "Giao Hàng Nhanh"
  },
  { 
    id: "ORD-7349", 
    customer: "Phạm Thị D", 
    phone: "0934567890",
    address: "101 Đường Võ Văn Kiệt, Quận 5, TP.HCM",
    productName: "Ốp lưng iPhone 15",
    productImage: "https://picsum.photos/seed/case/100/100",
    shopName: "Phụ kiện Số",
    date: "2026-03-01 09:00", 
    total: 450000, 
    status: "cancelled", 
    items: 2,
    trackingNumber: ""
  },
  { 
    id: "ORD-7348", 
    customer: "Hoàng Văn E", 
    phone: "0945678901",
    address: "202 Đường Nguyễn Trãi, Quận 5, TP.HCM",
    productName: "Bàn phím cơ Keychron K2",
    productImage: "https://picsum.photos/seed/keyboard/100/100",
    shopName: "GearVN",
    date: "2026-02-28 20:30", 
    total: 2100000, 
    status: "completed", 
    items: 1,
    trackingNumber: "VTP555666777",
    carrier: "Viettel Post"
  },
]

export function Orders() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isTrackingOpen, setIsTrackingOpen] = useState(false)
  const { t } = useTranslation()

  const filteredOrders = initialOrders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.shopName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string, variant: any }> = {
      pending_payment: { label: t("orders.statuses.pending_payment"), variant: "outline" },
      pending_confirmation: { label: t("orders.statuses.pending_confirmation"), variant: "secondary" },
      grouping: { label: t("orders.statuses.grouping"), variant: "secondary" },
      confirmed: { label: t("orders.statuses.confirmed"), variant: "default" },
      pending_shipping: { label: t("orders.statuses.pending_shipping"), variant: "secondary" },
      shipping: { label: t("orders.statuses.shipping"), variant: "default" },
      delivered: { label: t("orders.statuses.delivered"), variant: "default" },
      cancelled: { label: t("orders.statuses.cancelled"), variant: "destructive" },
      return_requested: { label: t("orders.statuses.return_requested"), variant: "destructive" },
      refund_requested: { label: t("orders.statuses.refund_requested"), variant: "destructive" },
      received: { label: t("orders.statuses.received"), variant: "default" },
      completed: { label: t("orders.statuses.completed"), variant: "default" },
    }
    const config = statusMap[status] || { label: status, variant: "outline" }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  const handleTrackOrder = (order: any) => {
    setSelectedOrder(order)
    setIsTrackingOpen(true)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    toast.success(t("common.exportSuccess", "Đã xuất dữ liệu đơn hàng thành công"));
  }

  const handleFilter = () => {
    toast.success(t("common.filterSuccess", "Đã áp dụng bộ lọc"));
  }

  const handleUpdateStatus = () => {
    toast.success(t("orders.updateStatusSuccess", "Đã cập nhật trạng thái đơn hàng"));
  }

  const handleCancelOrder = () => {
    toast.success(t("orders.cancelOrderSuccess", "Đã hủy đơn hàng"));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("orders.title")}</h2>
          <p className="text-muted-foreground">
            {t("orders.description")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => {
            toast.success(t("orders.syncSuccess"))
          }}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("orders.syncWms")}
          </Button>
          <Button variant="outline" onClick={handleFilter}>
            <Filter className="mr-2 h-4 w-4" />
            {t("common.filters")}
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            {t("common.export")}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("orders.stats.totalOrders")}</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialOrders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{t("orders.stats.allTime")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("orders.stats.pending")}</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-full">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-1">{t("orders.stats.awaitingConfirmation")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("orders.stats.shipping")}</CardTitle>
            <div className="p-2 bg-purple-100 rounded-full">
              <Truck className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-1">{t("orders.stats.inTransit")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("orders.stats.returns")}</CardTitle>
            <div className="p-2 bg-red-100 rounded-full">
              <RotateCcw className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">{t("orders.stats.requests")}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto p-1 bg-muted/50">
          <TabsTrigger value="orders" className="gap-2 py-2">
            <Package className="h-4 w-4" />
            {t("orders.tabs.orders")}
          </TabsTrigger>
          <TabsTrigger value="fulfillment" className="gap-2 py-2">
            <Truck className="h-4 w-4" />
            {t("orders.tabs.fulfillment")}
          </TabsTrigger>
          <TabsTrigger value="rma" className="gap-2 py-2">
            <RotateCcw className="h-4 w-4" />
            {t("orders.tabs.rma")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden">
            <div className="p-4 border-b flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("orders.searchPlaceholder")}
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[100px]">{t("orders.id")}</TableHead>
                    <TableHead>{t("orders.product")}</TableHead>
                    <TableHead>{t("orders.trackingNumber")}</TableHead>
                    <TableHead>{t("orders.shop")}</TableHead>
                    <TableHead>{t("orders.customer")}</TableHead>
                    <TableHead>{t("orders.date")}</TableHead>
                    <TableHead className="text-right">{t("orders.total")}</TableHead>
                    <TableHead>{t("common.status")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell className="max-w-[250px]">
                        <div className="flex items-center gap-3">
                          <img 
                            src={order.productImage} 
                            alt={order.productName} 
                            className="h-10 w-10 rounded-md object-cover border"
                            referrerPolicy="no-referrer"
                          />
                          <span className="truncate font-medium">{order.productName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.trackingNumber ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded w-fit">
                              {order.trackingNumber}
                            </span>
                            <span className="text-[10px] text-muted-foreground">{order.carrier}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>{order.shopName}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="whitespace-nowrap">{order.date}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        {formatVND(order.total)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("common.actions")}</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                              <Eye className="mr-2 h-4 w-4" />
                              {t("common.viewDetails")}
                            </DropdownMenuItem>
                            {order.trackingNumber && (
                              <DropdownMenuItem onClick={() => handleTrackOrder(order)}>
                                <Truck className="mr-2 h-4 w-4" />
                                {t("orders.trackOrder")}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={handleUpdateStatus}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              {t("orders.updateStatus")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={handleCancelOrder}>
                              {t("orders.cancelOrder")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        {t("orders.noOrders")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fulfillment">
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <FulfillmentTab />
          </div>
        </TabsContent>

        <TabsContent value="rma">
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <RMATab />
          </div>
        </TabsContent>
      </Tabs>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("orders.details.title")} - {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              {t("orders.date")}: {selectedOrder?.date}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">
                  {t("orders.details.customerInfo")}
                </h4>
                <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                  <p className="font-medium">{selectedOrder?.customer}</p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">{t("orders.details.phone")}:</span> {selectedOrder?.phone}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">
                  {t("orders.details.shippingInfo")}
                </h4>
                <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{t("orders.details.address")}:</span> {selectedOrder?.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">
                  {t("orders.product")}
                </h4>
                <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                  <p className="font-medium">{selectedOrder?.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">{t("orders.shop")}:</span> {selectedOrder?.shopName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">{t("orders.items")}:</span> {selectedOrder?.items}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">
                  {t("orders.total")}
                </h4>
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-2xl font-bold text-primary">
                    {selectedOrder && formatVND(selectedOrder.total)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handlePrint} className="w-full sm:w-auto">
              <Printer className="mr-2 h-4 w-4" />
              {t("orders.details.print")}
            </Button>
            <Button onClick={() => setIsDetailsOpen(false)} className="w-full sm:w-auto">
              {t("common.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tracking Dialog */}
      <Dialog open={isTrackingOpen} onOpenChange={setIsTrackingOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("orders.tracking.title")}</DialogTitle>
            <DialogDescription>
              {t("orders.tracking.description")} {selectedOrder?.trackingNumber}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("orders.tracking.carrier")}</p>
                <p className="font-bold">{selectedOrder?.carrier}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground">{t("orders.tracking.status")}</p>
                <Badge variant="default" className="bg-primary">
                  {selectedOrder?.status === "delivered" ? t("orders.tracking.delivered") : t("orders.tracking.inTransit")}
                </Badge>
              </div>
            </div>

            <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-muted">
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center border-4 border-background">
                  <div className="h-2 w-2 rounded-full bg-background" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{t("orders.tracking.step3.title")}</p>
                  <p className="text-xs text-muted-foreground">2026-03-02 10:00 - {t("orders.tracking.step3.desc")}</p>
                </div>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-muted flex items-center justify-center border-4 border-background">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/50" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-muted-foreground">{t("orders.tracking.step2.title")}</p>
                  <p className="text-xs text-muted-foreground">2026-03-01 15:30 - {t("orders.tracking.step2.desc")}</p>
                </div>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-muted flex items-center justify-center border-4 border-background">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/50" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-muted-foreground">{t("orders.tracking.step1.title")}</p>
                  <p className="text-xs text-muted-foreground">2026-03-01 09:00 - {t("orders.tracking.step1.desc")}</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsTrackingOpen(false)} className="w-full">
              {t("common.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
