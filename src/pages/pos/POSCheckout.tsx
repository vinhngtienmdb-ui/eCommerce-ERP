import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Search, ShoppingCart, Plus, Minus, Wallet, User, Loader2, ScanLine, Info, QrCode, Printer, CreditCard, Smartphone, AppWindow, DollarSign, Layout, Bell, Check, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import { db, auth } from "@/src/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, doc, query, where, limit, onSnapshot, getDoc, increment, serverTimestamp, deleteDoc } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors";
import { format } from "date-fns";

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
      <div className="bg-white p-8 text-black font-mono text-sm w-[300px] mx-auto shadow-2xl border">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold uppercase">{storeConfig.name}</h2>
          <p className="text-xs">Địa chỉ cửa hàng</p>
          <p className="text-xs">SĐT: 0123456789</p>
        </div>
        <div className="border-t border-b border-dashed py-2 mb-4">
          <p className="flex justify-between"><span>HĐ số:</span> <span>#{order.id.slice(-6).toUpperCase()}</span></p>
          <p className="flex justify-between"><span>Ngày:</span> <span>{format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}</span></p>
          <p className="flex justify-between"><span>Thu ngân:</span> <span>{activeShift?.staffName || "Admin"}</span></p>
        </div>
        <div className="mb-4">
          <div className="flex justify-between font-bold border-b pb-1 mb-1">
            <span className="w-1/2">Sản phẩm</span>
            <span className="w-1/4 text-center">SL</span>
            <span className="w-1/4 text-right">T.Tiền</span>
          </div>
          {order.items.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between py-1">
              <span className="w-1/2 truncate">{item.name}</span>
              <span className="w-1/4 text-center">{item.quantity}</span>
              <span className="w-1/4 text-right">{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-dashed pt-2 space-y-1">
          <p className="flex justify-between"><span>Tạm tính:</span> <span>{order.subtotal.toLocaleString()}đ</span></p>
          {order.discount > 0 && <p className="flex justify-between"><span>Giảm giá:</span> <span>-{order.discount.toLocaleString()}đ</span></p>}
          {order.pointsUsed > 0 && <p className="flex justify-between text-xs text-muted-foreground italic"><span>(Dùng {order.pointsUsed.toLocaleString()} điểm)</span></p>}
          <p className="flex justify-between font-bold text-lg"><span>TỔNG CỘNG:</span> <span>{order.total.toLocaleString()}đ</span></p>
          
          <div className="pt-2 border-t border-dotted mt-2">
            <p className="text-[10px] font-bold uppercase mb-1">Thanh toán:</p>
            {order.payments?.map((p: any, idx: number) => (
              <p key={idx} className="flex justify-between text-xs italic">
                <span>{p.method === 'cash' ? 'Tiền mặt' : p.method === 'card' ? 'Thẻ/CK' : p.method === 'vietqr' ? 'VietQR' : p.method === 'wallet' ? 'Ví App' : 'Dealtot'}:</span>
                <span>{p.amount.toLocaleString()}đ</span>
              </p>
            ))}
          </div>
          {order.pointsEarned > 0 && (
            <div className="pt-2 border-t border-dotted mt-2 text-[10px] text-center">
              <p>Điểm tích lũy mới: +{order.pointsEarned.toLocaleString()}</p>
            </div>
          )}
        </div>
        <div className="mt-6 text-center text-xs">
          <p>Cảm ơn Quý khách!</p>
          <p>Hẹn gặp lại!</p>
          <div className="mt-4 flex justify-center">
            <QrCode className="h-16 w-16 opacity-50" />
          </div>
        </div>
        <div className="mt-8 flex gap-2 no-print">
          <Button className="flex-1" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> In Bill
          </Button>
          <Button variant="outline" onClick={() => setShowPrintPreview(false)}>Đóng</Button>
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
    <div className="h-[calc(100vh-10rem)] flex gap-6">
      {/* Left: Products */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("pos.searchProduct", "Tìm kiếm sản phẩm...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
            <Input
              placeholder={t("pos.scanBarcode", "Quét mã vạch...")}
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && simulateBarcodeScan()}
              className="w-40 h-9 border-none bg-transparent focus-visible:ring-0"
            />
            <Button size="sm" variant="ghost" onClick={simulateBarcodeScan}>
              <ScanLine className="h-4 w-4" />
            </Button>
          </div>

          <Button 
            variant="outline" 
            className="relative h-9 rounded-lg border-primary/20 hover:bg-primary/5"
            onClick={() => setShowOnlineOrders(true)}
          >
            <Bell className="h-4 w-4 mr-2" />
            {t("pos.onlineOrders", "Đơn Online")}
            {onlineOrders.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 animate-pulse">
                {onlineOrders.length}
              </Badge>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pb-4">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="group cursor-pointer hover:border-primary transition-all hover:shadow-lg rounded-2xl overflow-hidden border-white/20 bg-white/50 backdrop-blur-sm"
              onClick={() => addToCart(product)}
            >
              <CardContent className="p-0 flex flex-col">
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={product.image || product.images?.[0]?.url || `https://picsum.photos/seed/${product.id}/400/400`} 
                    alt={product.productName} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute top-2 right-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="font-bold mb-1">{product.productName}</p>
                          <p className="text-xs">{product.description || t("pos.noDescription", "Chưa có mô tả sản phẩm")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <p className="font-bold line-clamp-1 text-sm">{product.productName}</p>
                  <p className="text-primary font-black text-lg">{(product.price || product.suggestedPrice || 0).toLocaleString()}đ</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Right: Cart & Payment */}
      <div className="w-96 flex flex-col gap-4">
        {/* Customer Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" /> {t("pos.customer")}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info("Tính năng quét QR khách hàng đang được phát triển")}>
                      <ScanLine className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Quét QR khách hàng</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                ref={customerSearchRef}
                placeholder={t("pos.searchCustomer")}
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchCustomer()}
              />
              <Button onClick={searchCustomer} variant="secondary">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground italic">Mẹo: Nhấn Ctrl+K để tìm nhanh khách hàng</p>
            
            {selectedCustomer && (
              <div className="bg-muted p-3 rounded-md space-y-2 text-sm">
                <div className="flex justify-between font-medium">
                  <span>{selectedCustomer.name}</span>
                  <span>{selectedCustomer.phone}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("pos.pointsBalance", { points: selectedCustomer.pointsBalance.toLocaleString() })}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("pos.walletBalance", { balance: selectedCustomer.walletBalance.toLocaleString() + 'đ' })}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cart Section */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" /> {t("pos.cart")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            {cart.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground flex-col gap-2">
                <ShoppingCart className="h-12 w-12 opacity-20" />
                <p>{t("pos.emptyCart")}</p>
              </div>
            ) : (
              <div className="divide-y">
                {cart.map((item) => (
                  <div key={item.product.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.product.productName}</p>
                      <p className="text-sm text-muted-foreground">{(item.product.price || item.product.suggestedPrice || 0).toLocaleString()}đ</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          
          {/* Payment Summary */}
          <div className="p-4 bg-muted/50 border-t space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("pos.subtotal")}</span>
              <span>{subtotal.toLocaleString()}đ</span>
            </div>
            
            {selectedCustomer && selectedCustomer.pointsBalance > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Dùng điểm (1đ = 1đ)</span>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="h-auto p-0 text-xs"
                    onClick={() => setPointsToUse(Math.min(selectedCustomer.pointsBalance, subtotal))}
                  >
                    Dùng tối đa
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Input
                    type="number"
                    placeholder={t("pos.pointsToUse")}
                    value={pointsToUse || ""}
                    onChange={(e) => setPointsToUse(Math.min(Number(e.target.value), selectedCustomer.pointsBalance, subtotal))}
                    className="h-8"
                    max={Math.min(selectedCustomer.pointsBalance, subtotal)}
                  />
                  <span className="text-primary font-bold whitespace-nowrap">
                    - {pointsToUse.toLocaleString()}đ
                  </span>
                </div>
              </div>
            )}

            <div className="pt-3 border-t flex justify-between font-bold text-lg">
              <span>{t("pos.total")}</span>
              <span className="text-primary">{total.toLocaleString()}đ</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button 
                variant={paymentMethod === "cash" ? "default" : "outline"} 
                size="sm" 
                className="h-9"
                onClick={() => setPaymentMethod("cash")}
              >
                <DollarSign className="mr-1 h-4 w-4" /> Tiền mặt
              </Button>
              <Button 
                variant={paymentMethod === "card" ? "default" : "outline"} 
                size="sm" 
                className="h-9"
                onClick={() => setPaymentMethod("card")}
              >
                <CreditCard className="mr-1 h-4 w-4" /> Thẻ/CK
              </Button>
              <Button 
                variant={paymentMethod === "vietqr" ? "default" : "outline"} 
                size="sm" 
                className="h-9"
                onClick={() => {
                  setPaymentMethod("vietqr");
                  setShowPaymentQR(true);
                }}
              >
                <QrCode className="mr-1 h-4 w-4" /> VietQR
              </Button>
              <Button 
                variant={paymentMethod === "wallet" ? "default" : "outline"} 
                size="sm" 
                className="h-9"
                onClick={() => setPaymentMethod("wallet")}
              >
                <Smartphone className="mr-1 h-4 w-4" /> Ví điện tử
              </Button>
              <Button 
                variant={paymentMethod === "dealtot" ? "default" : "outline"} 
                size="sm" 
                className="h-9"
                onClick={() => setPaymentMethod("dealtot")}
              >
                <AppWindow className="mr-1 h-4 w-4" /> App Dealtot
              </Button>
              <Button 
                variant={paymentMethod === "split" ? "default" : "outline"} 
                size="sm" 
                className="h-9 col-span-2"
                onClick={() => setPaymentMethod("split")}
              >
                <Layout className="mr-1 h-4 w-4" /> Thanh toán hỗn hợp (Split)
              </Button>
            </div>

            {paymentMethod === "split" && (
              <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 space-y-3 animate-in slide-in-from-top-2">
                <p className="text-xs font-bold text-primary uppercase">Nhập số tiền cho từng loại:</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Tiền mặt</label>
                    <Input 
                      type="number" 
                      className="h-8 text-xs" 
                      value={splitAmounts.cash || ""} 
                      onChange={(e) => setSplitAmounts(prev => ({ ...prev, cash: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Thẻ/CK</label>
                    <Input 
                      type="number" 
                      className="h-8 text-xs" 
                      value={splitAmounts.card || ""} 
                      onChange={(e) => setSplitAmounts(prev => ({ ...prev, card: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Ví App</label>
                    <Input 
                      type="number" 
                      className="h-8 text-xs" 
                      value={splitAmounts.wallet || ""} 
                      onChange={(e) => setSplitAmounts(prev => ({ ...prev, wallet: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">VietQR</label>
                    <Input 
                      type="number" 
                      className="h-8 text-xs" 
                      value={splitAmounts.vietqr || ""} 
                      onChange={(e) => {
                        setSplitAmounts(prev => ({ ...prev, vietqr: Number(e.target.value) }));
                        if (Number(e.target.value) > 0) setShowPaymentQR(true);
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Dealtot</label>
                    <Input 
                      type="number" 
                      className="h-8 text-xs" 
                      value={splitAmounts.dealtot || ""} 
                      onChange={(e) => setSplitAmounts(prev => ({ ...prev, dealtot: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-primary/10">
                  <span className="text-xs font-bold">Đã nhập:</span>
                  <span className={`text-sm font-bold ${Math.abs(Object.values(splitAmounts).reduce((a, b) => a + b, 0) - total) < 1 ? 'text-green-600' : 'text-red-500'}`}>
                    {Object.values(splitAmounts).reduce((a, b) => a + b, 0).toLocaleString()} / {total.toLocaleString()}đ
                  </span>
                </div>
              </div>
            )}

            {total > 0 && (
              <div className="text-xs text-muted-foreground space-y-1 pt-2">
                <div className="flex justify-between">
                  <span>{t("pos.platformFee", { rate: STORE_CONFIG.platformFeeRate * 100, fee: platformFee.toLocaleString() + 'đ' })}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>{t("pos.storeWalletCredit", { amount: storeCredit.toLocaleString() + 'đ' })}</span>
                </div>
                {selectedCustomer && (
                  <div className="flex justify-between text-blue-600">
                    <span>{t("pos.pointsEarned", { points: pointsEarned.toLocaleString() })}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/20" 
                size="lg" 
                disabled={cart.length === 0 || isProcessing || !activeShift}
                onClick={handlePayment}
              >
                <Wallet className="mr-2 h-5 w-5" />
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : t("pos.payNow", "Thanh toán")}
              </Button>
              <Button 
                variant="outline"
                className="h-12 w-12 rounded-xl border-primary/20 text-primary hover:bg-primary/5"
                disabled={cart.length === 0}
                onClick={() => setShowPaymentQR(true)}
              >
                <QrCode className="h-5 w-5" />
              </Button>
            </div>

            {!activeShift && (
              <p className="text-[10px] text-red-500 text-center font-bold uppercase mt-2">
                Vui lòng mở ca làm việc để bán hàng
              </p>
            )}

            {showPaymentQR && (
              <div className="mt-4 p-4 bg-white rounded-2xl border-2 border-dashed border-primary/20 flex flex-col items-center gap-3 animate-in zoom-in-95 duration-300">
                <div className="bg-slate-100 p-3 rounded-xl min-h-[160px] flex items-center justify-center">
                  {getVietQRUrl() ? (
                    <img 
                      src={getVietQRUrl()!} 
                      alt="VietQR Payment" 
                      className="h-48 w-48 object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <QrCode className="h-32 w-32 opacity-20" />
                      <p className="text-[10px] text-center">Chưa cấu hình tài khoản ngân hàng</p>
                    </div>
                  )}
                </div>
                {getVietQRUrl() && (
                  <>
                    <p className="text-[10px] font-bold text-center text-muted-foreground uppercase tracking-widest">
                      {t("pos.scanToPay", "Khách quét mã để thanh toán")}
                    </p>
                    <div className="text-center space-y-1">
                      <p className="text-xs font-bold">{storeConfig.accountName}</p>
                      <p className="text-[10px] text-muted-foreground">{storeConfig.bankId?.toUpperCase()} - {storeConfig.accountNo}</p>
                    </div>
                  </>
                )}
                <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setShowPaymentQR(false)}>
                  {t("common.cancel")}
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
      {/* Online Orders Dialog */}
      <Dialog open={showOnlineOrders} onOpenChange={setShowOnlineOrders}>
        <DialogContent className="sm:max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" /> {t("pos.onlineOrders", "Đơn hàng trực tuyến")}
            </DialogTitle>
            <DialogDescription>
              {t("pos.onlineOrdersDesc", "Quản lý các đơn hàng khách đặt qua QR Code")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto space-y-4 py-4">
            {onlineOrders.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <p>{t("pos.noOnlineOrders", "Hiện không có đơn hàng mới")}</p>
              </div>
            ) : (
              onlineOrders.map((order) => (
                <Card key={order.id} className="border-primary/10 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-lg">#{order.id.slice(-6).toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">{order.customerName} - {order.customerPhone}</p>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {t("pos.status.new", "Mới")}
                      </Badge>
                    </div>
                    <div className="space-y-1 mb-4">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.name}</span>
                          <span>{(item.price * item.quantity).toLocaleString()}đ</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <p className="font-bold text-primary">{order.total.toLocaleString()}đ</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600" onClick={async () => {
                          const ordersPath = branchId ? `stores/${storeId}/branches/${branchId}/orders` : `stores/${storeId}/orders`;
                          await updateDoc(doc(db, ordersPath, order.id), { status: 'cancelled' });
                          toast.info("Đã hủy đơn hàng");
                        }}>
                          <X className="h-4 w-4 mr-1" /> {t("common.cancel")}
                        </Button>
                        <Button size="sm" onClick={() => acceptOnlineOrder(order)}>
                          <Check className="h-4 w-4 mr-1" /> {t("pos.accept", "Tiếp nhận")}
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
    </div>
  );
}
