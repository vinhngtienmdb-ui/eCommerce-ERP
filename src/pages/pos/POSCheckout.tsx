import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Search, ShoppingCart, Plus, Minus, Wallet, User, Loader2, ScanLine, Info, QrCode, Printer, CreditCard, Smartphone, AppWindow, DollarSign, Layout, Bell, Check, X, Globe, Clock, MapPin, Trash2, BellOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import { db, auth } from "@/src/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, doc, query, where, limit, onSnapshot, getDoc, increment, serverTimestamp, deleteDoc } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors";
import { format } from "date-fns";
import { cn } from "@/src/lib/utils";

const STORE_CONFIG = {
  id: "s1",
  name: "Cửa hàng Quận 1",
  platformFeeRate: 0.05, // 5% fee
  pointsEarnRate: 0.01, // 1% cashback in points
};

export function POSCheckout({ storeId, branchId }: { storeId: string; branchId?: string }) {
  const { t } = useTranslation();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Array<{ product: any; quantity: number }>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [pointsToUse, setPointsToUse] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [showPaymentQR, setShowPaymentQR] = useState(false);
  const [storeConfig, setStoreConfig] = useState<any>(STORE_CONFIG);
  const [activeShift, setActiveShift] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "wallet" | "dealtot" | "vietqr" | "split">("cash");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // VietQR URL Generation
  const getVietQRUrl = () => {
    if (!storeConfig.bankId || !storeConfig.accountNo) return null;
    
    const bankId = storeConfig.bankId.toLowerCase();
    const accountNo = storeConfig.accountNo;
    const template = storeConfig.qrTemplate || "compact";
    const amount = total;
    const description = `Thanh toan don hang POS`;
    const accountName = encodeURIComponent(storeConfig.accountName || "");

    return `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${accountName}`;
  };
  const [splitAmounts, setSplitAmounts] = useState({ cash: 0, card: 0, wallet: 0, dealtot: 0, vietqr: 0 });
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [onlineOrders, setOnlineOrders] = useState<any[]>([]);
  const [showOnlineOrders, setShowOnlineOrders] = useState(false);

  useEffect(() => {
    if (!storeId) return;

    const ordersPath = branchId 
      ? `stores/${storeId}/branches/${branchId}/orders` 
      : `stores/${storeId}/orders`;

    const q = query(collection(db, ordersPath), where("status", "==", "new"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOnlineOrders(docs);
    });

    return () => unsubscribe();
  }, [storeId, branchId]);

  const acceptOnlineOrder = async (order: any) => {
    try {
      const ordersPath = branchId 
        ? `stores/${storeId}/branches/${branchId}/orders` 
        : `stores/${storeId}/orders`;
      
      await updateDoc(doc(db, ordersPath, order.id), {
        status: "processing",
        acceptedAt: serverTimestamp(),
        acceptedBy: auth.currentUser?.uid
      });
      
      // Load into cart for processing? Or just mark as processing.
      // Usually, staff will prepare then mark as completed.
      toast.success(t("pos.orders.orderAccepted", "Đã tiếp nhận đơn hàng"));
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  const completeOnlineOrder = async (order: any) => {
    try {
      const ordersPath = branchId 
        ? `stores/${storeId}/branches/${branchId}/orders` 
        : `stores/${storeId}/orders`;
      
      await updateDoc(doc(db, ordersPath, order.id), {
        status: "completed",
        completedAt: serverTimestamp()
      });
      
      toast.success(t("pos.orders.orderCompleted", "Đơn hàng đã hoàn thành"));
    } catch (error) {
      console.error("Error completing order:", error);
    }
  };

  const customerSearchRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        customerSearchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const simulateBarcodeScan = () => {
    if (!barcodeInput) return;
    const product = products.find(p => p.id === barcodeInput || p.productName.toLowerCase().includes(barcodeInput.toLowerCase()));
    if (product) {
      addToCart(product);
      toast.success(t("pos.barcodeScanned", { name: product.productName }));
      setBarcodeInput("");
    } else {
      toast.error(t("pos.productNotFound", "Không tìm thấy sản phẩm"));
    }
  };

  useEffect(() => {
    if (!auth.currentUser || !storeId) return;

    // Fetch store config
    const fetchStoreConfig = async () => {
      try {
        const docSnap = await getDoc(doc(db, "stores", storeId));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStoreConfig({
            ...STORE_CONFIG,
            id: storeId,
            name: data.name,
            bankId: data.settings?.bankId || "",
            accountNo: data.settings?.accountNo || "",
            accountName: data.settings?.accountName || "",
            qrTemplate: data.settings?.qrTemplate || "compact",
            ...(data.settings || {})
          });
        }
      } catch (error) {
        console.error("Error fetching store config:", error);
      }
    };
    fetchStoreConfig();

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
      setLoading(false);
    });

    return () => unsubscribe();
  }, [storeId, branchId]);

  useEffect(() => {
    if (!auth.currentUser || !storeId) return;

    const shiftsPath = branchId 
      ? `stores/${storeId}/branches/${branchId}/shifts` 
      : `stores/${storeId}/shifts`;

    const q = query(collection(db, shiftsPath), where("status", "==", "open"), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setActiveShift({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        setActiveShift(null);
      }
    });

    return () => unsubscribe();
  }, [storeId, branchId]);

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category || "General")))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.productName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || (p.category || "General") === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const searchCustomer = async () => {
    if (!customerPhone) return;
    try {
      const q = query(collection(db, "customers"), where("phone", "==", customerPhone), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setSelectedCustomer({ id: doc.id, ...doc.data() });
        setPointsToUse(0);
      } else {
        toast.error(t("pos.customerNotFound", "Không tìm thấy khách hàng"));
        setSelectedCustomer(null);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, "customers");
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price || item.product.suggestedPrice || 0) * item.quantity, 0);
  const discount = pointsToUse; // 1 point = 1 VND
  const total = Math.max(0, subtotal - discount);
  const platformFee = total * storeConfig.platformFeeRate;
  const pointsEarned = total * storeConfig.pointsEarnRate;
  const storeCredit = total - platformFee - pointsEarned;

  const handlePayment = async () => {
    if (cart.length === 0) return;
    if (!activeShift) {
      toast.error("Vui lòng mở ca làm việc trước khi thanh toán");
      return;
    }

    const totalToPay = total;
    let payments: any[] = [];

    if (paymentMethod === "split") {
      const splitTotal = Object.values(splitAmounts).reduce((a, b) => a + b, 0);
      if (Math.abs(splitTotal - totalToPay) > 1) {
        toast.error(`Tổng tiền thanh toán (${splitTotal.toLocaleString()}đ) phải bằng tổng hóa đơn (${totalToPay.toLocaleString()}đ)`);
        return;
      }
      payments = Object.entries(splitAmounts)
        .filter(([_, amount]) => amount > 0)
        .map(([method, amount]) => ({ method, amount }));
    } else {
      payments = [{ method: paymentMethod, amount: totalToPay }];
    }

    // Check wallet balance if wallet is used
    const walletPayment = payments.find(p => p.method === "wallet");
    if (walletPayment && selectedCustomer && (selectedCustomer.walletBalance || 0) < walletPayment.amount) {
      toast.error(t("pos.insufficientFunds", "Số dư ví không đủ"));
      return;
    }

    setIsProcessing(true);
    try {
      const ordersPath = branchId 
        ? `stores/${storeId}/branches/${branchId}/orders` 
        : `stores/${storeId}/orders`;

      const shiftsPath = branchId 
        ? `stores/${storeId}/branches/${branchId}/shifts` 
        : `stores/${storeId}/shifts`;

      // 1. Save Order
      const orderData = {
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.productName,
          price: item.product.price || item.product.suggestedPrice || 0,
          quantity: item.quantity
        })),
        subtotal,
        discount,
        pointsUsed: pointsToUse,
        total,
        platformFee,
        pointsEarned,
        storeCredit,
        customerId: selectedCustomer?.id || null,
        customerName: selectedCustomer?.name || "Khách vãng lai",
        status: "completed",
        paymentMethod,
        payments,
        shiftId: activeShift.id,
        createdAt: new Date().toISOString(),
        creatorId: auth.currentUser?.uid,
        storeId: storeId,
        branchId: branchId || null
      };
      const orderRef = await addDoc(collection(db, ordersPath), orderData);
      setLastOrder({ id: orderRef.id, ...orderData });

      // 2. Update Shift
      const shiftRef = doc(db, `${shiftsPath}/${activeShift.id}`);
      await updateDoc(shiftRef, {
        totalSales: increment(total),
        updatedAt: serverTimestamp()
      });

      // 3. Update Customer
      if (selectedCustomer) {
        const customerRef = doc(db, "customers", selectedCustomer.id);
        const updates: any = {
          pointsBalance: increment(-pointsToUse + pointsEarned),
          totalSpent: increment(total),
          totalOrders: increment(1),
          lastOrder: new Date().toISOString()
        };
        if (walletPayment) {
          updates.walletBalance = increment(-walletPayment.amount);
        }
        await updateDoc(customerRef, updates);
      }

      toast.success(t("pos.paymentSuccess", "Thanh toán thành công"));
      
      setShowPrintPreview(true);
      setCart([]);
      setSelectedCustomer(null);
      setCustomerPhone("");
      setPointsToUse(0);
      setShowPaymentQR(false);
      setSplitAmounts({ cash: 0, card: 0, wallet: 0, dealtot: 0, vietqr: 0 });
      setPaymentMethod("cash");
    } catch (error) {
      const ordersPath = branchId 
        ? `stores/${storeId}/branches/${branchId}/orders` 
        : `stores/${storeId}/orders`;
      handleFirestoreError(error, OperationType.WRITE, ordersPath);
    } finally {
      setIsProcessing(false);
    }
  };

  const PrintBill = ({ order }: { order: any }) => {
    if (!order) return null;
    return (
      <div className="bg-white p-8 text-slate-900 font-sans text-sm w-[350px] mx-auto rounded-2xl border border-slate-100 shadow-sm">
        <div className="text-center mb-6 space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">{storeConfig.name}</h2>
          <p className="text-xs font-medium text-slate-500">Địa chỉ cửa hàng</p>
          <p className="text-xs font-medium text-slate-500">SĐT: 0123456789</p>
        </div>
        
        <div className="border-y border-slate-100 border-dashed py-4 mb-6 space-y-2">
          <p className="flex justify-between text-xs font-medium text-slate-500"><span>HĐ số:</span> <span className="text-slate-900 font-bold">#{order.id.slice(-6).toUpperCase()}</span></p>
          <p className="flex justify-between text-xs font-medium text-slate-500"><span>Ngày:</span> <span className="text-slate-900 font-bold">{format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}</span></p>
          <p className="flex justify-between text-xs font-medium text-slate-500"><span>Thu ngân:</span> <span className="text-slate-900 font-bold">{activeShift?.staffName || "Admin"}</span></p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between font-bold text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 mb-3">
            <span className="w-1/2">Sản phẩm</span>
            <span className="w-1/4 text-center">SL</span>
            <span className="w-1/4 text-right">T.Tiền</span>
          </div>
          <div className="space-y-3">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-sm font-medium">
                <span className="w-1/2 truncate text-slate-700">{item.name}</span>
                <span className="w-1/4 text-center text-slate-500">{item.quantity}</span>
                <span className="w-1/4 text-right text-slate-900 font-bold">{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 border-dashed pt-4 space-y-3">
          <div className="space-y-1.5">
            <p className="flex justify-between text-sm font-medium text-slate-500"><span>Tạm tính:</span> <span className="text-slate-900 font-bold">{order.subtotal.toLocaleString()}đ</span></p>
            {order.discount > 0 && <p className="flex justify-between text-sm font-medium text-rose-500"><span>Giảm giá:</span> <span>-{order.discount.toLocaleString()}đ</span></p>}
            {order.pointsUsed > 0 && <p className="flex justify-between text-[11px] text-slate-400 font-medium italic"><span>(Dùng {order.pointsUsed.toLocaleString()} điểm)</span></p>}
          </div>
          
          <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
            <span className="font-bold text-slate-900 text-base uppercase tracking-tight">TỔNG CỘNG</span>
            <span className="text-2xl font-bold text-primary tracking-tight">{order.total.toLocaleString()}đ</span>
          </div>
          
          <div className="pt-4 border-t border-slate-100 border-dotted mt-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Hình thức thanh toán:</p>
            <div className="space-y-1.5">
              {order.payments?.map((p: any, idx: number) => (
                <p key={idx} className="flex justify-between text-xs font-bold text-slate-600">
                  <span>{p.method === 'cash' ? 'Tiền mặt' : p.method === 'card' ? 'Thẻ/CK' : p.method === 'vietqr' ? 'VietQR' : p.method === 'wallet' ? 'Ví App' : 'Dealtot'}:</span>
                  <span className="text-slate-900">{p.amount.toLocaleString()}đ</span>
                </p>
              ))}
            </div>
          </div>

          {order.pointsEarned > 0 && (
            <div className="pt-4 border-t border-slate-100 border-dotted mt-4 text-center">
              <Badge variant="outline" className="rounded-full bg-emerald-50 text-emerald-600 border-emerald-100 font-bold px-3 py-1 text-[10px] uppercase tracking-wider">
                +{order.pointsEarned.toLocaleString()} điểm tích lũy
              </Badge>
            </div>
          )}
        </div>

        <div className="mt-10 text-center space-y-2">
          <p className="text-sm font-bold text-slate-900">Cảm ơn Quý khách!</p>
          <p className="text-xs font-medium text-slate-500">Hẹn gặp lại Quý khách!</p>
          <div className="mt-8 flex justify-center opacity-20">
            <QrCode className="h-16 w-16" />
          </div>
        </div>

        <div className="mt-10 flex gap-3 no-print">
          <Button className="flex-1 rounded-xl font-bold h-12 bg-primary hover:bg-primary/90 text-white shadow-sm" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> In Bill
          </Button>
          <Button variant="outline" className="flex-1 rounded-xl font-bold h-12 border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => setShowPrintPreview(false)}>Đóng</Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="h-[calc(100vh-10rem)] flex gap-6">
      {/* Left: Products */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex-1">
          <div className="flex items-center gap-3 px-4 border-r border-slate-100">
            <Search className="h-5 w-5 text-slate-400" />
            <Input
              placeholder={t("pos.searchProduct", "Tìm kiếm sản phẩm...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 border-none bg-transparent focus-visible:ring-0 font-medium text-base placeholder:text-slate-400"
            />
          </div>
          
          <div className="flex items-center gap-3 px-4 border-r border-slate-100">
            <ScanLine className="h-5 w-5 text-slate-400" />
            <Input
              placeholder={t("pos.scanBarcode", "Quét mã...")}
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && simulateBarcodeScan()}
              className="w-32 h-10 border-none bg-transparent focus-visible:ring-0 font-medium text-sm placeholder:text-slate-400"
            />
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-lg hover:bg-slate-100 transition-colors relative"
                  onClick={() => setShowOnlineOrders(true)}
                >
                  <Globe className="h-5 w-5 text-slate-600" />
                  {onlineOrders.length > 0 && (
                    <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="rounded-lg font-medium border border-slate-200 bg-white text-slate-900 shadow-md">Đơn hàng Online ({onlineOrders.length})</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "rounded-full font-medium text-sm h-10 px-6 transition-all",
                selectedCategory === category ? "bg-primary text-primary-foreground shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              {category === "all" ? "Tất cả" : category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pb-12 pr-2 scrollbar-hide">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="group cursor-pointer border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
              onClick={() => addToCart(product)}
            >
              <CardContent className="p-0 flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-slate-50">
                  <img 
                    src={product.image || product.images?.[0]?.url || `https://picsum.photos/seed/${product.id}/400/400`} 
                    alt={product.productName} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 border border-slate-200 font-semibold px-2 py-0.5 rounded-lg text-[10px] shadow-sm">
                      {product.category || "General"}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 space-y-1 bg-white">
                  <p className="font-semibold text-slate-900 line-clamp-2 text-sm leading-tight min-h-[2.5rem]">{product.productName}</p>
                  <p className="text-primary font-bold text-xl tracking-tight">{(product.price || product.suggestedPrice || 0).toLocaleString()}đ</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

        <Card className="w-[450px] flex flex-col gap-0 overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-lg">
          {/* Customer Section */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{t("pos.customer")}</h3>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 hover:bg-primary/10 hover:text-primary transition-all bg-white" onClick={() => toast.info("Tính năng quét QR khách hàng đang được phát triển")}>
                      <ScanLine className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="rounded-lg font-medium border border-slate-200 bg-white text-slate-900 shadow-md">Quét QR khách hàng</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    ref={customerSearchRef}
                    placeholder={t("pos.searchCustomer")}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchCustomer()}
                    className="h-12 pl-12 rounded-xl bg-white border-slate-200 focus-visible:ring-primary/20 font-medium text-base placeholder:text-slate-400 shadow-sm"
                  />
                </div>
                <Button 
                  onClick={searchCustomer} 
                  className="h-12 w-12 p-0 rounded-xl bg-primary hover:bg-primary/90 text-white transition-all shadow-sm"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
              
              {selectedCustomer && (
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 relative group">
                  <button 
                    className="absolute -top-2 -right-2 h-8 w-8 bg-slate-100 text-slate-500 border border-slate-200 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all z-10 shadow-sm"
                    onClick={() => setSelectedCustomer(null)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="font-bold text-lg text-slate-900">{selectedCustomer.name}</span>
                      <span className="text-sm font-medium text-slate-500">{selectedCustomer.phone}</span>
                    </div>
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                      {selectedCustomer.name.charAt(0)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{t("pos.points")}</p>
                      <p className="font-bold text-emerald-600 text-xl">{selectedCustomer.pointsBalance.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{t("pos.wallet")}</p>
                      <p className="font-bold text-primary text-xl">{selectedCustomer.walletBalance.toLocaleString()}đ</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cart Section */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{t("pos.cart")}</h3>
              </div>
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-bold px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider">
                {cart.reduce((a, b) => a + b.quantity, 0)} items
              </Badge>
            </div>
            <div className="flex-1 overflow-y-auto px-6 scrollbar-hide">
              {cart.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-300 flex-col gap-6 py-16">
                  <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl">
                    <ShoppingCart className="h-16 w-16 opacity-10" />
                  </div>
                  <p className="font-bold text-lg text-slate-400">{t("pos.emptyCart")}</p>
                </div>
              ) : (
                <div className="space-y-6 py-6">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4 group">
                      <div className="h-16 w-16 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                        <img 
                          src={item.product.image || item.product.images?.[0]?.url || `https://picsum.photos/seed/${item.product.id}/100/100`} 
                          alt={item.product.productName} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 line-clamp-1 text-sm leading-tight mb-1">{item.product.productName}</p>
                        <p className="text-base font-bold text-primary tracking-tight">{(item.product.price || item.product.suggestedPrice || 0).toLocaleString()}đ</p>
                      </div>
                      <div className="flex items-center gap-0 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                        <button 
                          className="h-9 w-9 flex items-center justify-center hover:bg-slate-200 transition-colors disabled:opacity-30" 
                          onClick={() => updateQuantity(item.product.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center font-bold text-slate-900 text-sm">{item.quantity}</span>
                        <button 
                          className="h-9 w-9 flex items-center justify-center hover:bg-slate-200 transition-colors" 
                          onClick={() => updateQuantity(item.product.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button 
                        className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all rounded-xl"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Payment Summary */}
            <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>{t("pos.subtotal")}</span>
                  <span className="font-bold text-slate-900">{subtotal.toLocaleString()}đ</span>
                </div>
                
                {selectedCustomer && selectedCustomer.pointsBalance > 0 && (
                  <div className="space-y-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Dùng điểm tích lũy</span>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="h-auto p-0 text-[10px] font-bold text-primary hover:no-underline uppercase tracking-wider"
                        onClick={() => setPointsToUse(Math.min(selectedCustomer.pointsBalance, subtotal))}
                      >
                        Dùng tối đa
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <Input
                        type="number"
                        placeholder={t("pos.pointsToUse")}
                        value={pointsToUse || ""}
                        onChange={(e) => setPointsToUse(Math.min(Number(e.target.value), selectedCustomer.pointsBalance, subtotal))}
                        className="h-10 rounded-lg bg-slate-50 border-slate-100 font-bold text-slate-900 text-base focus-visible:ring-primary/20"
                        max={Math.min(selectedCustomer.pointsBalance, subtotal)}
                      />
                      <span className="text-emerald-600 font-bold whitespace-nowrap text-lg">
                        - {pointsToUse.toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
                <span className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-2">{t("pos.total")}</span>
                <span className="text-4xl font-bold text-primary tracking-tight leading-none">{total.toLocaleString()}đ</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "cash", icon: DollarSign, label: "Tiền mặt" },
                  { id: "card", icon: CreditCard, label: "Thẻ/CK" },
                  { id: "vietqr", icon: QrCode, label: "VietQR" },
                  { id: "wallet", icon: Smartphone, label: "Ví điện tử" }
                ].map((method) => (
                  <Button 
                    key={method.id}
                    variant={paymentMethod === method.id ? "default" : "outline"} 
                    className={cn(
                      "h-14 rounded-xl font-bold transition-all flex flex-col gap-0 border shadow-sm",
                      paymentMethod === method.id ? "bg-primary text-primary-foreground border-primary" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
                    )}
                    onClick={() => {
                      setPaymentMethod(method.id as any);
                      if (method.id === "vietqr") setShowPaymentQR(true);
                    }}
                  >
                    <method.icon className="h-4 w-4 mb-0.5" />
                    <span className="text-[10px] uppercase tracking-wider leading-none">{method.label}</span>
                  </Button>
                ))}
              </div>

              <div className="space-y-4 pt-2">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-16 rounded-xl text-lg uppercase tracking-wider transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none" 
                  disabled={cart.length === 0 || isProcessing || !activeShift}
                  onClick={handlePayment}
                >
                  {isProcessing ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <div className="flex items-center gap-3">
                      <Wallet className="h-6 w-6" />
                      <span>{t("pos.payNow", "Thanh toán")}</span>
                      <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-lg text-sm font-bold">{total.toLocaleString()}đ</span>
                    </div>
                  )}
                </Button>
                
                {!activeShift && (
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-rose-500 text-center font-bold uppercase tracking-wider text-[10px]">
                    Vui lòng mở ca làm việc để bán hàng
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Online Orders Dialog */}
      <Dialog open={showOnlineOrders} onOpenChange={setShowOnlineOrders}>
        <DialogContent className="sm:max-w-2xl rounded-2xl border-none shadow-2xl p-0 overflow-hidden bg-white">
          <div className="p-8 bg-slate-900 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-xl">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                {t("pos.onlineOrders", "Đơn hàng trực tuyến")}
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-slate-400 mt-2">
                {t("pos.onlineOrdersDesc", "Quản lý các đơn hàng khách đặt qua QR Code")}
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto space-y-4 p-6 bg-slate-50 scrollbar-hide">
            {onlineOrders.length === 0 ? (
              <div className="text-center py-20 text-slate-300 flex flex-col items-center gap-4">
                <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl">
                  <BellOff className="h-12 w-12 opacity-20" />
                </div>
                <p className="font-bold text-slate-400">{t("pos.noOnlineOrders", "Hiện không có đơn hàng mới")}</p>
              </div>
            ) : (
              onlineOrders.map((order) => (
                <Card key={order.id} className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <CardContent className="p-0">
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <div>
                        <p className="font-bold text-lg text-slate-900">#{order.id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">{order.customerName} - {order.customerPhone}</p>
                      </div>
                      <Badge className="rounded-lg bg-blue-50 text-blue-600 border-none font-bold px-3 py-1 text-[10px] uppercase tracking-wider">
                        {t("pos.status.new", "Mới")}
                      </Badge>
                    </div>
                    <div className="p-5 space-y-2 bg-white">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center font-medium text-sm">
                          <span className="text-slate-600">{item.quantity}x {item.name}</span>
                          <span className="text-slate-900 font-bold">{(item.price * item.quantity).toLocaleString()}đ</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <p className="font-bold text-2xl text-primary tracking-tight">{order.total.toLocaleString()}đ</p>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-10 rounded-xl font-bold text-xs text-rose-500 hover:bg-rose-50 transition-all" onClick={async () => {
                          const ordersPath = branchId ? `stores/${storeId}/branches/${branchId}/orders` : `stores/${storeId}/orders`;
                          await updateDoc(doc(db, ordersPath, order.id), { status: 'cancelled' });
                          toast.info("Đã hủy đơn hàng");
                        }}>
                          <X className="h-4 w-4 mr-2" /> {t("common.cancel")}
                        </Button>
                        <Button size="sm" className="h-10 rounded-xl font-bold text-xs bg-primary text-white hover:bg-primary/90 transition-all px-6" onClick={() => acceptOnlineOrder(order)}>
                          <Check className="h-4 w-4 mr-2" /> {t("pos.accept", "Tiếp nhận")}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment QR Dialog */}
      <Dialog open={showPaymentQR} onOpenChange={setShowPaymentQR}>
        <DialogContent className="sm:max-w-md rounded-2xl border-none shadow-2xl p-0 overflow-hidden bg-white">
          <div className="p-8 bg-slate-900 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-xl">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                Quét mã VietQR
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-10 flex flex-col items-center gap-8 bg-slate-50">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl">
              {getVietQRUrl() ? (
                <img src={getVietQRUrl()!} alt="VietQR" className="w-64 h-64 object-contain" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center text-slate-400 font-medium text-center px-4">
                  Vui lòng cấu hình tài khoản ngân hàng trong cài đặt
                </div>
              )}
            </div>
            <div className="text-center space-y-2">
              <p className="text-3xl font-bold text-primary tracking-tight">{total.toLocaleString()}đ</p>
              <p className="text-sm font-medium text-slate-500">Quét mã để thanh toán đơn hàng</p>
            </div>
            <Button 
              className="w-full h-14 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/20"
              onClick={() => setShowPaymentQR(false)}
            >
              Xác nhận đã chuyển
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Print Preview Dialog */}
      <Dialog open={showPrintPreview} onOpenChange={setShowPrintPreview}>
        <DialogContent className="sm:max-w-md rounded-2xl border-none shadow-2xl p-0 overflow-hidden bg-white">
          <div className="p-8 bg-slate-900 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-xl">
                  <Printer className="h-6 w-6 text-primary" />
                </div>
                Hóa đơn thanh toán
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-8 bg-slate-50 max-h-[70vh] overflow-y-auto scrollbar-hide">
            <PrintBill order={lastOrder} />
          </div>
        </DialogContent>
      </Dialog>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          .no-print { display: none !important; }
          .fixed.inset-0 { position: absolute; left: 0; top: 0; width: 100%; height: auto; background: white; visibility: visible; }
          .fixed.inset-0 * { visibility: visible; }
          @page { margin: 0; size: 80mm auto; }
        }
      `}} />
    </>
  );
}
