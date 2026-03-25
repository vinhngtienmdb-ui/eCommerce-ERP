import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Store, Package, Users, Settings, LayoutDashboard, QrCode, ArrowLeft, Loader2, BarChart3, MapPin, Clock } from "lucide-react";
import { POSCheckout } from "./POSCheckout";
import { POSProducts } from "./POSProducts";
import { POSStaff } from "./POSStaff";
import { POSSettings } from "./POSSettings";
import { POSDigitalMenu } from "./POSDigitalMenu";
import { POSReports } from "./POSReports";
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
    <div className="h-screen flex flex-col bg-slate-50 p-8 gap-8 overflow-hidden font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12 rounded-xl border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm"
            onClick={() => navigate(branchId ? `/pos/${storeId}/branches` : "/pos")}
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-sm">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-none mb-1">
                {branch ? branch.name : store.name}
              </h1>
              <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                <MapPin className="h-4 w-4 text-slate-400" /> 
                {branch 
                  ? `${branch.address.detail}, ${branch.address.district}` 
                  : (store.address || t("pos.subtitle"))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-primary/5 text-primary overflow-hidden py-2 rounded-xl border border-primary/10 shadow-sm">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="mx-6 font-bold uppercase tracking-wider text-xs">🔥 KHUYẾN MÃI: GIẢM 10% CHO ĐƠN TỪ 500K</span>
          <span className="mx-6 font-bold uppercase tracking-wider text-xs">⚡️ TÍCH ĐIỂM 1% MỌI ĐƠN HÀNG</span>
          <span className="mx-6 font-bold uppercase tracking-wider text-xs">🌟 QUÉT MÃ QR ĐỂ NHẬN ƯU ĐÃI</span>
          <span className="mx-6 font-bold uppercase tracking-wider text-xs">🔥 KHUYẾN MÃI: GIẢM 10% CHO ĐƠN TỪ 500K</span>
          <span className="mx-6 font-bold uppercase tracking-wider text-xs">⚡️ TÍCH ĐIỂM 1% MỌI ĐƠN HÀNG</span>
          <span className="mx-6 font-bold uppercase tracking-wider text-xs">🌟 QUÉT MÃ QR ĐỂ NHẬN ƯU ĐÃI</span>
        </div>
      </div>

      <Tabs defaultValue="checkout" className="flex-1 flex flex-col gap-8 overflow-hidden">
        <div className="flex items-center justify-between">
          <TabsList className="h-12 p-1 bg-white rounded-xl border border-slate-200 shadow-sm w-fit flex gap-1">
            {[
              { value: "checkout", icon: LayoutDashboard, label: t("pos.tabs.checkout") },
              { value: "products", icon: Package, label: t("pos.tabs.products") },
              { value: "reports", icon: BarChart3, label: t("pos.tabs.reports") },
              { value: "menu", icon: QrCode, label: t("pos.tabs.menu") },
              { value: "staff", icon: Users, label: t("pos.tabs.staff") },
              { value: "settings", icon: Settings, label: t("pos.tabs.settings") }
            ].map((tab) => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value} 
                className="px-6 h-9 rounded-lg font-bold text-xs uppercase tracking-wider text-slate-500 data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-slate-50 data-[state=active]:hover:bg-primary transition-all"
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="checkout" className="h-full mt-0 focus-visible:ring-0">
            <POSCheckout storeId={storeId!} branchId={branchId} />
          </TabsContent>
          <TabsContent value="products" className="h-full mt-0 focus-visible:ring-0 overflow-y-auto scrollbar-hide">
            <POSProducts storeId={storeId!} branchId={branchId} />
          </TabsContent>
          <TabsContent value="reports" className="h-full mt-0 focus-visible:ring-0 overflow-y-auto scrollbar-hide">
            <POSReports storeId={storeId!} branchId={branchId} />
          </TabsContent>
          <TabsContent value="menu" className="h-full mt-0 focus-visible:ring-0 overflow-y-auto scrollbar-hide">
            <POSDigitalMenu storeId={storeId!} branchId={branchId} store={store} branch={branch} />
          </TabsContent>
          <TabsContent value="staff" className="h-full mt-0 focus-visible:ring-0 overflow-y-auto scrollbar-hide">
            <POSStaff storeId={storeId!} branchId={branchId} />
          </TabsContent>
          <TabsContent value="settings" className="h-full mt-0 focus-visible:ring-0 overflow-y-auto scrollbar-hide">
            <POSSettings storeId={storeId!} branchId={branchId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
