import { useState } from "react"
import { useTranslation } from "react-i18next"
import { 
  FileText, 
  Send, 
  Inbox, 
  PenTool, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical 
} from "lucide-react"

export function Documents() {
  const { t } = useTranslation()
  const [activeSubTab, setActiveSubTab] = useState("incoming")

  const subTabs = [
    { id: "incoming", label: t("adminWorkspace.documents.incoming"), icon: Inbox },
    { id: "outgoing", label: t("adminWorkspace.documents.outgoing"), icon: Send },
    { id: "esignature", label: t("adminWorkspace.documents.esignature"), icon: PenTool },
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

      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-4 border-b flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("common.search")}
              className="w-full pl-9 pr-4 py-2 text-sm bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border rounded-md hover:bg-muted transition-colors">
            <Filter className="h-4 w-4" />
            {t("common.filter")}
          </button>
        </div>

        <div className="divide-y">
          {/* Placeholder for document list */}
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between group">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    {activeSubTab === "incoming" ? "Incoming Document #" : 
                     activeSubTab === "outgoing" ? "Outgoing Document #" : "Contract #"}
                    {item}2024
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeSubTab === "incoming" ? "From: Ministry of Finance" : 
                     activeSubTab === "outgoing" ? "To: Partner Company A" : "Signer: John Doe"}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-green-100 text-green-700 rounded-full">
                      Completed
                    </span>
                    <span className="text-[10px] text-muted-foreground">Oct 24, 2024</span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t text-center text-xs text-muted-foreground">
          Showing 5 of 24 documents
        </div>
      </div>
    </div>
  )
}
