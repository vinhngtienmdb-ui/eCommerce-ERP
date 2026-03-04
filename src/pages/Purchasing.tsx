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

export function Purchasing() {
  const { t } = useTranslation()

  // Mock Data for Requisitions
  const [requisitions] = useState([
    { id: "PR-2024-001", requester: "IT Department", item: "MacBook Pro M3", quantity: 5, date: "2024-03-01", status: "pending", priority: "high" },
    { id: "PR-2024-002", requester: "Marketing", item: "Printing Paper A4", quantity: 50, date: "2024-03-02", status: "approved", priority: "medium" },
    { id: "PR-2024-003", requester: "HR", item: "Office Chairs", quantity: 10, date: "2024-03-03", status: "rejected", priority: "low" },
  ])

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
          <Button>
            <Plus className="mr-2 h-4 w-4" /> {t("purchasing.requisitions.create")}
          </Button>
        </div>
      </div>

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
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Requires approval</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved (This Month)</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">+10% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spend (Est.)</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,450</div>
                <p className="text-xs text-muted-foreground">For approved requests</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("purchasing.requisitions.listTitle")}</CardTitle>
              <CardDescription>
                Manage internal purchase requests from various departments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Input placeholder="Search requests..." className="w-[300px]" />
                  <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Requester</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Approve</DropdownMenuItem>
                            <DropdownMenuItem>Reject</DropdownMenuItem>
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
                Evaluate and manage equipment and material suppliers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                        <Button variant="outline" size="sm">Evaluate</Button>
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
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">15</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
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
                B2B Main Warehouse Inventory Management with Safety Stock Alerts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Safety Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                        <Button variant="ghost" size="sm">Adjust</Button>
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
                Stock In/Out/Balance Reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <BarChart3 className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Chart visualization would go here.</p>
                  <Button variant="outline" className="mt-4">
                    <Download className="mr-2 h-4 w-4" /> Export Report
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
                AI-driven demand forecasting and purchase suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Predicted Demand (30 days)</TableHead>
                    <TableHead>Suggested Order</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                        <Button size="sm">Create PO</Button>
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
