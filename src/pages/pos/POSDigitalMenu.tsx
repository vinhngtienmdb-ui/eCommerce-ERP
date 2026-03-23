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
    const origin = window.location.origin;
    const storeSlug = store?.slug || storeId;
    const branchSlug = branch?.slug || branchId;

    if (branchId && branch) {
      if (branch.customUrl) return `https://${branch.customUrl}`;
      if (branch.branchCode) return `https://${branch.branchCode.toLowerCase()}.dealtot.io.vn`;
      return `${origin}/menu/${storeSlug}/${branchSlug}`;
    }
    
    if (store) {
      if (store.customUrl) return `https://${store.customUrl}`;
      if (store.storeCode) return `https://${store.storeCode.toLowerCase()}.dealtot.io.vn`;
      return `${origin}/menu/${storeSlug}`;
    }

    return `${origin}/menu/${storeId}${branchId ? `/${branchId}` : ""}`;
  };

  const menuUrl = getMenuUrl();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    toast.success(t("pos.menu.copySuccess", "Đã sao chép liên kết Menu"));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest mb-2">
            <QrCode className="w-3 h-3" />
            {t("pos.menu.digitalMenu", "Menu Kỹ thuật số")}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">{t("pos.menu.title", "Menu Điện tử & QR Code")}</h2>
          <p className="text-slate-500 text-base max-w-2xl font-medium">{t("pos.menu.subtitle", "Tạo mã QR chuyên nghiệp để khách hàng tự quét và đặt hàng")}</p>
        </div>
        <Button variant="outline" className="rounded-2xl h-11 px-6 border-slate-200 hover:bg-slate-50 hover:text-primary transition-all shadow-sm font-semibold text-sm" onClick={() => window.open(menuUrl, "_blank")}>
          <Eye className="mr-2 h-4 w-4" /> {t("pos.menu.preview", "Xem trước Menu")}
        </Button>
      </div>

      <Tabs defaultValue="qr" className="w-full">
        <TabsList className="bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50 h-12 mb-8">
          <TabsTrigger value="qr" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold text-xs px-6">
            <QrCode className="mr-2 h-3.5 w-3.5" /> {t("pos.menu.qrTab", "Mã QR Cửa hàng")}
          </TabsTrigger>
          <TabsTrigger value="design" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold text-xs px-6">
            <Palette className="mr-2 h-3.5 w-3.5" /> {t("pos.menu.designTab", "Tùy chỉnh Thiết kế")}
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold text-xs px-6">
            <Settings className="mr-2 h-3.5 w-3.5" /> {t("pos.menu.settingsTab", "Cấu hình Menu")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="qr" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl shadow-slate-200/20 rounded-[32px] overflow-hidden bg-white relative group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <QrCode className="w-32 h-32" />
              </div>
              <CardHeader className="text-center pb-2 relative z-10">
                <CardTitle className="text-xl font-bold">{t("pos.menu.qrPreview", "Bản xem trước QR")}</CardTitle>
                <CardDescription className="font-medium text-xs">{t("pos.menu.qrPreviewDesc", "Mã QR sẽ được in ra để dán tại bàn")}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-8 py-10 relative z-10">
                <div className="relative group/qr">
                  <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 to-violet-500/20 rounded-[60px] blur-3xl opacity-30 group-hover/qr:opacity-50 transition duration-1000"></div>
                  <div className="relative bg-white p-6 rounded-[40px] shadow-2xl border-[8px] border-slate-50 transform transition-transform duration-500 group-hover/qr:scale-[1.02]">
                    <div className="w-56 h-56 bg-white flex items-center justify-center relative overflow-hidden rounded-2xl border border-slate-100">
                      <QrCode className="w-48 h-48" style={{ color: qrColor }} />
                      {showLogo && (
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="bg-white p-2.5 rounded-[20px] shadow-xl border border-slate-50">
                              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-[10px] shadow-lg shadow-primary/20">
                                POS
                              </div>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 w-full max-w-sm">
                  <Button className="flex-1 h-12 rounded-2xl font-bold bg-white text-slate-900 border-slate-200 hover:bg-slate-50 shadow-sm text-sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" /> {t("pos.menu.download", "Tải PNG")}
                  </Button>
                  <Button className="flex-1 h-12 rounded-2xl font-bold shadow-lg shadow-primary/20 text-sm">
                    <Share2 className="mr-2 h-4 w-4" /> {t("pos.menu.share", "Chia sẻ")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-slate-200/20 rounded-[32px] overflow-hidden bg-white">
              <CardHeader className="p-8">
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                  <div className="p-2.5 bg-primary/5 rounded-xl">
                    <ExternalLink className="h-5 w-5 text-primary" />
                  </div>
                  {t("pos.menu.linkTitle", "Liên kết Menu")}
                </CardTitle>
                <CardDescription className="text-sm font-medium text-slate-500">
                  {t("pos.menu.linkDesc", "Gửi liên kết này cho khách hàng để xem menu và đặt hàng trực tuyến")}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t("pos.menu.url", "Đường dẫn Menu")}</label>
                  <div className="flex gap-2">
                    <Input value={menuUrl} readOnly className="h-12 rounded-2xl bg-slate-50 border-slate-100 font-mono text-[10px] px-4 focus-visible:ring-primary/20" />
                    <Button variant="secondary" className="h-12 w-12 rounded-2xl bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-all flex-shrink-0" onClick={copyToClipboard}>
                      {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-slate-400" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-emerald-50/50 rounded-3xl border border-emerald-100/30 space-y-3 group hover:bg-emerald-50 transition-colors">
                    <div className="h-9 w-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/10">
                      <Layout className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-emerald-900 text-xs">Giao diện đẹp</h5>
                      <p className="text-[10px] text-emerald-700/60 font-medium">Tối ưu cho di động</p>
                    </div>
                  </div>
                  <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100/30 space-y-3 group hover:bg-blue-50 transition-colors">
                    <div className="h-9 w-9 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/10">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-blue-900 text-xs">Đặt hàng nhanh</h5>
                      <p className="text-[10px] text-blue-700/60 font-medium">Tự chọn & thanh toán</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 relative overflow-hidden">
                  <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2 relative z-10">
                    <div className="p-1 bg-primary/10 rounded-md">
                      <Info className="h-3.5 w-3.5 text-primary" />
                    </div>
                    {t("pos.menu.tips", "Mẹo nhỏ")}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium relative z-10">
                    Bạn có thể in mã QR này và dán tại mỗi bàn. Khi khách hàng quét mã, hệ thống sẽ tự động nhận diện số bàn để nhân viên phục vụ chính xác hơn.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="design" className="animate-in fade-in-50 duration-500">
          <Card className="border-none shadow-xl shadow-slate-200/20 rounded-3xl bg-white">
            <CardContent className="py-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900">Màu sắc QR</h4>
                    <div className="flex gap-3">
                      {["#000000", "#2563eb", "#16a34a", "#dc2626", "#9333ea"].map(color => (
                        <button
                          key={color}
                          className={`w-9 h-9 rounded-full border-2 transition-all ${qrColor === color ? "border-primary ring-4 ring-primary/10 scale-110" : "border-transparent hover:scale-105"}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setQrColor(color)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900">Tùy chọn hiển thị</h4>
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="show-logo" 
                        checked={showLogo} 
                        onChange={(e) => setShowLogo(e.target.checked)}
                        className="w-5 h-5 rounded-lg border-slate-200 text-primary focus:ring-primary/20 transition-all"
                      />
                      <label htmlFor="show-logo" className="text-slate-600 font-medium text-sm">Hiển thị Logo ở giữa QR</label>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                    <Button className="w-full h-12 rounded-2xl font-bold shadow-lg shadow-primary/20">Lưu thiết kế</Button>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-3xl p-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 group">
                  <div className="bg-white p-5 rounded-[32px] shadow-xl transform transition-transform group-hover:scale-105 duration-500">
                    <QrCode className="w-32 h-32" style={{ color: qrColor }} />
                  </div>
                  <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Xem trước thay đổi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="animate-in fade-in-50 duration-500">
          <Card className="border-none shadow-xl shadow-slate-200/20 rounded-3xl bg-white">
            <CardContent className="py-10">
              <div className="max-w-2xl space-y-8">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900">Chế độ đặt hàng</h4>
                    <p className="text-sm text-slate-500 font-medium">Chọn cách khách hàng tương tác với menu</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div className="p-5 rounded-2xl border-2 border-primary bg-primary/5 cursor-pointer transition-all hover:shadow-md">
                      <h5 className="font-bold text-primary text-sm">Chỉ xem Menu</h5>
                      <p className="text-xs text-slate-500 font-medium mt-1">Khách hàng chỉ có thể xem giá & món</p>
                    </div>
                    <div className="p-5 rounded-2xl border-2 border-slate-100 hover:border-primary/30 cursor-pointer transition-all hover:shadow-md group">
                      <h5 className="font-bold text-slate-900 text-sm group-hover:text-primary transition-colors">Đặt hàng & Thanh toán</h5>
                      <p className="text-xs text-slate-500 font-medium mt-1">Khách hàng tự đặt & trả tiền qua App</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <Button className="h-12 px-8 rounded-2xl font-bold shadow-lg shadow-primary/20">Cập nhật cấu hình</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
