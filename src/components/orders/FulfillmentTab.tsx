import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
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
import { Search, Truck, MoreHorizontal, RefreshCw, Edit2, Zap, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Label } from "@/src/components/ui/label"
import { db } from "@/src/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { handleFirestoreError } from "@/src/lib/firestore-errors"

const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

interface FulfillmentTabProps {
  orders: any[];
}

export function FulfillmentTab({ orders }: FulfillmentTabProps) {
  const { t } = useTranslation()
  const [activeSubTab, setActiveSubTab] = useState("coordination")
  const [searchTerm, setSearchTerm] = useState("")
  const [isUpdateTrackingOpen, setIsUpdateTrackingOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [newTracking, setNewTracking] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const filtered = orders.filter(item => 
    (item.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.customerName?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (item.status === 'shipping' || item.status === 'delivered' || item.status === 'confirmed')
  )

  const handleUpdateTracking = (item: any) => {
    setSelectedItem(item)
    setNewTracking(item.trackingNumber || "")
    setIsUpdateTrackingOpen(true)
  }

  const saveTracking = async () => {
    if (!selectedItem) return;
    setIsSaving(true)
    try {
      const orderRef = doc(db, "orders", selectedItem.id);
      await updateDoc(orderRef, {
        trackingNumber: newTracking,
        status: selectedItem.status === 'confirmed' ? 'shipping' : selectedItem.status
      });
      setIsUpdateTrackingOpen(false)
    } catch (error) {
      handleFirestoreError(error, 'update' as any, `orders/${selectedItem.id}`);
    } finally {
      setIsSaving(false)
    }
  }

  const generateTracking = async (item: any) => {
    const prefix = item.carrier === "Giao Hàng Nhanh" ? "GHN" : item.carrier === "Viettel Post" ? "VT" : "NJV"
    const randomCode = Math.floor(100000000 + Math.random() * 900000000)
    const generatedCode = `${prefix}${randomCode}`
    
    try {
      const orderRef = doc(db, "orders", item.id);
      await updateDoc(orderRef, {
        trackingNumber: generatedCode,
        status: item.status === 'confirmed' ? 'shipping' : item.status
      });
    } catch (error) {
      handleFirestoreError(error, 'update' as any, `orders/${item.id}`);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-xl font-bold">{t("orders.fulfillment.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("orders.fulfillment.description")}</p>
        </div>
        
        <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="coordination">{t("orders.fulfillment.coordination")}</TabsTrigger>
            <TabsTrigger value="status">{t("orders.fulfillment.carrierStatus")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeSubTab === "coordination" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
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
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t("orders.fulfillment.updateStatus")}
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("orders.id")}</TableHead>
                  <TableHead>{t("orders.fulfillment.carrier")}</TableHead>
                  <TableHead>{t("orders.fulfillment.trackingNumber")}</TableHead>
                  <TableHead>{t("orders.fulfillment.method")}</TableHead>
                  <TableHead className="text-right">{t("orders.fulfillment.fee")}</TableHead>
                  <TableHead>{t("common.status")}</TableHead>
                  <TableHead className="text-right">{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.carrier || "---"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono">{item.trackingNumber || "---"}</code>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleUpdateTracking(item)}>
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{item.shippingMethod || "Standard"}</TableCell>
                    <TableCell className="text-right">{formatVND(item.shippingFee || 0)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex w-fit items-center gap-1 text-[10px]">
                        <Truck className="h-3 w-3" />
                        {t(`orders.statuses.${item.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t("common.actions")}</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => generateTracking(item)}>
                            <Zap className="mr-2 h-4 w-4 text-amber-500" />
                            {t("orders.details.generateTracking")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateTracking(item)}>
                            <Edit2 className="mr-2 h-4 w-4 text-blue-500" />
                            {t("orders.details.updateTracking")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      {t("orders.noOrders")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {activeSubTab === "status" && (
        <div className="grid gap-6 md:grid-cols-2">
          {["Giao Hàng Nhanh", "Viettel Post", "Ninja Van"].map((carrier) => (
            <div key={carrier} className="rounded-xl border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold">{carrier}</h4>
                    <p className="text-xs text-muted-foreground">{t("orders.apiConnected")}</p>
                  </div>
                </div>
                <Badge variant="default">{t("orders.online")}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-muted/30 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">{t("orders.fulfillment.statuses.pending")}</p>
                  <p className="text-xl font-bold">12</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">{t("orders.fulfillment.statuses.in_transit")}</p>
                  <p className="text-xl font-bold">45</p>
                </div>
              </div>
              <Button variant="outline" className="w-full text-xs h-8">
                {t("orders.fulfillment.updateStatus")}
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isUpdateTrackingOpen} onOpenChange={setIsUpdateTrackingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("orders.details.updateTracking")}</DialogTitle>
            <DialogDescription>
              {t("orders.id")}: {selectedItem?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tracking">{t("orders.trackingCode")}</Label>
              <Input
                id="tracking"
                value={newTracking}
                onChange={(e) => setNewTracking(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateTrackingOpen(false)} disabled={isSaving}>
              {t("common.cancel")}
            </Button>
            <Button onClick={saveTracking} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
