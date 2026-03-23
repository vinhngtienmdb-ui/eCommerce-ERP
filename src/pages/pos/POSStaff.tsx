import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Plus, Search, Edit, Trash2, CalendarClock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { db, auth } from "@/src/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors";

export function POSStaff({ storeId, branchId }: { storeId: string; branchId?: string }) {
  const { t } = useTranslation();
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    shift: "",
    status: "Đang làm việc",
  });

  useEffect(() => {
    if (!auth.currentUser || !storeId) return;

    const staffPath = branchId 
      ? `stores/${storeId}/branches/${branchId}/staff` 
      : `stores/${storeId}/staff`;

    const q = query(collection(db, staffPath), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStaff(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, staffPath);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [storeId, branchId]);

  const filteredStaff = staff.filter((s) =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStaff = () => {
    setEditingStaff(null);
    setFormData({ name: "", role: "", shift: "", status: "Đang làm việc" });
    setIsModalOpen(true);
  };

  const handleEditStaff = (staffMember: any) => {
    setEditingStaff(staffMember);
    setFormData({ ...staffMember });
    setIsModalOpen(true);
  };

  const handleSaveStaff = async () => {
    if (!formData.name) {
      toast.error("Vui lòng nhập tên nhân viên");
      return;
    }
    
    try {
      const staffPath = branchId 
        ? `stores/${storeId}/branches/${branchId}/staff` 
        : `stores/${storeId}/staff`;

      if (editingStaff) {
        const docRef = doc(db, `${staffPath}/${editingStaff.id}`);
        await updateDoc(docRef, {
          ...formData,
          updatedAt: new Date().toISOString()
        });
        toast.success(t("pos.staff.editSuccess", "Đã cập nhật thông tin nhân viên"));
      } else {
        await addDoc(collection(db, staffPath), {
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          creatorId: auth.currentUser?.uid
        });
        toast.success(t("pos.staff.addSuccess", "Đã thêm nhân viên mới"));
      }
      setIsModalOpen(false);
    } catch (error) {
      const staffPath = branchId 
        ? `stores/${storeId}/branches/${branchId}/staff` 
        : `stores/${storeId}/staff`;
      handleFirestoreError(error, editingStaff ? OperationType.UPDATE : OperationType.WRITE, editingStaff ? `${staffPath}/${editingStaff.id}` : staffPath);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm(t("pos.staff.deleteConfirm", "Bạn có chắc chắn muốn xóa nhân viên này?"))) return;
    
    try {
      const staffPath = branchId 
        ? `stores/${storeId}/branches/${branchId}/staff` 
        : `stores/${storeId}/staff`;
      await deleteDoc(doc(db, `${staffPath}/${id}`));
      toast.success(t("pos.staff.deleteSuccess", "Đã xóa nhân viên"));
    } catch (error) {
      const staffPath = branchId 
        ? `stores/${storeId}/branches/${branchId}/staff` 
        : `stores/${storeId}/staff`;
      handleFirestoreError(error, OperationType.DELETE, `${staffPath}/${id}`);
    }
  };

  const handleManageShifts = () => {
    toast.success(t("pos.staff.shiftSuccess", "Đã mở giao diện quản lý ca làm việc"));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t("pos.staff.title", "Nhân viên & Ca làm việc")}</h2>
          <p className="text-muted-foreground">{t("pos.staff.subtitle", "Quản lý nhân sự và phân ca tại cửa hàng")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleManageShifts}>
            <CalendarClock className="mr-2 h-4 w-4" /> {t("pos.staff.shifts", "Xếp ca")}
          </Button>
          <Button onClick={handleAddStaff}>
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
                    <Button variant="ghost" size="icon" onClick={() => handleEditStaff(s)}>
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteStaff(s.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStaff ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tên nhân viên</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="Nhập tên nhân viên"
              />
            </div>
            <div className="space-y-2">
              <Label>Vai trò</Label>
              <Input 
                value={formData.role} 
                onChange={(e) => setFormData({...formData, role: e.target.value})} 
                placeholder="Nhập vai trò (VD: Thu ngân, Pha chế)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ca làm việc</Label>
                <Input 
                  value={formData.shift} 
                  onChange={(e) => setFormData({...formData, shift: e.target.value})} 
                  placeholder="Nhập ca làm việc"
                />
              </div>
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Input 
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: e.target.value})} 
                  placeholder="Đang làm việc / Nghỉ"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSaveStaff}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
