import { useState } from "react"
import { useTranslation } from "react-i18next"
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Search, 
  Filter, 
  MoreHorizontal,
  Video,
  Instagram,
  Facebook,
  Youtube,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  BadgeCheck,
  UserPlus
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"

import { toast } from "sonner"

export default function KolManagement() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("list")

  const handleInvite = () => toast.success(t("common.inviteSuccess", "Đã mở giao diện mời KOL"));
  const handleApprove = () => toast.success(t("common.approveSuccess", "Đã duyệt yêu cầu"));
  const handleReject = () => toast.success(t("common.rejectSuccess", "Đã từ chối yêu cầu"));
  const handleViewProfile = () => toast.success(t("common.viewProfileSuccess", "Đang mở hồ sơ..."));
  const handleTerminate = () => toast.success(t("common.terminateSuccess", "Đã chấm dứt hợp tác"));

  const kols = [
    { id: 1, name: "Linh Trương", platform: "TikTok", followers: "1.2M", status: "active", revenue: 450000000, commission: 45000000, rating: 4.8 },
    { id: 2, name: "Hoàng Nam", platform: "YouTube", followers: "850K", status: "active", revenue: 320000000, commission: 32000000, rating: 4.9 },
    { id: 3, name: "Minh Anh", platform: "Instagram", followers: "500K", status: "active", revenue: 150000000, commission: 15000000, rating: 4.7 },
    { id: 4, name: "Thanh Hằng", platform: "TikTok", followers: "2.5M", status: "active", revenue: 890000000, commission: 89000000, rating: 4.9 },
    { id: 5, name: "Quốc Bảo", platform: "Facebook", followers: "300K", status: "inactive", revenue: 50000000, commission: 5000000, rating: 4.2 },
  ]

  const requests = [
    { id: 1, name: "An Nhiên", platform: "TikTok", followers: "150K", date: "2024-03-15", status: "pending" },
    { id: 2, name: "Đức Huy", platform: "YouTube", followers: "200K", date: "2024-03-16", status: "pending" },
  ]

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'tiktok': return <Video className="h-4 w-4 text-pink-500" />
      case 'instagram': return <Instagram className="h-4 w-4 text-purple-500" />
      case 'facebook': return <Facebook className="h-4 w-4 text-blue-600" />
      case 'youtube': return <Youtube className="h-4 w-4 text-red-600" />
      default: return <Users className="h-4 w-4" />
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("kolManagement.title")}</h2>
          <p className="text-muted-foreground">
            {t("kolManagement.description")}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleInvite}>
            <UserPlus className="mr-2 h-4 w-4" />
            {t("kolManagement.invite")}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("kolManagement.stats.total")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">
              {t("kolManagement.stats.newThisMonth", { count: 48 })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("kolManagement.stats.pending")}</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              {t("kolManagement.stats.needsAction")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("kolManagement.stats.revenue")}</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4B ₫</div>
            <div className="flex items-center text-xs text-emerald-500">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              +18.2%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("kolManagement.stats.commissions")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">240M ₫</div>
            <div className="flex items-center text-xs text-blue-500">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              +12.5%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">{t("kolManagement.tabs.list")}</TabsTrigger>
          <TabsTrigger value="approval">{t("kolManagement.tabs.approval")}</TabsTrigger>
          <TabsTrigger value="stats">{t("kolManagement.tabs.stats")}</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("kolManagement.list.searchPlaceholder")}
                  className="pl-8"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("kolManagement.list.table.kol")}</TableHead>
                    <TableHead>{t("kolManagement.list.table.platform")}</TableHead>
                    <TableHead>{t("kolManagement.list.table.followers")}</TableHead>
                    <TableHead>{t("kolManagement.list.table.status")}</TableHead>
                    <TableHead className="text-right">{t("kolManagement.list.table.revenue")}</TableHead>
                    <TableHead className="text-right">{t("kolManagement.list.table.commissions")}</TableHead>
                    <TableHead className="text-right">{t("kolManagement.list.table.rating")}</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kols.map((kol) => (
                    <TableRow key={kol.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${kol.id}`} />
                            <AvatarFallback>{kol.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium flex items-center gap-1">
                              {kol.name}
                              {kol.followers.includes('M') && <BadgeCheck className="h-3 w-3 text-blue-500" />}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(kol.platform)}
                          <span className="text-sm">{kol.platform}</span>
                        </div>
                      </TableCell>
                      <TableCell>{kol.followers}</TableCell>
                      <TableCell>
                        <Badge variant={kol.status === 'active' ? 'default' : 'secondary'}>
                          {t(`kolManagement.list.statuses.${kol.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {kol.revenue.toLocaleString()} ₫
                      </TableCell>
                      <TableCell className="text-right">
                        {kol.commission.toLocaleString()} ₫
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{kol.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("kolManagement.list.table.actions")}</DropdownMenuLabel>
                            <DropdownMenuItem onClick={handleViewProfile}>{t("kolManagement.list.menu.viewProfile")}</DropdownMenuItem>
                            <DropdownMenuItem>{t("kolManagement.list.menu.campaignHistory")}</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={handleTerminate}>{t("kolManagement.list.menu.terminate")}</DropdownMenuItem>
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

        <TabsContent value="approval" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("kolManagement.approval.title")}</CardTitle>
              <CardDescription>
                {t("kolManagement.approval.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("kolManagement.approval.table.candidate")}</TableHead>
                    <TableHead>{t("kolManagement.approval.table.platform")}</TableHead>
                    <TableHead>{t("kolManagement.approval.table.followers")}</TableHead>
                    <TableHead>{t("kolManagement.approval.table.date")}</TableHead>
                    <TableHead className="text-right">{t("kolManagement.approval.table.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=req${req.id}`} />
                            <AvatarFallback>{req.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{req.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(req.platform)}
                          <span className="text-sm">{req.platform}</span>
                        </div>
                      </TableCell>
                      <TableCell>{req.followers}</TableCell>
                      <TableCell>{req.date}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={handleReject}>{t("kolManagement.approval.reject")}</Button>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={handleApprove}>{t("kolManagement.approval.approve")}</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("kolManagement.stats.revenueByPlatform")}</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="mx-auto h-8 w-8 mb-2 opacity-20" />
                  <p>{t("kolManagement.stats.revenueByPlatformDesc")}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t("kolManagement.stats.topKols")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {kols.slice(0, 3).map((kol, i) => (
                    <div key={kol.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold text-xs">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{kol.name}</p>
                          <p className="text-xs text-muted-foreground">{kol.platform}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{(kol.revenue / 1000000).toFixed(1)}M ₫</p>
                        <p className="text-[10px] text-emerald-500">+15%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
