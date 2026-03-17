import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { GoogleGenAI } from "@google/genai"
import { 
  MessageSquare, 
  PhoneCall, 
  Ticket, 
  Users, 
  MoreHorizontal, 
  Send, 
  Phone, 
  User, 
  Clock, 
  MessageCircle,
  Facebook,
  Globe,
  Smartphone,
  Plus,
  Settings,
  ChevronRight,
  LayoutDashboard,
  Sparkles,
  Loader2,
  Smile,
  Meh,
  Frown
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Separator } from "@/src/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { Label } from "@/src/components/ui/label"
import { cn } from "@/src/lib/utils"
import { toast } from "sonner"
import Markdown from "react-markdown"

export function CustomerService() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("chat")
  const [isIncomingCall, setIsIncomingCall] = useState(false)
  const [activeCall, setActiveCall] = useState(false)
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false)

  // AI Sentiment State
  const [isAnalyzingSentiment, setIsAnalyzingSentiment] = useState(false)
  const [sentimentResult, setSentimentResult] = useState<{
    score: number;
    label: string;
    summary: string;
  } | null>(null)

  // AI Suggested Replies State
  const [isGeneratingReplies, setIsGeneratingReplies] = useState(false)
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([])
  const [chatInput, setChatInput] = useState("")

  const runSentimentAnalysis = async () => {
    setIsAnalyzingSentiment(true)
    try {
      const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
      const model = genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the sentiment of a customer based on this context: 
        Customer: Nguyễn Văn A. 
        Recent message: "Chào shop, cho mình hỏi đơn hàng ORD-7352 bao giờ giao ạ?"
        Recent orders: ORD-7352 (Shipping), ORD-7200 (Delivered).
        Customer status: VIP.
        
        Provide a JSON response with:
        - score: 0 to 100 (0 very negative, 100 very positive)
        - label: "Positive", "Neutral", or "Negative"
        - summary: 1 sentence explaining why.
        
        Language: ${t("languageCode") || "English"}.`,
        config: {
          responseMimeType: "application/json"
        }
      })

      const response = await model
      const result = JSON.parse(response.text || "{}")
      setSentimentResult(result)
    } catch (error) {
      console.error("Sentiment analysis error:", error)
      toast.error(t("customerService.ai.sentimentError"))
    } finally {
      setIsAnalyzingSentiment(false)
    }
  }

  const generateReplies = async () => {
    setIsGeneratingReplies(true)
    try {
      const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
      const model = genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate 3 short, professional, and helpful suggested replies for a customer service agent.
        Customer message: "Chào shop, cho mình hỏi đơn hàng ORD-7352 bao giờ giao ạ?"
        Context: Order ORD-7352 is currently in "Shipping" status.
        Agent should be polite and helpful.
        
        Provide a JSON array of 3 strings.
        Language: ${t("languageCode") || "English"}.`,
        config: {
          responseMimeType: "application/json"
        }
      })

      const response = await model
      const result = JSON.parse(response.text || "[]")
      setSuggestedReplies(result)
    } catch (error) {
      console.error("Generate replies error:", error)
      toast.error(t("customerService.ai.repliesError"))
    } finally {
      setIsGeneratingReplies(false)
    }
  }

  useEffect(() => {
    if (activeTab === "chat") {
      runSentimentAnalysis()
      generateReplies()
    }
  }, [activeTab])
  
  // Team Management State
  const [teams, setTeams] = useState([
    { id: 1, name: "VIP Support", desc: "Dedicated support for VIP customers", members: 3, routing: "vip", routingLabel: "vip" },
    { id: 2, name: "General Support", desc: "Handle general inquiries and FAQs", members: 12, routing: "all", routingLabel: "all" },
    { id: 3, name: "Technical Support", desc: "Level 2 technical issues and warranty", members: 2, routing: "tech", routingLabel: "tech" },
  ])
  const [newTeamName, setNewTeamName] = useState("")
  const [newTeamDesc, setNewTeamDesc] = useState("")
  const [newTeamRouting, setNewTeamRouting] = useState("all")

  const handleCreateTeam = () => {
    const newTeam = {
      id: teams.length + 1,
      name: newTeamName,
      desc: newTeamDesc,
      members: 0,
      routing: newTeamRouting,
      routingLabel: newTeamRouting
    }
    setTeams([...teams, newTeam])
    setIsCreateTeamOpen(false)
    // Reset form
    setNewTeamName("")
    setNewTeamDesc("")
    setNewTeamRouting("all")
    toast.success(t("customerService.teams.createdSuccess"))
  }

  const simulateIncomingCall = () => {
    setIsIncomingCall(true)
  }

  const acceptCall = () => {
    setIsIncomingCall(false)
    setActiveCall(true)
    toast.success(t("customerService.hotline.callAccepted"))
  }

  const navItems = [
    { id: "chat", label: t("customerService.tabs.chat"), icon: MessageSquare },
    { id: "hotline", label: t("customerService.tabs.hotline"), icon: PhoneCall },
    { id: "tickets", label: t("customerService.tabs.tickets"), icon: Ticket },
    { id: "teams", label: t("customerService.tabs.teams"), icon: Users },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("customerService.title")}</h2>
          <p className="text-muted-foreground">
            {t("customerService.description")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={simulateIncomingCall}>
            <PhoneCall className="mr-2 h-4 w-4" />
            {t("customerService.hotline.simulateCall")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 space-y-6">
          <nav className="space-y-1">
            {navItems.map((item) => (
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
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <div className="bg-card rounded-xl border shadow-sm p-6 min-h-[600px]">
            {activeTab === "chat" && (
              <div className="flex gap-4 h-[600px]">
                {/* Channel List */}
                <Card className="w-64 flex flex-col shrink-0">
                  <CardHeader className="p-4 border-b">
                    <CardTitle className="text-sm font-medium">{t("customerService.chat.channels")}</CardTitle>
                  </CardHeader>
                  <ScrollArea className="flex-1">
                    <div className="p-2 space-y-2">
                      <Button variant="ghost" className="w-full justify-start gap-2 bg-accent">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                        <div className="flex flex-col items-start text-sm">
                          <span className="font-medium">Zalo OA</span>
                          <span className="text-xs text-muted-foreground">5 active</span>
                        </div>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <Facebook className="h-4 w-4 text-blue-600" />
                        <div className="flex flex-col items-start text-sm">
                          <span className="font-medium">Messenger</span>
                          <span className="text-xs text-muted-foreground">3 active</span>
                        </div>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <Globe className="h-4 w-4 text-emerald-500" />
                        <div className="flex flex-col items-start text-sm">
                          <span className="font-medium">Live Chat</span>
                          <span className="text-xs text-muted-foreground">2 active</span>
                        </div>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <Smartphone className="h-4 w-4 text-green-500" />
                        <div className="flex flex-col items-start text-sm">
                          <span className="font-medium">WhatsApp</span>
                          <span className="text-xs text-muted-foreground">0 active</span>
                        </div>
                      </Button>
                    </div>
                  </ScrollArea>
                </Card>

                {/* Chat Area */}
                <Card className="flex-1 flex flex-col">
                  <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">Nguyễn Văn A</CardTitle>
                        <CardDescription className="text-xs flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                          Online via Zalo
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => toast.info(t("common.featureComingSoon"))}>
                        <Ticket className="h-4 w-4 mr-2" />
                        Create Ticket
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => toast.info(t("common.featureComingSoon"))}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm">Chào shop, cho mình hỏi đơn hàng ORD-7352 bao giờ giao ạ?</p>
                          <span className="text-[10px] text-muted-foreground mt-1 block">10:30 AM</span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm">Dạ chào anh A, để em kiểm tra giúp anh nhé.</p>
                          <span className="text-[10px] text-primary-foreground/70 mt-1 block">10:31 AM</span>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t space-y-4">
                    {suggestedReplies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {suggestedReplies.map((reply, idx) => (
                          <Button 
                            key={idx} 
                            variant="outline" 
                            size="sm" 
                            className="text-xs h-auto py-1 px-2 max-w-[200px] truncate"
                            onClick={() => setChatInput(reply)}
                          >
                            {reply}
                          </Button>
                        ))}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-auto py-1 px-2 text-xs text-primary"
                          onClick={generateReplies}
                          disabled={isGeneratingReplies}
                        >
                          {isGeneratingReplies ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1" />}
                          {t("customerService.ai.refreshReplies")}
                        </Button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Type a message..." 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                      />
                      <Button size="icon" onClick={() => {
                        if (chatInput.trim()) {
                          toast.success(t("customerService.chat.messageSent"))
                          setChatInput("")
                        }
                      }}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Customer Context Panel */}
                <Card className="w-80 flex flex-col shrink-0">
                  <CardHeader className="p-4 border-b">
                    <CardTitle className="text-sm font-medium">{t("customerService.chat.customerInfo")}</CardTitle>
                  </CardHeader>
                  <ScrollArea className="flex-1">
                    <div className="p-4 space-y-6">
                      {/* AI Sentiment Analysis */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            {t("customerService.ai.sentimentTitle")}
                          </h4>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={runSentimentAnalysis}
                            disabled={isAnalyzingSentiment}
                          >
                            <Loader2 className={cn("h-3 w-3", isAnalyzingSentiment && "animate-spin")} />
                          </Button>
                        </div>
                        
                        {isAnalyzingSentiment ? (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            {t("customerService.ai.analyzing")}
                          </div>
                        ) : sentimentResult ? (
                          <div className="p-3 rounded-lg bg-muted/50 border space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {sentimentResult.label === "Positive" && <Smile className="h-4 w-4 text-green-500" />}
                                {sentimentResult.label === "Neutral" && <Meh className="h-4 w-4 text-yellow-500" />}
                                {sentimentResult.label === "Negative" && <Frown className="h-4 w-4 text-red-500" />}
                                <span className={cn(
                                  "text-sm font-bold",
                                  sentimentResult.label === "Positive" && "text-green-600",
                                  sentimentResult.label === "Neutral" && "text-yellow-600",
                                  sentimentResult.label === "Negative" && "text-red-600"
                                )}>
                                  {sentimentResult.label}
                                </span>
                              </div>
                              <span className="text-xs font-medium">{sentimentResult.score}/100</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div 
                                className={cn(
                                  "h-1.5 rounded-full transition-all duration-500",
                                  sentimentResult.label === "Positive" && "bg-green-500",
                                  sentimentResult.label === "Neutral" && "bg-yellow-500",
                                  sentimentResult.label === "Negative" && "bg-red-500"
                                )}
                                style={{ width: `${sentimentResult.score}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground italic">
                              "{sentimentResult.summary}"
                            </p>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-xs"
                            onClick={runSentimentAnalysis}
                          >
                            {t("customerService.ai.runAnalysis")}
                          </Button>
                        )}
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Nguyễn Văn A</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>0901234567</span>
                        </div>
                        <Badge variant="outline" className="mt-2">VIP Customer</Badge>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {t("customerService.chat.recentOrders")}
                        </h4>
                        <div className="space-y-3">
                          <div className="border rounded-md p-3 text-sm">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">ORD-7352</span>
                              <Badge variant="secondary" className="text-[10px]">Shipping</Badge>
                            </div>
                            <p className="text-muted-foreground text-xs">iPhone 15 Pro Max</p>
                            <p className="text-xs mt-1">Total: 34,990,000đ</p>
                          </div>
                          <div className="border rounded-md p-3 text-sm">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">ORD-7200</span>
                              <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">Delivered</Badge>
                            </div>
                            <p className="text-muted-foreground text-xs">AirPods Pro 2</p>
                            <p className="text-xs mt-1">Total: 5,990,000đ</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </Card>
              </div>
            )}

            {activeTab === "hotline" && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("customerService.hotline.callHistory")}</CardTitle>
                  <CardDescription>Manage incoming and outgoing calls.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Caller</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Agent</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">0901234567 (Nguyễn Văn A)</TableCell>
                        <TableCell>05:23</TableCell>
                        <TableCell><Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge></TableCell>
                        <TableCell>10:30 AM</TableCell>
                        <TableCell>Staff 1</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">0912345678 (Trần Thị B)</TableCell>
                        <TableCell>00:00</TableCell>
                        <TableCell><Badge variant="destructive">Missed</Badge></TableCell>
                        <TableCell>09:15 AM</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {activeTab === "tickets" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{t("customerService.tabs.tickets")}</CardTitle>
                    <CardDescription>Manage support tickets and complaints.</CardDescription>
                  </div>
                  <Button onClick={() => toast.info(t("common.featureComingSoon"))}>
                    <Ticket className="mr-2 h-4 w-4" />
                    {t("customerService.tickets.create")}
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Assignee</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">TKT-1001</TableCell>
                        <TableCell>Wrong item delivered</TableCell>
                        <TableCell>Nguyễn Văn A</TableCell>
                        <TableCell><Badge variant="destructive">High</Badge></TableCell>
                        <TableCell><Badge variant="secondary">In Progress</Badge></TableCell>
                        <TableCell>Staff 1</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">TKT-1002</TableCell>
                        <TableCell>Refund request</TableCell>
                        <TableCell>Trần Thị B</TableCell>
                        <TableCell><Badge variant="outline">Medium</Badge></TableCell>
                        <TableCell><Badge variant="outline">Open</Badge></TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
            {activeTab === "teams" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{t("customerService.teams.createGroup")}</CardTitle>
                    <CardDescription>Manage support teams and routing rules.</CardDescription>
                  </div>
                  <Button onClick={() => setIsCreateTeamOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("customerService.teams.createGroup")}
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("customerService.teams.groupName")}</TableHead>
                        <TableHead>{t("customerService.teams.description")}</TableHead>
                        <TableHead>{t("customerService.teams.members")}</TableHead>
                        <TableHead>{t("customerService.teams.routing")}</TableHead>
                        <TableHead className="text-right">{t("common.actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teams.map((team) => (
                        <TableRow key={team.id}>
                          <TableCell className="font-medium">{team.name}</TableCell>
                          <TableCell>{team.desc}</TableCell>
                          <TableCell>
                            <div className="flex -space-x-2">
                              <Avatar className="h-8 w-8 border-2 border-background">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>S1</AvatarFallback>
                              </Avatar>
                              {team.members > 1 && (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                                  +{team.members - 1}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell><Badge variant="outline">{t(`customerService.teams.routingRules.${team.routingLabel}`)}</Badge></TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => toast.info(t("common.featureComingSoon"))}><Settings className="h-4 w-4" /></Button>
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

      {/* Create Team Modal */}
      <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("customerService.teams.createGroup")}</DialogTitle>
            <DialogDescription>
              Create a new customer service team and define routing rules.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t("customerService.teams.groupName")}
              </Label>
              <Input 
                id="name" 
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desc" className="text-right">
                Description
              </Label>
              <Input 
                id="desc" 
                value={newTeamDesc}
                onChange={(e) => setNewTeamDesc(e.target.value)}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="routing" className="text-right">
                {t("customerService.teams.routing")}
              </Label>
              <Select value={newTeamRouting} onValueChange={setNewTeamRouting}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select routing rule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("customerService.teams.routingRules.all")}</SelectItem>
                  <SelectItem value="vip">{t("customerService.teams.routingRules.vip")}</SelectItem>
                  <SelectItem value="tech">{t("customerService.teams.routingRules.tech")}</SelectItem>
                  <SelectItem value="complaint">{t("customerService.teams.routingRules.complaint")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateTeamOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTeam}>Create Team</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Incoming Call Modal */}
      <Dialog open={isIncomingCall} onOpenChange={setIsIncomingCall}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <PhoneCall className="h-6 w-6 text-green-500 animate-pulse" />
              {t("customerService.hotline.incomingCall")}
            </DialogTitle>
            <DialogDescription>
              Incoming call from <strong>0901234567</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>NA</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-bold">Nguyễn Văn A</h3>
              <Badge variant="outline" className="mt-1">VIP Customer</Badge>
            </div>
          </div>
          <DialogFooter className="flex gap-2 sm:justify-center">
            <Button variant="destructive" onClick={() => setIsIncomingCall(false)} className="w-full">
              {t("customerService.hotline.reject")}
            </Button>
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={acceptCall}>
              {t("customerService.hotline.accept")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Active Call Screen (Simulated as a Dialog for now, could be a full page redirect) */}
      <Dialog open={activeCall} onOpenChange={setActiveCall}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-600" />
              {t("customerService.hotline.activeCall")} - Nguyễn Văn A (0901234567)
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden">
            {/* Left: Customer Info */}
            <div className="col-span-1 border-r pr-6 space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground">Customer Profile</h3>
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>NA</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-lg">Nguyễn Văn A</p>
                    <p className="text-sm text-muted-foreground">Hanoi, Vietnam</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                    <p className="font-medium">25,000,000đ</p>
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Orders</p>
                    <p className="font-medium">12</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary">VIP</Badge>
                    <Badge variant="outline">High Value</Badge>
                    <Badge variant="outline">Loyal</Badge>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground">Quick Actions</h3>
                <Button variant="outline" className="w-full justify-start">
                  <Ticket className="mr-2 h-4 w-4" /> Create Ticket
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" /> Send SMS/Zalo
                </Button>
              </div>
            </div>

            {/* Right: Recent Orders */}
            <div className="col-span-2 overflow-y-auto">
              <h3 className="font-medium text-sm text-muted-foreground mb-4">Recent Orders (Last 10)</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">ORD-735{i}</TableCell>
                      <TableCell>2026-03-0{i + 1}</TableCell>
                      <TableCell>Product Item {i + 1}</TableCell>
                      <TableCell>
                        <Badge variant={i % 3 === 0 ? "default" : "secondary"}>
                          {i % 3 === 0 ? "Delivered" : "Processing"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">1,200,000đ</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter>
            <Button variant="destructive" onClick={() => { setActiveCall(false); toast.info(t("customerService.hotline.callEnded")); }}>
              End Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
