import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router-dom"
import { 
  LayoutDashboard, 
  CheckSquare, 
  MessageSquare, 
  Mail, 
  Calendar as CalendarIcon,
  Settings,
  Bell,
  Search,
  Menu,
  ChevronDown,
  Sparkles,
  Command
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Separator } from "@/src/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet"
import { Badge } from "@/src/components/ui/badge"
import { Dashboard } from "./Dashboard"
import { Tasks } from "./Tasks"
import { Chat } from "./Chat"
import { Email } from "./Email"
import { Calendar } from "./Calendar"
import { motion, AnimatePresence } from "motion/react"

const Workspace = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [activeModule, setActiveModule] = useState("dashboard")

  useEffect(() => {
    const path = location.pathname.split("/").pop()
    if (path && ["tasks", "chat", "email", "calendar"].includes(path)) {
      setActiveModule(path)
    } else {
      setActiveModule("dashboard")
    }
  }, [location])

  const handleNavigation = (id: string) => {
    setActiveModule(id)
    navigate(id === "dashboard" ? "/workspace" : `/workspace/${id}`)
  }

  const navItems = [
    { id: "dashboard", label: t('workspace.tabs.dashboard'), icon: LayoutDashboard, color: "text-indigo-600" },
    { id: "tasks", label: t('workspace.tabs.tasks'), icon: CheckSquare, color: "text-emerald-600" },
    { id: "chat", label: t('workspace.tabs.chat'), icon: MessageSquare, color: "text-blue-600" },
    { id: "email", label: t('workspace.tabs.email'), icon: Mail, color: "text-rose-600" },
    { id: "calendar", label: t('workspace.tabs.calendar'), icon: CalendarIcon, color: "text-amber-600" },
  ]

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeModule}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {(() => {
            switch (activeModule) {
              case "dashboard": return <Dashboard />
              case "tasks": return <Tasks />
              case "chat": return <Chat />
              case "email": return <Email />
              case "calendar": return <Calendar />
              default: return <Dashboard />
            }
          })()}
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-950">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden rounded-xl">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 border-r border-slate-200 dark:border-slate-800">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{t('workspace.title')}</h2>
                  </div>
                </div>
                <nav className="flex flex-col p-4 gap-1">
                  {navItems.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={`justify-start h-12 rounded-xl px-4 transition-all ${
                        activeModule === item.id 
                          ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold" 
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      onClick={() => handleNavigation(item.id)}
                    >
                      <item.icon className={`mr-3 h-5 w-5 ${activeModule === item.id ? item.color : ""}`} />
                      {item.label}
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            
            <div className="hidden lg:flex items-center gap-2 group cursor-pointer">
              <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none transition-transform group-hover:scale-105">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base leading-none text-slate-900 dark:text-slate-50">{t('workspace.title')}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Enterprise Edition</span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 ml-1" />
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`h-9 px-5 rounded-xl text-xs font-bold transition-all relative ${
                  activeModule === item.id 
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 shadow-sm" 
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
                onClick={() => handleNavigation(item.id)}
              >
                <item.icon className={`mr-2 h-4 w-4 ${activeModule === item.id ? item.color : ""}`} />
                {item.label}
                {activeModule === item.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600"
                  />
                )}
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:flex items-center group">
            <Search className="absolute left-3 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <Input 
              placeholder={t('common.search')} 
              className="pl-10 h-10 w-64 bg-slate-100 dark:bg-slate-900 border-none rounded-xl text-xs font-medium focus-visible:ring-2 focus-visible:ring-indigo-500/20 transition-all" 
            />
            <div className="absolute right-3 h-5 w-5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
              <Command className="h-3 w-3 text-slate-400" />
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl relative text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-500 border-2 border-white dark:border-slate-950" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-8 mx-1 hidden sm:block" />
          
          <div className="flex items-center gap-3 pl-1">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-50">Vinh Nguyen</span>
              <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-tighter px-1.5 py-0 border-slate-200 dark:border-slate-800 text-slate-500">Admin</Badge>
            </div>
            <Avatar className="h-10 w-10 rounded-xl border-2 border-white dark:border-slate-800 shadow-sm ring-2 ring-slate-100 dark:ring-slate-900">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-indigo-600 text-white font-bold">VN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-4 lg:p-8">
        <div className="max-w-[1600px] mx-auto h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default Workspace
