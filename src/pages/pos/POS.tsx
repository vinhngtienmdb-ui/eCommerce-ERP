import React from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Store, Package, Users, Settings, LayoutDashboard } from "lucide-react";
import { POSCheckout } from "./POSCheckout";
import { POSProducts } from "./POSProducts";
import { POSStaff } from "./POSStaff";
import { POSSettings } from "./POSSettings";

export function POS() {
  const { t } = useTranslation();

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Store className="h-8 w-8 text-primary" />
            {t("pos.title", "Phần mềm POS Cửa hàng")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("pos.subtitle", "Quản lý bán hàng, nhân viên và thiết lập cửa hàng độc lập")}
          </p>
        </div>
      </div>

      <Tabs defaultValue="checkout" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 max-w-3xl mb-4">
          <TabsTrigger value="checkout" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            {t("pos.tabs.checkout", "Bán hàng")}
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            {t("pos.tabs.products", "Sản phẩm")}
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t("pos.tabs.staff", "Nhân viên & Ca")}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {t("pos.tabs.settings", "Thiết lập")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checkout" className="flex-1 mt-0">
          <POSCheckout />
        </TabsContent>
        <TabsContent value="products" className="flex-1 mt-0">
          <POSProducts />
        </TabsContent>
        <TabsContent value="staff" className="flex-1 mt-0">
          <POSStaff />
        </TabsContent>
        <TabsContent value="settings" className="flex-1 mt-0">
          <POSSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
