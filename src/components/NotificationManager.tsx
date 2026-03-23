import React, { useEffect } from "react";
import { collection, query, where, onSnapshot, limit, orderBy } from "firebase/firestore";
import { db, auth } from "@/src/lib/firebase";
import { toast } from "sonner";

export function NotificationManager() {
  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }

    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;

    // 1. Listen for new orders
    // We listen for orders created after the current time to avoid notifying for old orders
    const now = new Date().toISOString();
    
    // Global orders
    const ordersQuery = query(
      collection(db, "orders"),
      where("createdAt", ">", now),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const order = change.doc.data();
          showNotification("Đơn hàng mới!", `Đơn hàng #${change.doc.id.slice(-6)} vừa được tạo. Tổng: ${order.total.toLocaleString()}đ`);
          toast.success(`Đơn hàng mới: #${change.doc.id.slice(-6)}`);
        }
      });
    });

    // 2. Listen for low stock products
    const productsQuery = query(
      collection(db, "products"),
      where("stock", "<=", 5) // Hardcoded threshold for now, or we could check lowStockThreshold
    );

    const unsubscribeStock = onSnapshot(productsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified" || change.type === "added") {
          const product = change.doc.data();
          if (product.stock <= (product.lowStockThreshold || 5)) {
            showNotification("Cảnh báo kho hàng!", `Sản phẩm "${product.productName}" sắp hết hàng (Còn lại: ${product.stock})`);
            toast.warning(`Sắp hết hàng: ${product.productName} (${product.stock})`);
          }
        }
      });
    });

    return () => {
      unsubscribeOrders();
      unsubscribeStock();
    };
  }, [auth.currentUser]);

  const showNotification = (title: string, body: string) => {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/favicon.ico", // Adjust icon path if needed
      });
    }
  };

  return null; // This component doesn't render anything
}
