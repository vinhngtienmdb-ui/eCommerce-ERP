import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { 
  CheckCircle2, 
  Clock, 
  Mail, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Users, 
  AlertCircle,
  ArrowRight,
  Plus,
  MessageSquare,
  Zap,
  Star,
  MoreVertical,
  Search
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Progress } from "@/src/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Badge } from "@/src/components/ui/badge"
import { Input } from "@/src/components/ui/input"
import { motion } from "motion/react"

export function Dashboard() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")

  const stats = [
    { title: t('workspace.dashboard.tasksCompleted'), value: "12", total: "20", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/10" },
    { title: t('workspace.dashboard.pendingReviews'), value: "5", total: "8", icon: Clock, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/10" },
    { title: t('workspace.dashboard.unreadEmails'), value: "3", total: "15", icon: Mail, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-900/10" },
    { title: t('workspace.dashboard.upcomingEvents'), value: "2", total: "4", icon: CalendarIcon, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/10" },
  ]

  const recentActivity = [
    { id: 1, user: "Alice Smith", action: "completed task", target: "Q1 Financial Report", time: "2 hours ago", type: "task" },
    { id: 2, user: "Bob Jones", action: "commented on", target: "Website Redesign", time: "4 hours ago", type: "comment" },
    { id: 3, user: "Charlie Brown", action: "uploaded file", target: "Project Specs.pdf", time: "Yesterday", type: "file" },
    { id: 4, user: "Dave Wilson", action: "joined channel", target: "#general", time: "Yesterday", type: "system" },
  ]

  const announcements = [
    { id: 1, title: "New Security Policy", content: "Please review the updated security guidelines for remote work.", date: "Mar 15", priority: "High" },
    { id: 2, title: "Office Renovation", content: "The 3rd floor will be closed for maintenance this weekend.", date: "Mar 14", priority: "Medium" },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {t('workspace.dashboard.welcome')}, Admin 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Here's what's happening in your workspace today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search workspace..." 
              className="pl-9 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={item}>
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900 dark:text-slate-50">{stat.value}</span>
                  <span className="text-base text-slate-400 font-medium">/ {stat.total}</span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                    <span>Progress</span>
                    <span>{Math.round((parseInt(stat.value) / parseInt(stat.total)) * 100)}%</span>
                  </div>
                  <Progress value={(parseInt(stat.value) / parseInt(stat.total)) * 100} className="h-1.5 bg-slate-100 dark:bg-slate-800" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Daily Focus</CardTitle>
                <CardDescription>Key priorities for today</CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4 text-slate-400" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Review Q1 Financials", time: "09:00 AM", status: "In Progress", priority: "High" },
                { title: "Team Sync Meeting", time: "11:30 AM", status: "Upcoming", priority: "Medium" },
                { title: "Product Roadmap Update", time: "02:00 PM", status: "Pending", priority: "High" },
              ].map((task, idx) => (
                <div key={idx} className="flex items-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Zap className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50">{task.title}</h4>
                    <p className="text-xs text-slate-500">{task.time} • {task.priority} Priority</p>
                  </div>
                  <Badge variant={task.status === "In Progress" ? "default" : "secondary"} className="rounded-full px-3">
                    {task.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
            <CardFooter className="border-t border-slate-50 dark:border-slate-800 pt-4">
              <Button variant="link" className="text-indigo-600 p-0 h-auto font-bold text-sm">
                View all tasks <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
              <CardDescription>Updates from your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${activity.id}`} alt="Avatar" />
                      <AvatarFallback>{activity.user[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-50">{activity.user}</p>
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{activity.time}</span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {activity.action} <span className="font-bold text-slate-700 dark:text-slate-300">{activity.target}</span>
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-bold uppercase text-slate-400 hover:text-indigo-600">
                          <MessageSquare className="mr-1 h-3 w-3" /> Reply
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-bold uppercase text-slate-400 hover:text-amber-500">
                          <Star className="mr-1 h-3 w-3" /> Favorite
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-sm bg-indigo-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 bg-white/10 rounded-full blur-2xl" />
            <CardHeader>
              <CardTitle className="text-lg font-bold">Announcements</CardTitle>
              <CardDescription className="text-indigo-100">Latest company updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="text-sm font-bold">{ann.title}</h5>
                    <Badge className="bg-white/20 text-white border-none text-[9px] uppercase font-bold">{ann.priority}</Badge>
                  </div>
                  <p className="text-xs text-indigo-50 leading-relaxed line-clamp-2">{ann.content}</p>
                  <div className="mt-2 text-[10px] font-medium text-indigo-200">{ann.date}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Team Status</CardTitle>
              <CardDescription>Who's online now</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="relative">
                    <Avatar className="h-11 w-11 border-2 border-white dark:border-slate-800 shadow-sm hover:scale-110 transition-transform cursor-pointer">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=team${i}`} />
                      <AvatarFallback>TM</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500 shadow-sm" />
                  </div>
                ))}
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-full border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-600 hover:border-indigo-600">
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Quick Links</CardTitle>
              <CardDescription>Your favorite tools</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {[
                { icon: Mail, label: t('workspace.tabs.email'), color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/10" },
                { icon: CalendarIcon, label: t('workspace.tabs.calendar'), color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/10" },
                { icon: CheckCircle2, label: t('workspace.tabs.tasks'), color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/10" },
                { icon: MessageSquare, label: t('workspace.tabs.chat'), color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/10" },
              ].map((link, idx) => (
                <Button key={idx} variant="outline" className="flex flex-col items-center justify-center h-24 gap-2 border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all group">
                  <div className={`p-2 rounded-lg ${link.bg} group-hover:scale-110 transition-transform`}>
                    <link.icon className={`h-5 w-5 ${link.color}`} />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{link.label}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
