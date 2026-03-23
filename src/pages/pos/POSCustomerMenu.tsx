import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import { db } from "../../lib/firebase";
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, getDoc, where, limit, getDocs } from "firebase/firestore";
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
        console.error("Error searching customer:", error);
      } finally {
        setIsSearchingCustomer(false);
      }
    }
  };

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
    try {
      const ordersPath = branchId 
        ? `stores/${storeId}/branches/${branchId}/orders` 
        : `stores/${storeId}/orders`;

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
    <div className="min-h-screen bg-slate-50/50 pb-32 font-sans selection:bg-primary/10">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl p-4 md:p-6 sticky top-0 z-30 border-b border-slate-200/50 shadow-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-gradient-to-br from-primary to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transform transition-transform hover:scale-105">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">{branchInfo?.name || storeInfo?.name || "Dealtot POS"}</h1>
              <div className="flex items-center gap-1.5 text-slate-500">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-[10px] font-bold uppercase tracking-widest">{branchInfo?.address?.detail || storeInfo?.address || "Chào mừng quý khách!"}</p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full border border-slate-200">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">Online Menu</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-[81px] z-20 bg-white/60 backdrop-blur-md border-b border-slate-200/30 py-4 overflow-x-auto scrollbar-hide">
        <div className="max-w-4xl mx-auto px-4 flex gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap shadow-sm ${
                activeCategory === cat 
                ? "bg-primary text-white shadow-lg shadow-primary/25 scale-105" 
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/50"
              }`}
            >
              {cat === "all" ? t("pos.menu.all", "Tất cả") : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-none shadow-xl shadow-slate-200/50 rounded-[32px] bg-white hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 transform hover:-translate-y-1">
              <div className="relative h-56 overflow-hidden">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.productName} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-slate-300">
                    {getCategoryIcon(product.category?.[0])}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-primary backdrop-blur-md border-none shadow-xl px-4 py-1.5 rounded-2xl font-black text-sm">
                    {product.price.toLocaleString()}đ
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                   <Button className="w-full rounded-2xl font-bold h-11 shadow-lg shadow-primary/30" onClick={() => addToCart(product)}>
                    <Plus className="h-5 w-5 mr-2" /> {t("pos.menu.addToCart", "Thêm vào giỏ")}
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary/70 bg-primary/5 px-2 py-0.5 rounded-md">
                        {product.category?.[0] || "Khác"}
                      </span>
                    </div>
                    <h3 className="font-black text-xl text-slate-900 group-hover:text-primary transition-colors">{product.productName}</h3>
                    <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">{product.description || "Món ăn ngon được chế biến từ nguyên liệu tươi sạch."}</p>
                  </div>
                </div>
                <div className="flex md:hidden justify-between items-center mt-6 pt-4 border-t border-slate-100">
                   <span className="text-lg font-black text-primary">{product.price.toLocaleString()}đ</span>
                   <Button size="sm" className="rounded-xl px-5 font-bold h-10 shadow-md shadow-primary/10" onClick={() => addToCart(product)}>
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
        <div className="fixed bottom-8 left-4 right-4 max-w-lg mx-auto z-40 animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-slate-900/90 backdrop-blur-xl text-white shadow-2xl shadow-primary/20 rounded-[32px] overflow-hidden border border-white/10">
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                    <ShoppingCart className="h-7 w-7 text-white" />
                  </div>
                  <Badge className="absolute -top-2 -right-2 bg-white text-primary h-6 w-6 flex items-center justify-center p-0 rounded-full text-xs font-black shadow-xl">
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50">{t("pos.menu.total", "Tổng cộng")}</p>
                  <p className="font-black text-2xl tracking-tight">{totalAmount.toLocaleString()}đ</p>
                </div>
              </div>
              <Button 
                className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 h-14 font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95"
                onClick={() => setShowCheckout(true)}
              >
                {t("pos.menu.checkout", "Thanh toán")} <Send className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="sm:max-w-md rounded-[40px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-8 space-y-8">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black tracking-tight">{t("pos.menu.checkoutTitle", "Xác nhận đơn hàng")}</DialogTitle>
              <DialogDescription className="text-base font-medium">
                {t("pos.menu.checkoutDesc", "Vui lòng nhập thông tin để chúng tôi phục vụ bạn tốt nhất")}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" /> {t("pos.menu.customerPhone", "Số điện thoại")}
                  </Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    placeholder={t("pos.menu.phonePlaceholder", "Nhập số điện thoại...")}
                    value={customerInfo.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="rounded-2xl h-14 bg-slate-100 border-none px-6 font-bold text-lg focus-visible:ring-primary/20"
                  />
                  {isSearchingCustomer && <p className="text-[10px] font-bold text-primary animate-pulse tracking-wider uppercase">Đang tìm thông tin...</p>}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" /> {t("pos.menu.customerName", "Họ và tên")}
                  </Label>
                  <Input 
                    id="name" 
                    placeholder={t("pos.menu.namePlaceholder", "Nhập tên của bạn...")}
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="rounded-2xl h-14 bg-slate-100 border-none px-6 font-bold text-lg focus-visible:ring-primary/20"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-[32px] space-y-5 border border-slate-200/50">
                <h4 className="font-black text-xs uppercase text-slate-400 tracking-widest">{t("pos.menu.orderSummary", "Tóm tắt đơn hàng")}</h4>
                <div className="max-h-40 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center group">
                      <div className="flex items-center gap-3">
                        <span className="h-6 w-6 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-[10px] font-black">{item.quantity}</span>
                        <span className="text-sm font-bold text-slate-700">{item.productName}</span>
                      </div>
                      <span className="font-black text-sm">{(item.price * item.quantity).toLocaleString()}đ</span>
                    </div>
                  ))}
                </div>
                <div className="pt-5 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-black text-slate-500 uppercase tracking-wider text-xs">{t("pos.menu.total", "Tổng cộng")}</span>
                  <span className="text-3xl font-black text-primary tracking-tight">{totalAmount.toLocaleString()}đ</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-black text-xs uppercase text-slate-400 tracking-widest">{t("pos.menu.paymentMethod", "Phương thức thanh toán")}</h4>
                <div className="flex items-center gap-4 p-5 bg-primary/5 rounded-[24px] border-2 border-primary shadow-lg shadow-primary/5">
                  <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <QrCode className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-sm text-slate-900">VietQR (Chuyển khoản nhanh)</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quét mã QR để thanh toán</p>
                  </div>
                  <Badge className="bg-primary text-white rounded-lg font-black text-[10px] uppercase tracking-widest px-3">Mặc định</Badge>
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-16 rounded-[24px] font-black text-xl shadow-2xl shadow-primary/30 transition-all active:scale-95" 
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
        <DialogContent className="sm:max-w-md rounded-[40px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-10 space-y-10 text-center">
            <div className="flex justify-center">
              <div className="h-24 w-24 bg-emerald-100 rounded-[32px] flex items-center justify-center shadow-lg shadow-emerald-100/50 animate-bounce">
                <CheckCircle2 className="h-12 w-12 text-emerald-600" />
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black tracking-tight text-slate-900">{t("pos.menu.orderSuccessTitle", "Đặt món thành công!")}</h2>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full">
                <span className="text-xs font-black uppercase tracking-widest text-primary">Mã đơn hàng:</span>
                <span className="text-sm font-black text-primary">#{lastOrderInfo?.id?.slice(-6).toUpperCase()}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-[40px] space-y-6 border border-slate-200/50 shadow-inner">
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t("pos.menu.scanToPay", "Quét mã để thanh toán")}</p>
              <div className="bg-white p-6 rounded-[32px] shadow-2xl inline-block transform transition-transform hover:scale-105 duration-500">
                {getVietQRUrl() ? (
                  <img 
                    src={getVietQRUrl()!} 
                    alt="VietQR" 
                    className="h-56 w-56 object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-56 w-56 flex items-center justify-center text-slate-300 italic text-xs font-bold uppercase tracking-widest">
                    Chưa cấu hình thanh toán
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-lg font-black text-slate-900">{storeInfo?.settings?.accountName}</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-black text-primary uppercase tracking-wider">{storeInfo?.settings?.bankId?.toUpperCase()}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-xs font-bold text-slate-500 tracking-widest">{storeInfo?.settings?.accountNo}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5">
                <Info className="w-24 h-24 text-blue-500" />
              </div>
              <p className="text-xs text-blue-700 leading-relaxed font-bold relative z-10">
                Vui lòng thanh toán và giữ màn hình này để đối soát khi nhận hàng tại quầy. Hệ thống đã thông báo cho nhân viên.
              </p>
            </div>

            <Button variant="outline" className="w-full h-14 rounded-2xl font-bold border-slate-200 hover:bg-slate-50 transition-all" onClick={() => setOrderComplete(false)}>
              <ArrowLeft className="mr-2 h-5 w-5" /> {t("pos.menu.backToMenu", "Quay lại Menu")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
