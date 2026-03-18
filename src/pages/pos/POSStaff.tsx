import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Plus, Search, Edit, Trash2, CalendarClock } from "lucide-react";

const INITIAL_STAFF = [
  { id: "1", name: "Nguyễn Văn Nhân", role: "Thu ngân", shift: "Ca sáng (06:00 - 14:00)", status: "Đang làm việc" },
  { id: "2", name: "Trần Thị Viên", role: "Pha chế", shift: "Ca chiều (14:00 - 22:00)", status: "Nghỉ" },
  { id: "3", name: "Lê Quản Lý", role: "Quản lý", shift: "Hành chính", status: "Đang làm việc" },
];

export function POSStaff() {
  const { t } = useTranslation();
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStaff = staff.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t("pos.staff.title", "Nhân viên & Ca làm việc")}</h2>
          <p className="text-muted-foreground">{t("pos.staff.subtitle", "Quản lý nhân sự và phân ca tại cửa hàng")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <CalendarClock className="mr-2 h-4 w-4" /> {t("pos.staff.shifts", "Xếp ca")}
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> {t("pos.staff.add", "Thêm nhân viên")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("pos.staff.search", "Tìm kiếm nhân viên...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("pos.staff.name", "Tên nhân viên")}</TableHead>
                <TableHead>{t("pos.staff.role", "Vai trò")}</TableHead>
                <TableHead>{t("pos.staff.shift", "Ca làm việc")}</TableHead>
                <TableHead>{t("pos.staff.status", "Trạng thái")}</TableHead>
                <TableHead className="text-right">{t("pos.staff.actions", "Thao tác")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.role}</TableCell>
                  <TableCell>{s.shift}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.status === 'Đang làm việc' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {s.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
