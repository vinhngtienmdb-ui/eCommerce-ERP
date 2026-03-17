import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Calendar, Car, Plus, Search, Filter, Clock, MapPin, Users } from "lucide-react"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Card, CardContent } from "@/src/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { useDataStore } from "@/src/store/useDataStore"
import { toast } from "sonner"

export function Booking() {
  const { t } = useTranslation()
  const { employees } = useDataStore()
  const [activeTab, setActiveTab] = useState("rooms")

  const [rooms, setRooms] = useState([
    { id: "RM-01", name: "Phòng họp A (Tầng 3)", capacity: 10, time: "14:00 - 15:30, Hôm nay", purpose: "Họp team Marketing", status: "confirmed", amenities: ["TV", "Whiteboard", "AC"] },
    { id: "RM-02", name: "Phòng họp Lớn (Tầng 4)", capacity: 30, time: "09:00 - 11:00, Ngày mai", purpose: "Đào tạo nhân sự mới", status: "pending", amenities: ["Projector", "Sound System", "AC"] },
    { id: "RM-03", name: "Phòng họp B (Tầng 3)", capacity: 8, time: "Trống", purpose: "-", status: "available", amenities: ["TV", "AC"] },
  ])

  const [cars, setCars] = useState([
    { id: "CAR-01", name: "Toyota Innova (51H-123.45)", driver: "Nguyễn Văn Tài", time: "08:00 - 17:00, Hôm nay", purpose: "Đi gặp đối tác tại Bình Dương", status: "confirmed", fuel: "85%" },
    { id: "CAR-02", name: "Ford Transit (51B-678.90)", driver: "Trần Văn Xế", time: "06:00 - 18:00, Thứ 6", purpose: "Đưa đón team đi sự kiện", status: "pending", fuel: "60%" },
    { id: "CAR-03", name: "VinFast VF8 (51K-999.99)", driver: "Lê Văn Điện", time: "Trống", purpose: "-", status: "available", fuel: "100%" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newBooking, setNewBooking] = useState({
    resourceId: "",
    requester: "",
    time: "",
    purpose: ""
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">Chờ duyệt</Badge>
      case 'confirmed': return <Badge variant="default" className="bg-blue-500">{t("adminWorkspace.booking.confirmed")}</Badge>
      case 'available': return <Badge variant="default" className="bg-emerald-500">Sẵn sàng</Badge>
      case 'cancelled': return <Badge variant="destructive">{t("adminWorkspace.booking.cancelled")}</Badge>
      default: return null
    }
  }

  const handleCreateBooking = () => {
    if (!newBooking.resourceId || !newBooking.requester || !newBooking.time || !newBooking.purpose) {
      toast.error("Vui lòng điền đầy đủ thông tin")
      return
    }

    if (activeTab === "rooms") {
      const roomIndex = rooms.findIndex(r => r.id === newBooking.resourceId)
      if (roomIndex > -1) {
        const updatedRooms = [...rooms]
        updatedRooms[roomIndex] = {
          ...updatedRooms[roomIndex],
          time: newBooking.time,
          purpose: newBooking.purpose,
          status: "pending"
        }
        setRooms(updatedRooms)
        toast.success("Đã gửi yêu cầu đặt phòng")
      }
    } else {
      const carIndex = cars.findIndex(c => c.id === newBooking.resourceId)
      if (carIndex > -1) {
        const updatedCars = [...cars]
        updatedCars[carIndex] = {
          ...updatedCars[carIndex],
          time: newBooking.time,
          purpose: newBooking.purpose,
          status: "pending"
        }
        setCars(updatedCars)
        toast.success("Đã gửi yêu cầu đặt xe")
      }
    }

    setIsModalOpen(false)
    setNewBooking({ resourceId: "", requester: "", time: "", purpose: "" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="rooms" className="flex items-center gap-2 data-[state=active]:bg-background">
              <Calendar className="h-4 w-4" />
              {t("adminWorkspace.booking.room")}
            </TabsTrigger>
            <TabsTrigger value="cars" className="flex items-center gap-2 data-[state=active]:bg-background">
              <Car className="h-4 w-4" />
              {t("adminWorkspace.booking.car")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Button className="shadow-sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {activeTab === "rooms" ? t("adminWorkspace.booking.bookRoom") : t("adminWorkspace.booking.bookCar")}
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{activeTab === "rooms" ? "Đặt phòng họp" : "Đặt xe công tác"}</DialogTitle>
            <DialogDescription>
              Điền thông tin để gửi yêu cầu {activeTab === "rooms" ? "đặt phòng" : "đặt xe"}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resource" className="text-right">
                {activeTab === "rooms" ? "Phòng" : "Xe"}
              </Label>
              <Select value={newBooking.resourceId} onValueChange={(val) => setNewBooking({...newBooking, resourceId: val})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={`Chọn ${activeTab === "rooms" ? "phòng" : "xe"}`} />
                </SelectTrigger>
                <SelectContent>
                  {activeTab === "rooms" ? (
                    rooms.map(room => (
                      <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                    ))
                  ) : (
                    cars.map(car => (
                      <SelectItem key={car.id} value={car.id}>{car.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="requester" className="text-right">Người yêu cầu</Label>
              <Select value={newBooking.requester} onValueChange={(val) => setNewBooking({...newBooking, requester: val})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn người yêu cầu" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">Thời gian</Label>
              <Input 
                id="time" 
                value={newBooking.time} 
                onChange={(e) => setNewBooking({...newBooking, time: e.target.value})}
                className="col-span-3" 
                placeholder="VD: 14:00 - 15:30, Hôm nay"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="purpose" className="text-right">Mục đích</Label>
              <Input 
                id="purpose" 
                value={newBooking.purpose} 
                onChange={(e) => setNewBooking({...newBooking, purpose: e.target.value})}
                className="col-span-3" 
                placeholder="VD: Họp team Marketing"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button onClick={handleCreateBooking}>Gửi yêu cầu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t("common.search")} className="pl-9 h-10" />
        </div>
        <Button variant="outline" className="h-10">
          <Filter className="mr-2 h-4 w-4" />
          {t("common.filters")}
        </Button>
      </div>

      {activeTab === "rooms" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-all border-t-4 border-t-blue-500">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{room.name}</h3>
                      <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                        <Users className="h-3.5 w-3.5 mr-1" /> {room.capacity} {t("adminWorkspace.booking.people")}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm mb-4">
                  <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/30">
                    <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span className="font-medium">{room.time}</span>
                  </div>
                  <div className="flex items-start gap-3 p-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="line-clamp-1 text-muted-foreground italic">{room.purpose}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {room.amenities.map((a, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] font-normal py-0 px-1.5 bg-slate-50">
                      {a}
                    </Badge>
                  ))}
                </div>

                <div className="pt-4 border-t flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">{room.id}</span>
                  {getStatusBadge(room.status)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "cars" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-all border-t-4 border-t-indigo-500">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Car className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg line-clamp-1">{car.name}</h3>
                      <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                        <Users className="h-3.5 w-3.5 mr-1" /> {t("adminWorkspace.booking.driver")}: {car.driver}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm mb-4">
                  <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/30">
                    <Clock className="h-4 w-4 text-indigo-500 mt-0.5" />
                    <span className="font-medium">{car.time}</span>
                  </div>
                  <div className="flex items-start gap-3 p-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="line-clamp-1 text-muted-foreground italic">{car.purpose}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${parseInt(car.fuel) > 20 ? 'bg-indigo-500' : 'bg-red-500'}`} 
                      style={{ width: car.fuel }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">Fuel: {car.fuel}</span>
                </div>

                <div className="pt-4 border-t flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">{car.id}</span>
                  {getStatusBadge(car.status)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
