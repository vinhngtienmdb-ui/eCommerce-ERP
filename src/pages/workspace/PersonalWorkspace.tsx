import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "motion/react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Button } from "@/src/components/ui/button"
import { 
  CheckCircle2, 
  MessageSquare, 
  Mail, 
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Clock,
  Star,
  Send,
  Paperclip
} from "lucide-react"
import { Badge } from "@/src/components/ui/badge"
import { Input } from "@/src/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"

const PersonalWorkspace = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("tasks")

  return (
    <div className="space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("workspace.title")}</h2>
          <p className="text-muted-foreground">
            {t("workspace.description")}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> {t("common.create")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tasks" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="bg-background border">
          <TabsTrigger value="tasks" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {t("workspace.tabs.tasks")}
          </TabsTrigger>
          <TabsTrigger value="chat" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <MessageSquare className="mr-2 h-4 w-4" />
            {t("workspace.tabs.chat")}
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Mail className="mr-2 h-4 w-4" />
            {t("workspace.tabs.email")}
          </TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {t("workspace.tabs.calendar")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {["To Do", "In Progress", "Completed"].map((status) => (
              <Card key={status} className="bg-muted/30 border-dashed">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider opacity-60">
                      {status}
                    </CardTitle>
                    <Badge variant="outline">3</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.01 }}
                      className="p-3 bg-background border rounded-lg shadow-sm cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">Task item #{i} for project X</h4>
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        Review the latest strategy documents and prepare feedback for the board meeting.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          <Avatar className="h-6 w-6 border-2 border-background">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${i}`} />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex items-center text-[10px] text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          2 days left
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[600px] flex overflow-hidden">
            <div className="w-80 border-r flex flex-col">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search messages..." className="pl-8" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-muted/50 transition-colors ${i === 1 ? 'bg-muted' : ''}`}>
                    <Avatar>
                      <AvatarImage src={`https://i.pravatar.cc/150?u=chat${i}`} />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">Team Member {i}</p>
                        <span className="text-[10px] text-muted-foreground">12:45 PM</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">Hey, did you check the new design?</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/150?u=chat1" />
                    <AvatarFallback>TM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Team Member 1</p>
                    <p className="text-[10px] text-emerald-500 font-medium">Online</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-muted/10">
                <div className="flex justify-start">
                  <div className="bg-background border rounded-2xl rounded-tl-none p-3 max-w-[70%]">
                    <p className="text-sm">Hi there! How is the progress on the Executive module?</p>
                    <span className="text-[10px] text-muted-foreground mt-1 block">12:40 PM</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none p-3 max-w-[70%]">
                    <p className="text-sm">It's going well. I'm just finishing up the SWOT analysis section.</p>
                    <span className="text-[10px] opacity-70 mt-1 block">12:42 PM</span>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
                  <Input placeholder="Type a message..." className="flex-1" />
                  <Button size="icon"><Send className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card className="overflow-hidden">
            <div className="flex h-[600px]">
              <div className="w-48 border-r bg-muted/20 p-4 space-y-2">
                <Button className="w-full justify-start mb-4" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Compose
                </Button>
                <div className="space-y-1">
                  {["Inbox", "Sent", "Drafts", "Trash"].map((folder) => (
                    <Button key={folder} variant="ghost" size="sm" className="w-full justify-start font-normal">
                      {folder}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="p-3 border-b flex items-center justify-between bg-background">
                  <div className="flex items-center space-x-2">
                    <Input placeholder="Search mail..." className="h-8 w-64" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Filter className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="flex items-center p-3 border-b hover:bg-muted/30 cursor-pointer transition-colors group">
                      <div className="w-8 flex justify-center">
                        <Star className="h-4 w-4 text-muted-foreground group-hover:text-yellow-500 transition-colors" />
                      </div>
                      <div className="w-48 font-medium text-sm truncate">Corporate Communications</div>
                      <div className="flex-1 min-w-0 px-4">
                        <span className="text-sm font-medium">Weekly Update: Q1 Strategy Review</span>
                        <span className="text-sm text-muted-foreground ml-2 truncate">- Please find the attached report for the upcoming...</span>
                      </div>
                      <div className="w-24 text-right text-xs text-muted-foreground">Oct {10 + i}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>March 2026</CardTitle>
                <CardDescription>Your schedule for this month</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">Today</Button>
                <div className="flex border rounded-md overflow-hidden">
                  <Button variant="ghost" size="sm" className="rounded-none border-r">Day</Button>
                  <Button variant="ghost" size="sm" className="rounded-none border-r bg-muted">Week</Button>
                  <Button variant="ghost" size="sm" className="rounded-none">Month</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-px bg-muted border rounded-lg overflow-hidden">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="bg-background p-2 text-center text-xs font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }).map((_, i) => {
                  const day = i - 3;
                  const isCurrentMonth = day > 0 && day <= 31;
                  return (
                    <div key={i} className={`bg-background min-h-[100px] p-2 border-t ${!isCurrentMonth ? 'opacity-30' : ''}`}>
                      <span className="text-xs font-medium">{isCurrentMonth ? day : ''}</span>
                      {day === 5 && (
                        <div className="mt-1 p-1 bg-primary/10 border-l-2 border-primary rounded text-[10px] font-medium text-primary leading-tight">
                          Strategy Sync
                        </div>
                      )}
                      {day === 12 && (
                        <div className="mt-1 p-1 bg-emerald-500/10 border-l-2 border-emerald-500 rounded text-[10px] font-medium text-emerald-600 leading-tight">
                          Product Launch
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PersonalWorkspace
