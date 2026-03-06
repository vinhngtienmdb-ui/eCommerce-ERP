import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Filter,
  LayoutGrid,
  List as ListIcon,
  Calendar as CalendarIcon,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertCircle
} from "lucide-react"
import { motion } from "motion/react"

export function Tasks() {
  const { t } = useTranslation()
  const [view, setView] = useState("kanban")

  const tasks = [
    { id: 1, title: "Q1 Financial Report", status: "In Progress", priority: "High", assignee: "Alice", dueDate: "2024-03-15", project: "Finance" },
    { id: 2, title: "Update Website Homepage", status: "To Do", priority: "Medium", assignee: "Bob", dueDate: "2024-03-20", project: "Marketing" },
    { id: 3, title: "Client Meeting Preparation", status: "Completed", priority: "High", assignee: "Charlie", dueDate: "2024-03-10", project: "Sales" },
    { id: 4, title: "Server Maintenance", status: "To Do", priority: "Low", assignee: "Dave", dueDate: "2024-03-25", project: "IT" },
    { id: 5, title: "Onboard New Hires", status: "In Progress", priority: "Medium", assignee: "Eve", dueDate: "2024-03-18", project: "HR" },
  ]

  const columns = [
    { id: "todo", title: t('workspace.tasks.todo'), status: "To Do", color: "bg-slate-100 dark:bg-slate-800" },
    { id: "in-progress", title: t('workspace.tasks.inProgress'), status: "In Progress", color: "bg-blue-50 dark:bg-blue-900/20" },
    { id: "review", title: t('workspace.tasks.review'), status: "Review", color: "bg-purple-50 dark:bg-purple-900/20" },
    { id: "completed", title: t('workspace.tasks.completed'), status: "Completed", color: "bg-green-50 dark:bg-green-900/20" },
  ]

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "High": return <ArrowUpCircle className="h-4 w-4 text-red-500" />
      case "Medium": return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "Low": return <ArrowDownCircle className="h-4 w-4 text-blue-500" />
      default: return <Circle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "To Do": return t('workspace.tasks.todo')
      case "In Progress": return t('workspace.tasks.inProgress')
      case "Review": return t('workspace.tasks.review')
      case "Completed": return t('workspace.tasks.completed')
      default: return status
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "High": return t('workspace.tasks.high')
      case "Medium": return t('workspace.tasks.medium')
      case "Low": return t('workspace.tasks.low')
      default: return priority
    }
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold tracking-tight">{t('workspace.tabs.tasks')}</h2>
          <Badge variant="outline" className="ml-2">12 {t('workspace.tasks.activeTasks')}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button 
              variant={view === "kanban" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setView("kanban")}
              className="h-8 px-2"
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              {t('workspace.tasks.kanban')}
            </Button>
            <Button 
              variant={view === "list" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setView("list")}
              className="h-8 px-2"
            >
              <ListIcon className="h-4 w-4 mr-2" />
              {t('workspace.tasks.list')}
            </Button>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {t('workspace.tasks.createTask')}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t('workspace.tasks.searchTasks')} className="pl-8" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            {t('workspace.tasks.filter')}
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <Tabs defaultValue="my-tasks" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger value="my-tasks" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">{t('workspace.tasks.myTasks')}</TabsTrigger>
          <TabsTrigger value="team" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">{t('workspace.tasks.teamTasks')}</TabsTrigger>
          <TabsTrigger value="department" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">{t('workspace.tasks.departmentTasks')}</TabsTrigger>
          <TabsTrigger value="company" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">{t('workspace.tasks.companyTasks')}</TabsTrigger>
        </TabsList>

        <TabsContent value="my-tasks" className="flex-1 mt-4">
          {view === "kanban" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full overflow-x-auto pb-4">
              {columns.map((col) => (
                <div key={col.id} className={`flex flex-col rounded-lg p-4 ${col.color} min-w-[280px]`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm">{col.title}</h3>
                    <Badge variant="secondary" className="bg-background/50">
                      {tasks.filter(t => t.status === col.status).length}
                    </Badge>
                  </div>
                  <div className="space-y-3 flex-1">
                    {tasks.filter(t => t.status === col.status).map((task) => (
                      <motion.div
                        key={task.id}
                        layoutId={`task-${task.id}`}
                        whileHover={{ y: -2 }}
                        className="bg-background p-3 rounded-md shadow-sm border cursor-pointer hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className="text-[10px] px-1 py-0 h-5">
                            {task.project}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                        <h4 className="font-medium text-sm mb-2">{task.title}</h4>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {getPriorityIcon(task.priority)}
                            <span>{task.dueDate}</span>
                          </div>
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[10px]">{task.assignee[0]}</AvatarFallback>
                          </Avatar>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-2 text-muted-foreground hover:text-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('workspace.tasks.createTask')}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="border rounded-md">
              <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 font-medium text-sm">
                <div className="col-span-5">Task Name</div>
                <div className="col-span-2">{t('workspace.tasks.status')}</div>
                <div className="col-span-2">{t('workspace.tasks.priority')}</div>
                <div className="col-span-2">{t('workspace.tasks.dueDate')}</div>
                <div className="col-span-1">{t('workspace.tasks.assignee')}</div>
              </div>
              {tasks.map((task) => (
                <div key={task.id} className="grid grid-cols-12 gap-4 p-4 border-b last:border-0 items-center hover:bg-muted/20 transition-colors text-sm">
                  <div className="col-span-5 font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    {task.title}
                  </div>
                  <div className="col-span-2">
                    <Badge variant="secondary">{getStatusLabel(task.status)}</Badge>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    {getPriorityIcon(task.priority)}
                    {getPriorityLabel(task.priority)}
                  </div>
                  <div className="col-span-2 flex items-center gap-2 text-muted-foreground">
                    <CalendarIcon className="h-3 w-3" />
                    {task.dueDate}
                  </div>
                  <div className="col-span-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[10px]">{task.assignee[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        {/* Placeholders for other tabs */}
        <TabsContent value="team" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Alice Smith", role: "Senior Developer", tasks: 5, completed: 12, avatar: "https://i.pravatar.cc/150?u=alice" },
              { name: "Bob Jones", role: "Designer", tasks: 3, completed: 8, avatar: "https://i.pravatar.cc/150?u=bob" },
              { name: "Charlie Brown", role: "Product Manager", tasks: 7, completed: 15, avatar: "https://i.pravatar.cc/150?u=charlie" },
              { name: "Dave Wilson", role: "QA Engineer", tasks: 4, completed: 10, avatar: "https://i.pravatar.cc/150?u=dave" },
            ].map((member, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-muted/50 p-2 rounded-md">
                      <div className="text-2xl font-bold">{member.tasks}</div>
                      <div className="text-xs text-muted-foreground">{t('workspace.tasks.activeTasks')}</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/10 p-2 rounded-md">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{member.completed}</div>
                      <div className="text-xs text-muted-foreground">{t('workspace.tasks.completed')}</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    {t('workspace.tasks.viewTasks')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="department" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t('workspace.tasks.departmentInitiatives')}</h3>
              <Button variant="outline" size="sm">{t('workspace.tasks.viewAllProjects')}</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { title: "Q1 Product Launch", progress: 75, status: "On Track", lead: "Charlie Brown", due: "Mar 30" },
                { title: "Website Redesign", progress: 40, status: "At Risk", lead: "Bob Jones", due: "Apr 15" },
                { title: "Internal Tool Migration", progress: 90, status: "On Track", lead: "Alice Smith", due: "Mar 10" },
                { title: "Customer Feedback Loop", progress: 20, status: "Delayed", lead: "Dave Wilson", due: "May 01" },
              ].map((project, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{project.title}</CardTitle>
                      <Badge variant={project.status === "On Track" ? "default" : project.status === "At Risk" ? "destructive" : "secondary"}>
                        {project.status}
                      </Badge>
                    </div>
                    <CardDescription>Lead: {project.lead} • Due: {project.due}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${project.status === "At Risk" ? "bg-red-500" : project.status === "Delayed" ? "bg-yellow-500" : "bg-primary"}`} 
                          style={{ width: `${project.progress}%` }} 
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="company" className="mt-4">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-primary text-primary-foreground">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t('workspace.tasks.annualRevenueGoal')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$12.5M</div>
                  <div className="text-sm opacity-80">Target: $15M (83%)</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t('workspace.tasks.marketExpansion')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">3 New Regions</div>
                  <div className="text-sm text-muted-foreground">Launched in Q1</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t('workspace.tasks.employeeSatisfaction')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4.8/5.0</div>
                  <div className="text-sm text-muted-foreground">Based on recent survey</div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{t('workspace.tasks.strategicPillars')}</h3>
              <div className="space-y-4">
                {[
                  { title: "Customer Obsession", desc: "Improve NPS by 10 points", status: "On Track" },
                  { title: "Operational Excellence", desc: "Reduce cloud costs by 15%", status: "At Risk" },
                  { title: "Innovation", desc: "Launch 2 new AI-powered features", status: "On Track" },
                ].map((pillar, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                    <div>
                      <h4 className="font-semibold">{pillar.title}</h4>
                      <p className="text-sm text-muted-foreground">{pillar.desc}</p>
                    </div>
                    <Badge variant={pillar.status === "On Track" ? "outline" : "destructive"}>{pillar.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
