import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { QrCode, Share2, ExternalLink, Copy, Check, Download, Palette, Settings, Layout, Eye, Info } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

export function POSDigitalMenu({ storeId, branchId, store, branch }: { storeId: string; branchId?: string; store?: any; branch?: any }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [qrColor, setQrColor] = useState("#000000");
  const [showLogo, setShowLogo] = useState(true);

  const getMenuUrl = () => {
    if (branchId && branch) {
      if (branch.customUrl) return `https://${branch.customUrl}`;
      if (branch.branchCode) return `https://${branch.branchCode.toLowerCase()}.dealtot.io.vn`;
    }
    if (store) {
      if (store.customUrl) return `https://${store.customUrl}`;
      if (store.storeCode) return `https://${store.storeCode.toLowerCase()}.dealtot.io.vn`;
    }
    return branchId 
      ? `${window.location.origin}/menu/${storeId}/${branchId}` 
      : `${window.location.origin}/menu/${storeId}`;
  };

  const menuUrl = getMenuUrl();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    toast.success(t("pos.menu.copySuccess", "Đã sao chép liên kết Menu"));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("pos.menu.title", "Menu Điện tử & QR Code")}</h2>
          <p className="text-muted-foreground text-lg">{t("pos.menu.subtitle", "Tạo mã QR chuyên nghiệp để khách hàng tự quét và đặt hàng")}</p>
        </div>
        <Button variant="outline" className="rounded-xl" onClick={() => window.open(menuUrl, "_blank")}>
          <Eye className="mr-2 h-4 w-4" /> {t("pos.menu.preview", "Xem trước Menu")}
        </Button>
      </div>

      <Tabs defaultValue="qr" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 h-12 rounded-xl p-1 bg-muted/50">
          <TabsTrigger value="qr" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <QrCode className="mr-2 h-4 w-4" /> {t("pos.menu.qrTab", "Mã QR Cửa hàng")}
          </TabsTrigger>
          <TabsTrigger value="design" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Palette className="mr-2 h-4 w-4" /> {t("pos.menu.designTab", "Tùy chỉnh Thiết kế")}
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Settings className="mr-2 h-4 w-4" /> {t("pos.menu.settingsTab", "Cấu hình Menu")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="qr" className="animate-in fade-in-50 duration-500">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-none shadow-2xl shadow-primary/5 rounded-3xl overflow-hidden bg-gradient-to-br from-white to-slate-50">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">{t("pos.menu.qrPreview", "Bản xem trước QR")}</CardTitle>
                <CardDescription>{t("pos.menu.qrPreviewDesc", "Mã QR sẽ được in ra để dán tại bàn")}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-8 py-10">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-violet-500/20 rounded-[40px] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                  <div className="relative bg-white p-6 rounded-[32px] shadow-2xl border-8 border-white">
                    <div className="w-56 h-56 bg-slate-50 flex items-center justify-center relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-200">
                      <QrCode className="w-48 h-48" style={{ color: qrColor }} />
                      {showLogo && (
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="bg-white p-2 rounded-2xl shadow-xl border-2 border-slate-100">
                              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xs">
                                POS
                              </div>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 w-full max-w-xs">
                  <Button className="flex-1 h-12 rounded-xl" variant="outline">
                    <Download className="mr-2 h-4 w-4" /> {t("pos.menu.download", "Tải xuống PNG")}
                  </Button>
                  <Button className="flex-1 h-12 rounded-xl">
                    <Share2 className="mr-2 h-4 w-4" /> {t("pos.menu.share", "Chia sẻ")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-2xl shadow-primary/5 rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-primary" />
                  {t("pos.menu.linkTitle", "Liên kết Menu trực tuyến")}
                </CardTitle>
                <CardDescription>
                  {t("pos.menu.linkDesc", "Gửi liên kết này cho khách hàng để xem menu và đặt hàng trực tuyến")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">{t("pos.menu.url", "Đường dẫn Menu")}</label>
                  <div className="flex gap-2">
                    <Input value={menuUrl} readOnly className="h-12 rounded-xl bg-slate-50 border-slate-200 font-mono text-xs" />
                    <Button variant="secondary" className="h-12 w-12 rounded-xl" onClick={copyToClipboard}>
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                    <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                      <Layout className="h-4 w-4" />
                    </div>
                    <h5 className="font-bold text-emerald-900 text-sm">Giao diện đẹp</h5>
                    <p className="text-xs text-emerald-700/70">Tối ưu cho mọi thiết bị di động</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-2">
                    <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                      <Check className="h-4 w-4" />
                    </div>
                    <h5 className="font-bold text-blue-900 text-sm">Đặt hàng nhanh</h5>
                    <p className="text-xs text-blue-700/70">Khách hàng tự chọn món & thanh toán</p>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    {t("pos.menu.tips", "Mẹo nhỏ")}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Bạn có thể in mã QR này và dán tại mỗi bàn. Khi khách hàng quét mã, hệ thống sẽ tự động nhận diện số bàn (nếu được cấu hình) để nhân viên phục vụ chính xác hơn.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="design" className="animate-in fade-in-50 duration-500">
          <Card className="border-none shadow-2xl shadow-primary/5 rounded-3xl">
            <CardContent className="py-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg">Màu sắc QR</h4>
                    <div className="flex gap-3">
                      {["#000000", "#2563eb", "#16a34a", "#dc2626", "#9333ea"].map(color => (
                        <button
                          key={color}
                          className={`w-10 h-10 rounded-full border-2 ${qrColor === color ? "border-primary ring-2 ring-primary/20" : "border-transparent"}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setQrColor(color)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-lg">Tùy chọn hiển thị</h4>
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="show-logo" 
                        checked={showLogo} 
                        onChange={(e) => setShowLogo(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="show-logo" className="text-slate-700 font-medium">Hiển thị Logo ở giữa QR</label>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <Button className="w-full h-12 rounded-xl">Lưu thiết kế</Button>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-3xl p-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                  <div className="bg-white p-4 rounded-2xl shadow-xl">
                    <QrCode className="w-32 h-32" style={{ color: qrColor }} />
                  </div>
                  <p className="mt-4 text-sm text-slate-500 font-medium italic">Xem trước thay đổi thiết kế</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="animate-in fade-in-50 duration-500">
          <Card className="border-none shadow-2xl shadow-primary/5 rounded-3xl">
            <CardContent className="py-10">
              <div className="max-w-2xl space-y-6">
                <div className="space-y-2">
                  <h4 className="font-bold">Chế độ đặt hàng</h4>
                  <p className="text-sm text-slate-500">Chọn cách khách hàng tương tác với menu</p>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="p-4 rounded-2xl border-2 border-primary bg-primary/5 cursor-pointer">
                      <h5 className="font-bold text-primary">Chỉ xem Menu</h5>
                      <p className="text-xs text-slate-500">Khách hàng chỉ có thể xem giá & món</p>
                    </div>
                    <div className="p-4 rounded-2xl border-2 border-slate-100 hover:border-primary/50 cursor-pointer transition-colors">
                      <h5 className="font-bold">Đặt hàng & Thanh toán</h5>
                      <p className="text-xs text-slate-500">Khách hàng tự đặt & trả tiền qua App</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Button className="h-12 px-8 rounded-xl">Cập nhật cấu hình</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
