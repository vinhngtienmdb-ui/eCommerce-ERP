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
  ArrowLeft
} from "lucide-react"
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

export function Marketing() {
  const { t } = useTranslation()
  const [currentView, setCurrentView] = useState<string>("dashboard")

  // Mock Data for Campaigns
  const [campaigns] = useState([
    { id: 1, name: "Summer Sale 2024", status: "active", budget: 50000000, revenue: 120000000, pnl: 70000000, roi: 140, platform: "Multi-channel" },
    { id: 2, name: "New Product Launch", status: "planned", budget: 30000000, revenue: 0, pnl: -30000000, roi: 0, platform: "Facebook, TikTok" },
    { id: 3, name: "Flash Sale 6.6", status: "completed", budget: 20000000, revenue: 85000000, pnl: 65000000, roi: 325, platform: "App" },
  ])

  // Mock Data for Social Posts
  const [posts] = useState([
    { id: 1, content: "Giảm giá 50% cho tất cả sản phẩm hè!", platform: "facebook", status: "published", engagement: 1200, date: "2024-06-01" },
    { id: 2, content: "Review sản phẩm mới - Siêu phẩm 2024", platform: "tiktok", status: "scheduled", engagement: 0, date: "2024-06-05" },
  ])

  // Mock Data for Promotions
  const [promotions] = useState([
    { id: 1, name: "Flash Sale 12H", type: "flash_sale", discount: "50%", start: "12:00", end: "14:00", status: "active" },
    { id: 2, name: "Voucher 100K", type: "voucher", discount: "100.000đ", start: "2024-06-01", end: "2024-06-30", status: "active" },
    { id: 3, name: "Mua chung giá rẻ", type: "group_buy", discount: "30%", start: "2024-06-10", end: "2024-06-15", status: "upcoming" },
  ])

  const marketingCampaigns = [
    { id: "campaigns", title: "Chiến dịch", description: "Tạo chiến dịch, mục tiêu, thời gian, ngân sách.", icon: Megaphone, color: "text-pink-500", bg: "bg-pink-100" },
    { id: "email", title: "Email Marketing", description: "Gửi email hàng loạt, mẫu, A/B test.", icon: Mail, color: "text-blue-500", bg: "bg-blue-100" },
    { id: "messages", title: "SMS & Thông báo", description: "SMS, push, tin nhắn trong app.", icon: MessageSquare, color: "text-green-500", bg: "bg-green-100" },
    { id: "social", title: "Mạng xã hội", description: "Lịch đăng bài, đa kênh, lịch sử đăng.", icon: Share2, color: "text-purple-500", bg: "bg-purple-100" },
    { id: "reports", title: "Báo cáo chiến dịch", description: "Hiệu quả, tỷ lệ mở/click, chuyển đổi.", icon: BarChart3, color: "text-cyan-500", bg: "bg-cyan-100" },
    { id: "settings", title: "Thiết lập chiến dịch", description: "Kênh, mẫu, giới hạn gửi.", icon: Settings, color: "text-gray-500", bg: "bg-gray-100" },
  ]

  const contentMedia = [
    { id: "content", title: "Quản lý nội dung", description: "Bài viết, landing page, bài quảng cáo.", icon: FileText, color: "text-pink-500", bg: "bg-pink-100" },
    { id: "assets", title: "Thư viện tài sản", description: "Hình ảnh, video, file tái sử dụng.", icon: Image, color: "text-violet-500", bg: "bg-violet-100" },
    { id: "landingPages", title: "Landing page", description: "Tạo trang đích, form đăng ký, theo dõi.", icon: LayoutTemplate, color: "text-emerald-500", bg: "bg-emerald-100" },
    { id: "leads", title: "Form thu thập lead", description: "Form nhúng, popup, tích hợp.", icon: ClipboardList, color: "text-orange-500", bg: "bg-orange-100" },
    { id: "contentSettings", title: "Thiết lập nội dung", description: "Mẫu, thư viện thương hiệu.", icon: Settings, color: "text-gray-500", bg: "bg-gray-100" },
  ]

  const renderDashboard = () => (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
          <h3 className="text-lg font-semibold text-blue-600">Chiến dịch Marketing</h3>
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
          <h3 className="text-lg font-semibold text-blue-600">Nội dung & Truyền thông</h3>
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
          <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
        </Button>

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
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">100.000.000đ</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">205.000.000đ</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ROI</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">205%</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                <Megaphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Running across 3 platforms</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("marketing.tabs.campaigns")}</CardTitle>
              <CardDescription>
                Overview of your marketing campaigns and their performance (P&L).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("marketing.campaigns.name")}</TableHead>
                    <TableHead>{t("marketing.campaigns.status")}</TableHead>
                    <TableHead>Platform</TableHead>
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
                      <Clock className="h-5 w-5" /> Flash Sale
                    </CardTitle>
                    <CardDescription>Create time-limited offers.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">{t("marketing.promotions.createFlashSale")}</Button>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-600">
                      <Tag className="h-5 w-5" /> Voucher Center
                    </CardTitle>
                    <CardDescription>Manage discount vouchers.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">{t("marketing.promotions.createVoucher")}</Button>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <Users className="h-5 w-5" /> Group Buy
                    </CardTitle>
                    <CardDescription>Create group buying deals.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-green-600 hover:bg-green-700">{t("marketing.promotions.createGroupBuy")}</Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Active Promotions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {promotions.map((promo) => (
                        <TableRow key={promo.id}>
                          <TableCell className="font-medium">{promo.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {promo.type.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{promo.discount}</TableCell>
                          <TableCell>{promo.start} - {promo.end}</TableCell>
                          <TableCell>
                            <Badge>{promo.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
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
                <CardDescription>Create and schedule posts for Facebook & TikTok.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">{t("marketing.social.platform")}</label>
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1 gap-2"><Facebook className="h-4 w-4" /> Facebook</Button>
                    <Button variant="outline" className="flex-1 gap-2"><Video className="h-4 w-4" /> TikTok</Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">{t("marketing.social.content")}</label>
                  <Input placeholder="What's on your mind?" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">{t("marketing.social.schedule")}</label>
                  <Input type="datetime-local" />
                </div>
                <Button className="w-full">{t("marketing.social.createPost")}</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Posts</CardTitle>
                <CardDescription>Performance of your recent social media posts.</CardDescription>
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
                          <p className="text-xs text-muted-foreground">{post.date} • {post.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{post.engagement}</p>
                        <p className="text-xs text-muted-foreground">Engagements</p>
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
                <CardTitle>Zalo OA Integration</CardTitle>
                <CardDescription>Status: <span className="text-green-600 font-bold">Connected</span></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Followers</span>
                    <span className="font-bold text-xl">12,450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Quota Remaining</span>
                    <span className="font-bold text-xl">45,000 / 50,000</span>
                  </div>
                  <Button className="w-full" variant="outline">Manage Zalo OA</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ad Message Performance</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sent</span>
                    <span className="font-bold text-xl">5,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Open Rate</span>
                    <span className="font-bold text-xl">12.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Click Rate</span>
                    <span className="font-bold text-xl">3.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Message Campaigns</CardTitle>
              <CardDescription>History of Zalo OA and SMS campaigns.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Date</TableHead>
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
              <CardTitle>Landing Pages</CardTitle>
              <CardDescription>Manage content for your marketing landing pages.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <LayoutTemplate className="mx-auto h-8 w-8 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">No Landing Pages</h3>
                    <p className="text-sm text-muted-foreground">Create your first landing page to drive conversions.</p>
                    <Button className="mt-4" variant="outline">Create Landing Page</Button>
                  </div>
               </div>
            </CardContent>
          </Card>
        )}

        {/* Email Marketing View */}
        {currentView === "email" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Email Marketing</h3>
              <Button><Plus className="mr-2 h-4 w-4" /> Create Campaign</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15,234</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24.8%</div>
                  <p className="text-xs text-muted-foreground">+2.4% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Click Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2%</div>
                  <p className="text-xs text-muted-foreground">-0.5% from last month</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Email Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent</TableHead>
                      <TableHead>Open Rate</TableHead>
                      <TableHead>Click Rate</TableHead>
                      <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Monthly Newsletter - June</TableCell>
                      <TableCell><Badge>Sent</Badge></TableCell>
                      <TableCell>14,500</TableCell>
                      <TableCell>28%</TableCell>
                      <TableCell>4.5%</TableCell>
                      <TableCell className="text-right">2024-06-01</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Product Launch Announcement</TableCell>
                      <TableCell><Badge variant="secondary">Draft</Badge></TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="text-right">Created 2 days ago</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reports View */}
        {currentView === "reports" && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Campaign Reports</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                  <CardDescription>Where your traffic is coming from</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-md">
                   <div className="text-center text-muted-foreground">
                     <BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-50" />
                     <p>Traffic Chart Placeholder</p>
                   </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Rate by Channel</CardTitle>
                  <CardDescription>Which channels convert best</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-md">
                   <div className="text-center text-muted-foreground">
                     <TrendingUp className="h-10 w-10 mx-auto mb-2 opacity-50" />
                     <p>Conversion Chart Placeholder</p>
                   </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Settings View */}
        {currentView === "settings" && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Campaign Settings</h3>
            <Card>
              <CardHeader>
                <CardTitle>General Configuration</CardTitle>
                <CardDescription>Manage your default campaign settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Default Sender Name</label>
                  <Input defaultValue="Marketing Team" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Default Sender Email</label>
                  <Input defaultValue="marketing@example.com" />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="track-opens" className="rounded border-gray-300" defaultChecked />
                  <label htmlFor="track-opens" className="text-sm">Track email opens</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="track-clicks" className="rounded border-gray-300" defaultChecked />
                  <label htmlFor="track-clicks" className="text-sm">Track link clicks</label>
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Content Management View */}
        {currentView === "content" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Content Management</h3>
              <Button><Plus className="mr-2 h-4 w-4" /> New Article</Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Last Modified</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          Top 10 Summer Fashion Trends
                        </div>
                      </TableCell>
                      <TableCell>Sarah Jenkins</TableCell>
                      <TableCell><Badge>Published</Badge></TableCell>
                      <TableCell className="text-right">2 hours ago</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          How to Choose the Right Skincare
                        </div>
                      </TableCell>
                      <TableCell>Mike Ross</TableCell>
                      <TableCell><Badge variant="outline">Draft</Badge></TableCell>
                      <TableCell className="text-right">Yesterday</TableCell>
                    </TableRow>
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
              <h3 className="text-xl font-semibold">Asset Library</h3>
              <Button variant="outline"><Plus className="mr-2 h-4 w-4" /> Upload Asset</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i} className="overflow-hidden group cursor-pointer">
                  <div className="aspect-square bg-muted flex items-center justify-center relative">
                    <Image className="h-10 w-10 text-muted-foreground opacity-50" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium">
                      View Details
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
              <h3 className="text-xl font-semibold">Lead Generation Forms</h3>
              <Button><Plus className="mr-2 h-4 w-4" /> Create Form</Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Active Forms</CardTitle>
                <CardDescription>Manage your lead capture forms and popups.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Form Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Submissions</TableHead>
                      <TableHead>Conversion Rate</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Newsletter Signup Footer</TableCell>
                      <TableCell>Embedded</TableCell>
                      <TableCell>12,500</TableCell>
                      <TableCell>450</TableCell>
                      <TableCell>3.6%</TableCell>
                      <TableCell><Badge>Active</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Exit Intent Popup</TableCell>
                      <TableCell>Popup</TableCell>
                      <TableCell>3,200</TableCell>
                      <TableCell>85</TableCell>
                      <TableCell>2.6%</TableCell>
                      <TableCell><Badge>Active</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Summer Sale Registration</TableCell>
                      <TableCell>Landing Page</TableCell>
                      <TableCell>1,500</TableCell>
                      <TableCell>320</TableCell>
                      <TableCell>21.3%</TableCell>
                      <TableCell><Badge variant="secondary">Paused</Badge></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Content Settings View */}
        {currentView === "contentSettings" && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Content Settings</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Guidelines</CardTitle>
                  <CardDescription>Set default colors and fonts for your content.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Primary Color</label>
                    <div className="flex gap-2 items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-600 border"></div>
                      <Input defaultValue="#2563EB" className="w-32" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Secondary Color</label>
                    <div className="flex gap-2 items-center">
                      <div className="w-8 h-8 rounded-full bg-orange-500 border"></div>
                      <Input defaultValue="#F97316" className="w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>SEO Defaults</CardTitle>
                  <CardDescription>Default settings for search engine optimization.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Default Meta Title Suffix</label>
                    <Input defaultValue="| My Store Name" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="index-content" className="rounded border-gray-300" defaultChecked />
                    <label htmlFor="index-content" className="text-sm">Index content by default</label>
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
    </div>
  )
}
