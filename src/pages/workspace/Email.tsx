import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { 
  Search, 
  Plus, 
  Inbox, 
  Send, 
  Star, 
  Trash2, 
  Archive, 
  AlertCircle, 
  MoreHorizontal, 
  Reply, 
  Forward, 
  Paperclip,
  ChevronDown,
  Filter,
  CheckSquare,
  RefreshCw,
  Tag,
  Clock,
  User,
  Mail,
  FileText,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  ReplyAll
} from "lucide-react"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Separator } from "@/src/components/ui/separator"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert"
import { motion, AnimatePresence } from "motion/react"

export function Email() {
  const { t } = useTranslation()
  const [isConnected, setIsConnected] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<number | null>(1)
  const [activeFolder, setActiveFolder] = useState("inbox")

  const folders = [
    { id: "inbox", name: "Inbox", icon: Inbox, count: 12 },
    { id: "sent", name: "Sent", icon: Send, count: 0 },
    { id: "starred", name: "Starred", icon: Star, count: 4 },
    { id: "drafts", name: "Drafts", icon: FileText, count: 2 },
    { id: "archive", name: "Archive", icon: Archive, count: 0 },
    { id: "spam", name: "Spam", icon: AlertCircle, count: 0 },
    { id: "trash", name: "Trash", icon: Trash2, count: 0 },
  ]

  const emails = [
    { 
      id: 1, 
      sender: "Alice Smith", 
      avatar: "https://i.pravatar.cc/150?u=alice",
      subject: "Q1 Report Feedback", 
      preview: "Hi team, I've reviewed the Q1 report and have some feedback...", 
      time: "10:30 AM", 
      unread: true,
      starred: true,
      tags: ["Work", "Report"]
    },
    { 
      id: 2, 
      sender: "Bob Jones", 
      avatar: "https://i.pravatar.cc/150?u=bob",
      subject: "Meeting Reminder", 
      preview: "Just a reminder that we have a meeting at 2 PM today.", 
      time: "Yesterday", 
      unread: false,
      starred: false,
      tags: ["Meeting"]
    },
    { 
      id: 3, 
      sender: "Charlie Brown", 
      avatar: "https://i.pravatar.cc/150?u=charlie",
      subject: "New Project Proposal", 
      preview: "I've attached the proposal for the new project. Let me know what you think.", 
      time: "Mar 15", 
      unread: false,
      starred: false,
      tags: ["Project X"]
    },
    { 
      id: 4, 
      sender: "David Wilson", 
      avatar: "https://i.pravatar.cc/150?u=david",
      subject: "Vacation Request", 
      preview: "I'd like to request vacation from April 1st to April 10th.", 
      time: "Mar 14", 
      unread: false,
      starred: true,
      tags: ["Personal"]
    },
  ]

  const currentEmail = emails.find(e => e.id === selectedEmail)

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)] space-y-8 text-center bg-slate-50/30 dark:bg-slate-950/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-3xl shadow-inner"
        >
          <Mail className="h-20 w-20 text-indigo-600 dark:text-indigo-400" />
        </motion.div>
        <div className="max-w-md space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{t('workspace.email.connectTitle')}</h2>
          <p className="text-slate-500 font-medium">
            {t('workspace.email.connectDescription')}
          </p>
        </div>
        <Card className="w-full max-w-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none rounded-3xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">{t('workspace.email.outlookIntegration')}</CardTitle>
            <CardDescription className="font-medium">{t('workspace.email.secureConnection')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full h-12 rounded-xl bg-[#0078D4] hover:bg-[#005a9e] text-white font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => setIsConnected(true)}
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg/2203px-Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg.png" 
                alt="Outlook" 
                className="h-5 w-5 mr-3 bg-white rounded-sm p-0.5" 
              />
              {t('workspace.email.connectButton')}
            </Button>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              {t('workspace.email.connectDisclaimer')}
            </p>
          </CardContent>
        </Card>
        <Alert className="max-w-md text-left border-amber-100 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 dark:text-amber-400 font-bold">{t('workspace.email.noteTitle')}</AlertTitle>
          <AlertDescription className="text-amber-700/80 dark:text-amber-400/80 text-xs font-medium">
            {t('workspace.email.simulationNote')}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-180px)] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-100 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/20">
        <div className="p-6">
          <Button className="w-full justify-start h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none font-bold">
            <Plus className="h-4 w-4 mr-2" />
            {t('workspace.email.compose')}
          </Button>
        </div>
        
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1">
            {folders.map((folder) => (
              <Button
                key={folder.id}
                variant="ghost"
                className={`w-full justify-start h-10 px-3 rounded-xl font-bold text-sm transition-all group ${
                  activeFolder === folder.id 
                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                    : "text-slate-500 hover:bg-white dark:hover:bg-slate-800"
                }`}
                onClick={() => setActiveFolder(folder.id)}
              >
                <folder.icon className={`h-4 w-4 mr-3 ${activeFolder === folder.id ? "text-indigo-500" : "text-slate-400 group-hover:text-indigo-500"}`} />
                <span className="truncate">{t(`workspace.email.folders.${folder.id}`)}</span>
                {folder.count > 0 && (
                  <Badge className={`ml-auto border-none h-5 px-1.5 min-w-[1.25rem] text-[10px] font-bold ${
                    activeFolder === folder.id ? "bg-indigo-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                  }`}>
                    {folder.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          <div className="mt-8 px-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{t('workspace.email.foldersTitle')}</h3>
            <div className="space-y-1">
              {["Work", "Personal", "Important", "Social"].map((label) => (
                <Button key={label} variant="ghost" className="w-full justify-start h-9 px-2 rounded-lg text-slate-500 hover:bg-white dark:hover:bg-slate-800 text-xs font-bold group">
                  <Tag className="h-3.5 w-3.5 mr-3 text-slate-300 group-hover:text-indigo-500" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <RefreshCw className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Last Sync</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">2 mins ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="w-96 border-r border-slate-100 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-950">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder={t('workspace.email.search')} 
              className="pl-9 h-10 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm font-medium" 
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600">
                <CheckSquare className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sort by:</span>
              <Button variant="ghost" size="sm" className="h-7 px-2 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                Newest <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="divide-y divide-slate-50 dark:divide-slate-900">
            {emails.map((email) => (
              <div
                key={email.id}
                className={`p-4 cursor-pointer transition-all relative group ${
                  selectedEmail === email.id 
                    ? "bg-indigo-50/50 dark:bg-indigo-900/10" 
                    : "hover:bg-slate-50 dark:hover:bg-slate-900/50"
                }`}
                onClick={() => setSelectedEmail(email.id)}
              >
                {selectedEmail === email.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600" />
                )}
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm">
                    <AvatarImage src={email.avatar} />
                    <AvatarFallback>{email.sender[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm truncate ${email.unread ? "font-bold text-slate-900 dark:text-slate-50" : "font-medium text-slate-600 dark:text-slate-400"}`}>
                        {email.sender}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{email.time}</span>
                    </div>
                    <h4 className={`text-sm truncate mb-1 ${email.unread ? "font-bold text-slate-900 dark:text-slate-50" : "font-medium text-slate-700 dark:text-slate-300"}`}>
                      {email.subject}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {email.preview}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {email.starred && <Star className="h-3 w-3 text-amber-400 fill-amber-400" />}
                      <div className="flex gap-1">
                        {email.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="h-4 px-1.5 text-[9px] font-bold uppercase tracking-tighter bg-slate-100 dark:bg-slate-800 text-slate-500 border-none">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Email Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950">
        <AnimatePresence mode="wait">
          {currentEmail ? (
            <motion.div 
              key={currentEmail.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col h-full"
            >
              {/* Toolbar */}
              <div className="h-16 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                    <AlertCircle className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6 mx-2" />
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                    <Clock className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6 mx-2" />
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-8 max-w-4xl mx-auto">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3 leading-tight tracking-tight">
                        {currentEmail.subject}
                      </h2>
                      <div className="flex gap-2">
                        {currentEmail.tags.map(tag => (
                          <Badge key={tag} className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-none font-bold text-[10px] px-2 py-0.5">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-300 hover:text-amber-400">
                      <Star className={`h-5 w-5 ${currentEmail.starred ? "fill-amber-400 text-amber-400" : ""}`} />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between mb-10 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-800 shadow-md">
                        <AvatarImage src={currentEmail.avatar} />
                        <AvatarFallback>{currentEmail.sender[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-50">{currentEmail.sender}</span>
                          <span className="text-xs text-slate-400 font-medium">&lt;{currentEmail.sender.toLowerCase().replace(' ', '.')}@example.com&gt;</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{t('workspace.email.toMe')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{currentEmail.time}</p>
                      <Button variant="ghost" size="sm" className="h-7 px-2 mt-1 rounded-lg text-[10px] font-bold text-indigo-600 hover:bg-indigo-50">
                        Details
                      </Button>
                    </div>
                  </div>

                  <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
                    <p>{t('workspace.email.placeholder.greeting')}</p>
                    <p>
                      I've reviewed the Q1 report and have some feedback regarding the marketing section. 
                      Overall, the data looks solid, but I think we could emphasize the growth in our 
                      social media engagement more clearly.
                    </p>
                    <p>
                      Specifically, the Instagram campaign results were outstanding, and we should 
                      highlight that as a key driver for our Q1 success.
                    </p>
                    <p>
                      I've attached a few charts that might be useful to include in the final version. 
                      Let me know if you need anything else!
                    </p>
                    <p className="pt-4">
                      {t('workspace.email.placeholder.signoff')}<br />
                      <span className="font-bold text-slate-900 dark:text-slate-50">{currentEmail.sender}</span>
                    </p>
                  </div>

                  <Separator className="my-10" />

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Paperclip className="h-3.5 w-3.5" />
                      Attachments (2)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer group">
                        <div className="h-10 w-10 rounded-lg bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-rose-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate group-hover:text-indigo-600">marketing_chart_q1.png</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">1.2 MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer group">
                        <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate group-hover:text-indigo-600">feedback_notes.pdf</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">450 KB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Footer Actions */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                <div className="flex gap-3">
                  <Button className="flex-1 h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold shadow-sm">
                    <Reply className="h-4 w-4 mr-2" />
                    {t('workspace.email.actions.reply')}
                  </Button>
                  <Button className="flex-1 h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold shadow-sm">
                    <ReplyAll className="h-4 w-4 mr-2" />
                    {t('workspace.email.actions.replyAll')}
                  </Button>
                  <Button className="flex-1 h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold shadow-sm">
                    <Forward className="h-4 w-4 mr-2" />
                    {t('workspace.email.actions.forward')}
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="h-20 w-20 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-6">
                <Mail className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">{t('workspace.email.selectEmail')}</h3>
              <p className="text-slate-500 max-w-xs">Choose an email from the list on the left to view its full content and attachments.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
