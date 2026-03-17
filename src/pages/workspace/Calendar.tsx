import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  MoreHorizontal,
  Search,
  Filter,
  Grid,
  List,
  Settings,
  Bell,
  Video
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Separator } from "@/src/components/ui/separator"
import { Badge } from "@/src/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { motion, AnimatePresence } from "motion/react"

export function Calendar() {
  const { t } = useTranslation()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState("month")

  const events = [
    { 
      id: 1, 
      title: t('workspace.calendar.events.teamSync'), 
      time: "10:00 AM - 11:00 AM", 
      type: "Meeting", 
      color: "bg-indigo-500",
      attendees: ["https://i.pravatar.cc/150?u=alice", "https://i.pravatar.cc/150?u=bob"],
      location: "Zoom"
    },
    { 
      id: 2, 
      title: t('workspace.calendar.events.projectReview'), 
      time: "2:00 PM - 3:30 PM", 
      type: "Review", 
      color: "bg-emerald-500",
      attendees: ["https://i.pravatar.cc/150?u=charlie"],
      location: "Conference Room A"
    },
    { 
      id: 3, 
      title: t('workspace.calendar.events.designWorkshop'), 
      time: "4:00 PM - 5:00 PM", 
      type: "Workshop", 
      color: "bg-amber-500",
      attendees: ["https://i.pravatar.cc/150?u=david", "https://i.pravatar.cc/150?u=eve"],
      location: "Design Lab"
    },
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
  
  const monthName = currentDate.toLocaleString('default', { month: 'long' })
  const year = currentDate.getFullYear()

  return (
    <div className="flex h-[calc(100vh-180px)] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
      {/* Sidebar */}
      <div className="w-72 border-r border-slate-100 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/20">
        <div className="p-6">
          <Button className="w-full justify-start h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none font-bold">
            <Plus className="h-4 w-4 mr-2" />
            {t('workspace.calendar.newEvent')}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">My Calendars</h3>
              <Settings className="h-3.5 w-3.5 text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors" />
            </div>
            <div className="space-y-1">
              {[
                { name: "Personal", color: "bg-indigo-500", active: true },
                { name: "Work", color: "bg-emerald-500", active: true },
                { name: "Project X", color: "bg-amber-500", active: false },
                { name: "Holidays", color: "bg-rose-500", active: true },
              ].map((cal) => (
                <Button key={cal.name} variant="ghost" className="w-full justify-start h-9 px-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 text-xs font-bold group">
                  <div className={`h-2.5 w-2.5 rounded-full mr-3 ${cal.active ? cal.color : "bg-slate-200 dark:bg-slate-800"}`} />
                  {cal.name}
                  {cal.active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600" />}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('workspace.calendar.upcomingEvents')}</h3>
              <Badge variant="secondary" className="bg-slate-200 dark:bg-slate-800 text-slate-500 border-none text-[9px] font-bold px-1.5">3</Badge>
            </div>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`${event.color} text-white border-none text-[9px] font-bold uppercase tracking-tighter px-1.5 py-0`}>
                      {event.type}
                    </Badge>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{event.time.split(' - ')[0]}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors truncate">{event.title}</h4>
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400 font-medium">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30">
            <Bell className="h-5 w-5 text-indigo-600" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">Next Event</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">Team Sync in 15m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950">
        {/* Header */}
        <div className="h-16 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50">{monthName} {year}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today is March 17, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600 shadow-sm transition-all">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-3 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800">
                {t('workspace.calendar.today')}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600 shadow-sm transition-all">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                placeholder="Search events..." 
                className="pl-9 pr-4 h-10 w-48 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all" 
              />
            </div>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
              {["day", "week", "month"].map((v) => (
                <Button
                  key={v}
                  variant="ghost"
                  size="sm"
                  className={`h-8 px-4 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                    view === v 
                      ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                  onClick={() => setView(v)}
                >
                  {t(`workspace.calendar.${v}`)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            <div className="grid grid-cols-7 gap-px bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              {days.map((day) => (
                <div key={day} className="bg-slate-50 dark:bg-slate-900 p-4 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{day}</span>
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => {
                const dayNum = i - 2;
                const isToday = dayNum === 17;
                const isCurrentMonth = dayNum > 0 && dayNum <= 31;
                
                return (
                  <div 
                    key={i} 
                    className={`min-h-[140px] p-3 bg-white dark:bg-slate-950 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/50 relative group ${
                      !isCurrentMonth ? "opacity-30" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-sm font-bold h-7 w-7 flex items-center justify-center rounded-full transition-all ${
                        isToday 
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none scale-110" 
                          : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100"
                      }`}>
                        {dayNum > 0 && dayNum <= 31 ? dayNum : ""}
                      </span>
                      {isCurrentMonth && (
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-indigo-600">
                          <Plus className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-1.5">
                      {isToday && events.slice(0, 2).map((event) => (
                        <motion.div 
                          key={event.id}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`${event.color} p-1.5 rounded-lg text-white shadow-sm cursor-pointer hover:brightness-110 transition-all overflow-hidden`}
                        >
                          <p className="text-[10px] font-bold truncate leading-tight">{event.title}</p>
                          <div className="flex items-center gap-1 mt-0.5 opacity-80">
                            <Clock className="h-2 w-2" />
                            <span className="text-[8px] font-bold uppercase">{event.time.split(' - ')[0]}</span>
                          </div>
                        </motion.div>
                      ))}
                      {dayNum === 20 && (
                        <div className="bg-amber-500 p-1.5 rounded-lg text-white shadow-sm cursor-pointer hover:brightness-110 transition-all overflow-hidden">
                          <p className="text-[10px] font-bold truncate leading-tight">Workshop</p>
                          <div className="flex items-center gap-1 mt-0.5 opacity-80">
                            <Video className="h-2 w-2" />
                            <span className="text-[8px] font-bold uppercase">4:00 PM</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
