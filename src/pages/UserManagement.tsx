import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { Label } from "@/src/components/ui/label"
import { Badge } from "@/src/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Search, Edit, Trash2, UserPlus, Shield, Building2 } from "lucide-react"
import { useDataStore, User } from "@/src/store/useDataStore"
import { toast } from "sonner"

export function UserManagement() {
  const { t } = useTranslation()
  const { users, addUser, updateUser, deleteUser } = useDataStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<Partial<User>>({})

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesStatus = statusFilter === "all" || user.status === statusFilter
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchQuery, roleFilter, statusFilter])

  const handleDelete = (id: string) => {
    deleteUser(id)
    toast.success(t("settings.users.deleteSuccess"))
  }

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user)
      setFormData(user)
    } else {
      setEditingUser(null)
      setFormData({ status: "active", role: "Sales", department: "Phòng Kinh Doanh" })
    }
    setIsModalOpen(true)
  }

  const handleSaveUser = () => {
    if (!formData.name || !formData.email) {
      toast.error(t("settings.users.validationError"))
      return
    }

    if (editingUser) {
      updateUser(editingUser.id, formData)
      toast.success(t("settings.users.updateSuccess"))
    } else {
      const newUser: User = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        lastActive: t("settings.users.notLoggedIn"),
      } as User
      addUser(newUser)
      toast.success(t("settings.users.saveSuccess"))
    }
    setIsModalOpen(false)
  }

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("settings.users.title")}</h2>
        <p className="text-muted-foreground">
          {t("settings.users.description")}
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>{t("settings.users.list")}</CardTitle>
            <CardDescription>{t("settings.users.totalUsers", { count: filteredUsers.length })}</CardDescription>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <UserPlus className="mr-2 h-4 w-4" />
            {t("settings.users.addUser")}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t("settings.users.searchPlaceholder")} 
                className="pl-9" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={t("settings.users.role")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("settings.users.allRoles")}</SelectItem>
                  <SelectItem value="Admin">{t("settings.users.dialog.roles.admin")}</SelectItem>
                  <SelectItem value="Sales">{t("settings.users.dialog.roles.sales")}</SelectItem>
                  <SelectItem value="HR">{t("settings.users.dialog.roles.hr")}</SelectItem>
                  <SelectItem value="Marketing">{t("settings.users.dialog.roles.marketing")}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={t("settings.users.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("settings.users.allStatus")}</SelectItem>
                  <SelectItem value="active">{t("settings.users.active")}</SelectItem>
                  <SelectItem value="inactive">{t("settings.users.inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("settings.users.table.user")}</TableHead>
                  <TableHead>{t("settings.users.table.department")}</TableHead>
                  <TableHead>{t("settings.users.table.role")}</TableHead>
                  <TableHead>{t("settings.users.table.status")}</TableHead>
                  <TableHead>{t("settings.users.table.lastActive")}</TableHead>
                  <TableHead className="text-right">{t("settings.users.table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {t("settings.users.noUsers")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {user.department}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          {user.role}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.status === "active" ? (
                          <Badge variant="default" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">
                            {t("settings.users.active")}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400">
                            {t("settings.users.inactive")}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastActive}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="ghost" onClick={() => handleOpenModal(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDelete(user.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? t("settings.users.dialog.editTitle") : t("settings.users.dialog.addTitle")}</DialogTitle>
            <DialogDescription>
              {editingUser ? t("settings.users.dialog.editDesc") : t("settings.users.dialog.addDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">{t("settings.users.dialog.name")}</Label>
              <Input 
                id="name" 
                value={formData.name || ""} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="col-span-3" 
                placeholder={t("settings.users.dialog.namePlaceholder")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">{t("settings.users.dialog.email")}</Label>
              <Input 
                id="email" 
                type="email"
                value={formData.email || ""} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="col-span-3" 
                placeholder={t("settings.users.dialog.emailPlaceholder")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">{t("settings.users.dialog.department")}</Label>
              <Select value={formData.department} onValueChange={(val) => setFormData({...formData, department: val})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("settings.users.dialog.selectDepartment")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ban Giám Đốc">{t("settings.users.dialog.departments.board")}</SelectItem>
                  <SelectItem value="Phòng Kinh Doanh">{t("settings.users.dialog.departments.sales")}</SelectItem>
                  <SelectItem value="Phòng Nhân Sự">{t("settings.users.dialog.departments.hr")}</SelectItem>
                  <SelectItem value="Phòng Marketing">{t("settings.users.dialog.departments.marketing")}</SelectItem>
                  <SelectItem value="Phòng Kỹ Thuật">{t("settings.users.dialog.departments.tech")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">{t("settings.users.dialog.role")}</Label>
              <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("settings.users.dialog.selectRole")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">{t("settings.users.dialog.roles.admin")}</SelectItem>
                  <SelectItem value="Sales">{t("settings.users.dialog.roles.sales")}</SelectItem>
                  <SelectItem value="HR">{t("settings.users.dialog.roles.hr")}</SelectItem>
                  <SelectItem value="Marketing">{t("settings.users.dialog.roles.marketing")}</SelectItem>
                  <SelectItem value="Developer">{t("settings.users.dialog.roles.developer")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">{t("settings.users.dialog.status")}</Label>
              <Select value={formData.status} onValueChange={(val: "active" | "inactive") => setFormData({...formData, status: val})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("settings.users.dialog.selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t("settings.users.active")}</SelectItem>
                  <SelectItem value="inactive">{t("settings.users.inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleSaveUser}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
