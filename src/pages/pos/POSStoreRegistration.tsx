import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { toast } from "sonner";
import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Upload, Store, User, Phone, FileText, Camera } from "lucide-react";

export function POSStoreRegistration() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    partnerName: "",
    partnerContact: "",
    businessType: "Individual",
    documents: [] as string[],
    storefrontImage: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "documents" | "storefrontImage") => {
    const files = e.target.files;
    if (!files) return;

    const processFile = (file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (field === "documents") {
          setFormData(prev => ({ ...prev, documents: [...prev.documents, base64String] }));
        } else {
          setFormData(prev => ({ ...prev, storefrontImage: base64String }));
        }
      };
      reader.readAsDataURL(file);
    };

    Array.from(files).forEach(processFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.partnerName || !formData.partnerContact) {
      toast.error(t("pos.register.errorMissingFields", "Vui lòng điền đầy đủ thông tin"));
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "store_registrations"), {
        ...formData,
        status: "pending_registration",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success(t("pos.register.success", "Đăng ký thành công! Chúng tôi sẽ liên hệ sớm nhất."));
      setFormData({
        partnerName: "",
        partnerContact: "",
        businessType: "Individual",
        documents: [],
        storefrontImage: "",
      });
    } catch (error) {
      console.error("Error registering store:", error);
      toast.error(t("pos.register.error", "Có lỗi xảy ra khi đăng ký"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <Card className="max-w-3xl w-full border border-slate-200 rounded-3xl bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="bg-primary/5 p-8 md:p-12 text-slate-900 text-center border-b border-slate-100">
          <div className="h-20 w-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
            <Store className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">{t("pos.register.title", "Đăng ký Đối tác Dealtot POS")}</h1>
          <p className="text-slate-500 font-medium mt-3 max-w-md mx-auto">{t("pos.register.subtitle", "Gia nhập hệ thống quản lý bán hàng hiện đại và chuyên nghiệp")}</p>
        </div>
        <CardContent className="p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs font-bold text-slate-700 ml-1">
                  <User className="h-3.5 w-3.5 text-primary" /> {t("pos.register.partnerName", "Tên Đối tác / Chủ hộ")}
                </Label>
                <Input 
                  placeholder="Nguyễn Văn A" 
                  value={formData.partnerName}
                  onChange={e => setFormData({ ...formData, partnerName: e.target.value })}
                  required
                  className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary font-medium transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs font-bold text-slate-700 ml-1">
                  <Phone className="h-3.5 w-3.5 text-primary" /> {t("pos.register.contact", "Số điện thoại liên hệ")}
                </Label>
                <Input 
                  placeholder="090..." 
                  value={formData.partnerContact}
                  onChange={e => setFormData({ ...formData, partnerContact: e.target.value })}
                  required
                  className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary font-medium transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 ml-1">{t("pos.register.businessType", "Loại hình kinh doanh")}</Label>
              <Select 
                value={formData.businessType} 
                onValueChange={val => setFormData({ ...formData, businessType: val })}
              >
                <SelectTrigger className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:ring-primary/20 focus:border-primary font-medium transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                  <SelectItem value="Enterprise" className="font-medium focus:bg-primary/5 focus:text-primary">{t("pos.store.enterprise", "Doanh nghiệp")}</SelectItem>
                  <SelectItem value="Household" className="font-medium focus:bg-primary/5 focus:text-primary">{t("pos.store.household", "Hộ kinh doanh")}</SelectItem>
                  <SelectItem value="Individual" className="font-medium focus:bg-primary/5 focus:text-primary">{t("pos.store.individual", "Cá nhân kinh doanh")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs font-bold text-slate-700 ml-1">
                  <FileText className="h-3.5 w-3.5 text-primary" /> {t("pos.register.documents", "Giấy tờ pháp lý (GPKD, CCCD...)")}
                </Label>
                <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-8 text-center hover:bg-primary/5 hover:border-primary/30 transition-all cursor-pointer relative group">
                  <input 
                    type="file" 
                    multiple 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={e => handleFileChange(e, "documents")}
                  />
                  <Upload className="h-8 w-8 mx-auto text-slate-400 mb-3 group-hover:text-primary group-hover:-translate-y-1 transition-all" />
                  <p className="text-xs font-bold text-slate-500">{t("pos.register.uploadHint", "Nhấn hoặc kéo thả để tải lên")}</p>
                  {formData.documents.length > 0 && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold">
                      {formData.documents.length} file(s) selected
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs font-bold text-slate-700 ml-1">
                  <Camera className="h-3.5 w-3.5 text-primary" /> {t("pos.register.storefront", "Hình ảnh mặt tiền cửa hàng")}
                </Label>
                <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-8 text-center hover:bg-primary/5 hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden group min-h-[140px] flex flex-col items-center justify-center">
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    onChange={e => handleFileChange(e, "storefrontImage")}
                  />
                  {formData.storefrontImage ? (
                    <img src={formData.storefrontImage} alt="Storefront" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mx-auto text-slate-400 mb-3 group-hover:text-primary group-hover:-translate-y-1 transition-all" />
                      <p className="text-xs font-bold text-slate-500">{t("pos.register.uploadHint", "Nhấn hoặc kéo thả để tải lên")}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-14 rounded-2xl font-bold text-lg bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]" disabled={loading}>
              {loading ? t("common.processing", "Đang xử lý...") : t("pos.register.submit", "Gửi yêu cầu đăng ký")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
