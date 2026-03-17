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
  AlertCircle,
  ChevronRight,
  MessageSquare,
  Paperclip
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

export function Tasks() {
  const { t } = useTranslation()
  const [view, setView] = useState("kanban")
  const [activeTab, setActiveTab] = useState("my-tasks")

  const tasks = [
    { id: 1, title: "Q1 Financial Report", status: "In Progress", priority: "High", assignee: "Alice", dueDate: "2024-03-15", project: "Finance", comments: 3, attachments: 2 },
    { id: 2, title: "Update Website Homepage", status: "To Do", priority: "Medium", assignee: "Bob", dueDate: "2024-03-20", project: "Marketing", comments: 0, attachments: 1 },
    { id: 3, title: "Client Meeting Preparation", status: "Completed", priority: "High", assignee: "Charlie", dueDate: "2024-03-10", project: "Sales", comments: 5, attachments: 4 },
    { id: 4, title: "Server Maintenance", status: "To Do", priority: "Low", assignee: "Dave", dueDate: "2024-03-25", project: "IT", comments: 1, attachments: 0 },
    { id: 5, title: "Onboard New Hires", status: "In Progress", priority: "Medium", assignee: "Eve", dueDate: "2024-03-18", project: "HR", comments: 2, attachments: 3 },
  ]

  const columns = [
    { id: "todo", title: t('workspace.tasks.todo'), status: "To Do", color: "bg-slate-100/50 dark:bg-slate-800/50", dot: "bg-slate-400" },
    { id: "in-progress", title: t('workspace.tasks.inProgress'), status: "In Progress", color: "bg-indigo-50/50 dark:bg-indigo-900/10", dot: "bg-indigo-500" },
    { id: "review", title: t('workspace.tasks.review'), status: "Review", color: "bg-amber-50/50 dark:bg-amber-900/10", dot: "bg-amber-500" },
    { id: "completed", title: t('workspace.tasks.completed'), status: "Completed", color: "bg-emerald-50/50 dark:bg-emerald-900/10", dot: "bg-emerald-500" },
  ]

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "High": return <ArrowUpCircle className="h-3.5 w-3.5 text-rose-500" />
      case "Medium": return <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
      case "Low": return <ArrowDownCircle className="h-3.5 w-3.5 text-sky-500" />
      default: return <Circle className="h-3.5 w-3.5 text-slate-400" />
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
    <div className="space-y-6 h-full flex flex-col pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{t('workspace.tabs.tasks')}</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and track your team's progress</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <Button 
              variant={view === "kanban" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setView("kanban")}
              className={`h-8 px-3 rounded-lg text-xs font-bold transition-all ${view === "kanban" ? "bg-white dark:bg-slate-700 shadow-sm" : "text-slate-500"}`}
            >
              <LayoutGrid className="h-3.5 w-3.5 mr-2" />
              {t('workspace.tasks.kanban')}
            </Button>
            <Button 
              variant={view === "list" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setView("list")}
              className={`h-8 px-3 rounded-lg text-xs font-bold transition-all ${view === "list" ? "bg-white dark:bg-slate-700 shadow-sm" : "text-slate-500"}`}
            >
              <ListIcon className="h-3.5 w-3.5 mr-2" />
              {t('workspace.tasks.list')}
            </Button>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            {t('workspace.tasks.createTask')}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder={t('workspace.tasks.searchTasks')} 
            className="pl-9 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl" 
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" size="sm" className="rounded-xl border-slate-200 dark:border-slate-800 font-bold text-xs h-9">
            <Filter className="h-3.5 w-3.5 mr-2" />
            {t('workspace.tasks.filter')}
          </Button>
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <Avatar key={i} className="h-8 w-8 border-2 border-white dark:border-slate-900 shadow-sm">
                <AvatarImage src={`https://i.pravatar.cc/150?u=task-user-${i}`} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            ))}
            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-900 text-slate-500">
              +5
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="my-tasks" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start border-b border-slate-100 dark:border-slate-800 rounded-none h-auto p-0 bg-transparent space-x-6">
          {["my-tasks", "team", "department", "company"].map((tab) => (
            <TabsTrigger 
              key={tab}
              value={tab} 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-2 py-3 text-sm font-bold text-slate-500 data-[state=active]:text-indigo-600 transition-all"
            >
              {t(`workspace.tasks.${tab.replace("-", "T")}`)}
            </TabsTrigger>
          ))}
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <TabsContent value={activeTab} className="flex-1 mt-6 h-full">
              {view === "kanban" ? (
                <div className="flex gap-6 h-full overflow-x-auto pb-6 scrollbar-hide">
                  {columns.map((col) => (
                    <div key={col.id} className={`flex flex-col rounded-2xl p-4 ${col.color} min-w-[300px] w-[300px] border border-slate-100 dark:border-slate-800/50`}>
                      <div className="flex items-center justify-between mb-5 px-1">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${col.dot}`} />
                          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">{col.title}</h3>
                        </div>
                        <Badge variant="secondary" className="bg-white dark:bg-slate-900 text-slate-500 border-none shadow-sm text-[10px] font-bold px-2">
                          {tasks.filter(t => t.status === col.status).length}
                        </Badge>
                      </div>
                      <div className="space-y-4 flex-1">
                        {tasks.filter(t => t.status === col.status).map((task) => (
                            <motion.div
                              key={task.id}
                              layoutId={`task-${task.id}`}
                              whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                              className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer group"
                            >
                            <div className="flex justify-between items-start mb-3">
                              <Badge className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-none text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">
                                {task.project}
                              </Badge>
                              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                <MoreHorizontal className="h-4 w-4 text-slate-400" />
                              </Button>
                            </div>
                            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-50 mb-3 leading-snug group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                            
                            <div className="flex items-center gap-3 mb-4">
                              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                                {getPriorityIcon(task.priority)}
                                <span>{getPriorityLabel(task.priority)}</span>
                              </div>
                              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                                <CalendarIcon className="h-3 w-3" />
                                <span>{task.dueDate}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-slate-400">
                                  <MessageSquare className="h-3 w-3" />
                                  <span className="text-[10px] font-bold">{task.comments}</span>
                                </div>
                                <div className="flex items-center gap-1 text-slate-400">
                                  <Paperclip className="h-3 w-3" />
                                  <span className="text-[10px] font-bold">{task.attachments}</span>
                                </div>
                              </div>
                              <Avatar className="h-7 w-7 border-2 border-white dark:border-slate-800 shadow-sm">
                                <AvatarImage src={`https://i.pravatar.cc/150?u=${task.assignee}`} />
                                <AvatarFallback className="text-[10px] font-bold">{task.assignee[0]}</AvatarFallback>
                              </Avatar>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <Button variant="ghost" className="w-full mt-4 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 rounded-xl text-xs font-bold">
                        <Plus className="h-4 w-4 mr-2" />
                        {t('workspace.tasks.createTask')}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 font-bold text-[10px] uppercase tracking-wider text-slate-500">
                    <div className="col-span-5">Task Name</div>
                    <div className="col-span-2">{t('workspace.tasks.status')}</div>
                    <div className="col-span-2">{t('workspace.tasks.priority')}</div>
                    <div className="col-span-2">{t('workspace.tasks.dueDate')}</div>
                    <div className="col-span-1 text-right">Assignee</div>
                  </div>
                  <div className="divide-y divide-slate-50 dark:divide-slate-800">
                    {tasks.map((task) => (
                      <div key={task.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-sm group cursor-pointer">
                        <div className="col-span-5 font-bold text-slate-900 dark:text-slate-50 flex items-center gap-3">
                          <div className="h-5 w-5 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:border-indigo-500 transition-colors">
                            {task.status === "Completed" && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                          </div>
                          {task.title}
                        </div>
                        <div className="col-span-2">
                          <Badge variant="secondary" className="rounded-full px-3 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none">
                            {getStatusLabel(task.status)}
                          </Badge>
                        </div>
                        <div className="col-span-2 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                          {getPriorityIcon(task.priority)}
                          {getPriorityLabel(task.priority)}
                        </div>
                        <div className="col-span-2 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          {task.dueDate}
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <Avatar className="h-8 w-8 border-2 border-white dark:border-slate-800 shadow-sm">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${task.assignee}`} />
                            <AvatarFallback className="text-[10px] font-bold">{task.assignee[0]}</AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}
