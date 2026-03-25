import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import { db } from "../../lib/firebase";
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, getDoc, where, limit, getDocs } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors";
import { ShoppingCart, Plus, Minus, Send, Store, Coffee, Utensils, Sparkles, Package, User, Phone, QrCode, CheckCircle2, ArrowLeft, Loader2, Info } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";

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
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "" });
  const [orderComplete, setOrderComplete] = useState(false);
  const [lastOrderInfo, setLastOrderInfo] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category?.[0] || "Khác")))];

  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(p => (p.category?.[0] || "Khác") === activeCategory);

  useEffect(() => {
    // Try to load customer info from local storage
    const savedInfo = localStorage.getItem("pos_customer_info");
    if (savedInfo) {
      try {
        setCustomerInfo(JSON.parse(savedInfo));
      } catch (e) {
        console.error("Error parsing saved customer info", e);
      }
    }
  }, []);

  const handlePhoneChange = async (phone: string) => {
    setCustomerInfo(prev => ({ ...prev, phone }));
    if (phone.length >= 10) {
      setIsSearchingCustomer(true);
      try {
        const q = query(collection(db, "customers"), where("phone", "==", phone), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setCustomerInfo(prev => ({ ...prev, name: data.name || prev.name }));
          toast.info(t("pos.menu.customerFound", "Chào mừng bạn quay trở lại, {{name}}!", { name: data.name }));
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, "customers");
      } finally {
        setIsSearchingCustomer(false);
      }
    }
  };

  useEffect(() => {
    if (!storeId) return;

    // Fetch Store/Branch Info
    const fetchInfo = async () => {
      try {
        const storeSnap = await getDoc(doc(db, "stores", storeId));
        if (storeSnap.exists()) setStoreInfo(storeSnap.data());

        if (branchId) {
          const branchSnap = await getDoc(doc(db, "stores", storeId, "branches", branchId));
          if (branchSnap.exists()) setBranchInfo(branchSnap.data());
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, branchId ? `stores/${storeId}/branches/${branchId}` : `stores/${storeId}`);
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
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, productsPath);
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

  const getVietQRUrl = () => {
    if (!storeInfo?.settings?.bankId || !storeInfo?.settings?.accountNo) return null;
    
    const bankId = storeInfo.settings.bankId.toLowerCase();
    const accountNo = storeInfo.settings.accountNo;
    const template = storeInfo.settings.qrTemplate || "compact";
    const amount = totalAmount;
    const description = `Thanh toan don hang ${storeInfo.name}`;
    const accountName = encodeURIComponent(storeInfo.settings.accountName || "");

    return `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${accountName}`;
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    if (!customerInfo.name || !customerInfo.phone) {
      toast.error(t("pos.menu.infoRequired", "Vui lòng nhập tên và số điện thoại"));
      return;
    }

    setIsOrdering(true);
    const ordersPath = branchId 
      ? `stores/${storeId}/branches/${branchId}/orders` 
      : `stores/${storeId}/orders`;

    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          name: item.productName,
          price: item.price,
          quantity: item.quantity
        })),
        total: totalAmount,
        status: "new",
        source: "customer_app",
        createdAt: new Date().toISOString(),
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        paymentStatus: "pending",
        paymentMethod: "vietqr",
        storeId: storeId,
        branchId: branchId || null
      };

      const docRef = await addDoc(collection(db, ordersPath), orderData);
      
      // Save customer info for next time
      localStorage.setItem("pos_customer_info", JSON.stringify(customerInfo));

      setLastOrderInfo({ id: docRef.id, ...orderData });
      setOrderComplete(true);
      setCart([]);
      setShowCheckout(false);
      toast.success(t("pos.menu.orderSuccess", "Đặt món thành công! Vui lòng chờ trong giây lát."));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, ordersPath);
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans selection:bg-primary/20 selection:text-primary">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-4 md:p-6 sticky top-0 z-30 border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">{branchInfo?.name || storeInfo?.name || "Dealtot POS"}</h1>
              <div className="flex items-center gap-2 text-slate-500 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-[10px] font-semibold uppercase tracking-wider">{branchInfo?.address?.detail || storeInfo?.address || "Chào mừng quý khách!"}</p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Online Menu</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-[73px] z-20 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200 py-4 overflow-x-auto scrollbar-hide">
        <div className="max-w-4xl mx-auto px-4 flex gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
                activeCategory === cat 
                ? "bg-primary text-white border-primary shadow-md shadow-primary/20" 
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm"
              }`}
            >
              {cat === "all" ? t("pos.menu.all", "Tất cả") : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all">
              <div className="relative h-56 overflow-hidden bg-slate-100">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.productName} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    {getCategoryIcon(product.category?.[0])}
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 border border-slate-200 shadow-sm px-3 py-1.5 rounded-xl font-bold text-base">
                    {product.price.toLocaleString()}đ
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3 right-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden md:block">
                   <Button className="w-full rounded-xl font-bold h-11 bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20" onClick={() => addToCart(product)}>
                    <Plus className="h-5 w-5 mr-2" /> {t("pos.menu.addToCart", "Thêm vào giỏ")}
                  </Button>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                        {product.category?.[0] || "Khác"}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg tracking-tight text-slate-900">{product.productName}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{product.description || "Món ăn ngon được chế biến từ nguyên liệu tươi sạch."}</p>
                  </div>
                </div>
                <div className="flex md:hidden justify-between items-center mt-4 pt-4 border-t border-slate-100">
                   <span className="text-xl font-bold tracking-tight text-slate-900">{product.price.toLocaleString()}đ</span>
                   <Button size="sm" className="rounded-xl px-5 font-bold h-10 bg-primary text-white hover:bg-primary/90 transition-all shadow-md shadow-primary/10" onClick={() => addToCart(product)}>
                    <Plus className="h-4 w-4 mr-1.5" /> {t("pos.menu.add", "Thêm")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Summary (Floating) */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 max-w-2xl mx-auto z-40">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 md:p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
                <Badge className="absolute -top-2 -right-2 bg-primary text-white h-6 w-6 flex items-center justify-center p-0 rounded-full border-2 border-white text-[10px] font-bold">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </Badge>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t("pos.menu.total", "Tổng cộng")}</p>
                <p className="font-bold text-xl tracking-tight text-slate-900">{totalAmount.toLocaleString()}đ</p>
              </div>
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 h-12 font-bold text-sm shadow-lg shadow-primary/20 transition-all"
              onClick={() => setShowCheckout(true)}
            >
              {t("pos.menu.checkout", "Thanh toán")} <Send className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="sm:max-w-xl rounded-2xl border-none p-0 overflow-hidden shadow-2xl bg-white">
          <div className="p-6 md:p-8 space-y-6">
            <DialogHeader className="bg-slate-50 p-6 -mx-6 -mt-6 md:-mx-8 md:-mt-8 border-b border-slate-100 mb-6">
              <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">{t("pos.menu.checkoutTitle", "Xác nhận đơn hàng")}</DialogTitle>
              <DialogDescription className="text-xs font-medium text-slate-500 mt-1">
                {t("pos.menu.checkoutDesc", "Vui lòng nhập thông tin để chúng tôi phục vụ bạn tốt nhất")}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-semibold text-slate-700 ml-1 flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400" /> {t("pos.menu.customerPhone", "Số điện thoại")}
                  </Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    placeholder={t("pos.menu.phonePlaceholder", "Nhập số điện thoại...")}
                    value={customerInfo.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="rounded-xl h-11 bg-slate-50/50 border-slate-200 px-4 font-medium focus-visible:ring-primary/20 transition-all"
                  />
                  {isSearchingCustomer && <p className="text-[10px] font-medium text-primary animate-pulse mt-1 ml-1">Đang tìm thông tin...</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-semibold text-slate-700 ml-1 flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-slate-400" /> {t("pos.menu.customerName", "Họ và tên")}
                  </Label>
                  <Input 
                    id="name" 
                    placeholder={t("pos.menu.namePlaceholder", "Nhập tên của bạn...")}
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="rounded-xl h-11 bg-slate-50/50 border-slate-200 px-4 font-medium focus-visible:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider border-b border-slate-200/50 pb-3">{t("pos.menu.orderSummary", "Tóm tắt đơn hàng")}</h4>
                <div className="max-h-40 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="h-7 w-7 bg-white border border-slate-200 text-slate-900 rounded-lg flex items-center justify-center text-[10px] font-bold shadow-sm">{item.quantity}</span>
                        <span className="text-sm font-semibold text-slate-700">{item.productName}</span>
                      </div>
                      <span className="font-bold text-slate-900">{(item.price * item.quantity).toLocaleString()}đ</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">{t("pos.menu.total", "Tổng cộng")}</span>
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">{totalAmount.toLocaleString()}đ</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider ml-1">{t("pos.menu.paymentMethod", "Phương thức thanh toán")}</h4>
                <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <div className="h-11 w-11 bg-primary/10 rounded-xl flex items-center justify-center">
                    <QrCode className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-slate-900">VietQR</p>
                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Quét mã QR để thanh toán</p>
                  </div>
                  <Badge variant="secondary" className="rounded-lg font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600">Mặc định</Badge>
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-14 rounded-xl font-bold text-lg bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20" 
              onClick={handlePlaceOrder}
              disabled={isOrdering}
            >
              {isOrdering ? <Loader2 className="h-6 w-6 animate-spin" /> : t("pos.menu.confirmOrder", "Đặt món ngay")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success View */}
      <Dialog open={orderComplete} onOpenChange={setOrderComplete}>
        <DialogContent className="sm:max-w-xl rounded-2xl border-none p-0 overflow-hidden shadow-2xl bg-white">
          <div className="p-8 md:p-12 space-y-10 text-center">
            <div className="flex justify-center">
              <div className="h-24 w-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center shadow-inner">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">{t("pos.menu.orderSuccessTitle", "Đặt món thành công!")}</h2>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mã đơn hàng:</span>
                <span className="text-lg font-mono font-bold text-slate-900">#{lastOrderInfo?.id?.slice(-6).toUpperCase()}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 space-y-6">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 inline-block px-3 py-1 rounded-lg border border-primary/10">{t("pos.menu.scanToPay", "Quét mã để thanh toán")}</p>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm inline-block transition-transform hover:scale-105 duration-500">
                {getVietQRUrl() ? (
                  <img 
                    src={getVietQRUrl()!} 
                    alt="VietQR" 
                    className="h-56 w-56 object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-56 w-56 flex items-center justify-center text-slate-400 italic text-[10px] font-bold uppercase tracking-widest border-2 border-dashed border-slate-200 rounded-xl">
                    Chưa cấu hình thanh toán
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <p className="text-xl font-bold text-slate-900">{storeInfo?.settings?.accountName}</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">{storeInfo?.settings?.bankId?.toUpperCase()}</span>
                  <span className="text-base font-mono font-bold text-slate-600 tracking-wider">{storeInfo?.settings?.accountNo}</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5">
                <Info className="w-24 h-24 text-amber-900" />
              </div>
              <p className="text-[10px] text-amber-800 font-medium leading-relaxed relative z-10">
                Vui lòng thanh toán và giữ màn hình này để đối soát khi nhận hàng tại quầy. Hệ thống đã thông báo cho nhân viên.
              </p>
            </div>

            <Button variant="outline" className="w-full h-14 rounded-xl font-bold text-slate-600 border-slate-200 hover:bg-slate-50 transition-all" onClick={() => setOrderComplete(false)}>
              <ArrowLeft className="mr-2 h-5 w-5" /> {t("pos.menu.backToMenu", "Quay lại Menu")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
