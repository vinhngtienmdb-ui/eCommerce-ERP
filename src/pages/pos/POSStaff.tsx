import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Plus, Search, Edit, Trash2, CalendarClock, Loader2, Play, Square } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { db, auth } from "@/src/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, where, getDocs, serverTimestamp } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors";
import { format } from "date-fns";

export function POSStaff({ storeId, branchId }: { storeId: string; branchId?: string }) {
  const { t } = useTranslation();
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [activeShift, setActiveShift] = useState<any>(null);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [shiftFormData, setShiftFormData] = useState({
    staffId: "",
    staffName: "",
    startCash: 0,
  });
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

  useEffect(() => {
    if (!auth.currentUser || !storeId) return;

    const shiftsPath = branchId 
      ? `stores/${storeId}/branches/${branchId}/shifts` 
      : `stores/${storeId}/shifts`;

    const q = query(collection(db, shiftsPath), where("status", "==", "open"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setActiveShift({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        setActiveShift(null);
      }
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
    if (activeShift) {
      handleCloseShift();
    } else {
      setIsShiftModalOpen(true);
    }
  };

  const handleOpenShift = async () => {
    if (!shiftFormData.staffId || !shiftFormData.staffName) {
      toast.error("Vui lòng chọn nhân viên trực ca");
      return;
    }

    try {
      const shiftsPath = branchId 
        ? `stores/${storeId}/branches/${branchId}/shifts` 
        : `stores/${storeId}/shifts`;

      await addDoc(collection(db, shiftsPath), {
        staffId: shiftFormData.staffId,
        staffName: shiftFormData.staffName,
        startTime: new Date().toISOString(),
        startCash: Number(shiftFormData.startCash),
        totalSales: 0,
        status: "open",
        storeId,
        branchId: branchId || null,
        createdAt: serverTimestamp()
      });

      toast.success("Đã mở ca làm việc mới");
      setIsShiftModalOpen(false);
    } catch (error) {
      console.error("Error opening shift:", error);
      toast.error("Không thể mở ca làm việc");
    }
  };

  const handleCloseShift = async () => {
    if (!activeShift) return;
    if (!confirm("Bạn có chắc chắn muốn kết thúc ca làm việc này?")) return;

    try {
      const shiftsPath = branchId 
        ? `stores/${storeId}/branches/${branchId}/shifts` 
        : `stores/${storeId}/shifts`;

      const docRef = doc(db, `${shiftsPath}/${activeShift.id}`);
      await updateDoc(docRef, {
        status: "closed",
        endTime: new Date().toISOString(),
        updatedAt: serverTimestamp()
      });

      toast.success("Đã kết thúc ca làm việc");
    } catch (error) {
      console.error("Error closing shift:", error);
      toast.error("Không thể kết thúc ca làm việc");
    }
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{t("pos.staff.title", "Nhân viên & Ca làm việc")}</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">{t("pos.staff.subtitle", "Quản lý nhân sự và phân ca tại cửa hàng")}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant={activeShift ? "destructive" : "outline"} 
            onClick={handleManageShifts}
            className={`rounded-xl h-11 px-6 font-semibold transition-all shadow-sm ${activeShift ? 'bg-rose-500 hover:bg-rose-600 text-white border-none' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'}`}
          >
            {activeShift ? (
              <><Square className="mr-2 h-4 w-4" /> {t("pos.staff.closeShift", "Kết thúc ca")}</>
            ) : (
              <><Play className="mr-2 h-4 w-4" /> {t("pos.staff.openShift", "Mở ca mới")}</>
            )}
          </Button>
          <Button 
            onClick={handleAddStaff} 
            className="rounded-xl h-11 px-6 bg-primary text-white hover:bg-primary/90 font-semibold shadow-sm transition-all"
          >
            <Plus className="mr-2 h-4 w-4" /> {t("pos.staff.add", "Thêm nhân viên")}
          </Button>
        </div>
      </div>

      {activeShift && (
        <Card className="bg-primary/5 border-primary/20 rounded-2xl overflow-hidden shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white rounded-xl border border-primary/10 shadow-sm">
                  <CalendarClock className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">Ca đang hoạt động: {activeShift.staffName}</p>
                  <p className="text-sm text-slate-500 font-medium mt-1">Bắt đầu lúc: {format(new Date(activeShift.startTime), "HH:mm dd/MM/yyyy")}</p>
                </div>
              </div>
              <div className="text-right bg-white p-4 rounded-xl border border-slate-100 shadow-sm min-w-[200px]">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Doanh thu hiện tại</p>
                <p className="text-2xl font-bold text-slate-900">{(activeShift.totalSales || 0).toLocaleString()}đ</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder={t("pos.staff.search", "Tìm kiếm nhân viên...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-white border-slate-200 focus-visible:ring-primary/20 font-medium text-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-100 bg-slate-50/30">
                <TableHead className="h-12 text-xs uppercase tracking-wider font-bold text-slate-500 px-6">{t("pos.staff.name", "Tên nhân viên")}</TableHead>
                <TableHead className="h-12 text-xs uppercase tracking-wider font-bold text-slate-500 px-6">{t("pos.staff.role", "Vai trò")}</TableHead>
                <TableHead className="h-12 text-xs uppercase tracking-wider font-bold text-slate-500 px-6">{t("pos.staff.shift", "Ca làm việc")}</TableHead>
                <TableHead className="h-12 text-xs uppercase tracking-wider font-bold text-slate-500 px-6">{t("pos.staff.status", "Trạng thái")}</TableHead>
                <TableHead className="h-12 text-right text-xs uppercase tracking-wider font-bold text-slate-500 px-6">{t("pos.staff.actions", "Thao tác")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-400 font-medium text-sm">
                    Không tìm thấy nhân viên nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredStaff.map((s) => (
                  <TableRow key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <TableCell className="font-semibold text-slate-900 py-4 px-6 text-sm">{s.name}</TableCell>
                    <TableCell className="text-slate-600 font-medium text-sm px-6">{s.role}</TableCell>
                    <TableCell className="text-slate-600 font-medium text-sm px-6">{s.shift}</TableCell>
                    <TableCell className="px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.status === 'Đang làm việc' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {s.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5" onClick={() => handleEditStaff(s)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50" onClick={() => handleDeleteStaff(s.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent aria-describedby="staff-dialog-description" className="sm:max-w-md p-0 rounded-2xl border-none shadow-2xl overflow-hidden">
          <DialogHeader className="p-6 border-b border-slate-100">
            <DialogTitle className="text-xl font-bold text-slate-900">{editingStaff ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</DialogTitle>
            <DialogDescription id="staff-dialog-description" className="text-sm text-slate-500 font-medium mt-1">
              Quản lý thông tin nhân sự và quyền hạn trong hệ thống POS.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-4 bg-white">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-slate-700 ml-1">Tên nhân viên</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="Nhập tên nhân viên"
                className="h-10 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary/20 font-medium text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-slate-700 ml-1">Vai trò</Label>
              <Input 
                value={formData.role} 
                onChange={(e) => setFormData({...formData, role: e.target.value})} 
                placeholder="Nhập vai trò (VD: Thu ngân, Pha chế)"
                className="h-10 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary/20 font-medium text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700 ml-1">Ca làm việc</Label>
                <Input 
                  value={formData.shift} 
                  onChange={(e) => setFormData({...formData, shift: e.target.value})} 
                  placeholder="Nhập ca làm việc"
                  className="h-10 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary/20 font-medium text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700 ml-1">Trạng thái</Label>
                <Input 
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: e.target.value})} 
                  placeholder="Đang làm việc / Nghỉ"
                  className="h-10 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary/20 font-medium text-sm"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="p-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <Button variant="ghost" className="w-full sm:w-auto rounded-xl h-10 px-6 font-semibold text-slate-500 hover:bg-slate-100" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSaveStaff} className="w-full sm:w-auto rounded-xl h-10 px-8 font-semibold bg-primary text-white hover:bg-primary/90 shadow-sm transition-all">Lưu nhân viên</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isShiftModalOpen} onOpenChange={setIsShiftModalOpen}>
        <DialogContent aria-describedby="shift-dialog-description" className="sm:max-w-md p-0 rounded-2xl border-none shadow-2xl overflow-hidden">
          <DialogHeader className="p-6 bg-primary text-white">
            <DialogTitle className="text-xl font-bold">Mở ca làm việc mới</DialogTitle>
            <DialogDescription id="shift-dialog-description" className="text-sm text-white/80 font-medium mt-1">
              Xác nhận nhân viên trực ca và số tiền mặt bàn giao đầu ca.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-6 bg-white">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-slate-700 ml-1">Chọn nhân viên trực ca</Label>
              <div className="relative">
                <select 
                  className="w-full h-10 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-sm appearance-none cursor-pointer outline-none transition-all"
                  value={shiftFormData.staffId}
                  onChange={(e) => {
                    const s = staff.find(x => x.id === e.target.value);
                    setShiftFormData({ ...shiftFormData, staffId: e.target.value, staffName: s?.name || "" });
                  }}
                >
                  <option value="">-- Chọn nhân viên --</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Plus className="h-4 w-4 rotate-45" />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-slate-700 ml-1">Tiền mặt đầu ca (đ)</Label>
              <Input 
                type="number"
                value={shiftFormData.startCash}
                onChange={(e) => setShiftFormData({ ...shiftFormData, startCash: Number(e.target.value) })}
                className="h-14 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary/20 font-bold text-slate-900 text-xl"
              />
            </div>
          </div>
          <DialogFooter className="p-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <Button variant="ghost" className="w-full sm:w-auto rounded-xl h-10 px-6 font-semibold text-slate-500 hover:bg-slate-100" onClick={() => setIsShiftModalOpen(false)}>Hủy</Button>
            <Button onClick={handleOpenShift} className="w-full sm:w-auto rounded-xl h-10 px-8 font-semibold bg-primary text-white hover:bg-primary/90 shadow-sm transition-all">Bắt đầu ca</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
