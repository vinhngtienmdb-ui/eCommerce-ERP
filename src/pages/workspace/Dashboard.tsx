import React from "react"
import { useTranslation } from "react-i18next"
import { 
  CheckCircle2, 
  Clock, 
  Mail, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Users, 
  AlertCircle,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Progress } from "@/src/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Badge } from "@/src/components/ui/badge"

export function Dashboard() {
  const { t } = useTranslation()

  const stats = [
    { title: t('workspace.dashboard.tasksCompleted'), value: "12", total: "20", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/20" },
    { title: t('workspace.dashboard.pendingReviews'), value: "5", total: "8", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/20" },
    { title: t('workspace.dashboard.unreadEmails'), value: "3", total: "15", icon: Mail, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/20" },
    { title: t('workspace.dashboard.upcomingEvents'), value: "2", total: "4", icon: CalendarIcon, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/20" },
  ]

  const recentActivity = [
    { id: 1, user: "Alice Smith", action: "completed task", target: "Q1 Financial Report", time: "2 hours ago" },
    { id: 2, user: "Bob Jones", action: "commented on", target: "Website Redesign", time: "4 hours ago" },
    { id: 3, user: "Charlie Brown", action: "uploaded file", target: "Project Specs.pdf", time: "Yesterday" },
    { id: 4, user: "Dave Wilson", action: "joined channel", target: "#general", time: "Yesterday" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +20.1% from last month
              </p>
              <Progress value={(parseInt(stat.value) / parseInt(stat.total)) * 100} className="h-1 mt-3" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t('workspace.dashboard.productivity')}</CardTitle>
            <CardDescription>Your weekly productivity summary</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {/* Placeholder for a chart */}
            <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-md border border-dashed">
              <div className="text-center space-y-2">
                <TrendingUp className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
                <p className="text-sm text-muted-foreground">Productivity Chart Placeholder</p>
                <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                  Visualize your task completion rate and time spent on projects here.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t('workspace.dashboard.recentActivity')}</CardTitle>
            <CardDescription>What's happening in your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${activity.id}`} alt="Avatar" />
                    <AvatarFallback>{activity.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action} <span className="font-medium text-foreground">{activity.target}</span>
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-xs text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-xs" size="sm">
              View All Activity <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t('workspace.dashboard.teamStatus')}</CardTitle>
            <CardDescription>Online members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="relative group cursor-pointer">
                  <Avatar className="h-10 w-10 border-2 border-background group-hover:border-primary transition-colors">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=team${i}`} />
                    <AvatarFallback>TM</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                </div>
              ))}
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-dashed">
                <Users className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('workspace.dashboard.deadlines')}</CardTitle>
            <CardDescription>Tasks due soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Q1 Report Review</p>
                  <p className="text-xs text-muted-foreground">Due Today, 5:00 PM</p>
                </div>
                <Badge variant="destructive">High</Badge>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Client Presentation</p>
                  <p className="text-xs text-muted-foreground">Tomorrow, 10:00 AM</p>
                </div>
                <Badge variant="outline">Medium</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('workspace.dashboard.quickLinks')}</CardTitle>
            <CardDescription>Frequently used tools</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="justify-start h-auto py-3 px-4">
              <Mail className="mr-2 h-4 w-4" /> {t('workspace.tabs.email')}
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3 px-4">
              <CalendarIcon className="mr-2 h-4 w-4" /> {t('workspace.tabs.calendar')}
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3 px-4">
              <CheckCircle2 className="mr-2 h-4 w-4" /> {t('workspace.tabs.tasks')}
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3 px-4">
              <Users className="mr-2 h-4 w-4" /> Team
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
