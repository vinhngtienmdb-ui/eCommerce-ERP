import React from "react"
import { useTranslation } from "react-i18next"
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  MapPin,
  Users
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"

export function Calendar() {
  const { t } = useTranslation()
  const events = [
    { id: 1, title: t('workspace.calendar.events.teamSync'), time: "09:00 AM - 10:00 AM", type: "meeting", color: "bg-blue-500", attendees: ["A", "B", "C"] },
    { id: 2, title: t('workspace.calendar.events.projectReview'), time: "11:00 AM - 12:30 PM", type: "work", color: "bg-purple-500", attendees: ["D", "E"] },
    { id: 3, title: t('workspace.calendar.events.lunchClient'), time: "01:00 PM - 02:00 PM", type: "personal", color: "bg-green-500", attendees: ["F"] },
    { id: 4, title: t('workspace.calendar.events.designWorkshop'), time: "03:00 PM - 05:00 PM", type: "workshop", color: "bg-orange-500", attendees: ["G", "H", "I", "J"] },
  ]

  const days = [
    t('workspace.calendar.days.sun'),
    t('workspace.calendar.days.mon'),
    t('workspace.calendar.days.tue'),
    t('workspace.calendar.days.wed'),
    t('workspace.calendar.days.thu'),
    t('workspace.calendar.days.fri'),
    t('workspace.calendar.days.sat'),
  ]
  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' })
  const currentYear = currentDate.getFullYear()

  // Generate calendar grid (simplified for demo)
  const generateCalendarDays = () => {
    const daysArray = []
    for (let i = 1; i <= 31; i++) {
      daysArray.push(i)
    }
    return daysArray
  }

  return (
    <div className="flex h-[calc(100vh-200px)] gap-4">
      {/* Main Calendar View */}
      <div className="flex-1 flex flex-col bg-background border rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold tracking-tight">{currentMonth} {currentYear}</h2>
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-r-none border-r">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 rounded-none px-3 font-normal">
                {t('workspace.calendar.today')}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-l-none border-l">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-md overflow-hidden">
              <Button variant="ghost" size="sm" className="rounded-none border-r h-8 px-3">{t('workspace.calendar.month')}</Button>
              <Button variant="secondary" size="sm" className="rounded-none border-r h-8 px-3">{t('workspace.calendar.week')}</Button>
              <Button variant="ghost" size="sm" className="rounded-none h-8 px-3">{t('workspace.calendar.day')}</Button>
            </div>
            <Button size="sm" className="h-8">
              <Plus className="h-4 w-4 mr-2" />
              {t('workspace.calendar.newEvent')}
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {/* Week Header */}
          <div className="grid grid-cols-7 border-b bg-muted/20">
            {days.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid (Month View Simulation) */}
          <div className="flex-1 grid grid-cols-7 grid-rows-5">
            {Array.from({ length: 35 }).map((_, i) => {
              const day = i - 3 // Offset for start of month
              const isCurrentMonth = day > 0 && day <= 31
              const isToday = day === currentDate.getDate()
              
              return (
                <div 
                  key={i} 
                  className={`border-b border-r p-2 min-h-[100px] relative group hover:bg-muted/10 transition-colors ${!isCurrentMonth ? 'bg-muted/5 text-muted-foreground/50' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium h-6 w-6 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-primary-foreground' : ''}`}>
                      {isCurrentMonth ? day : ''}
                    </span>
                    {isCurrentMonth && (
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  
                  {/* Simulated Events */}
                  {isCurrentMonth && day === 5 && (
                    <div className="mt-1 p-1 bg-blue-100 dark:bg-blue-900/30 border-l-2 border-blue-500 rounded text-[10px] font-medium text-blue-700 dark:text-blue-300 truncate cursor-pointer hover:brightness-95">
                      9:00 AM {t('workspace.calendar.events.teamSync')}
                    </div>
                  )}
                  {isCurrentMonth && day === 12 && (
                    <div className="mt-1 p-1 bg-purple-100 dark:bg-purple-900/30 border-l-2 border-purple-500 rounded text-[10px] font-medium text-purple-700 dark:text-purple-300 truncate cursor-pointer hover:brightness-95">
                      11:00 AM {t('workspace.calendar.events.projectReview')}
                    </div>
                  )}
                  {isCurrentMonth && day === 12 && (
                    <div className="mt-1 p-1 bg-green-100 dark:bg-green-900/30 border-l-2 border-green-500 rounded text-[10px] font-medium text-green-700 dark:text-green-300 truncate cursor-pointer hover:brightness-95">
                      1:00 PM {t('workspace.calendar.events.lunch')}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Side Panel: Upcoming Events */}
      <div className="w-80 flex flex-col gap-4">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('workspace.calendar.schedule')}</CardTitle>
            <CardDescription>{t('workspace.calendar.upcomingEvents')}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full px-4 pb-4">
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="flex gap-3 group">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium text-muted-foreground w-12 text-right">
                        {event.time.split(' - ')[0]}
                      </span>
                      <div className={`w-0.5 h-full bg-border my-1 group-last:hidden`} />
                    </div>
                    <div className={`flex-1 p-3 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden`}>
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${event.color}`} />
                      <h4 className="font-semibold text-sm mb-1">{event.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {event.attendees.map((att, i) => (
                            <Avatar key={i} className="h-5 w-5 border-2 border-background">
                              <AvatarFallback className="text-[8px]">{att}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('workspace.calendar.quickActions')}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="justify-start h-auto py-2 px-3 text-xs">
              <CalendarIcon className="h-3 w-3 mr-2" />
              {t('workspace.calendar.actions.scheduleMeeting')}
            </Button>
            <Button variant="outline" size="sm" className="justify-start h-auto py-2 px-3 text-xs">
              <Users className="h-3 w-3 mr-2" />
              {t('workspace.calendar.actions.bookRoom')}
            </Button>
            <Button variant="outline" size="sm" className="justify-start h-auto py-2 px-3 text-xs">
              <Clock className="h-3 w-3 mr-2" />
              {t('workspace.calendar.actions.logTime')}
            </Button>
            <Button variant="outline" size="sm" className="justify-start h-auto py-2 px-3 text-xs">
              <MapPin className="h-3 w-3 mr-2" />
              {t('workspace.calendar.actions.setLocation')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
