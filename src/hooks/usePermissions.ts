import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export interface UserPermissions {
  role: string;
  permissions: {
    [module: string]: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
      approve: boolean;
    };
  };
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const unsubscribeDoc = onSnapshot(doc(db, 'user_roles', user.uid), (docSnap) => {
          if (docSnap.exists()) {
            setPermissions(docSnap.data() as UserPermissions);
          } else {
            // Default permissions for new users or if not set
            setPermissions({
              role: 'user',
              permissions: {}
            });
          }
          setLoading(false);
        });
        return () => unsubscribeDoc();
      } else {
        setPermissions(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const hasPermission = (module: string, action: 'view' | 'create' | 'edit' | 'delete' | 'approve') => {
    if (!permissions) return false;
    if (permissions.role === 'admin') return true;
    return permissions.permissions[module]?.[action] || false;
  };

  return { permissions, loading, hasPermission, isAdmin: permissions?.role === 'admin' };
}
