import { useState } from "react"
import { useTranslation } from "react-i18next"
import { 
  MessageSquare, 
  Mail, 
  Users, 
  Search, 
  Plus, 
  MoreVertical, 
  Send 
} from "lucide-react"

export function InternalComms() {
  const { t } = useTranslation()
  const [activeSubTab, setActiveSubTab] = useState("chat")

  const subTabs = [
    { id: "chat", label: t("adminWorkspace.internalComms.chat"), icon: MessageSquare },
    { id: "webmail", label: t("adminWorkspace.internalComms.webmail"), icon: Mail },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {subTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full border transition-colors
                  ${activeSubTab === tab.id 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-background text-muted-foreground border-border hover:bg-muted"}
                `}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" />
          {t("common.create")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[500px]">
        {/* Sidebar for Chat/Email List */}
        <div className="md:col-span-1 bg-card rounded-lg border shadow-sm flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("common.search")}
                className="w-full pl-9 pr-4 py-2 text-sm bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="p-4 hover:bg-muted/50 cursor-pointer border-b last:border-0 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {activeSubTab === "chat" ? "U" : "E"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium truncate">
                        {activeSubTab === "chat" ? "User Name" : "Sender Name"}
                      </h4>
                      <span className="text-xs text-muted-foreground">10:30 AM</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {activeSubTab === "chat" ? "Hey, can you check this?" : "Subject: Weekly Report"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-2 bg-card rounded-lg border shadow-sm flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                {activeSubTab === "chat" ? "U" : "E"}
              </div>
              <div>
                <h3 className="text-sm font-medium">
                  {activeSubTab === "chat" ? "User Name" : "Sender Name"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {activeSubTab === "chat" ? "Online" : "sender@example.com"}
                </p>
              </div>
            </div>
            <button className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-muted/5">
            {/* Placeholder for messages/email content */}
            <div className="flex flex-col gap-4">
              <div className="self-start max-w-[80%] bg-muted p-3 rounded-lg rounded-tl-none">
                <p className="text-sm">Hello, how are you?</p>
                <span className="text-[10px] text-muted-foreground mt-1 block">10:00 AM</span>
              </div>
              <div className="self-end max-w-[80%] bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none">
                <p className="text-sm">I'm good, thanks! Working on the new module.</p>
                <span className="text-[10px] text-primary-foreground/70 mt-1 block">10:05 AM</span>
              </div>
            </div>
          </div>

          <div className="p-4 border-t bg-background">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={activeSubTab === "chat" ? "Type a message..." : "Reply..."}
                className="flex-1 px-4 py-2 text-sm bg-muted border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
