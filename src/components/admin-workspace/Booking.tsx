import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Calendar, Car, Plus, Search, Filter, Clock, MapPin, Users } from "lucide-react"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"

export function Booking() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("rooms")

  const rooms = [
    { id: "RM-01", name: "Phòng họp A (Tầng 3)", capacity: 10, time: "14:00 - 15:30, Hôm nay", purpose: "Họp team Marketing", status: "confirmed" },
    { id: "RM-02", name: "Phòng họp Lớn (Tầng 4)", capacity: 30, time: "09:00 - 11:00, Ngày mai", purpose: "Đào tạo nhân sự mới", status: "pending" },
  ]

  const cars = [
    { id: "CAR-01", name: "Toyota Innova (51H-123.45)", driver: "Nguyễn Văn Tài", time: "08:00 - 17:00, Hôm nay", purpose: "Đi gặp đối tác tại Bình Dương", status: "confirmed" },
    { id: "CAR-02", name: "Ford Transit (51B-678.90)", driver: "Trần Văn Xế", time: "06:00 - 18:00, Thứ 6", purpose: "Đưa đón team đi sự kiện", status: "pending" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary" className="bg-amber-100 text-amber-700">Chờ duyệt</Badge>
      case 'confirmed': return <Badge variant="default" className="bg-emerald-500">{t("adminWorkspace.booking.confirmed")}</Badge>
      case 'cancelled': return <Badge variant="destructive">{t("adminWorkspace.booking.cancelled")}</Badge>
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rooms" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t("adminWorkspace.booking.room")}
            </TabsTrigger>
            <TabsTrigger value="cars" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              {t("adminWorkspace.booking.car")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {activeTab === "rooms" ? t("adminWorkspace.booking.bookRoom") : t("adminWorkspace.booking.bookCar")}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t("common.search")} className="pl-9" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          {t("common.filters")}
        </Button>
      </div>

      {activeTab === "rooms" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div key={room.id} className="bg-card rounded-xl border p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{room.name}</h3>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Users className="h-3 w-3 mr-1" /> Sức chứa: {room.capacity} người
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{room.time}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="line-clamp-2">{room.purpose}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">{room.id}</span>
                {getStatusBadge(room.status)}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "cars" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((car) => (
            <div key={car.id} className="bg-card rounded-xl border p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                    <Car className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold line-clamp-1">{car.name}</h3>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Users className="h-3 w-3 mr-1" /> Tài xế: {car.driver}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{car.time}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="line-clamp-2">{car.purpose}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">{car.id}</span>
                {getStatusBadge(car.status)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
