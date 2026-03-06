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
  Settings
} from "lucide-react"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Separator } from "@/src/components/ui/separator"
import { Badge } from "@/src/components/ui/badge"

export function Chat() {
  const { t } = useTranslation()
  const [activeChannel, setActiveChannel] = useState("general")
  const [message, setMessage] = useState("")

  const channels = [
    { id: "general", name: "general", unread: 0 },
    { id: "random", name: "random", unread: 2 },
    { id: "announcements", name: "announcements", unread: 5 },
    { id: "project-x", name: "project-x", unread: 0 },
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
    <div className="flex h-[calc(100vh-200px)] border rounded-lg overflow-hidden bg-background shadow-sm">
      {/* Sidebar */}
      <div className="w-64 border-r flex flex-col bg-muted/10">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-lg tracking-tight">{t('workspace.title')}</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('workspace.chat.search')} className="pl-8 h-9 bg-background" />
          </div>
        </div>

        <ScrollArea className="flex-1 px-3">
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 flex items-center justify-between group">
                {t('workspace.chat.channels')}
                <Plus className="h-3 w-3 opacity-0 group-hover:opacity-100 cursor-pointer" />
              </h3>
              <div className="space-y-1">
                {channels.map((channel) => (
                  <Button
                    key={channel.id}
                    variant={activeChannel === channel.id ? "secondary" : "ghost"}
                    className="w-full justify-start h-8 px-2 font-normal"
                    onClick={() => setActiveChannel(channel.id)}
                  >
                    <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="truncate">{channel.name}</span>
                    {channel.unread > 0 && (
                      <Badge variant="destructive" className="ml-auto h-5 px-1.5 min-w-[1.25rem]">
                        {channel.unread}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 flex items-center justify-between group">
                {t('workspace.chat.directMessages')}
                <Plus className="h-3 w-3 opacity-0 group-hover:opacity-100 cursor-pointer" />
              </h3>
              <div className="space-y-1">
                {dms.map((dm) => (
                  <Button
                    key={dm.id}
                    variant="ghost"
                    className="w-full justify-start h-8 px-2 font-normal"
                  >
                    <div className="relative mr-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={dm.avatar} />
                        <AvatarFallback>{dm.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-background ${
                        dm.status === 'online' ? 'bg-green-500' : 
                        dm.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <span className="truncate">{dm.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-3 border-t bg-muted/20 flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{t('workspace.chat.myAccount')}</p>
            <p className="text-xs text-muted-foreground truncate">{t('workspace.chat.online')}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Header */}
        <div className="h-14 border-b flex items-center justify-between px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold text-lg">{activeChannel}</h3>
            <Badge variant="outline" className="ml-2 font-normal text-muted-foreground">
              {t('workspace.chat.topic')}: Q1 Planning
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2 mr-4">
              {dms.map((dm) => (
                <Avatar key={dm.id} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={dm.avatar} />
                  <AvatarFallback>{dm.name[0]}</AvatarFallback>
                </Avatar>
              ))}
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background font-medium">
                +5
              </div>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-3 group">
                <Avatar className="h-9 w-9 mt-0.5 cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarImage src={msg.avatar} />
                  <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm hover:underline cursor-pointer">{msg.sender}</span>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <div className="text-sm text-foreground/90 leading-relaxed">
                    {msg.content}
                  </div>
                  {msg.reactions.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {msg.reactions.map((reaction, i) => (
                        <Badge key={i} variant="secondary" className="px-1.5 py-0.5 text-xs rounded-full cursor-pointer hover:bg-muted-foreground/20">
                          {reaction} <span className="ml-1 text-[10px]">1</span>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-start gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Smile className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MessageSquare className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t bg-background">
          <div className="bg-muted/30 border rounded-lg p-2 focus-within:ring-1 focus-within:ring-ring focus-within:border-primary transition-all">
            <div className="flex gap-1 mb-2 border-b pb-2 border-muted/50">
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-sm">
                <span className="font-bold text-xs">B</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-sm">
                <span className="italic text-xs">I</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-sm">
                <span className="underline text-xs">U</span>
              </Button>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-sm">
                <ListIcon className="h-3 w-3" />
              </Button>
            </div>
            <Input 
              className="border-0 bg-transparent focus-visible:ring-0 px-2 py-1 h-auto min-h-[40px]" 
              placeholder={`${t('workspace.chat.typeMessage')} #${activeChannel}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-between items-center mt-2 pt-1">
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
              <Button size="sm" className="h-8 px-4" disabled={!message.trim()}>
                <Send className="h-3 w-3 mr-2" />
                {t('workspace.chat.send')}
              </Button>
            </div>
          </div>
          <div className="text-[10px] text-center text-muted-foreground mt-2">
            <strong>{t('workspace.chat.tip')}</strong>
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
