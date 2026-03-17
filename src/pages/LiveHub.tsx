import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { 
  Video, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  MessageSquare, 
  Plus, 
  Pin, 
  PinOff, 
  Search, 
  StopCircle, 
  Calendar, 
  LayoutDashboard, 
  ChevronRight,
  Sparkles,
  Loader2,
  BrainCircuit,
  MessageCircle
} from "lucide-react"
import { cn } from "@/src/lib/utils"
import { GoogleGenAI } from "@google/genai"
import Markdown from "react-markdown"

export function LiveHub() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [pinnedProducts, setPinnedProducts] = useState<string[]>(["PROD-001"])
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [liveScript, setLiveScript] = useState<string | null>(null)
  const [sentimentAnalysis, setSentimentAnalysis] = useState<string | null>(null)

  const generateLiveScript = async () => {
    setIsAiLoading(true)
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a high-converting live stream script for an e-commerce seller.
        Products: Áo thun Cotton Premium, Quần Jeans Slimfit, Giày Sneaker Basic.
        Event: Mega Sale 3.3.
        
        Provide a script in Markdown format.
        Include:
        1. **Opening**: Hook the audience in the first 30 seconds.
        2. **Product Showcase**: Key selling points for each product.
        3. **Closing/CTA**: How to drive immediate purchases.
        
        Language: ${t("languageCode") || "English"}.`,
      })
      const response = await model
      setLiveScript(response.text || null)
    } catch (error) {
      console.error("Live Script Error:", error)
      setLiveScript(t("live.ai.scriptError"))
    } finally {
      setIsAiLoading(false)
    }
  }

  const analyzeLiveSentiment = async () => {
    setIsAiLoading(true)
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the sentiment of a simulated live stream chat.
        Context: E-commerce live stream for fashion products.
        
        Provide a brief report in Markdown format.
        Include:
        1. **Overall Sentiment**: Positive, Neutral, or Negative.
        2. **Top Questions**: What are people asking about most?
        3. **Engagement Advice**: How to improve the vibe right now.
        
        Language: ${t("languageCode") || "English"}.`,
      })
      const response = await model
      setSentimentAnalysis(response.text || null)
    } catch (error) {
      console.error("Sentiment Analysis Error:", error)
      setSentimentAnalysis(t("live.ai.sentimentError"))
    } finally {
      setIsAiLoading(false)
    }
  }

  const togglePin = (id: string) => {
    setPinnedProducts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const products = [
    { id: "PROD-001", name: "Áo thun Cotton Premium", price: 250000, stock: 150 },
    { id: "PROD-002", name: "Quần Jeans Slimfit", price: 550000, stock: 80 },
    { id: "PROD-003", name: "Giày Sneaker Basic", price: 890000, stock: 45 },
  ]

  const groups = [
    {
      id: "overview",
      title: t("live.tabs.dashboard"),
      items: [
        { id: "dashboard", label: t("live.tabs.dashboard"), icon: LayoutDashboard },
      ]
    },
    {
      id: "management",
      title: t("live.title"),
      items: [
        { id: "schedule", label: t("live.tabs.schedule"), icon: Calendar },
        { id: "activeSession", label: t("live.tabs.activeSession"), icon: Video },
        { id: "products", label: t("live.tabs.products"), icon: ShoppingCart },
        { id: "aiTools", label: t("live.tabs.aiTools"), icon: BrainCircuit },
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("live.title")}</h2>
        <p className="text-muted-foreground">
          {t("live.description")}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 space-y-6">
          {groups.map((group) => (
            <div key={group.id} className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                {group.title}
              </h3>
              <nav className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      activeTab === item.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </div>
                    {activeTab === item.id && <ChevronRight className="h-4 w-4" />}
                  </button>
                ))}
              </nav>
            </div>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <div className="bg-card rounded-xl border shadow-sm p-6 min-h-[600px]">
            {activeTab === "dashboard" && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t("live.dashboard.activeViewers")}
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,245</div>
                    <p className="text-xs text-muted-foreground text-green-500">
                      +15% from last hour
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t("live.dashboard.totalRevenue")}
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₫ 45,000,000</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t("live.dashboard.orders")}
                    </CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">128</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t("live.dashboard.engagement")}
                    </CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">15.4K</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "schedule" && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("live.tabs.schedule")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("live.schedule.title")}</TableHead>
                        <TableHead>{t("live.schedule.host")}</TableHead>
                        <TableHead>{t("live.schedule.startTime")}</TableHead>
                        <TableHead>{t("live.schedule.status")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Mega Sale 3.3</TableCell>
                        <TableCell>Nguyễn Văn A</TableCell>
                        <TableCell>2026-03-03 20:00</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-red-500">{t("live.schedule.live")}</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Ra mắt SP mới</TableCell>
                        <TableCell>Trần Thị B</TableCell>
                        <TableCell>2026-03-05 19:00</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{t("live.schedule.upcoming")}</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {activeTab === "activeSession" && (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                  <Card className="overflow-hidden">
                    <div className="aspect-video bg-black relative flex items-center justify-center">
                      <Video className="h-16 w-16 text-white/20" />
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                        LIVE
                      </div>
                      <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-2">
                        <Users className="h-3 w-3" /> 1,245
                      </div>
                    </div>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">Mega Sale 3.3</h3>
                        <p className="text-sm text-muted-foreground">Host: Nguyễn Văn A</p>
                      </div>
                      <Button variant="destructive">
                        <StopCircle className="mr-2 h-4 w-4" />
                        {t("live.activeSession.endStream")}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-4">
                  <Card className="h-[400px] flex flex-col">
                    <CardHeader>
                      <CardTitle>{t("live.activeSession.chat")}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto space-y-4">
                      <div className="flex gap-2">
                        <span className="font-bold text-sm">User123:</span>
                        <span className="text-sm">Áo này còn size M không ạ?</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-bold text-sm text-blue-500">Shop:</span>
                        <span className="text-sm">Dạ còn size M nha bạn ơi.</span>
                      </div>
                    </CardContent>
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Input placeholder="Nhập tin nhắn..." />
                        <Button size="icon"><MessageSquare className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
            
            {activeTab === "aiTools" && (
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-indigo-100 bg-indigo-50/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-700">
                      <Sparkles className="h-5 w-5" />
                      {t("live.ai.scriptGenerator")}
                    </CardTitle>
                    <CardDescription>
                      {t("live.ai.scriptDesc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isAiLoading ? (
                      <div className="flex items-center gap-2 text-indigo-500/60 italic py-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("live.ai.generatingScript")}
                      </div>
                    ) : liveScript ? (
                      <div className="text-sm text-slate-700 leading-relaxed markdown-body bg-white p-4 rounded-xl border border-indigo-100 max-h-[400px] overflow-y-auto">
                        <Markdown>{liveScript}</Markdown>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Button onClick={generateLiveScript} className="bg-indigo-600 hover:bg-indigo-700">
                          <Sparkles className="mr-2 h-4 w-4" />
                          {t("live.ai.generateScript")}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-emerald-100 bg-emerald-50/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-emerald-700">
                      <MessageCircle className="h-5 w-5" />
                      {t("live.ai.sentimentAnalysis")}
                    </CardTitle>
                    <CardDescription>
                      {t("live.ai.sentimentDesc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isAiLoading ? (
                      <div className="flex items-center gap-2 text-emerald-500/60 italic py-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("live.ai.analyzingSentiment")}
                      </div>
                    ) : sentimentAnalysis ? (
                      <div className="text-sm text-slate-700 leading-relaxed markdown-body bg-white p-4 rounded-xl border border-emerald-100">
                        <Markdown>{sentimentAnalysis}</Markdown>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Button onClick={analyzeLiveSentiment} className="bg-emerald-600 hover:bg-emerald-700">
                          <Sparkles className="mr-2 h-4 w-4" />
                          {t("live.ai.runAnalysis")}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
                <Card>
                <CardHeader>
                  <CardTitle>{t("live.tabs.products")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder={t("live.products.search")} className="pl-8" />
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead className="text-right">{t("live.products.price")}</TableHead>
                        <TableHead className="text-right">{t("live.products.stock")}</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell className="text-right">{product.price.toLocaleString()} ₫</TableCell>
                          <TableCell className="text-right">{product.stock}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant={pinnedProducts.includes(product.id) ? "secondary" : "default"}
                              onClick={() => togglePin(product.id)}
                            >
                              {pinnedProducts.includes(product.id) ? (
                                <><PinOff className="mr-2 h-4 w-4" /> {t("live.products.unpin")}</>
                              ) : (
                                <><Pin className="mr-2 h-4 w-4" /> {t("live.products.pin")}</>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
