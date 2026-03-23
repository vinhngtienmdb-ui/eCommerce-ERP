import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Plus, Search, Edit, Trash2, CalendarClock, Loader2, Play, Square } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">{t("pos.staff.title", "Nhân viên & Ca làm việc")}</h2>
          <p className="text-sm text-slate-500 font-bold">{t("pos.staff.subtitle", "Quản lý nhân sự và phân ca tại cửa hàng")}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={activeShift ? "destructive" : "outline"} 
            onClick={handleManageShifts}
            className={`rounded-none font-black uppercase tracking-widest h-12 px-6 transition-colors ${activeShift ? '' : 'border-2 border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {activeShift ? (
              <><Square className="mr-2 h-4 w-4" /> {t("pos.staff.closeShift", "Kết thúc ca")}</>
            ) : (
              <><Play className="mr-2 h-4 w-4" /> {t("pos.staff.openShift", "Mở ca mới")}</>
            )}
          </Button>
          <Button onClick={handleAddStaff} className="rounded-none font-black uppercase tracking-widest h-12 px-6 transition-colors">
            <Plus className="mr-2 h-4 w-4" /> {t("pos.staff.add", "Thêm nhân viên")}
          </Button>
        </div>
      </div>

      {activeShift && (
        <Card className="bg-primary/[0.03] border-2 border-primary/20 rounded-none overflow-hidden">
          <CardContent className="pt-6 px-6 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-none border-2 border-primary">
                  <CalendarClock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-tight text-slate-900">Ca đang hoạt động: {activeShift.staffName}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Bắt đầu lúc: {format(new Date(activeShift.startTime), "HH:mm dd/MM/yyyy")}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Doanh thu hiện tại</p>
                <p className="text-2xl font-black text-primary tracking-tighter">{(activeShift.totalSales || 0).toLocaleString()}đ</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-2 border-slate-200 rounded-none overflow-hidden bg-white">
        <CardHeader className="pb-3 px-6 pt-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder={t("pos.staff.search", "Tìm kiếm nhân viên...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-none bg-slate-50 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-bold text-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b-2 border-slate-200">
                <TableHead className="text-[10px] uppercase tracking-widest font-black text-slate-900">{t("pos.staff.name", "Tên nhân viên")}</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest font-black text-slate-900">{t("pos.staff.role", "Vai trò")}</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest font-black text-slate-900">{t("pos.staff.shift", "Ca làm việc")}</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest font-black text-slate-900">{t("pos.staff.status", "Trạng thái")}</TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-widest font-black text-slate-900">{t("pos.staff.actions", "Thao tác")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((s) => (
                <TableRow key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <TableCell className="font-bold text-slate-900 py-4">{s.name}</TableCell>
                  <TableCell className="text-slate-500 font-bold text-xs">{s.role}</TableCell>
                  <TableCell className="text-slate-500 font-bold text-xs">{s.shift}</TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-1 rounded-none text-[10px] font-black uppercase tracking-widest border-2 ${s.status === 'Đang làm việc' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                      {s.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-slate-100 transition-colors" onClick={() => handleEditStaff(s)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-slate-100 text-rose-500 hover:text-rose-600 transition-colors" onClick={() => handleDeleteStaff(s.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-none border-4 border-slate-900 shadow-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight">{editingStaff ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">Tên nhân viên</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="Nhập tên nhân viên"
                className="h-11 rounded-none bg-slate-50 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">Vai trò</Label>
              <Input 
                value={formData.role} 
                onChange={(e) => setFormData({...formData, role: e.target.value})} 
                placeholder="Nhập vai trò (VD: Thu ngân, Pha chế)"
                className="h-11 rounded-none bg-slate-50 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">Ca làm việc</Label>
                <Input 
                  value={formData.shift} 
                  onChange={(e) => setFormData({...formData, shift: e.target.value})} 
                  placeholder="Nhập ca làm việc"
                  className="h-11 rounded-none bg-slate-50 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">Trạng thái</Label>
                <Input 
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: e.target.value})} 
                  placeholder="Đang làm việc / Nghỉ"
                  className="h-11 rounded-none bg-slate-50 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-bold"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" className="rounded-none font-bold text-slate-500 uppercase tracking-widest" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSaveStaff} className="rounded-none font-black uppercase tracking-widest px-8 transition-colors">Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isShiftModalOpen} onOpenChange={setIsShiftModalOpen}>
        <DialogContent className="sm:max-w-md rounded-none border-4 border-slate-900 shadow-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight">Mở ca làm việc mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">Chọn nhân viên trực ca</Label>
              <select 
                className="w-full h-11 px-4 rounded-none bg-slate-50 border-2 border-slate-200 focus:ring-0 focus:border-primary font-bold text-sm appearance-none"
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
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">Tiền mặt đầu ca (đ)</Label>
              <Input 
                type="number"
                value={shiftFormData.startCash}
                onChange={(e) => setShiftFormData({ ...shiftFormData, startCash: Number(e.target.value) })}
                className="h-11 rounded-none bg-slate-50 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-black text-primary"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" className="rounded-none font-bold text-slate-500 uppercase tracking-widest" onClick={() => setIsShiftModalOpen(false)}>Hủy</Button>
            <Button onClick={handleOpenShift} className="rounded-none font-black uppercase tracking-widest px-8 transition-colors">Bắt đầu ca</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
