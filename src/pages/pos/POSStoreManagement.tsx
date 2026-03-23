import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
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
          <h2 className="text-2xl font-bold">{t("pos.stores.title", "Quản lý Hệ thống Cửa hàng")}</h2>
          <p className="text-muted-foreground">{t("pos.stores.subtitle", "Tạo và quản lý các profile cửa hàng POS độc lập")}</p>
        </div>
        <Button onClick={handleAddStore}>
          <Plus className="mr-2 h-4 w-4" /> {t("pos.stores.add", "Thêm cửa hàng")}
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("pos.stores.search", "Tìm kiếm cửa hàng...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => (
          <Card key={store.id} className="hover:shadow-lg transition-shadow border-white/20 bg-white/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEditStore(store)}>
                    <Edit className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteStore(store.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <CardTitle className="mt-4">{store.name}</CardTitle>
              <CardDescription>
                <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded mr-2">{store.storeCode}</span>
                {store.ownerName || t("pos.stores.noOwner", "Chưa có chủ sở hữu")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground mb-6">
                <p><strong>{t("pos.stores.taxId", "MST")}:</strong> {store.taxId || "N/A"}</p>
                <p><strong>{t("pos.stores.ownerType", "Loại hình")}:</strong> {store.ownerType || "N/A"}</p>
                <p><strong>{t("pos.stores.status", "Trạng thái")}:</strong> 
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${store.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {store.status === 'active' ? t("pos.stores.active", "Hoạt động") : t("pos.stores.inactive", "Tạm dừng")}
                  </span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link to={`/pos/${store.id}`}>
                  <Button variant="outline" className="w-full group text-xs px-2">
                    {t("pos.stores.access", "Truy cập POS")}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
                <Link to={`/pos/${store.id}/branches`}>
                  <Button className="w-full text-xs px-2">
                    {t("pos.stores.branches", "Chi nhánh")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingStore ? t("pos.stores.editTitle", "Chỉnh sửa cửa hàng") : t("pos.stores.addTitle", "Thêm cửa hàng mới")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("pos.stores.formName", "Tên cửa hàng")}</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder={t("pos.stores.placeholderName", "Ví dụ: Highlands Coffee")}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("pos.stores.formCode", "Mã cửa hàng")}</Label>
                <Input 
                  value={formData.storeCode} 
                  onChange={(e) => setFormData({...formData, storeCode: e.target.value})} 
                  placeholder="HL001"
                />
              </div>
            </div>

            {/* Owner Info */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-sm">{t("pos.stores.ownerSection", "Thông tin chủ sở hữu")}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("pos.stores.ownerType", "Loại hình kinh doanh")}</Label>
                  <select 
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={formData.ownerType}
                    onChange={(e) => setFormData({...formData, ownerType: e.target.value})}
                  >
                    <option value="Enterprise">{t("pos.stores.enterprise", "Doanh nghiệp")}</option>
                    <option value="Household">{t("pos.stores.household", "Hộ kinh doanh")}</option>
                    <option value="Individual">{t("pos.stores.individual", "Cá nhân kinh doanh")}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>{t("pos.stores.taxId", "Mã số thuế")}</Label>
                  <Input 
                    value={formData.taxId} 
                    onChange={(e) => setFormData({...formData, taxId: e.target.value})} 
                    placeholder="0123456789"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("pos.stores.ownerName", "Tên chủ sở hữu/Đại diện")}</Label>
                  <Input 
                    value={formData.ownerName} 
                    onChange={(e) => setFormData({...formData, ownerName: e.target.value})} 
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("pos.stores.ownerContact", "Thông tin liên lạc chủ")}</Label>
                  <Input 
                    value={formData.ownerContact} 
                    onChange={(e) => setFormData({...formData, ownerContact: e.target.value})} 
                    placeholder="Email hoặc SĐT"
                  />
                </div>
              </div>
            </div>

            {/* Management & URL */}
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("pos.stores.managerContact", "Liên lạc Quản lý cửa hàng")}</Label>
                  <Input 
                    value={formData.managerContact} 
                    onChange={(e) => setFormData({...formData, managerContact: e.target.value})} 
                    placeholder="SĐT quản lý"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("pos.stores.customUrl", "Tùy chỉnh URL")}</Label>
                  <Input 
                    value={formData.customUrl} 
                    onChange={(e) => setFormData({...formData, customUrl: e.target.value})} 
                    placeholder="my-store-url"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("pos.stores.formStatus", "Trạng thái")}</Label>
                <select 
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="active">{t("pos.stores.active", "Hoạt động")}</option>
                  <option value="inactive">{t("pos.stores.inactive", "Tạm dừng")}</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>{t("common.cancel", "Hủy")}</Button>
            <Button onClick={handleSaveStore}>{t("common.save", "Lưu")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
