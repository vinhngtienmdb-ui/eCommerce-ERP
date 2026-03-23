import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Save, Store, Palette, Printer, Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { db, auth } from "@/src/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors";

export function POSSettings({ storeId, branchId }: { storeId: string; branchId?: string }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    storeName: "",
    address: "",
    phone: "",
    theme: "light",
    autoPrintReceipt: true,
    printerName: "",
    bankId: "",
    accountNo: "",
    accountName: "",
    qrTemplate: "compact",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      if (!storeId) return;
      try {
        const docPath = branchId 
          ? `stores/${storeId}/branches/${branchId}` 
          : `stores/${storeId}`;
        const docSnap = await getDoc(doc(db, docPath));
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const baseSettings = {
            theme: "light",
            autoPrintReceipt: true,
            printerName: "",
            bankId: "",
            accountNo: "",
            accountName: "",
            qrTemplate: "compact",
            ...(data.settings || {})
          };

          if (branchId) {
            setSettings({
              ...baseSettings,
              storeName: data.name || "",
              address: data.address?.detail || "",
              phone: data.phone || "",
            });
          } else {
            setSettings({
              ...baseSettings,
              storeName: data.name || "",
              address: data.address || "",
              phone: data.phone || "",
            });
          }
        }
      } catch (error) {
        const docPath = branchId 
          ? `stores/${storeId}/branches/${branchId}` 
          : `stores/${storeId}`;
        handleFirestoreError(error, OperationType.GET, docPath);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [storeId, branchId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const docPath = branchId 
        ? `stores/${storeId}/branches/${branchId}` 
        : `stores/${storeId}`;
      const docRef = doc(db, docPath);
      
      const updateData: any = {
        settings: {
          theme: settings.theme,
          autoPrintReceipt: settings.autoPrintReceipt,
          printerName: settings.printerName,
          bankId: settings.bankId,
          accountNo: settings.accountNo,
          accountName: settings.accountName,
          qrTemplate: settings.qrTemplate,
        },
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser?.uid
      };

      if (branchId) {
        updateData.name = settings.storeName;
        updateData.phone = settings.phone;
        // For branch, address is structured, so we only update detail if needed or keep as is
        // For simplicity, we'll just update the settings part and basic info
      } else {
        updateData.name = settings.storeName;
        updateData.address = settings.address;
        updateData.phone = settings.phone;
      }

      await updateDoc(docRef, updateData);
      toast.success(t("pos.settings.saveSuccess", "Đã lưu cấu hình!"));
    } catch (error) {
      const docPath = branchId 
        ? `stores/${storeId}/branches/${branchId}` 
        : `stores/${storeId}`;
      handleFirestoreError(error, OperationType.UPDATE, docPath);
    } finally {
      setIsSaving(false);
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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">{t("pos.settings.title", "Thiết lập Cửa hàng")}</h2>
        <p className="text-sm text-slate-500 font-bold">{t("pos.settings.subtitle", "Cấu hình thông tin, giao diện và thiết bị")}</p>
      </div>

      <div className="grid gap-6">
        {/* Store Info */}
        <Card className="border-2 border-slate-200 rounded-none overflow-hidden bg-white">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-tight">
              <div className="p-2 bg-primary/10 rounded-none border-2 border-primary/20">
                <Store className="h-5 w-5 text-primary" />
              </div>
              {t("pos.settings.info", "Thông tin chung")}
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {t("pos.settings.infoDesc", "Thông tin này sẽ hiển thị trên hóa đơn của khách hàng")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            <div className="grid gap-1.5">
              <Label htmlFor="storeName" className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">{t("pos.settings.storeName", "Tên cửa hàng")}</Label>
              <Input 
                id="storeName" 
                value={settings.storeName} 
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} 
                className="h-11 rounded-none bg-slate-50 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-bold"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="address" className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">{t("pos.settings.address", "Địa chỉ")}</Label>
              <Input 
                id="address" 
                value={settings.address} 
                onChange={(e) => setSettings({ ...settings, address: e.target.value })} 
                className="h-11 rounded-none bg-slate-50 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-bold"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">{t("pos.settings.phone", "Số điện thoại")}</Label>
              <Input 
                id="phone" 
                value={settings.phone} 
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })} 
                className="h-11 rounded-none bg-slate-50 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-bold"
              />
            </div>
          </CardContent>
        </Card>

        {/* Decoration & Theme */}
        <Card className="border-2 border-slate-200 rounded-none overflow-hidden bg-white">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-tight">
              <div className="p-2 bg-primary/10 rounded-none border-2 border-primary/20">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              {t("pos.settings.decoration", "Trang trí & Giao diện")}
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {t("pos.settings.decorationDesc", "Tùy chỉnh màu sắc và hiển thị của phần mềm POS")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-none border-2 border-slate-200">
              <div className="space-y-0.5">
                <Label className="text-sm font-black uppercase tracking-tight text-slate-900">{t("pos.settings.darkMode", "Chế độ tối (Dark Mode)")}</Label>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  {t("pos.settings.darkModeDesc", "Sử dụng giao diện tối để giảm mỏi mắt")}
                </p>
              </div>
              <Switch 
                checked={settings.theme === "dark"} 
                onCheckedChange={(c) => setSettings({ ...settings, theme: c ? "dark" : "light" })} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment & VietQR */}
        <Card className="border-2 border-slate-200 rounded-none overflow-hidden bg-white">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-tight">
              <div className="p-2 bg-primary/10 rounded-none border-2 border-primary/20">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              {t("pos.settings.payment", "Thanh toán & VietQR")}
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {t("pos.settings.paymentDesc", "Cấu hình tài khoản ngân hàng để nhận thanh toán qua mã QR")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="bankId" className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">{t("pos.settings.bankName", "Ngân hàng")}</Label>
                <Input 
                  id="bankId" 
                  value={settings.bankId || ""} 
                  onChange={(e) => setSettings({ ...settings, bankId: e.target.value })} 
                  placeholder={t("pos.settings.bankPlaceholder", "Ví dụ: VCB, TCB, MBB...")}
                  className="h-11 rounded-none bg-slate-50 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-bold"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="accountNo" className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">{t("pos.settings.accountNo", "Số tài khoản")}</Label>
                <Input 
                  id="accountNo" 
                  value={settings.accountNo || ""} 
                  onChange={(e) => setSettings({ ...settings, accountNo: e.target.value })} 
                  placeholder="0123456789"
                  className="h-11 rounded-none bg-slate-50 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-bold"
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="accountName" className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">{t("pos.settings.accountName", "Tên chủ tài khoản")}</Label>
              <Input 
                id="accountName" 
                value={settings.accountName || ""} 
                onChange={(e) => setSettings({ ...settings, accountName: e.target.value })} 
                placeholder="NGUYEN VAN A"
                className="h-11 rounded-none bg-slate-50 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-bold"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="qrTemplate" className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">{t("pos.settings.qrTemplate", "Mẫu QR")}</Label>
              <select 
                id="qrTemplate"
                className="flex h-11 w-full rounded-none bg-slate-50 border-2 border-slate-200 px-4 py-2 text-sm focus:ring-0 focus:border-primary font-bold appearance-none"
                value={settings.qrTemplate || "compact"}
                onChange={(e) => setSettings({ ...settings, qrTemplate: e.target.value })}
              >
                <option value="compact">Compact (Chỉ mã QR)</option>
                <option value="qr_only">QR Only</option>
                <option value="print">Print (Có thông tin tài khoản)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Hardware & Devices */}
        <Card className="border-2 border-slate-200 rounded-none overflow-hidden bg-white">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-tight">
              <div className="p-2 bg-primary/10 rounded-none border-2 border-primary/20">
                <Printer className="h-5 w-5 text-primary" />
              </div>
              {t("pos.settings.hardware", "Thiết bị ngoại vi")}
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {t("pos.settings.hardwareDesc", "Kết nối máy in hóa đơn, máy quét mã vạch")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-none border-2 border-slate-200">
              <div className="space-y-0.5">
                <Label className="text-sm font-black uppercase tracking-tight text-slate-900">{t("pos.settings.autoPrint", "Tự động in hóa đơn")}</Label>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  {t("pos.settings.autoPrintDesc", "In hóa đơn ngay sau khi thanh toán thành công")}
                </p>
              </div>
              <Switch 
                checked={settings.autoPrintReceipt} 
                onCheckedChange={(c) => setSettings({ ...settings, autoPrintReceipt: c })} 
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="printerName" className="text-[10px] uppercase tracking-widest font-black text-slate-900 ml-1">{t("pos.settings.printerName", "Tên/IP máy in")}</Label>
              <Input 
                id="printerName" 
                value={settings.printerName || ""} 
                onChange={(e) => setSettings({ ...settings, printerName: e.target.value })} 
                placeholder="Ví dụ: POS-Printer-01"
                className="h-11 rounded-none bg-slate-50 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary font-bold"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} size="lg" disabled={isSaving} className="rounded-none px-12 h-14 font-black uppercase tracking-widest transition-colors">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {t("pos.settings.save", "Lưu thay đổi")}
          </Button>
        </div>
      </div>
    </div>
  );
}
