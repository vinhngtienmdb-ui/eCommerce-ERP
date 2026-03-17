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
  Settings,
  Zap,
  Crown,
  Brain,
  TrendingDown,
  AlertTriangle,
  Loader2,
  Sparkles
} from "lucide-react"
import { GoogleGenAI } from "@google/genai"
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
import { toast } from "sonner"

const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

import { customersData } from "@/src/data/customers"

import { cn } from "@/src/lib/utils"
import Markdown from "react-markdown"

export function Customers() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiInsights, setAiInsights] = useState<string | null>(null)

  // AI Churn Prediction State
  const [isChurnLoading, setIsChurnLoading] = useState(false)
  const [churnPredictions, setChurnPredictions] = useState<Record<number, { risk: string, score: number }>>({})

  const generateAiInsights = async () => {
    setIsAiLoading(true)
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze customer data for an e-commerce platform.
        Current stats: ${customersData.length} total customers, ${customersData.filter(c => c.status === 'vip').length} VIPs.
        
        Provide a strategic segmentation analysis in Markdown format.
        Include:
        1. **Segmentation Overview**: Define 3-4 smart segments based on spending and frequency.
        2. **Marketing Actions**: Specific actions for each segment to increase LTV or reduce churn.
        3. **Growth Opportunities**: Where to focus marketing budget.
        
        Language: ${t("languageCode") || "English"}.`,
      })
      const response = await model
      setAiInsights(response.text || null)
    } catch (error) {
      console.error("AI Insights Error:", error)
      setAiInsights(t("customers.ai.insightsError"))
    } finally {
      setIsAiLoading(false)
    }
  }

  const predictChurn = async (customer: any) => {
    setIsChurnLoading(true)
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Predict churn risk for this customer:
        Name: ${customer.name}
        Total Orders: ${customer.totalOrders}
        Total Spent: ${customer.totalSpent}
        Last Order: ${customer.lastOrder}
        Status: ${customer.status}
        
        Provide a JSON response with:
        - risk: "Low", "Medium", or "High"
        - score: 0 to 100 (churn probability)
        
        Language: ${t("languageCode") || "English"}.`,
        config: {
          responseMimeType: "application/json"
        }
      })
      const response = await model
      const result = JSON.parse(response.text || "{}")
      setChurnPredictions(prev => ({ ...prev, [customer.id]: result }))
    } catch (error) {
      console.error("Churn prediction error:", error)
    } finally {
      setIsChurnLoading(false)
    }
  }

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
          <Button onClick={() => toast.info(t("common.featureComingSoon"))}>
            <UserPlus className="mr-2 h-4 w-4" />
            {t("customers.crm.title")}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersData.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Today</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <UserPlus className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">+5% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-full">
              <Zap className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground mt-1">Online users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Members</CardTitle>
            <div className="p-2 bg-purple-100 rounded-full">
              <Crown className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersData.filter(c => c.status === 'vip').length}</div>
            <p className="text-xs text-muted-foreground mt-1">High value</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-indigo-700">
              <Brain className="h-5 w-5" />
              AI Customer Insights & Segmentation
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={generateAiInsights}
              disabled={isAiLoading}
              className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100"
            >
              {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            </Button>
          </div>
          <CardDescription className="text-indigo-600/80">
            Phân tích hành vi mua sắm để tự động phân loại và gợi ý chiến dịch chăm sóc.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAiLoading ? (
            <div className="flex items-center gap-2 text-indigo-500/60 italic py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang phân tích hành vi khách hàng...
            </div>
          ) : aiInsights ? (
            <div className="space-y-4">
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white/50 p-4 rounded-xl border border-indigo-100">
                {aiInsights}
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  <Crown className="h-3 w-3 mr-1" /> VIP Retention: 95%
                </Badge>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                  <AlertTriangle className="h-3 w-3 mr-1" /> Churn Risk: 12%
                </Badge>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Button 
                variant="outline" 
                onClick={generateAiInsights}
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Phân tích Phân khúc Khách hàng
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
                  <Button variant="outline" size="icon" onClick={() => toast.info(t("common.featureComingSoon"))}>
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
                    <TableHead>{t("customers.crm.churnRisk")}</TableHead>
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
                      <TableCell>
                        {churnPredictions[customer.id] ? (
                          <div className="flex items-center gap-2">
                            <Badge className={cn(
                              "text-[10px]",
                              churnPredictions[customer.id].risk === "Low" && "bg-green-100 text-green-700 border-green-200",
                              churnPredictions[customer.id].risk === "Medium" && "bg-yellow-100 text-yellow-700 border-yellow-200",
                              churnPredictions[customer.id].risk === "High" && "bg-red-100 text-red-700 border-red-200"
                            )}>
                              {churnPredictions[customer.id].risk} ({churnPredictions[customer.id].score}%)
                            </Badge>
                          </div>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-[10px] px-2"
                            onClick={() => predictChurn(customer)}
                            disabled={isChurnLoading}
                          >
                            {isChurnLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1" />}
                            {t("customers.ai.predictChurn")}
                          </Button>
                        )}
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
                            <DropdownMenuItem onClick={() => toast.info(t("common.featureComingSoon"))}>
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
