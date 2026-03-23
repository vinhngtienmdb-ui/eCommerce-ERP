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

  const filteredProducts = products.filter((p) =>
    p.productName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="bg-white p-8 text-black font-mono text-sm w-[300px] mx-auto border-4 border-slate-900">
        <div className="text-center mb-4">
          <h2 className="text-xl font-black uppercase tracking-tighter">{storeConfig.name}</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Địa chỉ cửa hàng</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">SĐT: 0123456789</p>
        </div>
        <div className="border-t-2 border-b-2 border-slate-900 border-dashed py-3 mb-4 space-y-1">
          <p className="flex justify-between text-[10px] font-bold uppercase tracking-widest"><span>HĐ số:</span> <span>#{order.id.slice(-6).toUpperCase()}</span></p>
          <p className="flex justify-between text-[10px] font-bold uppercase tracking-widest"><span>Ngày:</span> <span>{format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}</span></p>
          <p className="flex justify-between text-[10px] font-bold uppercase tracking-widest"><span>Thu ngân:</span> <span>{activeShift?.staffName || "Admin"}</span></p>
        </div>
        <div className="mb-4">
          <div className="flex justify-between font-black uppercase text-[10px] tracking-widest border-b-2 border-slate-900 pb-1 mb-2">
            <span className="w-1/2">Sản phẩm</span>
            <span className="w-1/4 text-center">SL</span>
            <span className="w-1/4 text-right">T.Tiền</span>
          </div>
          {order.items.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between py-1 text-[11px] font-bold">
              <span className="w-1/2 truncate">{item.name}</span>
              <span className="w-1/4 text-center">{item.quantity}</span>
              <span className="w-1/4 text-right">{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="border-t-2 border-slate-900 border-dashed pt-3 space-y-1">
          <p className="flex justify-between text-[11px] font-bold"><span>Tạm tính:</span> <span>{order.subtotal.toLocaleString()}đ</span></p>
          {order.discount > 0 && <p className="flex justify-between text-[11px] font-bold text-rose-600"><span>Giảm giá:</span> <span>-{order.discount.toLocaleString()}đ</span></p>}
          {order.pointsUsed > 0 && <p className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-widest italic"><span>(Dùng {order.pointsUsed.toLocaleString()} điểm)</span></p>}
          <p className="flex justify-between font-black text-xl border-t-2 border-slate-900 pt-2 mt-2"><span>TỔNG:</span> <span>{order.total.toLocaleString()}đ</span></p>
          
          <div className="pt-3 border-t-2 border-slate-900 border-dotted mt-3">
            <p className="text-[10px] font-black uppercase tracking-widest mb-1">Thanh toán:</p>
            {order.payments?.map((p: any, idx: number) => (
              <p key={idx} className="flex justify-between text-[10px] font-bold uppercase tracking-widest italic text-slate-600">
                <span>{p.method === 'cash' ? 'Tiền mặt' : p.method === 'card' ? 'Thẻ/CK' : p.method === 'vietqr' ? 'VietQR' : p.method === 'wallet' ? 'Ví App' : 'Dealtot'}:</span>
                <span>{p.amount.toLocaleString()}đ</span>
              </p>
            ))}
          </div>
          {order.pointsEarned > 0 && (
            <div className="pt-3 border-t-2 border-slate-900 border-dotted mt-3 text-[10px] text-center font-bold uppercase tracking-widest text-emerald-600">
              <p>Điểm tích lũy mới: +{order.pointsEarned.toLocaleString()}</p>
            </div>
          )}
        </div>
        <div className="mt-8 text-center space-y-1">
          <p className="text-[11px] font-black uppercase tracking-widest">Cảm ơn Quý khách!</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Hẹn gặp lại!</p>
          <div className="mt-6 flex justify-center">
            <QrCode className="h-20 w-20 opacity-20" />
          </div>
        </div>
        <div className="mt-10 flex gap-2 no-print">
          <Button className="flex-1 rounded-none font-black uppercase tracking-widest h-12" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> In Bill
          </Button>
          <Button variant="outline" className="rounded-none font-bold uppercase tracking-widest h-12 border-2 border-slate-200" onClick={() => setShowPrintPreview(false)}>Đóng</Button>
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
        <div className="flex items-center gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-900" />
            <Input
              placeholder={t("pos.searchProduct", "Tìm kiếm sản phẩm theo tên hoặc mã...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 pl-12 rounded-none bg-white border-4 border-slate-900 text-base font-black uppercase tracking-tight placeholder:text-slate-300 focus-visible:ring-0 focus-visible:border-primary transition-colors shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
            />
          </div>
          
          <div className="flex items-center gap-3 bg-white p-1 rounded-none border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <div className="flex items-center gap-2 px-4 border-r-4 border-slate-900">
              <ScanLine className="h-5 w-5 text-slate-900" />
              <Input
                placeholder={t("pos.scanBarcode", "Quét mã...")}
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && simulateBarcodeScan()}
                className="w-32 h-10 border-none bg-transparent focus-visible:ring-0 font-black uppercase tracking-widest text-xs placeholder:text-slate-400"
              />
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-none hover:bg-slate-900 hover:text-white transition-colors relative"
                    onClick={() => setShowOnlineOrders(true)}
                  >
                    <Globe className="h-5 w-5" />
                    {onlineOrders.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-rose-500 rounded-none border-2 border-white"></span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="rounded-none font-black uppercase tracking-widest border-4 border-slate-900 bg-white text-slate-900 shadow-none">Đơn hàng Online ({onlineOrders.length})</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto pb-8 pr-2 scrollbar-hide">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="group cursor-pointer border-4 border-slate-900 rounded-none overflow-hidden bg-white hover:bg-slate-50 transition-colors shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
              onClick={() => addToCart(product)}
            >
              <CardContent className="p-0 flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-slate-100 border-b-4 border-slate-900">
                  <img 
                    src={product.image || product.images?.[0]?.url || `https://picsum.photos/seed/${product.id}/400/400`} 
                    alt={product.productName} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-slate-900 text-white border-2 border-white font-black uppercase tracking-widest px-2 py-0.5 rounded-none text-[8px]">
                      {product.category || "General"}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <p className="font-black text-slate-900 line-clamp-1 text-xs uppercase tracking-tight">{product.productName}</p>
                  <p className="text-primary font-black text-xl tracking-tighter">{(product.price || product.suggestedPrice || 0).toLocaleString()}đ</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

        <Card className="w-[450px] flex flex-col gap-0 overflow-hidden border-4 border-slate-900 rounded-none bg-white shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
          {/* Customer Section */}
          <div className="p-6 border-b-4 border-slate-900 bg-slate-50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 rounded-none border-2 border-slate-900">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">{t("pos.customer")}</h3>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-none border-4 border-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none" onClick={() => toast.info("Tính năng quét QR khách hàng đang được phát triển")}>
                      <ScanLine className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="rounded-none font-black uppercase tracking-widest border-4 border-slate-900 bg-white text-slate-900 shadow-none">Quét QR khách hàng</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-900" />
                  <Input
                    ref={customerSearchRef}
                    placeholder={t("pos.searchCustomer")}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchCustomer()}
                    className="h-14 pl-12 rounded-none bg-white border-4 border-slate-900 focus-visible:ring-0 focus-visible:border-primary font-black uppercase tracking-tight text-sm placeholder:text-slate-300"
                  />
                </div>
                <Button 
                  onClick={searchCustomer} 
                  className="h-14 w-14 p-0 rounded-none bg-slate-900 hover:bg-slate-800 text-white border-4 border-slate-900 transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  <Search className="h-6 w-6" />
                </Button>
              </div>
              
              {selectedCustomer && (
                <div className="bg-white p-5 rounded-none border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-4 relative group">
                  <button 
                    className="absolute -top-3 -right-3 h-8 w-8 bg-rose-500 text-white border-4 border-slate-900 rounded-none flex items-center justify-center hover:bg-rose-600 transition-colors z-10"
                    onClick={() => setSelectedCustomer(null)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="font-black text-lg text-slate-900 uppercase tracking-tight">{selectedCustomer.name}</span>
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{selectedCustomer.phone}</span>
                    </div>
                    <div className="h-14 w-14 rounded-none bg-slate-900 border-4 border-slate-900 flex items-center justify-center text-white font-black text-2xl">
                      {selectedCustomer.name.charAt(0)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-none border-2 border-slate-900">
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">{t("pos.points")}</p>
                      <p className="font-black text-emerald-600 text-base tracking-tighter">{selectedCustomer.pointsBalance.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-none border-2 border-slate-900">
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">{t("pos.wallet")}</p>
                      <p className="font-black text-primary text-base tracking-tighter">{selectedCustomer.walletBalance.toLocaleString()}đ</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cart Section */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className="p-6 pb-4 flex items-center justify-between border-b-4 border-slate-900">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 rounded-none border-2 border-slate-900">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">{t("pos.cart")}</h3>
              </div>
              <Badge className="bg-slate-900 text-white border-none font-black px-3 py-1 rounded-none text-[10px] uppercase tracking-widest">
                {cart.reduce((a, b) => a + b.quantity, 0)} items
              </Badge>
            </div>
            <div className="flex-1 overflow-y-auto px-6 scrollbar-hide bg-slate-50/30">
              {cart.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-300 flex-col gap-6 py-20">
                  <div className="p-8 border-4 border-dashed border-slate-200 rounded-none">
                    <ShoppingCart className="h-20 w-20 opacity-20" />
                  </div>
                  <p className="font-black text-lg uppercase tracking-widest opacity-30">{t("pos.emptyCart")}</p>
                </div>
              ) : (
                <div className="space-y-6 py-6">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4 group">
                      <div className="h-16 w-16 rounded-none overflow-hidden bg-white flex-shrink-0 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                        <img 
                          src={item.product.image || item.product.images?.[0]?.url || `https://picsum.photos/seed/${item.product.id}/100/100`} 
                          alt={item.product.productName} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-slate-900 line-clamp-1 text-xs uppercase tracking-tight">{item.product.productName}</p>
                        <p className="text-sm font-black text-primary tracking-tighter">{(item.product.price || item.product.suggestedPrice || 0).toLocaleString()}đ</p>
                      </div>
                      <div className="flex items-center gap-0 bg-white border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                        <button 
                          className="h-10 w-10 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors border-r-4 border-slate-900 disabled:opacity-30" 
                          onClick={() => updateQuantity(item.product.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-black text-slate-900 text-sm">{item.quantity}</span>
                        <button 
                          className="h-10 w-10 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors border-l-4 border-slate-900" 
                          onClick={() => updateQuantity(item.product.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button 
                        className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
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
            <div className="p-8 bg-slate-50 border-t-4 border-slate-900 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-black text-slate-500 uppercase tracking-widest">
                  <span>{t("pos.subtotal")}</span>
                  <span>{subtotal.toLocaleString()}đ</span>
                </div>
                
                {selectedCustomer && selectedCustomer.pointsBalance > 0 && (
                  <div className="space-y-3 p-4 bg-white rounded-none border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Dùng điểm tích lũy</span>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="h-auto p-0 text-[10px] font-black text-primary hover:no-underline uppercase tracking-widest"
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
                        className="h-10 rounded-none bg-slate-50 border-2 border-slate-900 font-black text-slate-900 text-sm focus-visible:ring-0 focus-visible:border-primary"
                        max={Math.min(selectedCustomer.pointsBalance, subtotal)}
                      />
                      <span className="text-emerald-600 font-black whitespace-nowrap text-base tracking-tighter">
                        - {pointsToUse.toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t-4 border-slate-900 flex justify-between items-end">
                <span className="font-black text-slate-900 text-xs uppercase tracking-widest mb-2">{t("pos.total")}</span>
                <span className="text-4xl font-black text-primary tracking-tighter">{total.toLocaleString()}đ</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                      "h-14 rounded-none font-black transition-all flex flex-col gap-0 border-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                      paymentMethod === method.id ? "bg-slate-900 border-slate-900 text-white shadow-none translate-x-[2px] translate-y-[2px]" : "bg-white hover:bg-slate-50 border-slate-900 text-slate-900"
                    )}
                    onClick={() => {
                      setPaymentMethod(method.id as any);
                      if (method.id === "vietqr") setShowPaymentQR(true);
                    }}
                  >
                    <method.icon className="h-5 w-5 mb-1" />
                    <span className="text-[10px] uppercase tracking-widest leading-none">{method.label}</span>
                  </Button>
                ))}
              </div>

              <div className="space-y-4 pt-2">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-black h-20 rounded-none text-xl uppercase tracking-widest transition-all border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0" 
                  disabled={cart.length === 0 || isProcessing || !activeShift}
                  onClick={handlePayment}
                >
                  {isProcessing ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-3">
                        <Wallet className="h-6 w-6" />
                        <span>{t("pos.payNow", "Thanh toán ngay")}</span>
                      </div>
                      <span className="text-xs font-bold opacity-80 tracking-tighter mt-1">{total.toLocaleString()}đ</span>
                    </div>
                  )}
                </Button>
                
                {!activeShift && (
                  <div className="p-3 bg-rose-50 border-4 border-rose-500 text-rose-500 text-center font-black uppercase tracking-widest text-[10px]">
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
        <DialogContent className="sm:max-w-2xl rounded-none border-4 border-slate-900 shadow-none p-0 overflow-hidden">
          <div className="p-8 bg-slate-900 text-white">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
                <Bell className="h-8 w-8 text-primary" /> {t("pos.onlineOrders", "Đơn hàng trực tuyến")}
              </DialogTitle>
              <DialogDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
                {t("pos.onlineOrdersDesc", "Quản lý các đơn hàng khách đặt qua QR Code")}
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto space-y-6 p-8 bg-slate-50 scrollbar-hide">
            {onlineOrders.length === 0 ? (
              <div className="text-center py-20 text-slate-300 flex flex-col items-center gap-6">
                <div className="p-8 border-4 border-dashed border-slate-200 rounded-none">
                  <BellOff className="h-16 w-16 opacity-20" />
                </div>
                <p className="font-black uppercase tracking-widest text-lg opacity-30">{t("pos.noOnlineOrders", "Hiện không có đơn hàng mới")}</p>
              </div>
            ) : (
              onlineOrders.map((order) => (
                <Card key={order.id} className="border-4 border-slate-900 rounded-none bg-white shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6 border-b-4 border-slate-900 flex justify-between items-center bg-slate-50">
                      <div>
                        <p className="font-black text-2xl uppercase tracking-tighter text-slate-900">#{order.id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{order.customerName} - {order.customerPhone}</p>
                      </div>
                      <Badge className="rounded-none border-4 border-slate-900 bg-blue-500 text-white font-black uppercase tracking-widest text-xs px-4 py-1.5">
                        {t("pos.status.new", "Mới")}
                      </Badge>
                    </div>
                    <div className="p-6 space-y-3 bg-white">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center font-black uppercase tracking-tight text-sm">
                          <span className="text-slate-600">{item.quantity}x {item.name}</span>
                          <span className="text-slate-900">{(item.price * item.quantity).toLocaleString()}đ</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-6 border-t-4 border-slate-900 bg-slate-50 flex items-center justify-between">
                      <p className="font-black text-3xl text-primary tracking-tighter">{order.total.toLocaleString()}đ</p>
                      <div className="flex gap-3">
                        <Button variant="outline" size="lg" className="h-12 rounded-none font-black uppercase tracking-widest text-xs border-4 border-slate-900 hover:bg-rose-500 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none" onClick={async () => {
                          const ordersPath = branchId ? `stores/${storeId}/branches/${branchId}/orders` : `stores/${storeId}/orders`;
                          await updateDoc(doc(db, ordersPath, order.id), { status: 'cancelled' });
                          toast.info("Đã hủy đơn hàng");
                        }}>
                          <X className="h-4 w-4 mr-2" /> {t("common.cancel")}
                        </Button>
                        <Button size="lg" className="h-12 rounded-none font-black uppercase tracking-widest text-xs border-4 border-slate-900 bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none px-8" onClick={() => acceptOnlineOrder(order)}>
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
