import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Plus, Search, Edit, Trash2, UserPlus } from "lucide-react"
import { toast } from "sonner"

// Mock user data for now
const mockUsers = [
  { id: "1", name: "Nguyễn Văn A", email: "vana@example.com", role: "Admin" },
  { id: "2", name: "Trần Thị B", email: "thib@example.com", role: "Sales" },
]

export function UserManagement() {
  const { t } = useTranslation()
  const [users, setUsers] = useState(mockUsers)

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id))
    toast.success("User deleted successfully")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h2>
        <p className="text-muted-foreground">
          Quản lý danh sách người dùng và phân quyền truy cập hệ thống.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Danh sách người dùng</CardTitle>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Thêm người dùng
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm người dùng..." className="pl-8" />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
