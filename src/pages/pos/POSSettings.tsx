import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Save, Store, Palette, Printer, Loader2 } from "lucide-react";
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
          if (branchId) {
            setSettings({
              storeName: data.name || "",
              address: data.address?.detail || "",
              phone: data.phone || "",
              ...(data.settings || {})
            });
          } else {
            setSettings({
              storeName: data.name || "",
              address: data.address || "",
              phone: data.phone || "",
              ...(data.settings || {})
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
        <h2 className="text-2xl font-bold">{t("pos.settings.title", "Thiết lập Cửa hàng")}</h2>
        <p className="text-muted-foreground">{t("pos.settings.subtitle", "Cấu hình thông tin, giao diện và thiết bị")}</p>
      </div>

      <div className="grid gap-6">
        {/* Store Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              {t("pos.settings.info", "Thông tin chung")}
            </CardTitle>
            <CardDescription>
              {t("pos.settings.infoDesc", "Thông tin này sẽ hiển thị trên hóa đơn của khách hàng")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="storeName">{t("pos.settings.storeName", "Tên cửa hàng")}</Label>
              <Input 
                id="storeName" 
                value={settings.storeName} 
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">{t("pos.settings.address", "Địa chỉ")}</Label>
              <Input 
                id="address" 
                value={settings.address} 
                onChange={(e) => setSettings({ ...settings, address: e.target.value })} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">{t("pos.settings.phone", "Số điện thoại")}</Label>
              <Input 
                id="phone" 
                value={settings.phone} 
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Decoration & Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              {t("pos.settings.decoration", "Trang trí & Giao diện")}
            </CardTitle>
            <CardDescription>
              {t("pos.settings.decorationDesc", "Tùy chỉnh màu sắc và hiển thị của phần mềm POS")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t("pos.settings.darkMode", "Chế độ tối (Dark Mode)")}</Label>
                <p className="text-sm text-muted-foreground">
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

        {/* Hardware & Devices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5 text-primary" />
              {t("pos.settings.hardware", "Thiết bị ngoại vi")}
            </CardTitle>
            <CardDescription>
              {t("pos.settings.hardwareDesc", "Kết nối máy in hóa đơn, máy quét mã vạch")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t("pos.settings.autoPrint", "Tự động in hóa đơn")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("pos.settings.autoPrintDesc", "In hóa đơn ngay sau khi thanh toán thành công")}
                </p>
              </div>
              <Switch 
                checked={settings.autoPrintReceipt} 
                onCheckedChange={(c) => setSettings({ ...settings, autoPrintReceipt: c })} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="printerName">{t("pos.settings.printerName", "Tên/IP máy in")}</Label>
              <Input 
                id="printerName" 
                value={settings.printerName || ""} 
                onChange={(e) => setSettings({ ...settings, printerName: e.target.value })} 
                placeholder="Ví dụ: POS-Printer-01"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {t("pos.settings.save", "Lưu thay đổi")}
          </Button>
        </div>
      </div>
    </div>
  );
}
