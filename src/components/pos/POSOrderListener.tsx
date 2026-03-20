import React, { useEffect, useRef } from "react";
import { db } from "@/src/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { toast } from "sonner";
import { Printer } from "lucide-react";

export function POSOrderListener() {
  const printQueue = useRef<any[]>([]);
  const isPrinting = useRef(false);

  const processQueue = async () => {
    if (isPrinting.current || printQueue.current.length === 0) return;

    isPrinting.current = true;
    const order = printQueue.current.shift();

    toast.success("Đang in đơn hàng mới!", {
      description: `Tổng tiền: ${order.total.toLocaleString()}đ`,
      icon: <Printer className="h-5 w-5" />,
    });

    // Trigger print
    window.print();

    // Small delay to allow the print dialog to open/close
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    isPrinting.current = false;
    processQueue();
  };

  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const order = change.doc.data();
          const createdAt = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
          
          if (Date.now() - createdAt.getTime() < 10000) {
            printQueue.current.push(order);
            processQueue();
          }
        }
      });
    });

    return () => unsubscribe();
  }, []);

  return null;
}
