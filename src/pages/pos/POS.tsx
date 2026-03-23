import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Store, Package, Users, Settings, LayoutDashboard, QrCode, ArrowLeft, Loader2 } from "lucide-react";
import { POSCheckout } from "./POSCheckout";
import { POSProducts } from "./POSProducts";
import { POSStaff } from "./POSStaff";
import { POSSettings } from "./POSSettings";
import { POSDigitalMenu } from "./POSDigitalMenu";
import { Button } from "@/src/components/ui/button";
import { db } from "@/src/lib/firebase";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { toast } from "sonner";

export function POS() {
  const { t } = useTranslation();
  const { storeId, branchId } = useParams<{ storeId: string; branchId?: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState<any>(null);
  const [branch, setBranch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!storeId) return;
      try {
        const storeDoc = await getDoc(doc(db, "stores", storeId));
        if (storeDoc.exists()) {
          setStore({ id: storeDoc.id, ...storeDoc.data() });
          
          if (branchId) {
            const branchDoc = await getDoc(doc(db, "stores", storeId, "branches", branchId));
            if (branchDoc.exists()) {
              setBranch({ id: branchDoc.id, ...branchDoc.data() });
            }
          }
        } else {
          navigate("/pos");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [storeId, branchId, navigate]);

  useEffect(() => {
    if (!storeId) return;

    const ordersPath = branchId 
      ? `stores/${storeId}/branches/${branchId}/orders` 
      : `stores/${storeId}/orders`;

    const q = query(collection(db, ordersPath), where("status", "==", "new"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const order = change.doc.data();
          toast.info(`🔔 ${t("pos.orders.newOrder", "Đơn hàng mới!")}`, {
            description: `${t("pos.orders.total", "Tổng")}: ${order.total.toLocaleString()}đ`,
            duration: 10000,
          });
        }
      });
    });

    return () => unsubscribe();
  }, [storeId, branchId, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!store) return null;

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(branchId ? `/pos/${storeId}/branches` : "/pos")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Store className="h-8 w-8 text-primary" />
              {branch ? `${store.name} - ${branch.name}` : store.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              {branch 
                ? `${branch.address.detail}, ${branch.address.district}, ${branch.address.province}` 
                : (store.address || t("pos.subtitle", "Quản lý bán hàng, nhân viên và thiết lập cửa hàng độc lập"))}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="checkout" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-5 max-w-4xl mb-4">
          <TabsTrigger value="checkout" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            {t("pos.tabs.checkout", "Bán hàng")}
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            {t("pos.tabs.products", "Sản phẩm")}
          </TabsTrigger>
          <TabsTrigger value="menu" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            {t("pos.tabs.menu", "Menu & QR")}
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
          <POSCheckout storeId={storeId!} branchId={branchId} />
        </TabsContent>
        <TabsContent value="products" className="flex-1 mt-0">
          <POSProducts storeId={storeId!} branchId={branchId} />
        </TabsContent>
        <TabsContent value="menu" className="flex-1 mt-0">
          <POSDigitalMenu storeId={storeId!} branchId={branchId} />
        </TabsContent>
        <TabsContent value="staff" className="flex-1 mt-0">
          <POSStaff storeId={storeId!} branchId={branchId} />
        </TabsContent>
        <TabsContent value="settings" className="flex-1 mt-0">
          <POSSettings storeId={storeId!} branchId={branchId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
