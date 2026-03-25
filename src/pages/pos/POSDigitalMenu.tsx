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
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
            <QrCode className="w-3.5 h-3.5" />
            {t("pos.menu.digitalMenu", "Menu Kỹ thuật số")}
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 leading-tight">{t("pos.menu.title", "Menu Điện tử & QR Code")}</h2>
          <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">{t("pos.menu.subtitle", "Tạo mã QR chuyên nghiệp để khách hàng tự quét và đặt hàng")}</p>
        </div>
        <Button variant="outline" className="rounded-xl h-14 px-8 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-primary transition-all font-bold shadow-sm" onClick={() => window.open(menuUrl, "_blank")}>
          <Eye className="mr-2 h-5 w-5" /> {t("pos.menu.preview", "Xem trước Menu")}
        </Button>
      </div>

      <Tabs defaultValue="qr" className="w-full">
        <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 h-16 mb-8 flex gap-2 w-fit">
          <TabsTrigger value="qr" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md font-bold text-sm px-6 h-full transition-all">
            <QrCode className="mr-2 h-4 w-4" /> {t("pos.menu.qrTab", "Mã QR Cửa hàng")}
          </TabsTrigger>
          <TabsTrigger value="design" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md font-bold text-sm px-6 h-full transition-all">
            <Palette className="mr-2 h-4 w-4" /> {t("pos.menu.designTab", "Tùy chỉnh Thiết kế")}
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md font-bold text-sm px-6 h-full transition-all">
            <Settings className="mr-2 h-4 w-4" /> {t("pos.menu.settingsTab", "Cấu hình Menu")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="qr" className="mt-0">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border border-slate-200 rounded-3xl bg-white shadow-sm overflow-hidden">
              <CardHeader className="text-center pb-6 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-xl font-bold tracking-tight text-slate-900">{t("pos.menu.qrPreview", "Bản xem trước QR")}</CardTitle>
                <CardDescription className="font-medium text-xs text-slate-500 mt-1">{t("pos.menu.qrPreviewDesc", "Mã QR sẽ được in ra để dán tại bàn")}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-10 py-12 relative z-10">
                <div className="relative group/qr">
                  <div className="relative bg-white p-8 rounded-3xl border border-slate-200 shadow-xl transition-all duration-300 hover:shadow-2xl">
                    <div className="w-64 h-64 bg-white flex items-center justify-center relative">
                      <QrCode className="w-full h-full" style={{ color: qrColor }} />
                      {showLogo && (
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-lg">
                              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xs uppercase tracking-wider">
                                POS
                              </div>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 w-full max-w-sm">
                  <Button className="flex-1 h-12 rounded-xl font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all text-sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" /> {t("pos.menu.download", "Tải PNG")}
                  </Button>
                  <Button className="flex-1 h-12 rounded-xl font-bold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all text-sm">
                    <Share2 className="mr-2 h-4 w-4" /> {t("pos.menu.share", "Chia sẻ")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 rounded-3xl bg-white shadow-sm">
              <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="flex items-center gap-4 text-xl font-bold tracking-tight text-slate-900">
                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <ExternalLink className="h-5 w-5 text-primary" />
                  </div>
                  {t("pos.menu.linkTitle", "Liên kết Menu")}
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-500 mt-2">
                  {t("pos.menu.linkDesc", "Gửi liên kết này cho khách hàng để xem menu và đặt hàng trực tuyến")}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t("pos.menu.url", "Đường dẫn Menu")}</label>
                  <div className="flex gap-3">
                    <Input value={menuUrl} readOnly className="h-12 rounded-xl bg-slate-50 border-slate-200 font-mono text-xs px-4 focus-visible:ring-primary/20 shadow-none" />
                    <Button variant="secondary" className="h-12 w-12 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all flex-shrink-0" onClick={copyToClipboard}>
                      {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3 group hover:border-primary/30 transition-all">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <Layout className="h-5 w-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">Giao diện đẹp</h5>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1">Tối ưu cho di động</p>
                    </div>
                  </div>
                  <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3 group hover:border-primary/30 transition-all">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <Check className="h-5 w-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">Đặt hàng nhanh</h5>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1">Tự chọn & thanh toán</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 opacity-5">
                    <Info className="w-16 h-16 text-amber-900" />
                  </div>
                  <h4 className="font-bold text-amber-900 text-sm mb-2 flex items-center gap-2 relative z-10">
                    <Info className="h-4 w-4" />
                    {t("pos.menu.tips", "Mẹo nhỏ")}
                  </h4>
                  <p className="text-xs text-amber-800 leading-relaxed font-medium relative z-10">
                    Bạn có thể in mã QR này và dán tại mỗi bàn. Khi khách hàng quét mã, hệ thống sẽ tự động nhận diện số bàn để nhân viên phục vụ chính xác hơn.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="design" className="mt-0">
          <Card className="border border-slate-200 rounded-3xl bg-white shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-8">
              <CardTitle className="text-xl font-bold tracking-tight text-slate-900">Tùy chỉnh thiết kế QR</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-10">
                  <div className="space-y-6">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs ml-1">Màu sắc QR</h4>
                    <div className="flex gap-4 flex-wrap">
                      {["#000000", "#2563eb", "#16a34a", "#dc2626", "#9333ea"].map(color => (
                        <button
                          key={color}
                          className={`w-12 h-12 rounded-xl border-2 transition-all ${qrColor === color ? "border-primary shadow-lg shadow-primary/20 scale-110" : "border-transparent hover:border-slate-200"}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setQrColor(color)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs ml-1">Tùy chọn hiển thị</h4>
                    <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:bg-white hover:border-primary/20 transition-all group cursor-pointer" onClick={() => setShowLogo(!showLogo)}>
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${showLogo ? "bg-primary border-primary" : "bg-white border-slate-300"}`}>
                        {showLogo && <Check className="h-4 w-4 text-white" />}
                      </div>
                      <span className="text-slate-700 font-bold text-sm select-none">Hiển thị Logo ở giữa QR</span>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100">
                    <Button className="w-full h-14 rounded-xl font-bold text-base bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">Lưu thiết kế</Button>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center group relative overflow-hidden min-h-[400px]">
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl transform transition-transform group-hover:scale-105 duration-300">
                    <QrCode className="w-48 h-48" style={{ color: qrColor }} />
                  </div>
                  <p className="mt-10 text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">Xem trước thay đổi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-0">
          <Card className="border border-slate-200 rounded-3xl bg-white shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-8">
              <CardTitle className="text-xl font-bold tracking-tight text-slate-900">Cấu hình Menu</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="max-w-3xl space-y-10">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Chế độ đặt hàng</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">Chọn cách khách hàng tương tác với menu</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="p-6 rounded-2xl border-2 border-primary bg-primary/5 shadow-sm cursor-pointer transition-all">
                      <h5 className="font-bold text-primary text-base">Chỉ xem Menu</h5>
                      <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">Khách hàng chỉ có thể xem giá & món. Không thể đặt hàng trực tiếp.</p>
                    </div>
                    <div className="p-6 rounded-2xl border-2 border-slate-100 bg-white hover:border-primary/30 hover:bg-slate-50 shadow-sm cursor-pointer transition-all group">
                      <h5 className="font-bold text-slate-900 text-base group-hover:text-primary">Đặt hàng & Thanh toán</h5>
                      <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">Khách hàng tự đặt & trả tiền qua App. Tự động gửi thông báo cho bếp.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <Button className="h-14 px-10 rounded-xl font-bold text-base bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">Cập nhật cấu hình</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
