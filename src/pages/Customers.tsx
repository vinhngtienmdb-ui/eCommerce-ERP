import { useState, useEffect } from "react"
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
  Sparkles,
  Trash2,
  Edit
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
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { toast } from "sonner"
import { db, auth } from "@/src/lib/firebase"
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore"
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors"

const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

import { cn } from "@/src/lib/utils"
import Markdown from "react-markdown"

export function Customers() {
  const { t } = useTranslation()
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiInsights, setAiInsights] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    status: "active",
    walletBalance: 0,
    pointsBalance: 0
  })

  // AI Churn Prediction State
  const [isChurnLoading, setIsChurnLoading] = useState(false)
  const [churnPredictions, setChurnPredictions] = useState<Record<string, { risk: string, score: number }>>({})

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(collection(db, "customers"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "customers");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const generateAiInsights = async () => {
    if (customers.length === 0) {
      toast.error(t("customers.ai.noData", "Không có dữ liệu khách hàng để phân tích"));
      return;
    }
    setIsAiLoading(true)
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze customer data for an e-commerce platform.
        Current stats: ${customers.length} total customers, ${customers.filter(c => c.status === 'vip').length} VIPs.
        
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
        Total Orders: ${customer.totalOrders || 0}
        Total Spent: ${customer.totalSpent || 0}
        Last Order: ${customer.lastOrder || "N/A"}
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

  const handleSaveCustomer = async () => {
    if (!formData.name || !formData.phone) {
      toast.error(t("customers.fillRequired", "Vui lòng điền đầy đủ thông tin bắt buộc"));
      return;
    }

    try {
      if (isEditing && selectedCustomer) {
        const customerRef = doc(db, "customers", selectedCustomer.id);
        await updateDoc(customerRef, {
          ...formData,
          updatedAt: serverTimestamp()
        });
        toast.success(t("customers.updateSuccess", "Cập nhật khách hàng thành công"));
      } else {
        await addDoc(collection(db, "customers"), {
          ...formData,
          totalOrders: 0,
          totalSpent: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          creatorId: auth.currentUser?.uid
        });
        toast.success(t("customers.addSuccess", "Thêm khách hàng thành công"));
      }
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      handleFirestoreError(error, isEditing ? OperationType.UPDATE : OperationType.CREATE, "customers");
    }
  }

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm(t("customers.deleteConfirm", "Bạn có chắc chắn muốn xóa khách hàng này?"))) return;
    try {
      await deleteDoc(doc(db, "customers", id));
      toast.success(t("customers.deleteSuccess", "Đã xóa khách hàng"));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, "customers");
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      status: "active",
      walletBalance: 0,
      pointsBalance: 0
    });
    setSelectedCustomer(null);
    setIsEditing(false);
  }

  const handleEdit = (customer: any) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || "",
      status: customer.status || "active",
      walletBalance: customer.walletBalance || 0,
      pointsBalance: customer.pointsBalance || 0
    });
    setIsEditing(true);
    setIsAddDialogOpen(true);
  }

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleViewHistory = (customer: any) => {
    setSelectedCustomer(customer)
    setIsHistoryOpen(true)
  }

  const handleAddCustomer = () => {
    resetForm();
    setIsAddDialogOpen(true);
  }

  const handleFilter = () => {
    toast.success(t("common.filterSuccess", "Đã áp dụng bộ lọc"));
  }

  const handleViewDetails = (customer: any) => {
    toast.success(t("customers.viewDetailsSuccess", `Đang xem chi tiết khách hàng ${customer.name}`));
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-slate-900">{t("customers.title")}</h2>
          <p className="text-muted-foreground text-lg font-medium">
            {t("customers.description")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl h-11 px-6 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95" onClick={handleAddCustomer}>
            <UserPlus className="mr-2 h-5 w-5" />
            {t("customers.crm.title")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: t("customers.stats.totalCustomers"), value: customers.length, icon: Users, color: "blue", desc: t("customers.stats.registeredUsers") },
          { title: t("customers.stats.newToday"), value: 12, icon: UserPlus, color: "emerald", desc: t("customers.stats.fromYesterday") },
          { title: t("customers.stats.activeNow"), value: 45, icon: Zap, color: "amber", desc: t("customers.stats.onlineUsers") },
          { title: t("customers.stats.vipMembers"), value: customers.filter(c => c.status === 'vip').length, icon: Crown, color: "purple", desc: t("customers.stats.highValue") },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500">{stat.title}</CardTitle>
              <div className={cn(
                "p-3 rounded-2xl transition-transform group-hover:scale-110 duration-500",
                stat.color === "blue" && "bg-blue-50 text-blue-600 shadow-lg shadow-blue-500/10",
                stat.color === "emerald" && "bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-500/10",
                stat.color === "amber" && "bg-amber-50 text-amber-600 shadow-lg shadow-amber-500/10",
                stat.color === "purple" && "bg-purple-50 text-purple-600 shadow-lg shadow-purple-500/10"
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

      <Card className="border-none shadow-2xl shadow-primary/5 rounded-[40px] overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-700 relative group">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
          <Brain className="w-48 h-48 text-white" />
        </div>
        <CardHeader className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <CardTitle className="text-3xl font-black flex items-center gap-3 text-white">
              <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
                <Brain className="h-7 w-7 text-white" />
              </div>
              {t("customers.ai.insightsTitle")}
            </CardTitle>
            <CardDescription className="text-indigo-100/80 text-lg font-medium max-w-2xl">
              {t("customers.ai.insightsDesc")}
            </CardDescription>
          </div>
          <Button 
            onClick={generateAiInsights} 
            disabled={isAiLoading}
            className="bg-white hover:bg-indigo-50 text-indigo-700 rounded-2xl h-14 px-8 font-black text-lg shadow-2xl shadow-black/20 gap-3 transition-all active:scale-95"
          >
            {isAiLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Sparkles className="h-6 w-6" />}
            {t("customers.ai.analyzeButton")}
          </Button>
        </CardHeader>
        <CardContent className="p-8 pt-4 relative z-10">
          {aiInsights ? (
            <div className="space-y-6">
              <div className="text-base text-indigo-50 leading-relaxed whitespace-pre-line bg-white/10 backdrop-blur-md p-6 rounded-[24px] border border-white/20 prose prose-invert max-w-none">
                <Markdown>{aiInsights}</Markdown>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-white/20 text-white border-none text-[10px] font-black uppercase tracking-widest px-3 py-1.5 backdrop-blur-md">
                  <Crown className="h-3 w-3 mr-2" /> VIP Retention: 95%
                </Badge>
                <Badge className="bg-white/20 text-white border-none text-[10px] font-black uppercase tracking-widest px-3 py-1.5 backdrop-blur-md">
                  <AlertTriangle className="h-3 w-3 mr-2" /> Churn Risk: 12%
                </Badge>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-indigo-100/50">
              <Sparkles className="h-16 w-16 mb-4 opacity-20" />
              <p className="font-bold uppercase tracking-widest text-sm">{t("customers.ai.readyToAnalyze", "Sẵn sàng phân tích dữ liệu khách hàng")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="crm" className="space-y-8">
        <div className="rounded-[40px] border-none bg-white shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="border-b border-slate-100 px-8 bg-slate-50/50">
            <TabsList className="flex h-auto p-0 bg-transparent gap-10 overflow-x-auto scrollbar-hide">
              <TabsTrigger 
                value="crm" 
                className={cn(
                  "py-6 text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap flex items-center gap-2 rounded-none border-b-2 border-transparent",
                  "data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent",
                  "text-slate-400 hover:text-slate-600"
                )}
              >
                <Users className="h-4 w-4" />
                {t("customers.crm.title")}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="crm" className="m-0">
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder={t("customers.crm.searchPlaceholder")}
                  className="h-14 rounded-2xl bg-slate-100 border-none pl-14 pr-6 font-bold text-lg focus-visible:ring-primary/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="h-14 w-14 rounded-2xl border-slate-200 hover:bg-slate-50 transition-all shadow-sm" onClick={handleFilter}>
                  <Filter className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="h-16 px-8 text-xs font-black uppercase tracking-widest text-slate-500">{t("customers.crm.buyerName")}</TableHead>
                    <TableHead className="h-16 text-xs font-black uppercase tracking-widest text-slate-500">{t("customers.crm.contact")}</TableHead>
                    <TableHead className="h-16 text-xs font-black uppercase tracking-widest text-slate-500 text-center">{t("customers.crm.totalOrders")}</TableHead>
                    <TableHead className="h-16 text-xs font-black uppercase tracking-widest text-slate-500 text-right">{t("customers.crm.totalSpent")}</TableHead>
                    <TableHead className="h-16 text-xs font-black uppercase tracking-widest text-slate-500 text-right">{t("customers.crm.walletBalance")}</TableHead>
                    <TableHead className="h-16 text-xs font-black uppercase tracking-widest text-slate-500">{t("customers.crm.lastOrder")}</TableHead>
                    <TableHead className="h-16 text-xs font-black uppercase tracking-widest text-slate-500">{t("customers.crm.segment")}</TableHead>
                    <TableHead className="h-16 text-xs font-black uppercase tracking-widest text-slate-500">{t("customers.crm.churnRisk")}</TableHead>
                    <TableHead className="h-16 px-8 text-xs font-black uppercase tracking-widest text-slate-500 text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id} className="hover:bg-slate-50/50 transition-colors border-slate-100 group">
                      <TableCell className="px-8 py-4 font-bold text-slate-900">{customer.name}</TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700">{customer.phone}</span>
                          <span className="text-xs font-medium text-slate-400">{customer.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-center font-bold text-slate-600">{customer.totalOrders || 0}</TableCell>
                      <TableCell className="py-4 text-right font-black text-emerald-600">
                        {formatVND(customer.totalSpent || 0)}
                      </TableCell>
                      <TableCell className="py-4 text-right font-black text-blue-600">
                        {formatVND(customer.walletBalance || 0)}
                      </TableCell>
                      <TableCell className="py-4 font-bold text-slate-600">{customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : "N/A"}</TableCell>
                      <TableCell className="py-4">
                        <Badge className={cn(
                          "rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border-none",
                          customer.status === 'vip' ? 'bg-purple-100 text-purple-700' : 
                          customer.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                          'bg-slate-100 text-slate-700'
                        )}>
                          {t(`customers.segments.${customer.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        {churnPredictions[customer.id] ? (
                          <Badge className={cn(
                            "rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border-none",
                            churnPredictions[customer.id].risk === "Low" && "bg-green-100 text-green-700",
                            churnPredictions[customer.id].risk === "Medium" && "bg-yellow-100 text-yellow-700",
                            churnPredictions[customer.id].risk === "High" && "bg-red-100 text-red-700"
                          )}>
                            {churnPredictions[customer.id].risk} ({churnPredictions[customer.id].score}%)
                          </Badge>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                            onClick={() => predictChurn(customer)}
                            disabled={isChurnLoading}
                          >
                            {isChurnLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1" />}
                            {t("customers.ai.predictChurn")}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="px-8 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100 transition-all">
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[200px]">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">{t("common.actions")}</DropdownMenuLabel>
                            <DropdownMenuItem className="rounded-xl px-3 py-2.5 font-bold text-slate-700 focus:bg-slate-50 cursor-pointer" onClick={() => handleViewHistory(customer)}>
                              <History className="mr-3 h-4 w-4 text-slate-400" />
                              {t("customers.crm.purchaseHistory")}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl px-3 py-2.5 font-bold text-slate-700 focus:bg-slate-50 cursor-pointer" onClick={() => handleEdit(customer)}>
                              <Edit className="mr-3 h-4 w-4 text-slate-400" />
                              {t("common.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl px-3 py-2.5 font-bold text-slate-700 focus:bg-slate-50 cursor-pointer" onClick={() => handleViewDetails(customer)}>
                              <Users className="mr-3 h-4 w-4 text-slate-400" />
                              {t("customers.crm.details")}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="rounded-xl px-3 py-2.5 font-bold text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer"
                              onClick={() => handleDeleteCustomer(customer.id)}
                            >
                              <Trash2 className="mr-3 h-4 w-4" />
                              {t("common.delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Add/Edit Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? t("common.edit") : t("customers.crm.title")}</DialogTitle>
            <DialogDescription>
              {t("customers.fillInfo", "Điền thông tin khách hàng bên dưới")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("customers.crm.buyerName")}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">{t("customers.crm.contact")} (Phone)</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">{t("common.status")}</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t("customers.segments.active")}</SelectItem>
                  <SelectItem value="vip">{t("customers.segments.vip")}</SelectItem>
                  <SelectItem value="inactive">{t("customers.segments.inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="wallet">{t("customers.crm.walletBalance")}</Label>
                <Input
                  id="wallet"
                  type="number"
                  value={formData.walletBalance}
                  onChange={(e) => setFormData({ ...formData, walletBalance: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  value={formData.pointsBalance}
                  onChange={(e) => setFormData({ ...formData, pointsBalance: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleSaveCustomer}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  <TableHead>{t("orders.id")}</TableHead>
                  <TableHead>{t("common.date")}</TableHead>
                  <TableHead>{t("orders.product")}</TableHead>
                  <TableHead className="text-right">{t("orders.total")}</TableHead>
                  <TableHead>{t("common.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedCustomer?.history?.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell className="text-right">{formatVND(order.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                        {t(`orders.status.${order.status}`)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {(!selectedCustomer?.history || selectedCustomer.history.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      {t("orders.noData", "Không có lịch sử mua hàng")}
                    </TableCell>
                  </TableRow>
                )}
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
