import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";
import { Plus, Search, Store, ExternalLink, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { db, auth } from "@/src/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors";
import { Link } from "react-router-dom";

export function POSStoreManagement() {
  const { t } = useTranslation();
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    storeCode: "",
    ownerType: "Enterprise",
    ownerName: "",
    ownerContact: "",
    taxId: "",
    managerContact: "",
    customUrl: "",
    status: "active",
  });

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(collection(db, "stores"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStores(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "stores");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredStores = stores.filter((s) =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.storeCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStore = () => {
    setEditingStore(null);
    setFormData({
      name: "",
      storeCode: "",
      ownerType: "Enterprise",
      ownerName: "",
      ownerContact: "",
      taxId: "",
      managerContact: "",
      customUrl: "",
      status: "active"
    });
    setIsModalOpen(true);
  };

  const handleEditStore = (store: any) => {
    setEditingStore(store);
    setFormData({ ...store });
    setIsModalOpen(true);
  };

  const handleSaveStore = async () => {
    if (!formData.name || !formData.storeCode) {
      toast.error(t("pos.stores.requiredFields", "Vui lòng nhập tên và mã cửa hàng"));
      return;
    }
    
    try {
      if (editingStore) {
        const docRef = doc(db, "stores", editingStore.id);
        await updateDoc(docRef, {
          ...formData,
          updatedAt: serverTimestamp()
        });
        toast.success(t("pos.stores.editSuccess", "Đã cập nhật thông tin cửa hàng"));
      } else {
        await addDoc(collection(db, "stores"), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          creatorId: auth.currentUser?.uid,
          settings: {
            theme: "light",
            autoPrintReceipt: true,
            printerName: ""
          }
        });
        toast.success(t("pos.stores.addSuccess", "Đã thêm cửa hàng mới"));
      }
      setIsModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, editingStore ? OperationType.UPDATE : OperationType.WRITE, editingStore ? `stores/${editingStore.id}` : "stores");
    }
  };

  const handleDeleteStore = async (id: string) => {
    if (!confirm(t("pos.stores.deleteConfirm", "Bạn có chắc chắn muốn xóa cửa hàng này? Dữ liệu liên quan sẽ không thể khôi phục."))) return;
    
    try {
      await deleteDoc(doc(db, "stores", id));
      toast.success(t("pos.stores.deleteSuccess", "Đã xóa cửa hàng"));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `stores/${id}`);
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
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">{t("pos.stores.title", "Quản lý Hệ thống Cửa hàng")}</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">{t("pos.stores.subtitle", "Tạo và quản lý các profile cửa hàng POS độc lập")}</p>
        </div>
        <Button onClick={handleAddStore} className="rounded-xl font-bold px-6 h-12 bg-primary hover:bg-primary/90 text-white shadow-sm transition-all">
          <Plus className="mr-2 h-5 w-5" /> {t("pos.stores.add", "Thêm cửa hàng")}
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder={t("pos.stores.search", "Tìm kiếm cửa hàng...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11 h-11 rounded-xl bg-white border-slate-200 focus-visible:ring-primary/20 font-medium text-sm shadow-sm transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => (
          <Card key={store.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all group">
            <CardHeader className="pb-4 px-6 pt-6 bg-slate-50/50 border-b border-slate-100">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-slate-200 hover:bg-slate-50 transition-colors" onClick={() => handleEditStore(store)}>
                    <Edit className="h-4 w-4 text-slate-600" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-rose-100 text-rose-500 hover:bg-rose-50 transition-colors" onClick={() => handleDeleteStore(store.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="mt-4 text-xl font-bold tracking-tight text-slate-900">{store.name}</CardTitle>
              <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="font-mono font-bold text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md uppercase tracking-wider">{store.storeCode}</Badge>
                <span className="text-xs font-medium text-slate-500">{store.ownerName || t("pos.stores.noOwner", "Chưa có chủ sở hữu")}</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3 text-sm font-medium text-slate-600 mb-6">
                <p className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-400">{t("pos.stores.taxId", "MST")}:</span> <span className="text-slate-900">{store.taxId || "N/A"}</span></p>
                <p className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-400">{t("pos.stores.ownerType", "Loại hình")}:</span> <span className="text-slate-900">{store.ownerType || "N/A"}</span></p>
                <p className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-400">URL:</span> <a href={`https://${store.customUrl || `${store.storeCode?.toLowerCase()}.dealtot.io.vn`}`} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate ml-4">{store.customUrl || `${store.storeCode?.toLowerCase()}.dealtot.io.vn`}</a></p>
                <div className="flex justify-between items-center pt-1"><span className="text-slate-400">{t("pos.stores.status", "Trạng thái")}:</span> 
                  <Badge className={cn(
                    "rounded-full font-bold px-3 py-0.5 text-[10px] uppercase tracking-wider",
                    store.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                  )}>
                    {store.status === 'active' ? t("pos.stores.active", "Hoạt động") : t("pos.stores.inactive", "Tạm dừng")}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link to={`/pos/${store.id}`}>
                  <Button variant="outline" className="w-full h-11 rounded-xl border-slate-200 text-sm font-bold bg-white text-slate-700 hover:bg-slate-50 transition-all group">
                    {t("pos.stores.access", "Truy cập POS")}
                    <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to={`/pos/${store.id}/branches`}>
                  <Button className="w-full h-11 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all">
                    {t("pos.stores.branches", "Chi nhánh")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl rounded-2xl border-none p-0 shadow-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="bg-slate-50 border-b border-slate-100 p-8">
            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">{editingStore ? t("pos.stores.editTitle", "Chỉnh sửa cửa hàng") : t("pos.stores.addTitle", "Thêm cửa hàng mới")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-8 p-8">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 ml-1">{t("pos.stores.formName", "Tên cửa hàng")}</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder={t("pos.stores.placeholderName", "Ví dụ: Highlands Coffee")}
                  className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 font-medium text-sm transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 ml-1">{t("pos.stores.formCode", "Mã cửa hàng")}</Label>
                <Input 
                  value={formData.storeCode} 
                  onChange={(e) => setFormData({...formData, storeCode: e.target.value})} 
                  placeholder="HL001"
                  className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 font-medium text-sm transition-all"
                />
              </div>
            </div>

            {/* Owner Info */}
            <div className="space-y-6 border-t border-slate-100 pt-6">
              <h3 className="font-bold text-base text-slate-900">{t("pos.stores.ownerSection", "Thông tin chủ sở hữu")}</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 ml-1">{t("pos.stores.ownerType", "Loại hình kinh doanh")}</Label>
                  <select 
                    className="w-full h-11 px-3 rounded-xl bg-slate-50/50 border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium text-sm transition-all appearance-none"
                    value={formData.ownerType}
                    onChange={(e) => setFormData({...formData, ownerType: e.target.value})}
                  >
                    <option value="Enterprise">{t("pos.stores.enterprise", "Doanh nghiệp")}</option>
                    <option value="Household">{t("pos.stores.household", "Hộ kinh doanh")}</option>
                    <option value="Individual">{t("pos.stores.individual", "Cá nhân kinh doanh")}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 ml-1">{t("pos.stores.taxId", "Mã số thuế")}</Label>
                  <Input 
                    value={formData.taxId} 
                    onChange={(e) => setFormData({...formData, taxId: e.target.value})} 
                    placeholder="0123456789"
                    className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 font-medium text-sm transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 ml-1">{t("pos.stores.ownerName", "Tên chủ sở hữu/Đại diện")}</Label>
                  <Input 
                    value={formData.ownerName} 
                    onChange={(e) => setFormData({...formData, ownerName: e.target.value})} 
                    placeholder="Nguyễn Văn A"
                    className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 font-medium text-sm transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 ml-1">{t("pos.stores.ownerContact", "Thông tin liên lạc chủ")}</Label>
                  <Input 
                    value={formData.ownerContact} 
                    onChange={(e) => setFormData({...formData, ownerContact: e.target.value})} 
                    placeholder="Email hoặc SĐT"
                    className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 font-medium text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Management & URL */}
            <div className="space-y-6 border-t border-slate-100 pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 ml-1">{t("pos.stores.managerContact", "Liên lạc Quản lý cửa hàng")}</Label>
                  <Input 
                    value={formData.managerContact} 
                    onChange={(e) => setFormData({...formData, managerContact: e.target.value})} 
                    placeholder="SĐT quản lý"
                    className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 font-medium text-sm transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 ml-1">{t("pos.stores.customUrl", "Tùy chỉnh URL")}</Label>
                  <Input 
                    value={formData.customUrl} 
                    onChange={(e) => setFormData({...formData, customUrl: e.target.value})} 
                    placeholder={formData.storeCode ? `${formData.storeCode.toLowerCase()}.dealtot.io.vn` : "my-store.dealtot.io.vn"}
                    className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 font-medium text-sm transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 ml-1">{t("pos.stores.formStatus", "Trạng thái")}</Label>
                <select 
                  className="w-full h-11 px-3 rounded-xl bg-slate-50/50 border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium text-sm transition-all appearance-none"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="active">{t("pos.stores.active", "Hoạt động")}</option>
                  <option value="inactive">{t("pos.stores.inactive", "Tạm dừng")}</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-3 bg-slate-50 border-t border-slate-100 p-8">
            <Button variant="outline" className="rounded-xl font-bold text-slate-600 h-12 px-8 border-slate-200 hover:bg-slate-100 transition-all" onClick={() => setIsModalOpen(false)}>{t("common.cancel", "Hủy")}</Button>
            <Button onClick={handleSaveStore} className="rounded-xl font-bold px-10 h-12 bg-primary text-white hover:bg-primary/90 transition-all shadow-md shadow-primary/20">{t("common.save", "Lưu")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
