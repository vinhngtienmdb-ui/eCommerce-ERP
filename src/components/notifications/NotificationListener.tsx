import { useEffect } from "react";
import { db } from "@/src/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { toast } from "sonner";
import { Bell } from "lucide-react";

export function NotificationListener() {
  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const notification = change.doc.data();
          const notificationId = change.doc.id;
          const lastShownId = localStorage.getItem("lastNotificationId");

          if (notificationId !== lastShownId) {
            toast.info(notification.title || "Thông báo mới", {
              description: notification.message,
              icon: <Bell className="h-5 w-5" />,
            });
            localStorage.setItem("lastNotificationId", notificationId);
          }
        }
      });
    });

    return () => unsubscribe();
  }, []);

  return null;
}
