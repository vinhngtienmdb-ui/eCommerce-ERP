import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Save, Store, Palette, Printer } from "lucide-react";
import { toast } from "sonner";

export function POSSettings() {
  const { t } = useTranslation();
  const [storeName, setStoreName] = useState("Cửa hàng Quận 1");
  const [address, setAddress] = useState("123 Lê Lợi, Quận 1, TP.HCM");
  const [phone, setPhone] = useState("0901234567");
  const [theme, setTheme] = useState("light");
  const [autoPrintReceipt, setAutoPrintReceipt] = useState(true);

  const handleSave = () => {
    toast.success(t("pos.settings.saveSuccess", "Đã lưu cấu hình cửa hàng!"));
  };

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
              <Input id="storeName" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">{t("pos.settings.address", "Địa chỉ")}</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">{t("pos.settings.phone", "Số điện thoại")}</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
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
                checked={theme === "dark"} 
                onCheckedChange={(c) => setTheme(c ? "dark" : "light")} 
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
                checked={autoPrintReceipt} 
                onCheckedChange={setAutoPrintReceipt} 
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            <Save className="mr-2 h-4 w-4" />
            {t("pos.settings.save", "Lưu thay đổi")}
          </Button>
        </div>
      </div>
    </div>
  );
}
