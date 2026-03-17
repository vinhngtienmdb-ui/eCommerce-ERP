import { useState } from "react"
import { useTranslation } from "react-i18next"
import { 
  Megaphone, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar, 
  MessageSquare, 
  Share2, 
  Tag, 
  Clock, 
  LayoutTemplate,
  Facebook,
  Video,
  Send,
  Mail,
  BarChart3,
  Settings,
  FileText,
  Image,
  ClipboardList,
  HelpCircle,
  Star,
  ArrowLeft,
  Sparkles,
  Loader2,
  Play,
  Pause,
  ArrowRight,
  Settings2,
  Zap
} from "lucide-react"
import { GoogleGenAI } from "@google/genai"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Badge } from "@/src/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"

export function Marketing() {
  const { t } = useTranslation()
  const [currentView, setCurrentView] = useState<string>("dashboard")

  // Mock Data for Campaigns
  const [campaigns, setCampaigns] = useState([
    { id: 1, name: "Summer Sale 2024", status: "active", budget: 50000000, revenue: 120000000, pnl: 70000000, roi: 140, platform: "Multi-channel" },
    { id: 2, name: "New Product Launch", status: "planned", budget: 30000000, revenue: 0, pnl: -30000000, roi: 0, platform: "Facebook, TikTok" },
    { id: 3, name: "Flash Sale 6.6", status: "completed", budget: 20000000, revenue: 85000000, pnl: 65000000, roi: 325, platform: "App" },
  ])

  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false)
  const [newCampaignName, setNewCampaignName] = useState("")
  const [newCampaignBudget, setNewCampaignBudget] = useState("")
  const [newCampaignPlatform, setNewCampaignPlatform] = useState("")

  const handleCreateCampaign = () => {
    if (!newCampaignName || !newCampaignBudget || !newCampaignPlatform) {
      toast.error(t("common.error"))
      return
    }

    const newCampaign = {
      id: campaigns.length + 1,
      name: newCampaignName,
      status: "planned",
      budget: parseInt(newCampaignBudget),
      revenue: 0,
      pnl: 0,
      roi: 0,
      platform: newCampaignPlatform
    }

    setCampaigns([...campaigns, newCampaign])
    setIsCreateCampaignOpen(false)
    setNewCampaignName("")
    setNewCampaignBudget("")
    setNewCampaignPlatform("")
    toast.success(t("common.success"))
  }

  // Mock Data for Social Posts
  const [posts, setPosts] = useState([
    { id: 1, content: "Giảm giá 50% cho tất cả sản phẩm hè!", platform: "facebook", status: "published", engagement: 1200, date: "2024-06-01" },
    { id: 2, content: "Review sản phẩm mới - Siêu phẩm 2024", platform: "tiktok", status: "scheduled", engagement: 0, date: "2024-06-05" },
  ])

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostPlatform, setNewPostPlatform] = useState("")

  const handleCreatePost = () => {
    if (!newPostContent || !newPostPlatform) {
      toast.error(t("common.error"))
      return
    }

    const newPost = {
      id: posts.length + 1,
      content: newPostContent,
      platform: newPostPlatform,
      status: "draft",
      engagement: 0,
      date: new Date().toISOString().split('T')[0]
    }

    setPosts([...posts, newPost])
    setIsCreatePostOpen(false)
    setNewPostContent("")
    setNewPostPlatform("")
    toast.success(t("common.success"))
  }

  // Mock Data for Promotions
  const [promotions, setPromotions] = useState([
    { id: 1, name: "Flash Sale 12H", type: "flash_sale", discount: "50%", start: "12:00", end: "14:00", status: "active" },
    { id: 2, name: "Voucher 100K", type: "voucher", discount: "100.000đ", start: "2024-06-01", end: "2024-06-30", status: "active" },
    { id: 3, name: "Mua chung giá rẻ", type: "group_buy", discount: "30%", start: "2024-06-10", end: "2024-06-15", status: "upcoming" },
  ])

  const [isCreatePromotionOpen, setIsCreatePromotionOpen] = useState(false)
  const [newPromoName, setNewPromoName] = useState("")
  const [newPromoType, setNewPromoType] = useState("")
  const [newPromoDiscount, setNewPromoDiscount] = useState("")

  const handleCreatePromotion = () => {
    if (!newPromoName || !newPromoType || !newPromoDiscount) {
      toast.error(t("common.error"))
      return
    }

    const newPromotion = {
      id: promotions.length + 1,
      name: newPromoName,
      type: newPromoType,
      discount: newPromoDiscount,
      start: new Date().toISOString().split('T')[0],
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +7 days
      status: "upcoming"
    }

    setPromotions([...promotions, newPromotion])
    setIsCreatePromotionOpen(false)
    setNewPromoName("")
    setNewPromoType("")
    setNewPromoDiscount("")
    toast.success(t("common.success"))
  }

  // Mock Data for Email Campaigns
  const [emailCampaigns, setEmailCampaigns] = useState([
    { id: 1, name: "Monthly Newsletter - June", status: "Sent", sent: 14500, openRate: "28%", clickRate: "4.5%", date: "2024-06-01" },
    { id: 2, name: "Product Launch Announcement", status: "Draft", sent: "-", openRate: "-", clickRate: "-", date: "Created 2 days ago" },
  ])

  const [isCreateEmailOpen, setIsCreateEmailOpen] = useState(false)
  const [newEmailName, setNewEmailName] = useState("")

  const handleCreateEmail = () => {
    if (!newEmailName) {
      toast.error(t("common.error"))
      return
    }

    const newEmail = {
      id: emailCampaigns.length + 1,
      name: newEmailName,
      status: "Draft",
      sent: "-",
      openRate: "-",
      clickRate: "-",
      date: new Date().toISOString().split('T')[0]
    }

    setEmailCampaigns([...emailCampaigns, newEmail])
    setIsCreateEmailOpen(false)
    setNewEmailName("")
    toast.success(t("common.success"))
  }

  // Mock Data for Articles
  const [articles, setArticles] = useState([
    { id: 1, title: "Top 10 Summer Fashion Trends", author: "Sarah Jenkins", status: "Published", lastModified: "2 hours ago" },
    { id: 2, title: "How to Choose the Right Skincare", author: "Mike Ross", status: "Draft", lastModified: "Yesterday" },
  ])

  const [isCreateArticleOpen, setIsCreateArticleOpen] = useState(false)
  const [newArticleTitle, setNewArticleTitle] = useState("")

  const handleCreateArticle = () => {
    if (!newArticleTitle) {
      toast.error(t("common.error"))
      return
    }

    const newArticle = {
      id: articles.length + 1,
      title: newArticleTitle,
      author: "Current User",
      status: "Draft",
      lastModified: "Just now"
    }

    setArticles([...articles, newArticle])
    setIsCreateArticleOpen(false)
    setNewArticleTitle("")
    toast.success(t("common.success"))
  }

  // Mock Data for Leads Forms
  const [leadForms, setLeadForms] = useState([
    { id: 1, name: "Newsletter Signup Footer", type: "embedded", views: 12500, submissions: 450, conversionRate: "3.6%", status: "active" },
    { id: 2, name: "Exit Intent Popup", type: "popup", views: 3200, submissions: 85, conversionRate: "2.6%", status: "active" },
    { id: 3, name: "Summer Sale Registration", type: "landingPage", views: 1500, submissions: 320, conversionRate: "21.3%", status: "paused" },
  ])

  const [isCreateLeadFormOpen, setIsCreateLeadFormOpen] = useState(false)
  const [newLeadFormName, setNewLeadFormName] = useState("")
  const [newLeadFormType, setNewLeadFormType] = useState("")

  const handleCreateLeadForm = () => {
    if (!newLeadFormName || !newLeadFormType) {
      toast.error(t("common.error"))
      return
    }

    const newForm = {
      id: leadForms.length + 1,
      name: newLeadFormName,
      type: newLeadFormType,
      views: 0,
      submissions: 0,
      conversionRate: "0%",
      status: "active"
    }

    setLeadForms([...leadForms, newForm])
    setIsCreateLeadFormOpen(false)
    setNewLeadFormName("")
    setNewLeadFormType("")
    toast.success(t("common.success"))
  }

  // AI Content Generation
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [isAiGenerating, setIsAiGenerating] = useState(false)
  const [automations, setAutomations] = useState([
    { id: 1, name: "Welcome Email", trigger: "New Customer", action: "Send Email", status: "active", runs: 1240 },
    { id: 2, name: "Abandoned Cart", trigger: "Cart Inactive > 2h", action: "Push Notification", status: "active", runs: 856 },
    { id: 3, name: "VIP Birthday", trigger: "Customer Birthday", action: "Send Voucher", status: "paused", runs: 45 },
  ])

  const handleAiGenerate = async () => {
    if (!aiPrompt) {
      toast.error(t("marketing.ai.promptRequired"))
      return
    }

    setIsAiGenerating(true)
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a catchy marketing article title and a short summary (max 200 characters) for: ${aiPrompt}. Return as JSON with keys "title" and "summary".`,
        config: { responseMimeType: "application/json" }
      })

      const result = JSON.parse(response.text || "{}")
      if (result.title) {
        const newArticle = {
          id: articles.length + 1,
          title: result.title,
          author: "AI Assistant",
          status: "Draft",
          lastModified: "Just now"
        }
        setArticles([newArticle, ...articles])
        toast.success(t("marketing.ai.success"))
        setIsAiDialogOpen(false)
        setAiPrompt("")
      }
    } catch (error) {
      console.error("AI Generation Error:", error)
      toast.error(t("marketing.ai.error"))
    } finally {
      setIsAiGenerating(false)
    }
  }

  const marketingCampaigns = [
    { id: "campaigns", title: t("marketing.campaigns.title"), description: t("marketing.campaigns.description"), icon: Megaphone, color: "text-pink-500", bg: "bg-pink-100" },
    { id: "email", title: t("marketing.email.title"), description: t("marketing.email.description"), icon: Mail, color: "text-blue-500", bg: "bg-blue-100" },
    { id: "messages", title: t("marketing.messages.title"), description: t("marketing.messages.description"), icon: MessageSquare, color: "text-green-500", bg: "bg-green-100" },
    { id: "social", title: t("marketing.social.title"), description: t("marketing.social.description"), icon: Share2, color: "text-purple-500", bg: "bg-purple-100" },
    { id: "reports", title: t("marketing.reports.title"), description: t("marketing.reports.description"), icon: BarChart3, color: "text-cyan-500", bg: "bg-cyan-100" },
    { id: "automations", title: t("marketing.tabs.automations"), description: t("marketing.automation.description"), icon: Zap, color: "text-amber-500", bg: "bg-amber-100" },
    { id: "settings", title: t("marketing.settings.title"), description: t("marketing.settings.description"), icon: Settings, color: "text-gray-500", bg: "bg-gray-100" },
  ]

  const contentMedia = [
    { id: "content", title: t("marketing.content.title"), description: t("marketing.content.description"), icon: FileText, color: "text-pink-500", bg: "bg-pink-100" },
    { id: "assets", title: t("marketing.assets.title"), description: t("marketing.assets.description"), icon: Image, color: "text-violet-500", bg: "bg-violet-100" },
    { id: "landingPages", title: t("marketing.landingPages.title"), description: t("marketing.landingPages.description"), icon: LayoutTemplate, color: "text-emerald-500", bg: "bg-emerald-100" },
    { id: "leads", title: t("marketing.leads.title"), description: t("marketing.leads.description"), icon: ClipboardList, color: "text-orange-500", bg: "bg-orange-100" },
    { id: "contentSettings", title: t("marketing.contentSettings.title"), description: t("marketing.contentSettings.description"), icon: Settings, color: "text-gray-500", bg: "bg-gray-100" },
  ]

  const renderDashboard = () => (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
          <h3 className="text-lg font-semibold text-blue-600">{t("marketing.dashboard.campaigns")}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketingCampaigns.map((item) => (
            <Card 
              key={item.title} 
              className="hover:shadow-md transition-shadow cursor-pointer relative group"
              onClick={() => setCurrentView(item.id)}
            >
              <CardContent className="p-6">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Star className="w-4 h-4 text-muted-foreground hover:text-yellow-400 cursor-pointer" />
                  <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-blue-400 cursor-pointer" />
                </div>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${item.bg}`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
          <h3 className="text-lg font-semibold text-blue-600">{t("marketing.dashboard.content")}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {contentMedia.map((item) => (
            <Card 
              key={item.title} 
              className="hover:shadow-md transition-shadow cursor-pointer relative group"
              onClick={() => setCurrentView(item.id)}
            >
              <CardContent className="p-6">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Star className="w-4 h-4 text-muted-foreground hover:text-yellow-400 cursor-pointer" />
                  <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-blue-400 cursor-pointer" />
                </div>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${item.bg}`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    if (currentView === "dashboard") return renderDashboard()

    return (
      <div className="space-y-6">
        <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary" onClick={() => setCurrentView("dashboard")}>
          <ArrowLeft className="w-4 h-4" /> {t("marketing.backToDashboard")}
        </Button>

        {currentView === "automations" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">{t("marketing.automations.title")}</h2>
                <p className="text-muted-foreground">{t("marketing.automations.description")}</p>
              </div>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                {t("marketing.automations.create")}
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-emerald-50/50 border-emerald-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-emerald-700">{t("marketing.automations.stats.totalRuns")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-700">2,141</div>
                  <p className="text-xs text-emerald-600">{t("marketing.automation.runs")}</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50/50 border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">{t("marketing.automations.stats.activeWorkflows")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700">8</div>
                  <p className="text-xs text-blue-600">{t("marketing.automation.activeFlows")}</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50/50 border-purple-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700">{t("marketing.automations.stats.conversionRate")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-700">4.2%</div>
                  <p className="text-xs text-purple-600">{t("marketing.automation.successRate")}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t("marketing.automations.activeWorkflows")}</CardTitle>
                <CardDescription>{t("marketing.automations.activeWorkflowsDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {automations.map((flow) => (
                    <div key={flow.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${flow.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          <Zap className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{flow.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {flow.trigger}</span>
                            <ArrowRight className="h-3 w-3" />
                            <span>{flow.action}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right mr-4">
                          <p className="text-sm font-medium">{flow.runs.toLocaleString()}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("marketing.automations.runs")}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            {flow.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Settings2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === "campaigns" && (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">{t("marketing.tabs.campaigns")}</TabsTrigger>
              <TabsTrigger value="promotions">{t("marketing.tabs.promotions")}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("marketing.stats.totalBudget")}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">100.000.000đ</div>
                <p className="text-xs text-muted-foreground">{t("marketing.stats.vsLastMonth", { value: "+20.1%" })}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("marketing.stats.totalRevenue")}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">205.000.000đ</div>
                <p className="text-xs text-muted-foreground">{t("marketing.stats.vsLastMonth", { value: "+15%" })}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("marketing.stats.roi")}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">205%</div>
                <p className="text-xs text-muted-foreground">{t("marketing.stats.vsLastMonth", { value: "+5%" })}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("marketing.stats.activeCampaigns")}</CardTitle>
                <Megaphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">{t("marketing.stats.runningPlatforms", { count: 3 })}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("marketing.tabs.campaigns")}</CardTitle>
                <CardDescription>
                  {t("marketing.campaigns.overview")}
                </CardDescription>
              </div>
              <Button onClick={() => setIsCreateCampaignOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t("marketing.campaigns.create")}
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("marketing.campaigns.name")}</TableHead>
                    <TableHead>{t("marketing.campaigns.status")}</TableHead>
                    <TableHead>{t("marketing.campaigns.platform")}</TableHead>
                    <TableHead className="text-right">{t("marketing.campaigns.budget")}</TableHead>
                    <TableHead className="text-right">{t("marketing.campaigns.revenue")}</TableHead>
                    <TableHead className="text-right">{t("marketing.campaigns.pnl")}</TableHead>
                    <TableHead className="text-right">{t("marketing.campaigns.roi")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>
                        <Badge variant={campaign.status === "active" ? "default" : campaign.status === "completed" ? "secondary" : "outline"}>
                          {t(`marketing.campaigns.${campaign.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>{campaign.platform}</TableCell>
                      <TableCell className="text-right">{campaign.budget.toLocaleString()}đ</TableCell>
                      <TableCell className="text-right">{campaign.revenue.toLocaleString()}đ</TableCell>
                      <TableCell className="text-right font-bold text-green-600">{campaign.pnl.toLocaleString()}đ</TableCell>
                      <TableCell className="text-right">{campaign.roi}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </TabsContent>

            <TabsContent value="promotions" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-600">
                      <Clock className="h-5 w-5" /> {t("marketing.promotions.flashSale")}
                    </CardTitle>
                    <CardDescription>{t("marketing.promotions.flashSaleDesc")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={() => { setNewPromoType("flash_sale"); setIsCreatePromotionOpen(true); }}>{t("marketing.promotions.createFlashSale")}</Button>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-600">
                      <Tag className="h-5 w-5" /> {t("marketing.promotions.voucherCenter")}
                    </CardTitle>
                    <CardDescription>{t("marketing.promotions.voucherCenterDesc")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => { setNewPromoType("voucher"); setIsCreatePromotionOpen(true); }}>{t("marketing.promotions.createVoucher")}</Button>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <Users className="h-5 w-5" /> {t("marketing.promotions.groupBuy")}
                    </CardTitle>
                    <CardDescription>{t("marketing.promotions.groupBuyDesc")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => { setNewPromoType("group_buy"); setIsCreatePromotionOpen(true); }}>{t("marketing.promotions.createGroupBuy")}</Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{t("marketing.promotions.activePromotions")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("marketing.promotions.name")}</TableHead>
                        <TableHead>{t("marketing.promotions.type")}</TableHead>
                        <TableHead>{t("marketing.promotions.discount")}</TableHead>
                        <TableHead>{t("marketing.promotions.duration")}</TableHead>
                        <TableHead>{t("marketing.promotions.status")}</TableHead>
                        <TableHead className="text-right">{t("marketing.promotions.actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {promotions.map((promo) => (
                        <TableRow key={promo.id}>
                          <TableCell className="font-medium">{promo.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {t(`marketing.promotions.types.${promo.type}`)}
                            </Badge>
                          </TableCell>
                          <TableCell>{promo.discount}</TableCell>
                          <TableCell>{promo.start} - {promo.end}</TableCell>
                      <TableCell>
                        <Badge variant={promo.status === "active" ? "default" : "secondary"}>
                          {t(`marketing.promotions.statuses.${promo.status}`)}
                        </Badge>
                      </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => toast.info(t("common.featureComingSoon"))}>{t("common.edit")}</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {currentView === "social" && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("marketing.social.createPost")}</CardTitle>
                <CardDescription>{t("marketing.social.createPostDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">{t("marketing.social.platform")}</label>
                  <div className="flex gap-4">
                    <Button 
                      variant={newPostPlatform === "facebook" ? "default" : "outline"} 
                      className="flex-1 gap-2"
                      onClick={() => setNewPostPlatform("facebook")}
                    >
                      <Facebook className="h-4 w-4" /> Facebook
                    </Button>
                    <Button 
                      variant={newPostPlatform === "tiktok" ? "default" : "outline"} 
                      className="flex-1 gap-2"
                      onClick={() => setNewPostPlatform("tiktok")}
                    >
                      <Video className="h-4 w-4" /> TikTok
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">{t("marketing.social.content")}</label>
                  <Input 
                    placeholder={t("marketing.social.promptPlaceholder", "Bạn đang nghĩ gì?")} 
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">{t("marketing.social.schedule")}</label>
                  <Input type="datetime-local" />
                </div>
                <Button className="w-full" onClick={handleCreatePost}>{t("marketing.social.createPost")}</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("marketing.social.recentPosts")}</CardTitle>
                <CardDescription>{t("marketing.social.recentPostsDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${post.platform === 'facebook' ? 'bg-blue-100 text-blue-600' : 'bg-black text-white'}`}>
                        {post.platform === 'facebook' ? <Facebook className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{post.content}</p>
                        <p className="text-xs text-muted-foreground">{post.date} • {t(`marketing.social.statuses.${post.status.toLowerCase()}`)}</p>
                      </div>
                    </div>
                      <div className="text-right">
                        <p className="font-bold">{post.engagement}</p>
                        <p className="text-xs text-muted-foreground">{t("marketing.social.engagements")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === "messages" && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("marketing.messages.zaloIntegration")}</CardTitle>
                <CardDescription>{t("marketing.messages.status")}: <span className="text-green-600 font-bold">{t("marketing.messages.connected")}</span></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t("marketing.messages.followers")}</span>
                    <span className="font-bold text-xl">12,450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t("marketing.messages.quotaRemaining")}</span>
                    <span className="font-bold text-xl">45,000 / 50,000</span>
                  </div>
                  <Button className="w-full" variant="outline">{t("marketing.messages.manageZalo")}</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t("marketing.messages.adPerformance")}</CardTitle>
                <CardDescription>{t("marketing.messages.last30Days")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t("marketing.messages.sent")}</span>
                    <span className="font-bold text-xl">5,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t("marketing.messages.openRate")}</span>
                    <span className="font-bold text-xl">12.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t("marketing.messages.clickRate")}</span>
                    <span className="font-bold text-xl">3.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("marketing.messages.campaigns")}</CardTitle>
              <CardDescription>{t("marketing.messages.campaignsDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("marketing.messages.campaignName")}</TableHead>
                    <TableHead>{t("marketing.messages.type")}</TableHead>
                    <TableHead>{t("marketing.messages.sent")}</TableHead>
                    <TableHead>{t("marketing.messages.openRate")}</TableHead>
                    <TableHead>{t("marketing.messages.status")}</TableHead>
                    <TableHead className="text-right">{t("marketing.messages.date")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">June Promo Blast</TableCell>
                    <TableCell><Badge variant="outline">Zalo OA</Badge></TableCell>
                    <TableCell>2,500</TableCell>
                    <TableCell>15%</TableCell>
                    <TableCell><Badge>Completed</Badge></TableCell>
                    <TableCell className="text-right">2024-06-01</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Cart Abandonment Recovery</TableCell>
                    <TableCell><Badge variant="outline">SMS</Badge></TableCell>
                    <TableCell>120</TableCell>
                    <TableCell>8%</TableCell>
                    <TableCell><Badge variant="secondary">Active</Badge></TableCell>
                    <TableCell className="text-right">Ongoing</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </div>
        )}

        {currentView === "landingPages" && (
           <Card>
            <CardHeader>
              <CardTitle>{t("marketing.landingPages.title")}</CardTitle>
              <CardDescription>{t("marketing.landingPages.description")}</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <LayoutTemplate className="mx-auto h-8 w-8 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">{t("marketing.landingPages.noPages")}</h3>
                    <p className="text-sm text-muted-foreground">{t("marketing.landingPages.createFirst")}</p>
                    <Button className="mt-4" variant="outline">{t("marketing.landingPages.create")}</Button>
                  </div>
               </div>
            </CardContent>
          </Card>
        )}

        {/* Email Marketing View */}
        {currentView === "email" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{t("marketing.email.title")}</h3>
              <Button onClick={() => setIsCreateEmailOpen(true)}><Plus className="mr-2 h-4 w-4" /> {t("marketing.email.create")}</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t("marketing.email.subscribers")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15,234</div>
                  <p className="text-xs text-muted-foreground">{t("marketing.stats.vsLastMonth", { value: "+12%" })}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t("marketing.email.avgOpenRate")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24.8%</div>
                  <p className="text-xs text-muted-foreground">{t("marketing.stats.vsLastMonth", { value: "+2.4%" })}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t("marketing.email.avgClickRate")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2%</div>
                  <p className="text-xs text-muted-foreground">{t("marketing.stats.vsLastMonth", { value: "-0.5%" })}</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>{t("marketing.email.recentCampaigns")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("marketing.email.campaignName")}</TableHead>
                      <TableHead>{t("marketing.email.status")}</TableHead>
                      <TableHead>{t("marketing.email.sent")}</TableHead>
                      <TableHead>{t("marketing.email.openRate")}</TableHead>
                      <TableHead>{t("marketing.email.clickRate")}</TableHead>
                      <TableHead className="text-right">{t("marketing.email.date")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailCampaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell><Badge variant={campaign.status === "Sent" ? "default" : "secondary"}>{t(`marketing.email.statuses.${campaign.status.toLowerCase()}`)}</Badge></TableCell>
                        <TableCell>{campaign.sent}</TableCell>
                        <TableCell>{campaign.openRate}</TableCell>
                        <TableCell>{campaign.clickRate}</TableCell>
                        <TableCell className="text-right">{campaign.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reports View */}
        {currentView === "reports" && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{t("marketing.reports.title")}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("marketing.reports.trafficSources")}</CardTitle>
                  <CardDescription>{t("marketing.reports.trafficSourcesDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-md">
                   <div className="text-center text-muted-foreground">
                     <BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-50" />
                     <p>{t("marketing.reports.trafficChartPlaceholder")}</p>
                   </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t("marketing.reports.conversionRate")}</CardTitle>
                  <CardDescription>{t("marketing.reports.conversionRateDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-md">
                   <div className="text-center text-muted-foreground">
                     <TrendingUp className="h-10 w-10 mx-auto mb-2 opacity-50" />
                     <p>{t("marketing.reports.conversionChartPlaceholder")}</p>
                   </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Settings View */}
        {currentView === "settings" && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{t("marketing.settings.title")}</h3>
            <Card>
              <CardHeader>
                <CardTitle>{t("marketing.settings.general")}</CardTitle>
                <CardDescription>{t("marketing.settings.generalDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">{t("marketing.settings.senderName")}</label>
                  <Input defaultValue="Marketing Team" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">{t("marketing.settings.senderEmail")}</label>
                  <Input defaultValue="marketing@example.com" />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="track-opens" className="rounded border-gray-300" defaultChecked />
                  <label htmlFor="track-opens" className="text-sm">{t("marketing.settings.trackOpens")}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="track-clicks" className="rounded border-gray-300" defaultChecked />
                  <label htmlFor="track-clicks" className="text-sm">{t("marketing.settings.trackClicks")}</label>
                </div>
                <Button>{t("marketing.settings.save")}</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Content Management View */}
        {currentView === "content" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{t("marketing.content.title")}</h3>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsAiDialogOpen(true)}>
                  <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
                  {t("marketing.ai.generate")}
                </Button>
                <Button onClick={() => setIsCreateArticleOpen(true)}><Plus className="mr-2 h-4 w-4" /> {t("marketing.content.newArticle")}</Button>
              </div>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("marketing.content.articleTitle")}</TableHead>
                      <TableHead>{t("marketing.content.author")}</TableHead>
                      <TableHead>{t("marketing.content.status")}</TableHead>
                      <TableHead className="text-right">{t("marketing.content.lastModified")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className={`h-4 w-4 ${article.status === "Published" ? "text-blue-500" : "text-gray-400"}`} />
                            {article.title}
                          </div>
                        </TableCell>
                        <TableCell>{article.author}</TableCell>
                        <TableCell><Badge variant={article.status === "Published" ? "default" : "outline"}>{t(`marketing.content.statuses.${article.status.toLowerCase()}`)}</Badge></TableCell>
                        <TableCell className="text-right">{article.lastModified}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Assets Library View */}
        {currentView === "assets" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{t("marketing.assets.title")}</h3>
              <Button variant="outline" onClick={() => toast.info(t("common.featureComingSoon"))}><Plus className="mr-2 h-4 w-4" /> {t("marketing.assets.upload")}</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i} className="overflow-hidden group cursor-pointer">
                  <div className="aspect-square bg-muted flex items-center justify-center relative">
                    <Image className="h-10 w-10 text-muted-foreground opacity-50" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium">
                      {t("common.viewDetails")}
                    </div>
                  </div>
                  <CardFooter className="p-2 text-xs text-muted-foreground truncate">
                    marketing-banner-{i}.jpg
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Leads View */}
        {currentView === "leads" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{t("marketing.leads.title")}</h3>
              <Button onClick={() => setIsCreateLeadFormOpen(true)}><Plus className="mr-2 h-4 w-4" /> {t("marketing.leads.create")}</Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>{t("marketing.leads.activeForms")}</CardTitle>
                <CardDescription>{t("marketing.leads.activeFormsDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("marketing.leads.formName")}</TableHead>
                      <TableHead>{t("marketing.leads.type")}</TableHead>
                      <TableHead>{t("marketing.leads.views")}</TableHead>
                      <TableHead>{t("marketing.leads.submissions")}</TableHead>
                      <TableHead>{t("marketing.leads.conversionRate")}</TableHead>
                      <TableHead>{t("marketing.leads.status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leadForms.map((form) => (
                      <TableRow key={form.id}>
                        <TableCell className="font-medium">{form.name}</TableCell>
                        <TableCell>{t(`marketing.leads.types.${form.type}`)}</TableCell>
                        <TableCell>{form.views.toLocaleString()}</TableCell>
                        <TableCell>{form.submissions.toLocaleString()}</TableCell>
                        <TableCell>{form.conversionRate}</TableCell>
                        <TableCell><Badge variant={form.status === "active" ? "default" : "secondary"}>{t(`marketing.leads.statuses.${form.status}`)}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Content Settings View */}
        {currentView === "contentSettings" && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{t("marketing.contentSettings.title")}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("marketing.contentSettings.brand")}</CardTitle>
                  <CardDescription>{t("marketing.contentSettings.brandDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">{t("marketing.contentSettings.primaryColor")}</label>
                    <div className="flex gap-2 items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-600 border"></div>
                      <Input defaultValue="#2563EB" className="w-32" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">{t("marketing.contentSettings.secondaryColor")}</label>
                    <div className="flex gap-2 items-center">
                      <div className="w-8 h-8 rounded-full bg-orange-500 border"></div>
                      <Input defaultValue="#F97316" className="w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t("marketing.contentSettings.seo")}</CardTitle>
                  <CardDescription>{t("marketing.contentSettings.seoDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">{t("marketing.contentSettings.metaSuffix")}</label>
                    <Input defaultValue="| My Store Name" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="index-content" className="rounded border-gray-300" defaultChecked />
                    <label htmlFor="index-content" className="text-sm">{t("marketing.contentSettings.indexContent")}</label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("marketing.title")}</h2>
          <p className="text-muted-foreground">
            {t("marketing.description")}
          </p>
        </div>
        {currentView === "dashboard" && (
          <div className="flex items-center space-x-2">
            <Button onClick={() => setCurrentView("campaigns")}>
              <Plus className="mr-2 h-4 w-4" /> {t("marketing.campaigns.create")}
            </Button>
          </div>
        )}
      </div>

      {renderContent()}

      <Dialog open={isCreateCampaignOpen} onOpenChange={setIsCreateCampaignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("marketing.campaigns.create")}</DialogTitle>
            <DialogDescription>
              {t("marketing.campaigns.createDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("marketing.campaigns.name")}</label>
              <Input 
                placeholder={t("marketing.campaigns.name")} 
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("marketing.campaigns.budget")}</label>
              <Input 
                type="number"
                placeholder={t("marketing.campaigns.budget")} 
                value={newCampaignBudget}
                onChange={(e) => setNewCampaignBudget(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("marketing.campaigns.platform")}</label>
              <Select value={newCampaignPlatform} onValueChange={setNewCampaignPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder={t("marketing.campaigns.platform")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="Google Ads">Google Ads</SelectItem>
                  <SelectItem value="Multi-channel">Multi-channel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateCampaignOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleCreateCampaign}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreatePromotionOpen} onOpenChange={setIsCreatePromotionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("marketing.promotions.create")}</DialogTitle>
            <DialogDescription>
              {t("marketing.promotions.createDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("marketing.promotions.name")}</label>
              <Input 
                placeholder={t("marketing.promotions.name")} 
                value={newPromoName}
                onChange={(e) => setNewPromoName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("marketing.promotions.type")}</label>
              <Select value={newPromoType} onValueChange={setNewPromoType}>
                <SelectTrigger>
                  <SelectValue placeholder={t("marketing.promotions.type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flash_sale">{t("marketing.promotions.flashSale")}</SelectItem>
                  <SelectItem value="voucher">{t("marketing.promotions.voucherCenter")}</SelectItem>
                  <SelectItem value="group_buy">{t("marketing.promotions.groupBuy")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("marketing.promotions.discount")}</label>
              <Input 
                placeholder={t("marketing.promotions.discount")} 
                value={newPromoDiscount}
                onChange={(e) => setNewPromoDiscount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatePromotionOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleCreatePromotion}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateEmailOpen} onOpenChange={setIsCreateEmailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("marketing.email.create")}</DialogTitle>
            <DialogDescription>
              {t("marketing.email.createDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("marketing.email.campaignName")}</label>
              <Input 
                placeholder={t("marketing.email.campaignName")} 
                value={newEmailName}
                onChange={(e) => setNewEmailName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateEmailOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleCreateEmail}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateArticleOpen} onOpenChange={setIsCreateArticleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("marketing.content.newArticle")}</DialogTitle>
            <DialogDescription>
              {t("marketing.content.createDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("marketing.content.articleTitle")}</label>
              <Input 
                placeholder={t("marketing.content.articleTitle")} 
                value={newArticleTitle}
                onChange={(e) => setNewArticleTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateArticleOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleCreateArticle}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateLeadFormOpen} onOpenChange={setIsCreateLeadFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("marketing.leads.create")}</DialogTitle>
            <DialogDescription>
              {t("marketing.leads.createDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("marketing.leads.formName")}</label>
              <Input 
                placeholder={t("marketing.leads.formName")} 
                value={newLeadFormName}
                onChange={(e) => setNewLeadFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("marketing.leads.type")}</label>
              <Select value={newLeadFormType} onValueChange={setNewLeadFormType}>
                <SelectTrigger>
                  <SelectValue placeholder={t("marketing.leads.type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="embedded">{t("marketing.leads.types.embedded")}</SelectItem>
                  <SelectItem value="popup">{t("marketing.leads.types.popup")}</SelectItem>
                  <SelectItem value="landingPage">{t("marketing.leads.types.landingPage")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateLeadFormOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleCreateLeadForm}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              {t("marketing.ai.title")}
            </DialogTitle>
            <DialogDescription>
              {t("marketing.ai.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("marketing.ai.promptLabel")}</label>
              <Input 
                placeholder={t("marketing.ai.promptPlaceholder")} 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                disabled={isAiGenerating}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAiDialogOpen(false)} disabled={isAiGenerating}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleAiGenerate} disabled={isAiGenerating}>
              {isAiGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("marketing.ai.generating")}
                </>
              ) : (
                t("marketing.ai.generate")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
