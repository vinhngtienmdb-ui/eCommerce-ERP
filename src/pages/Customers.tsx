import { useState } from "react"
import { useTranslation } from "react-i18next"
import { 
  Users, 
  MessageSquare, 
  PhoneCall, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Facebook, 
  MessageCircle, 
  History,
  Phone,
  Play,
  Download,
  UserPlus,
  Settings
} from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog"

const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

import { customersData } from "@/src/data/customers"

const callLogs = [
  { id: "CALL-001", caller: "Nguyễn Văn A", phone: "0901234567", duration: "05:20", time: "2026-03-03 14:20", agent: "Nguyễn Thu Thảo", status: "completed" },
  { id: "CALL-002", caller: "Khách lạ", phone: "0988777666", duration: "00:00", time: "2026-03-03 13:45", agent: "N/A", status: "missed" },
  { id: "CALL-003", caller: "Lê Văn C", phone: "0923456789", duration: "12:15", time: "2026-03-03 10:30", agent: "Trần Minh Tâm", status: "completed" },
]

export function Customers() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const handleViewHistory = (customer: any) => {
    setSelectedCustomer(customer)
    setIsHistoryOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("customers.title")}</h2>
          <p className="text-muted-foreground">
            {t("customers.description")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            {t("customers.crm.title")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="crm" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto p-1 bg-muted/50">
          <TabsTrigger value="crm" className="gap-2 py-2">
            <Users className="h-4 w-4" />
            {t("customers.crm.title")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="crm" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("customers.crm.title")}</CardTitle>
                  <CardDescription>{t("customers.description")}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search customers..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("customers.crm.buyerName")}</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-center">{t("customers.crm.totalOrders")}</TableHead>
                    <TableHead className="text-right">{t("customers.crm.totalSpent")}</TableHead>
                    <TableHead className="text-right">{t("customers.crm.walletBalance")}</TableHead>
                    <TableHead>{t("customers.crm.lastOrder")}</TableHead>
                    <TableHead>{t("customers.crm.segment")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customersData.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col text-xs">
                          <span>{customer.phone}</span>
                          <span className="text-muted-foreground">{customer.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{customer.totalOrders}</TableCell>
                      <TableCell className="text-right font-medium text-emerald-600">
                        {formatVND(customer.totalSpent)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-blue-600">
                        {formatVND(customer.walletBalance)}
                      </TableCell>
                      <TableCell>{customer.lastOrder}</TableCell>
                      <TableCell>
                        <Badge variant={customer.status === 'vip' ? 'default' : customer.status === 'active' ? 'secondary' : 'outline'}>
                          {customer.status.toUpperCase()}
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
                            <DropdownMenuItem onClick={() => handleViewHistory(customer)}>
                              <History className="mr-2 h-4 w-4" />
                              {t("customers.crm.purchaseHistory")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="mr-2 h-4 w-4" />
                              {t("customers.crm.details")}
                            </DropdownMenuItem>
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
      </Tabs>

      {/* Purchase History Dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("customers.crm.purchaseHistory")} - {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>
              {t("customers.crm.details")} {selectedCustomer?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedCustomer?.history.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell className="text-right">{formatVND(order.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsHistoryOpen(false)}>{t("common.close")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
