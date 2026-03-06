import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { 
  Mail, 
  Inbox, 
  Send, 
  File, 
  Trash2, 
  Archive, 
  AlertCircle, 
  MoreHorizontal, 
  Search, 
  RefreshCw, 
  Plus,
  Star,
  Paperclip,
  Reply,
  ReplyAll,
  Forward,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Separator } from "@/src/components/ui/separator"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert"

export function Email() {
  const { t } = useTranslation()
  const [isConnected, setIsConnected] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null)

  const emails = [
    { id: 1, sender: "Microsoft Outlook Team", subject: "Welcome to your new Outlook account", preview: "Get started with your new account...", time: "10:00 AM", read: false, starred: true },
    { id: 2, sender: "HR Department", subject: "Q1 Performance Review Schedule", preview: "Please review the attached schedule for...", time: "Yesterday", read: true, starred: false },
    { id: 3, sender: "Project Manager", subject: "Urgent: Client Feedback on Design", preview: "The client has some feedback on the latest...", time: "Yesterday", read: true, starred: true },
    { id: 4, sender: "IT Support", subject: "Scheduled Maintenance Notification", preview: "Server maintenance will occur on Saturday...", time: "2 days ago", read: true, starred: false },
    { id: 5, sender: "Marketing Team", subject: "Newsletter Draft for Approval", preview: "Here is the draft for next week's newsletter...", time: "3 days ago", read: true, starred: false },
  ]

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] space-y-6 text-center">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-full">
          <Mail className="h-16 w-16 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">{t('workspace.email.connectTitle')}</h2>
          <p className="text-muted-foreground">
            {t('workspace.email.connectDescription')}
          </p>
        </div>
        <Card className="w-full max-w-sm border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
          <CardHeader>
            <CardTitle className="text-base">{t('workspace.email.outlookIntegration')}</CardTitle>
            <CardDescription>{t('workspace.email.secureConnection')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-[#0078D4] hover:bg-[#005a9e] text-white"
              onClick={() => setIsConnected(true)}
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg/2203px-Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg.png" 
                alt="Outlook" 
                className="h-5 w-5 mr-2 bg-white rounded-sm p-0.5" 
              />
              {t('workspace.email.connectButton')}
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              {t('workspace.email.connectDisclaimer')}
            </p>
          </CardContent>
        </Card>
        <Alert className="max-w-md text-left">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('workspace.email.noteTitle')}</AlertTitle>
          <AlertDescription>
            {t('workspace.email.simulationNote')}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-200px)] border rounded-lg overflow-hidden bg-background shadow-sm">
      {/* Sidebar */}
      <div className="w-64 border-r flex flex-col bg-muted/10">
        <div className="p-4">
          <Button className="w-full justify-start gap-2" size="lg">
            <Plus className="h-5 w-5" />
            {t('workspace.email.compose')}
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="px-2 space-y-1">
            <Button variant="ghost" className="w-full justify-start font-normal bg-accent text-accent-foreground">
              <Inbox className="h-4 w-4 mr-2" />
              {t('workspace.email.folders.inbox')}
              <Badge variant="secondary" className="ml-auto">4</Badge>
            </Button>
            <Button variant="ghost" className="w-full justify-start font-normal">
              <Send className="h-4 w-4 mr-2" />
              {t('workspace.email.folders.sent')}
            </Button>
            <Button variant="ghost" className="w-full justify-start font-normal">
              <File className="h-4 w-4 mr-2" />
              {t('workspace.email.folders.drafts')}
            </Button>
            <Button variant="ghost" className="w-full justify-start font-normal">
              <Star className="h-4 w-4 mr-2" />
              {t('workspace.email.folders.starred')}
            </Button>
            <Button variant="ghost" className="w-full justify-start font-normal">
              <Archive className="h-4 w-4 mr-2" />
              {t('workspace.email.folders.archive')}
            </Button>
            <Button variant="ghost" className="w-full justify-start font-normal">
              <Trash2 className="h-4 w-4 mr-2" />
              {t('workspace.email.folders.trash')}
            </Button>
          </div>
          <Separator className="my-4" />
          <div className="px-4 pb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{t('workspace.email.foldersTitle')}</h3>
            <div className="space-y-1">
              <Button variant="ghost" size="sm" className="w-full justify-start font-normal h-8">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                {t('workspace.email.labels.urgent')}
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start font-normal h-8">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                {t('workspace.email.labels.projects')}
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start font-normal h-8">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                {t('workspace.email.labels.personal')}
              </Button>
            </div>
          </div>
        </ScrollArea>
        <div className="p-4 border-t bg-muted/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t('workspace.email.storageUsage', { used: 1.2, total: 15 })}</span>
            <Button variant="link" className="h-auto p-0 text-xs">{t('workspace.email.manage')}</Button>
          </div>
          <div className="h-1.5 w-full bg-muted mt-2 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[8%]" />
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="w-80 border-r flex flex-col bg-background">
        <div className="p-3 border-b flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('workspace.email.search')} className="pl-8 h-9" />
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="divide-y">
            {emails.map((email) => (
              <div 
                key={email.id} 
                className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedEmail === email.id ? 'bg-muted border-l-4 border-l-primary pl-3' : ''} ${!email.read ? 'font-semibold bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                onClick={() => setSelectedEmail(email.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="truncate max-w-[180px]">{email.sender}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{email.time}</span>
                </div>
                <div className="text-sm mb-1 truncate">{email.subject}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">{email.preview}</div>
                <div className="flex items-center justify-end mt-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {email.starred && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                  <Paperclip className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Reading Pane */}
      <div className="flex-1 flex flex-col bg-background min-w-0">
        {selectedEmail ? (
          <>
            <div className="h-14 border-b flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Archive className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Mail className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">1 of 50</span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-start justify-between mb-6">
                  <h1 className="text-2xl font-bold leading-tight">
                    {emails.find(e => e.id === selectedEmail)?.subject}
                  </h1>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{t('workspace.email.folders.inbox')}</Badge>
                    <Badge>{t('workspace.email.labels.important')}</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>MS</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm">{emails.find(e => e.id === selectedEmail)?.sender}</div>
                      <div className="text-xs text-muted-foreground">{t('workspace.email.toMe')}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {emails.find(e => e.id === selectedEmail)?.time}, 2024
                  </div>
                </div>
                <div className="prose dark:prose-invert max-w-none text-sm">
                  <p>{t('workspace.email.placeholder.greeting')}</p>
                  <p>{t('workspace.email.placeholder.body')}</p>
                  <p>
                    {t('workspace.email.placeholder.lorem')}
                  </p>
                  <p>{t('workspace.email.placeholder.signoff')}<br/>{t('workspace.email.placeholder.team')}</p>
                </div>
                <Separator className="my-8" />
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <Reply className="h-4 w-4" /> {t('workspace.email.actions.reply')}
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <ReplyAll className="h-4 w-4" /> {t('workspace.email.actions.replyAll')}
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Forward className="h-4 w-4" /> {t('workspace.email.actions.forward')}
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Mail className="h-16 w-16 mb-4 opacity-20" />
            <p>{t('workspace.email.selectEmail')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
