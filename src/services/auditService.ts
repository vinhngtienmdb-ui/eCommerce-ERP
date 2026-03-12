import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export interface AuditLogEntry {
  action: string;
  module: string;
  details?: string;
  status?: 'success' | 'warning' | 'danger';
}

export const logAction = async (entry: AuditLogEntry) => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, 'audit_logs'), {
      ...entry,
      userId: user.uid,
      userEmail: user.email,
      timestamp: serverTimestamp(),
      ipAddress: 'Client Side', // In a real app, this would be fetched or set by the server
    });
  } catch (error) {
    console.error('Failed to log action:', error);
  }
};
