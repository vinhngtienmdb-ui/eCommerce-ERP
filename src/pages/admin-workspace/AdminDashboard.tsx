import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { 
  Box, 
  PenTool, 
  Calendar, 
  FileQuestion, 
  Star,
  HelpCircle,
  Briefcase,
  CheckCircle2,
  Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"

export function AdminDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const adminModules = [
    { 
      id: "assets", 
      title: "nav.assets", 
      description: "Manage company assets and inventory.", 
      icon: Box, 
      color: "text-blue-500", 
      bg: "bg-blue-100",
      href: "/admin-workspace/assets"
    },
    { 
      id: "stationery", 
      title: "nav.stationery", 
      description: "Order and track stationery supplies.", 
      icon: PenTool, 
      color: "text-purple-500", 
      bg: "bg-purple-100",
      href: "/admin-workspace/stationery"
    },
    { 
      id: "booking", 
      title: "nav.booking", 
      description: "Book meeting rooms and resources.", 
      icon: Calendar, 
      color: "text-green-500", 
      bg: "bg-green-100",
      href: "/admin-workspace/booking"
    },
    { 
      id: "requests", 
      title: "nav.requests", 
      description: "Submit and manage administrative requests.", 
      icon: FileQuestion, 
      color: "text-orange-500", 
      bg: "bg-orange-100",
      href: "/admin-workspace/requests"
    },
  ]

  return (
    <div className="space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("nav.adminWorkspace")}</h2>
          <p className="text-muted-foreground">
            Administrative tools and services.
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Box className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground mt-1">
              Items in inventory
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <div className="p-2 bg-orange-100 rounded-full">
              <FileQuestion className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Room Bookings</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <Calendar className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              Scheduled for today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stationery Orders</CardTitle>
            <div className="p-2 bg-purple-100 rounded-full">
              <PenTool className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">
              Processing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modules */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
          <h3 className="text-lg font-semibold text-blue-600">Admin Modules</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminModules.map((item) => (
            <Card 
              key={item.id} 
              className="hover:shadow-md transition-shadow cursor-pointer relative group"
              onClick={() => navigate(item.href)}
            >
              <CardContent className="p-6">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Star className="w-4 h-4 text-muted-foreground hover:text-yellow-400 cursor-pointer" />
                  <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-blue-400 cursor-pointer" />
                </div>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${item.bg}`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold">{t(item.title)}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
