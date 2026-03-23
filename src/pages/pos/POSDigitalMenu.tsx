import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { QrCode, Share2, ExternalLink, Copy, Check, Download } from "lucide-react";
import { toast } from "sonner";

export function POSDigitalMenu({ storeId, branchId }: { storeId: string; branchId?: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const menuUrl = branchId 
    ? `${window.location.origin}/menu/${storeId}/${branchId}` 
    : `${window.location.origin}/menu/${storeId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    toast.success(t("pos.menu.copySuccess", "Đã sao chép liên kết Menu"));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t("pos.menu.title", "Menu Điện tử & QR Code")}</h2>
          <p className="text-muted-foreground">{t("pos.menu.subtitle", "Tạo mã QR để khách hàng tự quét và đặt hàng")}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-white/20 bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              {t("pos.menu.qrTitle", "Mã QR Cửa hàng")}
            </CardTitle>
            <CardDescription>
              {t("pos.menu.qrDesc", "Dán mã này tại bàn hoặc quầy thanh toán")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 py-8">
            <div className="bg-white p-4 rounded-2xl shadow-inner border-4 border-primary/10">
              {/* Mock QR Code */}
              <div className="w-48 h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden rounded-lg">
                <QrCode className="w-40 h-40 text-slate-800" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="bg-white p-2 rounded-full shadow-lg">
                      <div className="w-8 h-8 bg-primary rounded-full" />
                   </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 w-full">
              <Button className="flex-1" variant="outline">
                <Download className="mr-2 h-4 w-4" /> {t("pos.menu.download", "Tải xuống")}
              </Button>
              <Button className="flex-1">
                <Share2 className="mr-2 h-4 w-4" /> {t("pos.menu.share", "Chia sẻ")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/20 bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary" />
              {t("pos.menu.linkTitle", "Liên kết Menu")}
            </CardTitle>
            <CardDescription>
              {t("pos.menu.linkDesc", "Gửi liên kết này cho khách hàng để xem menu trực tuyến")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">{t("pos.menu.url", "Đường dẫn Menu")}</label>
              <div className="flex gap-2">
                <Input value={menuUrl} readOnly className="bg-muted/50" />
                <Button variant="secondary" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-3">
              <h4 className="font-bold text-primary flex items-center gap-2">
                <Check className="h-4 w-4" />
                {t("pos.menu.features", "Tính năng Menu Điện tử")}
              </h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• {t("pos.menu.feat1", "Hiển thị hình ảnh & mô tả sản phẩm sinh động")}</li>
                <li>• {t("pos.menu.feat2", "Khách hàng tự quét mã vạch để thêm vào giỏ hàng")}</li>
                <li>• {t("pos.menu.feat3", "Thanh toán nhanh chóng qua Ví App hoặc QR")}</li>
                <li>• {t("pos.menu.feat4", "Tự động đồng bộ với kho hàng POS")}</li>
              </ul>
            </div>

            <Button className="w-full" variant="secondary">
              <ExternalLink className="mr-2 h-4 w-4" />
              {t("pos.menu.preview", "Xem trước Menu")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
