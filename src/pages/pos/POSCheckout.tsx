import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Search, ShoppingCart, Plus, Minus, Wallet, User, Loader2, ScanLine, Info, QrCode } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { toast } from "sonner";
import { db, auth } from "@/src/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, doc, query, where, limit, onSnapshot, getDoc } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors";

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
  const [storeConfig, setStoreConfig] = useState(STORE_CONFIG);

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
    if (selectedCustomer && (selectedCustomer.walletBalance || 0) < total) {
      toast.error(t("pos.insufficientFunds", "Số dư ví không đủ"));
      return;
    }

    setIsProcessing(true);
    try {
      const ordersPath = branchId 
        ? `stores/${storeId}/branches/${branchId}/orders` 
        : `stores/${storeId}/orders`;

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
        total,
        platformFee,
        pointsEarned,
        storeCredit,
        customerId: selectedCustomer?.id || null,
        customerName: selectedCustomer?.name || "Khách vãng lai",
        status: "completed",
        createdAt: new Date().toISOString(),
        creatorId: auth.currentUser?.uid,
        storeId: storeId,
        branchId: branchId || null
      };
      await addDoc(collection(db, ordersPath), orderData);

      // 2. Update Customer (if selected)
      if (selectedCustomer) {
        const customerRef = doc(db, "customers", selectedCustomer.id);
        await updateDoc(customerRef, {
          walletBalance: (selectedCustomer.walletBalance || 0) - total,
          pointsBalance: (selectedCustomer.pointsBalance || 0) - pointsToUse + pointsEarned,
          totalSpent: (selectedCustomer.totalSpent || 0) + total,
          totalOrders: (selectedCustomer.totalOrders || 0) + 1,
          lastOrder: new Date().toISOString()
        });
      }

      toast.success(t("pos.paymentSuccess", "Thanh toán thành công"));
      
      // Reset state
      setCart([]);
      setSelectedCustomer(null);
      setCustomerPhone("");
      setPointsToUse(0);
    } catch (error) {
      const ordersPath = branchId 
        ? `stores/${storeId}/branches/${branchId}/orders` 
        : `stores/${storeId}/orders`;
      handleFirestoreError(error, OperationType.WRITE, ordersPath);
    } finally {
      setIsProcessing(false);
    }
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
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" /> {t("pos.customer")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder={t("pos.searchCustomer")}
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchCustomer()}
              />
              <Button onClick={searchCustomer} variant="secondary">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
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
              <div className="flex items-center gap-2 text-sm">
                <Input
                  type="number"
                  placeholder={t("pos.pointsToUse")}
                  value={pointsToUse || ""}
                  onChange={(e) => setPointsToUse(Math.min(Number(e.target.value), selectedCustomer.pointsBalance, subtotal))}
                  className="h-8"
                  max={Math.min(selectedCustomer.pointsBalance, subtotal)}
                />
                <span className="text-muted-foreground whitespace-nowrap">
                  - {pointsToUse.toLocaleString()}đ
                </span>
              </div>
            )}

            <div className="pt-3 border-t flex justify-between font-bold text-lg">
              <span>{t("pos.total")}</span>
              <span className="text-primary">{total.toLocaleString()}đ</span>
            </div>

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
                disabled={cart.length === 0 || isProcessing}
                onClick={handlePayment}
              >
                <Wallet className="mr-2 h-5 w-5" />
                {t("pos.payWithWallet", "Ví App")}
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

            {showPaymentQR && (
              <div className="mt-4 p-4 bg-white rounded-2xl border-2 border-dashed border-primary/20 flex flex-col items-center gap-3 animate-in zoom-in-95 duration-300">
                <div className="bg-slate-100 p-3 rounded-xl">
                  <QrCode className="h-32 w-32 text-slate-800" />
                </div>
                <p className="text-[10px] font-bold text-center text-muted-foreground uppercase tracking-widest">
                  {t("pos.scanToPay", "Khách quét mã để thanh toán")}
                </p>
                <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setShowPaymentQR(false)}>
                  {t("common.cancel")}
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
