import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Phone, 
  Video, 
  Info, 
  Smile, 
  Paperclip, 
  Mic, 
  Send,
  Hash,
  MessageSquare,
  Users,
  Settings,
  ChevronDown,
  AtSign,
  Star,
  Clock
} from "lucide-react"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Separator } from "@/src/components/ui/separator"
import { Badge } from "@/src/components/ui/badge"
import { motion, AnimatePresence } from "motion/react"

export function Chat() {
  const { t } = useTranslation()
  const [activeChannel, setActiveChannel] = useState("general")
  const [message, setMessage] = useState("")

  const channels = [
    { id: "general", name: "general", unread: 0, topic: "General discussion" },
    { id: "random", name: "random", unread: 2, topic: "Fun stuff" },
    { id: "announcements", name: "announcements", unread: 5, topic: "Company news" },
    { id: "project-x", name: "project-x", unread: 0, topic: "Project X coordination" },
  ]

  const dms = [
    { id: "alice", name: "Alice Smith", status: "online", avatar: "https://i.pravatar.cc/150?u=alice" },
    { id: "bob", name: "Bob Jones", status: "offline", avatar: "https://i.pravatar.cc/150?u=bob" },
    { id: "charlie", name: "Charlie Brown", status: "busy", avatar: "https://i.pravatar.cc/150?u=charlie" },
  ]

  const messages = [
    { id: 1, sender: "Alice Smith", avatar: "https://i.pravatar.cc/150?u=alice", content: "Hey team, any updates on the Q1 report?", time: "10:30 AM", reactions: ["👍"] },
    { id: 2, sender: "Bob Jones", avatar: "https://i.pravatar.cc/150?u=bob", content: "I'm almost done with the financial section.", time: "10:32 AM", reactions: [] },
    { id: 3, sender: "You", avatar: "https://github.com/shadcn.png", content: "Great! I'll review the marketing data this afternoon.", time: "10:35 AM", reactions: ["🔥"] },
    { id: 4, sender: "Charlie Brown", avatar: "https://i.pravatar.cc/150?u=charlie", content: "Don't forget to include the new user metrics.", time: "10:36 AM", reactions: [] },
  ]

  return (
    <div className="flex h-[calc(100vh-180px)] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
      {/* Sidebar */}
      <div className="w-72 border-r border-slate-100 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/20">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group">
            <h2 className="font-bold text-lg tracking-tight text-slate-900 dark:text-slate-50">Workspace</h2>
            <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white dark:hover:bg-slate-800 shadow-sm">
            <Plus className="h-4 w-4 text-slate-600" />
          </Button>
        </div>
        
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder={t('workspace.chat.search')} 
              className="pl-9 h-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl text-sm" 
            />
          </div>
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {t('workspace.chat.channels')}
                </h3>
                <Plus className="h-3.5 w-3.5 text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors" />
              </div>
              <div className="space-y-1">
                {channels.map((channel) => (
                  <Button
                    key={channel.id}
                    variant="ghost"
                    className={`w-full justify-start h-10 px-3 rounded-xl font-bold text-sm transition-all group ${
                      activeChannel === channel.id 
                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                        : "text-slate-500 hover:bg-white dark:hover:bg-slate-800"
                    }`}
                    onClick={() => setActiveChannel(channel.id)}
                  >
                    <Hash className={`h-4 w-4 mr-2 ${activeChannel === channel.id ? "text-indigo-500" : "text-slate-400 group-hover:text-indigo-500"}`} />
                    <span className="truncate">{channel.name}</span>
                    {channel.unread > 0 && (
                      <Badge className="ml-auto bg-indigo-600 text-white border-none h-5 px-1.5 min-w-[1.25rem] text-[10px] font-bold">
                        {channel.unread}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {t('workspace.chat.directMessages')}
                </h3>
                <Plus className="h-3.5 w-3.5 text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors" />
              </div>
              <div className="space-y-1">
                {dms.map((dm) => (
                  <Button
                    key={dm.id}
                    variant="ghost"
                    className="w-full justify-start h-10 px-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-white dark:hover:bg-slate-800 transition-all group"
                  >
                    <div className="relative mr-3">
                      <Avatar className="h-6 w-6 border-2 border-white dark:border-slate-800 shadow-sm">
                        <AvatarImage src={dm.avatar} />
                        <AvatarFallback>{dm.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-50 dark:border-slate-900 ${
                        dm.status === 'online' ? 'bg-emerald-500' : 
                        dm.status === 'busy' ? 'bg-rose-500' : 'bg-slate-300'
                      }`} />
                    </div>
                    <span className="truncate group-hover:text-slate-900 dark:group-hover:text-slate-100">{dm.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-9 w-9 border-2 border-indigo-100 dark:border-indigo-900 shadow-sm">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-50 truncate">Admin User</p>
            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">Online</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <Settings className="h-4 w-4 text-slate-400" />
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950">
        {/* Header */}
        <div className="h-16 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
              <Hash className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50">{activeChannel}</h3>
                <Star className="h-4 w-4 text-slate-300 hover:text-amber-400 cursor-pointer transition-colors" />
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {channels.find(c => c.id === activeChannel)?.topic}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex -space-x-2 mr-4">
              {dms.map((dm) => (
                <Avatar key={dm.id} className="h-8 w-8 border-2 border-white dark:border-slate-950 shadow-sm">
                  <AvatarImage src={dm.avatar} />
                  <AvatarFallback>{dm.name[0]}</AvatarFallback>
                </Avatar>
              ))}
              <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] border-2 border-white dark:border-slate-950 font-bold text-slate-500">
                +5
              </div>
            </div>
            <Separator orientation="vertical" className="h-6 mx-2 hidden md:block" />
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10">
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="h-16 w-16 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
                <Hash className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Welcome to #{activeChannel}!</h2>
              <p className="text-slate-500 max-w-sm mt-2">This is the start of the #{activeChannel} channel. Use it to discuss anything related to the project.</p>
              <Button variant="outline" size="sm" className="mt-6 rounded-xl font-bold text-xs border-slate-200 dark:border-slate-800">
                Edit Topic
              </Button>
              <div className="w-full flex items-center gap-4 mt-10">
                <Separator className="flex-1" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today</span>
                <Separator className="flex-1" />
              </div>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-4 group hover:bg-slate-50/50 dark:hover:bg-slate-900/20 -mx-6 px-6 py-2 transition-colors relative">
                <Avatar className="h-10 w-10 mt-1 cursor-pointer hover:scale-105 transition-transform border-2 border-white dark:border-slate-800 shadow-sm">
                  <AvatarImage src={msg.avatar} />
                  <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-50 hover:text-indigo-600 cursor-pointer transition-colors">{msg.sender}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{msg.time}</span>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {msg.content}
                  </div>
                  {msg.reactions.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {msg.reactions.map((reaction, i) => (
                        <Badge key={i} variant="secondary" className="px-2 py-1 text-xs rounded-lg cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-none transition-colors">
                          {reaction} <span className="ml-1.5 text-[10px] font-bold text-slate-500">1</span>
                        </Badge>
                      ))}
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:text-indigo-600">
                        <Smile className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="absolute right-6 top-2 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-1 shadow-sm">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600">
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-6 bg-white dark:bg-slate-950">
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all shadow-sm">
            <div className="flex gap-1 mb-2 border-b border-slate-200 dark:border-slate-800 pb-2 px-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800">
                <span className="font-bold text-sm">B</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800">
                <span className="italic text-sm font-serif">I</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800">
                <AtSign className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-5 mx-1 my-auto" />
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800">
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
            <Input 
              className="border-0 bg-transparent focus-visible:ring-0 px-3 py-2 h-auto min-h-[44px] text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 font-medium" 
              placeholder={`${t('workspace.chat.typeMessage')} #${activeChannel}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && message.trim()) {
                  e.preventDefault();
                  setMessage("");
                }
              }}
            />
            <div className="flex justify-between items-center mt-2 pt-1 px-1">
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800">
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase mr-2">
                  <Clock className="h-3 w-3" />
                  <span>Scheduled</span>
                </div>
                <Button 
                  size="sm" 
                  className={`h-9 px-5 rounded-xl font-bold transition-all ${
                    message.trim() 
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  }`} 
                  disabled={!message.trim()}
                >
                  <Send className="h-3.5 w-3.5 mr-2" />
                  {t('workspace.chat.send')}
                </Button>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-center text-slate-400 mt-3 font-bold uppercase tracking-widest">
            <strong>{t('workspace.chat.tip')}</strong>: Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  )
}

function ListIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  )
}
