import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import { db } from "../../lib/firebase";
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { ShoppingCart, Plus, Minus, Send, Store, Coffee, Utensils, Sparkles, Package } from "lucide-react";

import { StorefrontFooter } from "../../components/storefront/StorefrontFooter";

export function POSCustomerMenu() {
  const { storeId, branchId } = useParams();
  const { t } = useTranslation();
  const [products, setProducts] = useState<any[]>([]);
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const [branchInfo, setBranchInfo] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    if (!storeId) return;

    // Fetch Store/Branch Info
    const fetchInfo = async () => {
      const storeSnap = await getDoc(doc(db, "stores", storeId));
      if (storeSnap.exists()) setStoreInfo(storeSnap.data());

      if (branchId) {
        const branchSnap = await getDoc(doc(db, "stores", storeId, "branches", branchId));
        if (branchSnap.exists()) setBranchInfo(branchSnap.data());
      }
    };
    fetchInfo();

    // Fetch Products
    const productsPath = branchId 
      ? `stores/${storeId}/branches/${branchId}/products` 
      : `stores/${storeId}/products`;
    
    const q = query(collection(db, productsPath));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [storeId, branchId]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.productName} ${t("pos.menu.added", "đã được thêm vào giỏ")}`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsOrdering(true);
    try {
      const ordersPath = branchId 
        ? `stores/${storeId}/branches/${branchId}/orders` 
        : `stores/${storeId}/orders`;

      await addDoc(collection(db, ordersPath), {
        items: cart,
        total: totalAmount,
        status: "new",
        source: "customer_app",
        createdAt: serverTimestamp(),
        customerName: "Khách tại bàn", // Could be from a prompt
      });

      toast.success(t("pos.menu.orderSuccess", "Đặt món thành công! Vui lòng chờ trong giây lát."));
      setCart([]);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(t("pos.menu.orderError", "Có lỗi xảy ra khi đặt món"));
    } finally {
      setIsOrdering(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = category?.toLowerCase() || "";
    if (cat.includes("cafe") || cat.includes("uống")) return <Coffee className="h-5 w-5" />;
    if (cat.includes("ăn") || cat.includes("món")) return <Utensils className="h-5 w-5" />;
    if (cat.includes("spa") || cat.includes("đẹp")) return <Sparkles className="h-5 w-5" />;
    return <Package className="h-5 w-5" />;
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm sticky top-0 z-10 border-b border-slate-100">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Store className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{branchInfo?.name || storeInfo?.name || "Dealtot POS"}</h1>
            <p className="text-xs text-muted-foreground">{branchInfo?.address?.detail || storeInfo?.address || "Chào mừng quý khách!"}</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden border-none shadow-md rounded-3xl hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-slate-100">
                {product.image ? (
                  <img src={product.image} alt={product.productName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    {getCategoryIcon(product.category?.[0])}
                  </div>
                )}
                <Badge className="absolute top-3 right-3 bg-white/90 text-primary backdrop-blur-sm border-none shadow-sm">
                  {product.price.toLocaleString()}đ
                </Badge>
              </div>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{product.productName}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Badge variant="secondary" className="rounded-lg font-normal">
                    {product.category?.[0] || "Khác"}
                  </Badge>
                  <Button size="sm" className="rounded-xl px-4" onClick={() => addToCart(product)}>
                    <Plus className="h-4 w-4 mr-1" /> {t("pos.menu.add", "Thêm")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Summary (Floating) */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 max-w-lg mx-auto z-50">
          <Card className="bg-primary text-white shadow-2xl border-none rounded-3xl overflow-hidden">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  <Badge className="absolute -top-2 -right-2 bg-white text-primary h-5 w-5 flex items-center justify-center p-0 rounded-full text-[10px] font-bold">
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs opacity-80">{t("pos.menu.total", "Tổng cộng")}</p>
                  <p className="font-bold text-lg">{totalAmount.toLocaleString()}đ</p>
                </div>
              </div>
              <Button 
                className="bg-white text-primary hover:bg-white/90 rounded-2xl px-6 font-bold"
                onClick={handlePlaceOrder}
                disabled={isOrdering}
              >
                {isOrdering ? "..." : <><Send className="h-4 w-4 mr-2" /> {t("pos.menu.orderNow", "Đặt ngay")}</>}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
