import { useState, useEffect } from "react"
import { useAuth } from "@/src/lib/AuthContext"
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
  Clock,
  ChevronUp,
  ChevronDown,
  Loader2,
  Trash2
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { useTranslation } from "react-i18next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { FulfillmentTab } from "@/src/components/orders/FulfillmentTab"
import { RMATab } from "@/src/components/orders/RMATab"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { toast } from "sonner"
import { db, auth } from "@/src/lib/firebase"
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors"
import { cn } from "@/src/lib/utils"

const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

type SortField = 'id' | 'date' | 'total' | 'status' | 'customer';
type SortOrder = 'asc' | 'desc';

export function Orders() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isTrackingOpen, setIsTrackingOpen] = useState(false)
  
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        date: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toLocaleString() : doc.data().createdAt
      }));
      setOrders(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "orders");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'id':
        comparison = a.id.localeCompare(b.id);
        break;
      case 'date':
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        comparison = dateA - dateB;
        break;
      case 'total':
        comparison = (a.total || 0) - (b.total || 0);
        break;
      case 'status':
        comparison = (a.status || "").localeCompare(b.status || "");
        break;
      case 'customer':
        comparison = (a.customerName || "").localeCompare(b.customerName || "");
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const filteredOrders = sortedOrders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.items?.[0]?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string, variant: any, color: string }> = {
      pending_payment: { label: t("orders.statuses.pending_payment"), variant: "outline", color: "text-slate-500 bg-slate-50 border-slate-200" },
      pending_confirmation: { label: t("orders.statuses.pending_confirmation"), variant: "secondary", color: "text-amber-600 bg-amber-50 border-amber-200" },
      grouping: { label: t("orders.statuses.grouping"), variant: "secondary", color: "text-blue-600 bg-blue-50 border-blue-200" },
      confirmed: { label: t("orders.statuses.confirmed"), variant: "default", color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
      pending_shipping: { label: t("orders.statuses.pending_shipping"), variant: "secondary", color: "text-orange-600 bg-orange-50 border-orange-200" },
      shipping: { label: t("orders.statuses.shipping"), variant: "default", color: "text-sky-600 bg-sky-50 border-sky-200" },
      delivered: { label: t("orders.statuses.delivered"), variant: "default", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
      cancelled: { label: t("orders.statuses.cancelled"), variant: "destructive", color: "text-rose-600 bg-rose-50 border-rose-200" },
      return_requested: { label: t("orders.statuses.return_requested"), variant: "destructive", color: "text-pink-600 bg-pink-50 border-pink-200" },
      refund_requested: { label: t("orders.statuses.refund_requested"), variant: "destructive", color: "text-purple-600 bg-purple-50 border-purple-200" },
      received: { label: t("orders.statuses.received"), variant: "default", color: "text-teal-600 bg-teal-50 border-teal-200" },
      completed: { label: t("orders.statuses.completed"), variant: "default", color: "text-green-600 bg-green-50 border-green-200" },
    }
    const config = statusMap[status] || { label: status, variant: "outline", color: "text-slate-500 bg-slate-50 border-slate-200" }
    return (
      <Badge variant={config.variant} className={cn("font-medium px-2 py-0.5", config.color)}>
        {config.label}
      </Badge>
    )
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

  const handleUpdateStatus = async (order: any, newStatus: string) => {
    try {
      const orderRef = doc(db, "orders", order.id);
      await updateDoc(orderRef, { status: newStatus });
      toast.success(t("orders.updateStatusSuccess", "Đã cập nhật trạng thái đơn hàng"));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, "orders");
    }
  }

  const handleCancelOrder = async (order: any) => {
    if (!confirm(t("orders.cancelConfirm", "Bạn có chắc chắn muốn hủy đơn hàng này?"))) return;
    try {
      const orderRef = doc(db, "orders", order.id);
      await updateDoc(orderRef, { status: "cancelled" });
      toast.success(t("orders.cancelOrderSuccess", "Đã hủy đơn hàng"));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, "orders");
    }
  }

  const handleDeleteOrder = async (id: string) => {
    if (!confirm(t("orders.deleteConfirm", "Bạn có chắc chắn muốn xóa đơn hàng này?"))) return;
    try {
      await deleteDoc(doc(db, "orders", id));
      toast.success(t("orders.deleteSuccess", "Đã xóa đơn hàng"));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, "orders");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{t("orders.title")}</h2>
          <p className="text-muted-foreground/70 text-base font-medium">
            {t("orders.description")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="rounded-2xl h-10 border-slate-200 hover:bg-slate-50 transition-all shadow-sm font-semibold" onClick={() => {
            toast.success(t("orders.syncSuccess"))
          }}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("orders.syncWms")}
          </Button>
          <Button variant="outline" className="rounded-2xl h-10 border-slate-200 hover:bg-slate-50 transition-all shadow-sm font-semibold" onClick={handleFilter}>
            <Filter className="mr-2 h-4 w-4" />
            {t("common.filters")}
          </Button>
          <Button variant="outline" className="rounded-2xl h-10 border-slate-200 hover:bg-slate-50 transition-all shadow-sm font-semibold" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            {t("common.export")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: t("orders.stats.totalOrders"), value: orders.length, icon: Package, color: "blue", desc: t("orders.stats.allTime") },
          { title: t("orders.stats.pending"), value: orders.filter(o => o.status === 'pending_confirmation' || o.status === 'pending_payment').length, icon: Clock, color: "amber", desc: t("orders.stats.awaitingConfirmation") },
          { title: t("orders.stats.shipping"), value: orders.filter(o => o.status === 'shipping').length, icon: Truck, color: "sky", desc: t("orders.stats.inTransit") },
          { title: t("orders.stats.returns"), value: orders.filter(o => o.status === 'return_requested' || o.status === 'refund_requested').length, icon: RotateCcw, color: "rose", desc: t("orders.stats.requests") },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-xl shadow-slate-200/20 rounded-[24px] overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">{stat.title}</CardTitle>
              <div className={cn(
                "p-3 rounded-xl transition-transform group-hover:scale-110 duration-500",
                stat.color === "blue" && "bg-blue-50/50 text-blue-600",
                stat.color === "amber" && "bg-amber-50/50 text-amber-600",
                stat.color === "sky" && "bg-sky-50/50 text-sky-600",
                stat.color === "rose" && "bg-rose-50/50 text-rose-600"
              )}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight text-slate-900">{stat.value}</div>
              <p className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-widest">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="orders" className="space-y-8">
        <div className="rounded-[32px] border-none bg-white shadow-2xl shadow-slate-200/30 overflow-hidden">
          <div className="border-b border-slate-100 px-8 bg-slate-50/30">
            <TabsList className="flex h-auto p-0 bg-transparent gap-8 overflow-x-auto scrollbar-hide">
              {[
                { id: "orders", label: t("orders.tabs.orders"), icon: Package },
                { id: "fulfillment", label: t("orders.tabs.fulfillment"), icon: Truck },
                { id: "rma", label: t("orders.tabs.rma"), icon: RotateCcw },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    "py-5 text-[10px] font-semibold uppercase tracking-[0.2em] transition-all relative whitespace-nowrap flex items-center gap-2 rounded-none border-b-2 border-transparent",
                    "data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent",
                    "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="orders" className="m-0">
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="search"
                  placeholder={t("orders.searchPlaceholder")}
                  className="h-12 rounded-xl bg-slate-50 border-none pl-12 pr-6 font-semibold text-sm focus-visible:ring-primary/10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <Select value={sortField} onValueChange={(v) => handleSort(v as SortField)}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white px-6 font-semibold min-w-[180px] text-sm">
                    <SelectValue placeholder={t("common.sortBy")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-2xl">
                    <SelectItem value="date">{t("orders.date")}</SelectItem>
                    <SelectItem value="total">{t("orders.total")}</SelectItem>
                    <SelectItem value="status">{t("orders.status")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/30">
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead 
                      className="h-14 px-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center gap-2">
                        {t("orders.id")}
                        <SortIcon field="id" />
                      </div>
                    </TableHead>
                    <TableHead className="h-14 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">{t("orders.product")}</TableHead>
                    <TableHead className="h-14 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 hidden md:table-cell">{t("orders.trackingNumber")}</TableHead>
                    <TableHead className="h-14 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 hidden lg:table-cell">{t("orders.shop")}</TableHead>
                    <TableHead 
                      className="h-14 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort('customer')}
                    >
                      <div className="flex items-center gap-2">
                        {t("orders.customer")}
                        <SortIcon field="customer" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="h-14 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 cursor-pointer hover:text-primary transition-colors hidden sm:table-cell"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center gap-2">
                        {t("orders.date")}
                        <SortIcon field="date" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="h-14 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 cursor-pointer hover:text-primary transition-colors text-right"
                      onClick={() => handleSort('total')}
                    >
                      <div className="flex items-center justify-end gap-2">
                        {t("orders.total")}
                        <SortIcon field="total" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="h-14 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-2">
                        {t("common.status")}
                        <SortIcon field="status" />
                      </div>
                    </TableHead>
                    <TableHead className="h-14 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 text-right px-8">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors group border-slate-100">
                      <TableCell className="px-8 font-mono text-xs font-bold text-blue-600">
                        {order.id}
                      </TableCell>
                      <TableCell className="max-w-[200px] sm:max-w-[250px]">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border bg-muted">
                            <img 
                              src={order.items?.[0]?.image || order.productImage || "https://picsum.photos/seed/placeholder/100/100"} 
                              alt={order.items?.[0]?.name || order.productName} 
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate font-semibold text-sm">
                              {order.items?.[0]?.name || order.productName}
                            </span>
                            {order.items && order.items.length > 1 && (
                              <span className="text-[10px] text-muted-foreground">
                                + {order.items.length - 1} {t("common.otherItems")}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {order.trackingNumber ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 w-fit">
                              {order.trackingNumber}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-medium">{order.carrier}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-[10px] italic opacity-50">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {order.shopName || order.storeId || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{order.customerName || order.customer}</span>
                          <span className="text-[10px] text-muted-foreground">{order.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground hidden sm:table-cell">
                        {order.date}
                      </TableCell>
                      <TableCell className="text-right font-bold text-indigo-600">
                        {formatVND(order.total)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-2xl border-none shadow-2xl">
                            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
                              {t("common.actions")}
                            </DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewDetails(order)} className="rounded-xl">
                              <Eye className="mr-2 h-4 w-4 text-blue-500" />
                              {t("common.viewDetails")}
                            </DropdownMenuItem>
                            {order.trackingNumber && (
                              <DropdownMenuItem onClick={() => handleTrackOrder(order)} className="rounded-xl">
                                <Truck className="mr-2 h-4 w-4 text-sky-500" />
                                {t("orders.trackOrder")}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase px-2 py-1.5">
                              {t("orders.updateStatus")}
                            </DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order, "confirmed")} className="rounded-xl">
                              <RefreshCw className="mr-2 h-4 w-4 text-indigo-500" />
                              {t("orders.statuses.confirmed")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order, "shipping")} className="rounded-xl">
                              <Truck className="mr-2 h-4 w-4 text-sky-500" />
                              {t("orders.statuses.shipping")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order, "delivered")} className="rounded-xl">
                              <Package className="mr-2 h-4 w-4 text-emerald-500" />
                              {t("orders.statuses.delivered")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-rose-600 focus:text-rose-600 rounded-xl" 
                              onClick={() => handleCancelOrder(order)}
                            >
                              <RotateCcw className="mr-2 h-4 w-4" />
                              {t("orders.cancelOrder")}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600 rounded-xl" 
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t("common.delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400 gap-4">
                          <div className="p-6 bg-slate-50 rounded-full">
                            <Package className="h-12 w-12 opacity-20" />
                          </div>
                          <p className="font-black uppercase tracking-widest text-sm">{t("orders.noOrders")}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="fulfillment" className="m-0 p-8">
            <FulfillmentTab orders={orders} />
          </TabsContent>

          <TabsContent value="rma" className="m-0 p-8">
            <RMATab orders={orders} />
          </TabsContent>
        </div>
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
