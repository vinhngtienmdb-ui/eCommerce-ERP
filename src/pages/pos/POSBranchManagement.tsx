import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Plus, Search, MapPin, Edit, Trash2, Loader2, ArrowLeft, ExternalLink, Map as MapIcon } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { db, auth } from "@/src/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, serverTimestamp, getDoc } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors";
import { VIETNAM_PROVINCES } from "@/src/constants/vietnam-address";

export function POSBranchManagement() {
  const { t } = useTranslation();
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState<any>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    branchCode: "",
    address: {
      province: "",
      district: "",
      detail: ""
    },
    location: {
      lat: 0,
      lng: 0
    },
    phone: "",
    email: "",
    managerName: "",
    managerContact: "",
    customUrl: "",
    status: "active",
  });

  useEffect(() => {
    if (!auth.currentUser || !storeId) return;

    const fetchStore = async () => {
      try {
        const storeDoc = await getDoc(doc(db, "stores", storeId));
        if (storeDoc.exists()) {
          setStore({ id: storeDoc.id, ...storeDoc.data() });
        } else {
          toast.error("Không tìm thấy cửa hàng");
          navigate("/pos");
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `stores/${storeId}`);
      }
    };

    fetchStore();

    const q = query(collection(db, "stores", storeId, "branches"), orderBy("branchCode", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBranches(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `stores/${storeId}/branches`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [storeId, navigate]);

  const filteredBranches = branches.filter((b) =>
    b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.branchCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddBranch = () => {
    setEditingBranch(null);
    const nextSeq = branches.length + 1;
    const nextCode = `${store?.storeCode || "BR"}-${String(nextSeq).padStart(3, '0')}`;
    setFormData({
      name: "",
      branchCode: nextCode,
      address: {
        province: VIETNAM_PROVINCES[0].name,
        district: VIETNAM_PROVINCES[0].districts[0],
        detail: ""
      },
      location: {
        lat: 10.762622, // Default HCM
        lng: 106.660172
      },
      phone: "",
      email: "",
      managerName: "",
      managerContact: "",
      customUrl: "",
      status: "active"
    });
    setIsModalOpen(true);
  };

  const handleEditBranch = (branch: any) => {
    setEditingBranch(branch);
    setFormData({ ...branch });
    setIsModalOpen(true);
  };

  const handleSaveBranch = async () => {
    if (!formData.name || !formData.branchCode) {
      toast.error("Vui lòng nhập tên và mã chi nhánh");
      return;
    }
    
    try {
      if (editingBranch) {
        const docRef = doc(db, "stores", storeId!, "branches", editingBranch.id);
        await updateDoc(docRef, {
          ...formData,
          updatedAt: serverTimestamp()
        });
        toast.success("Đã cập nhật thông tin chi nhánh");
      } else {
        await addDoc(collection(db, "stores", storeId!, "branches"), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        toast.success("Đã thêm chi nhánh mới");
      }
      setIsModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, editingBranch ? OperationType.UPDATE : OperationType.WRITE, editingBranch ? `stores/${storeId}/branches/${editingBranch.id}` : `stores/${storeId}/branches`);
    }
  };

  const handleDeleteBranch = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa chi nhánh này?")) return;
    
    try {
      await deleteDoc(doc(db, "stores", storeId!, "branches", id));
      toast.success("Đã xóa chi nhánh");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `stores/${storeId}/branches/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const selectedProvince = VIETNAM_PROVINCES.find(p => p.name === formData.address.province);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/pos")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{t("pos.branches.title", "Quản lý Chi nhánh")} - {store?.name}</h2>
            <p className="text-muted-foreground">{t("pos.branches.subtitle", "Quản lý các điểm bán hàng của cửa hàng")}</p>
          </div>
        </div>
        <Button onClick={handleAddBranch}>
          <Plus className="mr-2 h-4 w-4" /> {t("pos.branches.add", "Thêm chi nhánh")}
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("pos.branches.search", "Tìm kiếm chi nhánh...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBranches.map((branch) => (
          <Card key={branch.id} className="hover:shadow-lg transition-shadow border-white/20 bg-white/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEditBranch(branch)}>
                    <Edit className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteBranch(branch.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <CardTitle className="mt-4">{branch.name}</CardTitle>
              <CardDescription>
                <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded mr-2">{branch.branchCode}</span>
                {branch.address.province}, {branch.address.district}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground mb-6">
                <p><strong>{t("pos.branches.manager", "Quản lý")}:</strong> {branch.managerName || "N/A"}</p>
                <p><strong>{t("pos.branches.phone", "SĐT")}:</strong> {branch.phone || "N/A"}</p>
                <p><strong>URL:</strong> <a href={`https://${branch.customUrl || `${branch.branchCode?.toLowerCase()}.dealtot.io.vn`}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{branch.customUrl || `${branch.branchCode?.toLowerCase()}.dealtot.io.vn`}</a></p>
                <p><strong>{t("pos.branches.status", "Trạng thái")}:</strong> 
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${branch.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {branch.status === 'active' ? t("pos.stores.active", "Hoạt động") : t("pos.stores.inactive", "Tạm dừng")}
                  </span>
                </p>
              </div>
              <Link to={`/pos/${storeId}/${branch.id}`}>
                <Button className="w-full group">
                  {t("pos.branches.access", "Truy cập POS")}
                  <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBranch ? t("pos.branches.editTitle", "Chỉnh sửa chi nhánh") : t("pos.branches.addTitle", "Thêm chi nhánh mới")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("pos.branches.formName", "Tên chi nhánh")}</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="Ví dụ: Chi nhánh Quận 1"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("pos.branches.formCode", "Mã chi nhánh")}</Label>
                <Input 
                  value={formData.branchCode} 
                  onChange={(e) => setFormData({...formData, branchCode: e.target.value})} 
                  placeholder="HL-001"
                />
              </div>
            </div>

            {/* Address Selection */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t("pos.branches.addressSection", "Địa chỉ hành chính")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("pos.branches.province", "Tỉnh/Thành phố")}</Label>
                  <select 
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={formData.address.province}
                    onChange={(e) => {
                      const province = VIETNAM_PROVINCES.find(p => p.name === e.target.value);
                      setFormData({
                        ...formData, 
                        address: {
                          ...formData.address, 
                          province: e.target.value,
                          district: province?.districts[0] || ""
                        }
                      });
                    }}
                  >
                    {VIETNAM_PROVINCES.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>{t("pos.branches.district", "Quận/Huyện")}</Label>
                  <select 
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={formData.address.district}
                    onChange={(e) => setFormData({...formData, address: {...formData.address, district: e.target.value}})}
                  >
                    {selectedProvince?.districts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("pos.branches.detailAddress", "Địa chỉ chi tiết")}</Label>
                <Input 
                  value={formData.address.detail} 
                  onChange={(e) => setFormData({...formData, address: {...formData.address, detail: e.target.value}})} 
                  placeholder="Số nhà, tên đường..."
                />
              </div>
              
              {/* Map Positioning */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <MapIcon className="h-4 w-4" />
                  {t("pos.branches.mapSection", "Định vị trên bản đồ")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("pos.branches.lat", "Vĩ độ (Latitude)")}</Label>
                    <Input 
                      type="number"
                      step="any"
                      value={formData.location.lat} 
                      onChange={(e) => setFormData({...formData, location: {...formData.location, lat: parseFloat(e.target.value)}})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("pos.branches.lng", "Kinh độ (Longitude)")}</Label>
                    <Input 
                      type="number"
                      step="any"
                      value={formData.location.lng} 
                      onChange={(e) => setFormData({...formData, location: {...formData.location, lng: parseFloat(e.target.value)}})} 
                    />
                  </div>
                </div>
                <div className="bg-slate-100 h-32 rounded-lg flex items-center justify-center text-muted-foreground text-xs italic">
                  [ Bản đồ hiển thị tại: {formData.location.lat}, {formData.location.lng} ]
                </div>
              </div>
            </div>

            {/* Manager Info */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-sm">{t("pos.branches.managerSection", "Thông tin quản lý chi nhánh")}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("pos.branches.managerName", "Họ tên quản lý")}</Label>
                  <Input 
                    value={formData.managerName} 
                    onChange={(e) => setFormData({...formData, managerName: e.target.value})} 
                    placeholder="Nguyễn Văn B"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("pos.branches.managerContact", "Liên lạc quản lý")}</Label>
                  <Input 
                    value={formData.managerContact} 
                    onChange={(e) => setFormData({...formData, managerContact: e.target.value})} 
                    placeholder="SĐT hoặc Email"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("pos.branches.phone", "SĐT chi nhánh")}</Label>
                  <Input 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                    placeholder="090..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("pos.branches.customUrl", "Tùy chỉnh URL chi nhánh")}</Label>
                  <Input 
                    value={formData.customUrl} 
                    onChange={(e) => setFormData({...formData, customUrl: e.target.value})} 
                    placeholder={formData.branchCode ? `${formData.branchCode.toLowerCase()}.dealtot.io.vn` : "branch.dealtot.io.vn"}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>{t("common.cancel", "Hủy")}</Button>
            <Button onClick={handleSaveBranch}>{t("common.save", "Lưu")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
