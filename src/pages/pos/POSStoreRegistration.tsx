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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-none rounded-3xl overflow-hidden">
        <div className="bg-primary p-8 text-white text-center">
          <Store className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">{t("pos.register.title", "Đăng ký Đối tác Dealtot POS")}</h1>
          <p className="opacity-80 mt-2">{t("pos.register.subtitle", "Gia nhập hệ thống quản lý bán hàng hiện đại")}</p>
        </div>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4" /> {t("pos.register.partnerName", "Tên Đối tác / Chủ hộ")}
                </Label>
                <Input 
                  placeholder="Nguyễn Văn A" 
                  value={formData.partnerName}
                  onChange={e => setFormData({ ...formData, partnerName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> {t("pos.register.contact", "Số điện thoại liên hệ")}
                </Label>
                <Input 
                  placeholder="090..." 
                  value={formData.partnerContact}
                  onChange={e => setFormData({ ...formData, partnerContact: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("pos.register.businessType", "Loại hình kinh doanh")}</Label>
              <Select 
                value={formData.businessType} 
                onValueChange={val => setFormData({ ...formData, businessType: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Enterprise">{t("pos.store.enterprise", "Doanh nghiệp")}</SelectItem>
                  <SelectItem value="Household">{t("pos.store.household", "Hộ kinh doanh")}</SelectItem>
                  <SelectItem value="Individual">{t("pos.store.individual", "Cá nhân kinh doanh")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4" /> {t("pos.register.documents", "Giấy tờ pháp lý (GPKD, CCCD...)")}
                </Label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-primary transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    multiple 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={e => handleFileChange(e, "documents")}
                  />
                  <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-xs text-slate-500">{t("pos.register.uploadHint", "Nhấn hoặc kéo thả để tải lên")}</p>
                  {formData.documents.length > 0 && (
                    <p className="mt-2 text-xs font-medium text-primary">{formData.documents.length} file(s) selected</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Camera className="h-4 w-4" /> {t("pos.register.storefront", "Hình ảnh mặt tiền cửa hàng")}
                </Label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-primary transition-colors cursor-pointer relative overflow-hidden">
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={e => handleFileChange(e, "storefrontImage")}
                  />
                  {formData.storefrontImage ? (
                    <img src={formData.storefrontImage} alt="Storefront" className="h-24 w-full object-cover rounded-lg" />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                      <p className="text-xs text-slate-500">{t("pos.register.uploadHint", "Nhấn hoặc kéo thả để tải lên")}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full py-6 text-lg rounded-xl" disabled={loading}>
              {loading ? t("common.processing", "Đang xử lý...") : t("pos.register.submit", "Gửi yêu cầu đăng ký")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
