import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import {
  Heart,
  MessageCircle,
  Share2,
  ShoppingCart,
  Plus,
  Users,
  TrendingUp,
  Image as ImageIcon,
  Video
} from "lucide-react"

export function SocialCommerce() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("feed")
  const [likedPosts, setLikedPosts] = useState<string[]>([])
  const [followedUsers, setFollowedUsers] = useState<string[]>(["USER-001"])

  const toggleLike = (id: string) => {
    setLikedPosts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const toggleFollow = (id: string) => {
    setFollowedUsers(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const posts = [
    { 
      id: "POST-001", 
      user: { id: "USER-001", name: "Linh Beauty", avatar: "LB", isCreator: true },
      content: "Mới tậu được em son này màu siêu xinh luôn mọi người ơi! Chất son mềm mịn không bị khô môi chút nào. Highly recommend nha! 💄✨",
      image: "https://picsum.photos/seed/lipstick/600/400",
      likes: 1245,
      comments: 89,
      shares: 12,
      product: { name: "Son Mac Matte Lipstick", price: 550000 }
    },
    { 
      id: "POST-002", 
      user: { id: "USER-002", name: "Minh Tech", avatar: "MT", isCreator: false },
      content: "Góc setup làm việc mới của mình. Bàn phím cơ gõ siêu sướng, chuột thì ôm tay. Mua trên sàn đợt sale 3.3 giá quá hời! 💻⌨️",
      image: "https://picsum.photos/seed/setup/600/400",
      likes: 856,
      comments: 45,
      shares: 5,
      product: { name: "Bàn phím cơ Keychron K8", price: 1890000 }
    }
  ]

  const groups = [
    { id: "GRP-001", name: "Hội Review Mỹ Phẩm", category: "Làm đẹp", members: "125K", postsPerDay: 450, isJoined: true },
    { id: "GRP-002", name: "Săn Sale Công Nghệ", category: "Điện tử", members: "89K", postsPerDay: 320, isJoined: false },
    { id: "GRP-003", name: "Mê Decor Nhà Cửa", category: "Nhà cửa & Đời sống", members: "210K", postsPerDay: 850, isJoined: false },
  ]

  const creators = [
    { id: "USER-001", name: "Linh Beauty", category: "Làm đẹp", followers: "1.2M", engagement: "8.5%", sales: "2.5B ₫" },
    { id: "USER-003", name: "Chef Tuấn", category: "Ẩm thực", followers: "850K", engagement: "12.1%", sales: "1.8B ₫" },
    { id: "USER-004", name: "Hà Fashion", category: "Thời trang", followers: "2.1M", engagement: "6.2%", sales: "5.2B ₫" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("socialCommerce.title")}</h1>
          <p className="text-muted-foreground">
            {t("socialCommerce.description")}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="feed">{t("socialCommerce.tabs.feed")}</TabsTrigger>
          <TabsTrigger value="groups">{t("socialCommerce.tabs.groups")}</TabsTrigger>
          <TabsTrigger value="creators">{t("socialCommerce.tabs.creators")}</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              {/* Create Post */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      <Input placeholder="Chia sẻ trải nghiệm mua sắm của bạn..." className="bg-muted/50 border-none" />
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <ImageIcon className="mr-2 h-4 w-4" /> Ảnh
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <Video className="mr-2 h-4 w-4" /> Video
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <ShoppingCart className="mr-2 h-4 w-4" /> Gắn SP
                          </Button>
                        </div>
                        <Button size="sm">{t("socialCommerce.feed.createPost")}</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feed Posts */}
              {posts.map(post => (
                <Card key={post.id}>
                  <CardHeader className="flex flex-row items-center gap-4 p-4">
                    <Avatar>
                      <AvatarFallback>{post.user.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{post.user.name}</h3>
                        {post.user.isCreator && (
                          <Badge variant="secondary" className="text-[10px] px-1 py-0">Creator</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">2 giờ trước</p>
                    </div>
                    <Button 
                      variant={followedUsers.includes(post.user.id) ? "secondary" : "outline"} 
                      size="sm"
                      onClick={() => toggleFollow(post.user.id)}
                    >
                      {followedUsers.includes(post.user.id) ? t("socialCommerce.creators.following") : t("socialCommerce.creators.follow")}
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="px-4 pb-4">{post.content}</p>
                    <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-[400px]" referrerPolicy="no-referrer" />
                    
                    {/* Attached Product */}
                    <div className="p-4 bg-muted/30 border-y">
                      <div className="flex items-center justify-between bg-background p-3 rounded-lg border shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-sm line-clamp-1">{post.product.name}</p>
                            <p className="text-sm font-bold text-primary">{post.product.price.toLocaleString()} ₫</p>
                          </div>
                        </div>
                        <Button size="sm">{t("socialCommerce.feed.buyNow")}</Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between text-muted-foreground">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={likedPosts.includes(post.id) ? "text-red-500" : ""}
                      onClick={() => toggleLike(post.id)}
                    >
                      <Heart className={`mr-2 h-4 w-4 ${likedPosts.includes(post.id) ? "fill-current" : ""}`} /> 
                      {likedPosts.includes(post.id) ? post.likes + 1 : post.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="mr-2 h-4 w-4" /> {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="mr-2 h-4 w-4" /> {post.shares}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    {t("socialCommerce.feed.trending")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">#Sale33Mega</p>
                    <p className="text-xs text-muted-foreground">12.5K posts</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">#ReviewMyPham</p>
                    <p className="text-xs text-muted-foreground">8.2K posts</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">#UnboxCungToi</p>
                    <p className="text-xs text-muted-foreground">5.1K posts</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Khám phá cộng đồng</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("socialCommerce.groups.createGroup")}
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {groups.map(group => (
              <Card key={group.id}>
                <div className="h-24 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-t-lg"></div>
                <CardContent className="pt-4 relative">
                  <div className="absolute -top-8 left-4 w-16 h-16 bg-background rounded-xl border-4 border-background flex items-center justify-center shadow-sm">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="mt-8 space-y-2">
                    <h3 className="font-bold text-lg">{group.name}</h3>
                    <Badge variant="secondary">{group.category}</Badge>
                    <div className="flex gap-4 text-sm text-muted-foreground pt-2">
                      <div><span className="font-semibold text-foreground">{group.members}</span> {t("socialCommerce.groups.members")}</div>
                      <div><span className="font-semibold text-foreground">{group.postsPerDay}</span> {t("socialCommerce.groups.posts")}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant={group.isJoined ? "secondary" : "default"} className="w-full">
                    {group.isJoined ? t("socialCommerce.groups.joined") : t("socialCommerce.groups.join")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="creators" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {creators.map(creator => (
              <Card key={creator.id}>
                <CardContent className="p-6 text-center space-y-4">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarFallback className="text-2xl">{creator.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-xl">{creator.name}</h3>
                    <p className="text-sm text-muted-foreground">{creator.category}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center divide-x border-y py-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{t("socialCommerce.creators.followers")}</p>
                      <p className="font-bold">{creator.followers}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                      <p className="font-bold text-emerald-600">{creator.engagement}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Sales</p>
                      <p className="font-bold text-blue-600">{creator.sales}</p>
                    </div>
                  </div>
                  <Button 
                    variant={followedUsers.includes(creator.id) ? "secondary" : "default"} 
                    className="w-full"
                    onClick={() => toggleFollow(creator.id)}
                  >
                    {followedUsers.includes(creator.id) ? t("socialCommerce.creators.unfollow") : t("socialCommerce.creators.follow")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
