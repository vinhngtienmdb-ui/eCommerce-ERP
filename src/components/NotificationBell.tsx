import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { Bell } from 'lucide-react';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="relative">
      <button onClick={() => setShowDropdown(!showDropdown)} className="p-2 rounded-full hover:bg-muted">
        <Bell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-destructive rounded-full" />
        )}
      </button>
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg p-4 z-50">
          <h3 className="font-bold mb-2">Notifications</h3>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No new notifications</p>
          ) : (
            notifications.map(n => (
              <div key={n.id} className="mb-2 border-b border-border pb-2">
                <p className="font-semibold">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
