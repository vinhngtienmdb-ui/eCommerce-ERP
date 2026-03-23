import { Bell, Menu, Search, Sun, Moon, Globe, X, LogOut, User as UserIcon, Settings as SettingsIcon, MessageSquare, Mail } from "lucide-react"
import { useAppStore } from "@/src/store/useAppStore"
import { useDevice } from "@/src/hooks/useDevice"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/src/lib/AuthContext"
import { db } from "@/src/lib/firebase"
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/src/components/ui/dialog"
import { Chat } from "@/src/pages/workspace/Chat"
import { Email } from "@/src/pages/workspace/Email"

export function Header() {
  const { toggleSidebar, isSidebarOpen } = useAppStore()
  const { isMobile } = useDevice()
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const { t, i18n } = useTranslation()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { user, logout } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme])

  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-3 md:gap-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-200 active:scale-90"
        >
          {isMobile && isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        
        {/* Desktop Search */}
        <div className="hidden md:flex relative w-64 lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="search"
            placeholder={t("header.searchPlaceholder")}
            className="w-full bg-muted/50 pl-11 border-none focus:ring-2 focus:ring-primary/20 rounded-2xl transition-all duration-200 h-10"
          />
        </div>

        {/* Mobile Search Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden hover:bg-primary/10 hover:text-primary rounded-xl"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Search Bar Overlay */}
      {isSearchOpen && (
        <div className="absolute inset-x-0 top-0 z-50 flex h-16 items-center bg-background/95 backdrop-blur-md px-4 md:hidden shadow-lg border-b border-border animate-in slide-in-from-top duration-200">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              type="search"
              placeholder={t("header.searchPlaceholder")}
              className="w-full bg-muted pl-11 border-none focus:ring-2 focus:ring-primary/20 rounded-2xl h-10"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)} className="ml-2 hover:bg-primary/10 hover:text-primary rounded-xl">
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="flex items-center gap-1.5 md:gap-3">
        <div className="hidden sm:flex items-center gap-1.5 bg-muted/30 p-1 rounded-2xl mr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background hover:text-primary rounded-xl transition-all">
                <Globe className="h-4 w-4" />
                <span className="sr-only">Toggle language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-2xl p-1 shadow-xl border-border/50">
              <DropdownMenuItem className="rounded-xl cursor-pointer py-2 px-3" onClick={() => changeLanguage('en')}>
                <span className="mr-2">🇺🇸</span> English
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl cursor-pointer py-2 px-3" onClick={() => changeLanguage('zh')}>
                <span className="mr-2">🇨🇳</span> 中文
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl cursor-pointer py-2 px-3" onClick={() => changeLanguage('vi')}>
                <span className="mr-2">🇻🇳</span> Tiếng Việt
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-8 w-8 hover:bg-background hover:text-primary rounded-xl transition-all"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        <div className="flex items-center gap-1.5">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex hover:bg-primary/10 hover:text-primary rounded-xl transition-all">
                <MessageSquare className="h-5 w-5" />
                <span className="sr-only">Chat</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0 border-none bg-transparent shadow-none">
              <DialogTitle className="sr-only">Chat</DialogTitle>
              <Chat isPopup={true} />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex hover:bg-primary/10 hover:text-primary rounded-xl transition-all">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl p-0 border-none bg-transparent shadow-none">
              <DialogTitle className="sr-only">Email</DialogTitle>
              <Email isPopup={true} />
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary rounded-xl transition-all">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background animate-pulse" />
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 rounded-2xl p-2 shadow-2xl border-border/50" align="end">
              <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold flex justify-between items-center">
                <span className="tracking-tight">{t("header.notifications")}</span>
                <Badge variant="secondary" className="rounded-full px-2 py-0 text-[10px] font-medium">{notifications.length}</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1" />
              <div className="max-h-[350px] overflow-y-auto scrollbar-hide">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <Bell className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">{t("header.noNotifications")}</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <DropdownMenuItem key={notif.id} className="flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-primary/5 rounded-xl mb-1 transition-colors">
                      <div className="flex justify-between w-full items-start">
                        <span className="font-semibold text-sm leading-tight pr-4">{notif.title}</span>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap bg-muted px-1.5 py-0.5 rounded">
                          {notif.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {notif.message}
                      </span>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-primary/10 p-0.5 transition-all active:scale-95">
              <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/avatar/100/100"} alt={user?.displayName || t("header.user")} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{user?.displayName?.charAt(0) || t("header.userFallback")}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 rounded-2xl p-2 shadow-2xl border-border/50" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border/50">
                  <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/avatar/100/100"} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">{user?.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-semibold leading-none tracking-tight">{user?.displayName || t("header.user")}</p>
                  <p className="text-[11px] leading-none text-muted-foreground/70 truncate max-w-[140px]">
                    {user?.email}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <div className="space-y-1">
              <DropdownMenuItem className="hover:bg-primary/5 rounded-xl cursor-pointer py-2 px-3 transition-colors">
                <UserIcon className="mr-3 h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{t("header.profile")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-primary/5 rounded-xl cursor-pointer py-2 px-3 transition-colors">
                <SettingsIcon className="mr-3 h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{t("header.settings")}</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem onClick={logout} className="text-destructive hover:bg-destructive/10 rounded-xl cursor-pointer py-2 px-3 transition-colors">
              <LogOut className="mr-3 h-4 w-4" />
              <span className="text-sm font-semibold">{t("header.logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

