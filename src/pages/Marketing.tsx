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
  Send
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

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("marketing.title")}</h2>
          <p className="text-muted-foreground">
            {t("marketing.description")}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> {t("marketing.campaigns.create")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">{t("marketing.tabs.campaigns")}</TabsTrigger>
          <TabsTrigger value="social">{t("marketing.tabs.social")}</TabsTrigger>
          <TabsTrigger value="messages">{t("marketing.tabs.messages")}</TabsTrigger>
          <TabsTrigger value="promotions">{t("marketing.tabs.promotions")}</TabsTrigger>
          <TabsTrigger value="landingPages">{t("marketing.tabs.landingPages")}</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
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

        {/* Social Media Tab */}
        <TabsContent value="social" className="space-y-4">
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
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
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
        </TabsContent>

        {/* Promotions Tab */}
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

        {/* Landing Pages Tab */}
        <TabsContent value="landingPages" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
