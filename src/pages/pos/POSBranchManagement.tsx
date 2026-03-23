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
          <Button variant="ghost" size="icon" className="rounded-none hover:bg-slate-100 transition-colors" onClick={() => navigate("/pos")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">{t("pos.branches.title", "Quản lý Chi nhánh")} - {store?.name}</h2>
            <p className="text-sm text-slate-500 font-bold">{t("pos.branches.subtitle", "Quản lý các điểm bán hàng của cửa hàng")}</p>
          </div>
        </div>
        <Button onClick={handleAddBranch} className="rounded-none font-black uppercase tracking-widest px-6 h-12 transition-colors">
          <Plus className="mr-2 h-4 w-4" /> {t("pos.branches.add", "Thêm chi nhánh")}
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder={t("pos.branches.search", "Tìm kiếm chi nhánh...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 pl-10 rounded-none bg-white border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-bold text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBranches.map((branch) => (
          <Card key={branch.id} className="border-2 border-slate-200 rounded-none overflow-hidden bg-white hover:border-primary transition-colors">
            <CardHeader className="pb-3 px-6 pt-6">
              <div className="flex justify-between items-start">
                <div className="bg-slate-100 p-3 rounded-none border-2 border-slate-200">
                  <MapPin className="h-6 w-6 text-slate-600" />
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-slate-100 transition-colors" onClick={() => handleEditBranch(branch)}>
                    <Edit className="h-4 w-4 text-slate-600" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-slate-100 text-rose-500 hover:text-rose-600 transition-colors" onClick={() => handleDeleteBranch(branch.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="mt-4 text-lg font-black uppercase tracking-tight text-slate-900">{branch.name}</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="font-mono bg-slate-900 text-white px-2 py-0.5 rounded-none">{branch.branchCode}</span>
                {branch.address.province}, {branch.address.district}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-3 text-xs text-slate-600 mb-6 border-y-2 border-slate-50 py-4">
                <p className="flex justify-between"><strong className="uppercase tracking-widest text-[10px] text-slate-400">{t("pos.branches.manager", "Quản lý")}:</strong> <span className="font-bold text-slate-900">{branch.managerName || "N/A"}</span></p>
                <p className="flex justify-between"><strong className="uppercase tracking-widest text-[10px] text-slate-400">{t("pos.branches.phone", "SĐT")}:</strong> <span className="font-bold text-slate-900">{branch.phone || "N/A"}</span></p>
                <p className="flex justify-between"><strong className="uppercase tracking-widest text-[10px] text-slate-400">URL:</strong> <a href={`https://${branch.customUrl || `${branch.branchCode?.toLowerCase()}.dealtot.io.vn`}`} target="_blank" rel="noreferrer" className="text-primary font-bold hover:underline">{branch.customUrl || `${branch.branchCode?.toLowerCase()}.dealtot.io.vn`}</a></p>
                <p className="flex justify-between items-center"><strong className="uppercase tracking-widest text-[10px] text-slate-400">{t("pos.branches.status", "Trạng thái")}:</strong> 
                  <span className={`px-2 py-0.5 rounded-none text-[8px] font-black uppercase tracking-widest border-2 ${branch.status === 'active' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                    {branch.status === 'active' ? t("pos.stores.active", "Hoạt động") : t("pos.stores.inactive", "Tạm dừng")}
                  </span>
                </p>
              </div>
              <Link to={`/pos/${storeId}/${branch.id}`}>
                <Button className="w-full rounded-none font-black uppercase tracking-widest h-12 transition-colors group">
                  {t("pos.branches.access", "Truy cập POS")}
                  <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-none border-4 border-slate-900 shadow-none scrollbar-hide">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight">{editingBranch ? t("pos.branches.editTitle", "Chỉnh sửa chi nhánh") : t("pos.branches.addTitle", "Thêm chi nhánh mới")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">{t("pos.branches.formName", "Tên chi nhánh")}</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="Ví dụ: Chi nhánh Quận 1"
                  className="h-11 rounded-none bg-slate-50 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">{t("pos.branches.formCode", "Mã chi nhánh")}</Label>
                <Input 
                  value={formData.branchCode} 
                  onChange={(e) => setFormData({...formData, branchCode: e.target.value})} 
                  placeholder="HL-001"
                  className="h-11 rounded-none bg-slate-50 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-bold font-mono"
                />
              </div>
            </div>

            {/* Address Selection */}
            <div className="space-y-4 border-t-2 border-slate-100 pt-4">
              <h3 className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t("pos.branches.addressSection", "Địa chỉ hành chính")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">{t("pos.branches.province", "Tỉnh/Thành phố")}</Label>
                  <select 
                    className="w-full h-11 px-3 rounded-none bg-slate-50 border-2 border-slate-200 focus:outline-none focus:border-primary font-bold text-sm"
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
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">{t("pos.branches.district", "Quận/Huyện")}</Label>
                  <select 
                    className="w-full h-11 px-3 rounded-none bg-slate-50 border-2 border-slate-200 focus:outline-none focus:border-primary font-bold text-sm"
                    value={formData.address.district}
                    onChange={(e) => setFormData({...formData, address: {...formData.address, district: e.target.value}})}
                  >
                    {selectedProvince?.districts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">{t("pos.branches.detailAddress", "Địa chỉ chi tiết")}</Label>
                <Input 
                  value={formData.address.detail} 
                  onChange={(e) => setFormData({...formData, address: {...formData.address, detail: e.target.value}})} 
                  placeholder="Số nhà, tên đường..."
                  className="h-11 rounded-none bg-slate-50 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-bold"
                />
              </div>
              
              {/* Map Positioning */}
              <div className="space-y-4 border-t-2 border-slate-100 pt-4">
                <h3 className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center gap-2">
                  <MapIcon className="h-4 w-4" />
                  {t("pos.branches.mapSection", "Định vị trên bản đồ")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">{t("pos.branches.lat", "Vĩ độ (Latitude)")}</Label>
                    <Input 
                      type="number"
                      step="any"
                      value={formData.location.lat} 
                      onChange={(e) => setFormData({...formData, location: {...formData.location, lat: parseFloat(e.target.value)}})} 
                      className="h-11 rounded-none bg-slate-50 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">{t("pos.branches.lng", "Kinh độ (Longitude)")}</Label>
                    <Input 
                      type="number"
                      step="any"
                      value={formData.location.lng} 
                      onChange={(e) => setFormData({...formData, location: {...formData.location, lng: parseFloat(e.target.value)}})} 
                      className="h-11 rounded-none bg-slate-50 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-bold"
                    />
                  </div>
                </div>
                <div className="bg-slate-900 h-32 rounded-none flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest italic border-4 border-slate-200">
                  [ Bản đồ hiển thị tại: {formData.location.lat}, {formData.location.lng} ]
                </div>
              </div>
            </div>

            {/* Manager Info */}
            <div className="space-y-4 border-t-2 border-slate-100 pt-4">
              <h3 className="text-[10px] uppercase tracking-widest font-black text-slate-400">{t("pos.branches.managerSection", "Thông tin quản lý chi nhánh")}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">{t("pos.branches.managerName", "Họ tên quản lý")}</Label>
                  <Input 
                    value={formData.managerName} 
                    onChange={(e) => setFormData({...formData, managerName: e.target.value})} 
                    placeholder="Nguyễn Văn B"
                    className="h-11 rounded-none bg-slate-50 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">{t("pos.branches.managerContact", "Liên lạc quản lý")}</Label>
                  <Input 
                    value={formData.managerContact} 
                    onChange={(e) => setFormData({...formData, managerContact: e.target.value})} 
                    placeholder="SĐT hoặc Email"
                    className="h-11 rounded-none bg-slate-50 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">{t("pos.branches.phone", "SĐT chi nhánh")}</Label>
                  <Input 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                    placeholder="090..."
                    className="h-11 rounded-none bg-slate-50 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">{t("pos.branches.customUrl", "Tùy chỉnh URL chi nhánh")}</Label>
                  <Input 
                    value={formData.customUrl} 
                    onChange={(e) => setFormData({...formData, customUrl: e.target.value})} 
                    placeholder={formData.branchCode ? `${formData.branchCode.toLowerCase()}.dealtot.io.vn` : "branch.dealtot.io.vn"}
                    className="h-11 rounded-none bg-slate-50 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" className="rounded-none font-bold text-slate-500 uppercase tracking-widest" onClick={() => setIsModalOpen(false)}>{t("common.cancel", "Hủy")}</Button>
            <Button onClick={handleSaveBranch} className="rounded-none font-black uppercase tracking-widest px-8 transition-colors">{t("common.save", "Lưu")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
