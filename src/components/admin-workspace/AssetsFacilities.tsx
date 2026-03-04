import { useState } from "react"
import { useTranslation } from "react-i18next"
import { 
  Monitor, 
  PenTool, 
  Calendar, 
  Car, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical 
} from "lucide-react"

export function AssetsFacilities() {
  const { t } = useTranslation()
  const [activeSubTab, setActiveSubTab] = useState("devices")

  const subTabs = [
    { id: "devices", label: t("adminWorkspace.assetsFacilities.devices"), icon: Monitor },
    { id: "stationery", label: t("adminWorkspace.assetsFacilities.stationery"), icon: PenTool },
    { id: "meetingRooms", label: t("adminWorkspace.assetsFacilities.meetingRooms"), icon: Calendar },
    { id: "cars", label: t("adminWorkspace.assetsFacilities.cars"), icon: Car },
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
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
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
              className="w-full pl-9 pr-4 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-muted transition-colors">
            <Filter className="h-4 w-4" />
            {t("common.filters")}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {/* Placeholder for items */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-background rounded-lg border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {activeSubTab === "devices" ? <Monitor className="h-5 w-5" /> :
                   activeSubTab === "stationery" ? <PenTool className="h-5 w-5" /> :
                   activeSubTab === "meetingRooms" ? <Calendar className="h-5 w-5" /> :
                   <Car className="h-5 w-5" />}
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">
                {activeSubTab === "devices" ? "MacBook Pro M2" :
                 activeSubTab === "stationery" ? "A4 Paper Ream" :
                 activeSubTab === "meetingRooms" ? "Conference Room A" :
                 "Toyota Camry 2023"}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {activeSubTab === "devices" ? "Assigned to: John Doe" :
                 activeSubTab === "stationery" ? "Stock: 50 units" :
                 activeSubTab === "meetingRooms" ? "Capacity: 10 people" :
                 "Driver: Jane Smith"}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className={`px-2 py-1 rounded-full font-medium ${
                  item % 2 === 0 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {item % 2 === 0 ? "Available" : "In Use"}
                </span>
                <span className="text-muted-foreground">ID: #{item}2345</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
