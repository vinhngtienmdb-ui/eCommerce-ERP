import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import { db } from "../../lib/firebase";
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, getDoc, where, limit, getDocs } from "firebase/firestore";
import { ShoppingCart, Plus, Minus, Send, Store, Coffee, Utensils, Sparkles, Package, User, Phone, QrCode, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
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
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);

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
                onClick={() => setShowCheckout(true)}
              >
                <Send className="h-4 w-4 mr-2" /> {t("pos.menu.checkout", "Thanh toán")}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{t("pos.menu.checkoutTitle", "Xác nhận đơn hàng")}</DialogTitle>
            <DialogDescription>
              {t("pos.menu.checkoutDesc", "Vui lòng nhập thông tin để chúng tôi phục vụ bạn tốt nhất")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-bold flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> {t("pos.menu.customerName", "Họ và tên")}
                </Label>
                <Input 
                  id="name" 
                  placeholder={t("pos.menu.namePlaceholder", "Nhập tên của bạn...")}
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-bold flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" /> {t("pos.menu.customerPhone", "Số điện thoại")}
                </Label>
                <Input 
                  id="phone" 
                  placeholder={t("pos.menu.phonePlaceholder", "Nhập số điện thoại...")}
                  value={customerInfo.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="rounded-xl h-12"
                />
                {isSearchingCustomer && <p className="text-[10px] text-primary animate-pulse">Đang tìm thông tin...</p>}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
              <h4 className="font-bold text-sm uppercase text-slate-500 tracking-wider">{t("pos.menu.orderSummary", "Tóm tắt đơn hàng")}</h4>
              <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-600">{item.quantity}x {item.productName}</span>
                    <span className="font-bold">{(item.price * item.quantity).toLocaleString()}đ</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold">{t("pos.menu.total", "Tổng cộng")}</span>
                <span className="text-xl font-black text-primary">{totalAmount.toLocaleString()}đ</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-sm uppercase text-slate-500 tracking-wider">{t("pos.menu.paymentMethod", "Phương thức thanh toán")}</h4>
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border-2 border-primary">
                <QrCode className="h-6 w-6 text-primary" />
                <div className="flex-1">
                  <p className="font-bold text-sm">VietQR (Chuyển khoản nhanh)</p>
                  <p className="text-[10px] text-slate-500">Quét mã QR để thanh toán an toàn</p>
                </div>
                <Badge className="bg-primary text-white">Mặc định</Badge>
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-start gap-2">
            <Button 
              className="w-full h-12 rounded-xl font-bold text-lg" 
              onClick={handlePlaceOrder}
              disabled={isOrdering}
            >
              {isOrdering ? <Loader2 className="h-5 w-5 animate-spin" /> : t("pos.menu.confirmOrder", "Xác nhận & Thanh toán")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success View */}
      <Dialog open={orderComplete} onOpenChange={setOrderComplete}>
        <DialogContent className="sm:max-w-md rounded-3xl text-center">
          <div className="py-8 space-y-6">
            <div className="flex justify-center">
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{t("pos.menu.orderSuccessTitle", "Đặt hàng thành công!")}</h2>
              <p className="text-slate-500 mt-2">Mã đơn hàng: <span className="font-bold text-primary">#{lastOrderInfo?.id?.slice(-6).toUpperCase()}</span></p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
              <p className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t("pos.menu.scanToPay", "Quét mã để thanh toán")}</p>
              <div className="bg-white p-4 rounded-2xl shadow-sm inline-block">
                {getVietQRUrl() ? (
                  <img 
                    src={getVietQRUrl()!} 
                    alt="VietQR" 
                    className="h-48 w-48 object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-48 w-48 flex items-center justify-center text-slate-300 italic text-xs">
                    Chưa cấu hình thanh toán
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold">{storeInfo?.settings?.accountName}</p>
                <p className="text-xs text-slate-500">{storeInfo?.settings?.bankId?.toUpperCase()} - {storeInfo?.settings?.accountNo}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-xs text-blue-700 leading-relaxed">
                Vui lòng thanh toán và giữ màn hình này để đối soát khi nhận hàng tại quầy. Hệ thống đã thông báo cho nhân viên.
              </p>
            </div>

            <Button variant="outline" className="w-full h-12 rounded-xl" onClick={() => setOrderComplete(false)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {t("pos.menu.backToMenu", "Quay lại Menu")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
