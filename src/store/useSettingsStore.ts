import { create } from 'zustand';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { logAction } from '../services/auditService';

interface SettingsState {
  settings: any;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (path: string, value: any) => Promise<void>;
  saveAllSettings: (newSettings: any) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: {},
  loading: true,
  error: null,

  fetchSettings: async () => {
    set({ loading: true });
    try {
      const docRef = doc(db, 'settings', 'global');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        set({ settings: docSnap.data(), loading: false });
      } else {
        // Initialize with empty if not exists
        set({ settings: {}, loading: false });
      }

      // Subscribe to real-time updates
      onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          set({ settings: snapshot.data() });
        }
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  updateSettings: async (path: string, value: any) => {
    const currentSettings = get().settings;
    const keys = path.split('.');
    let updated = { ...currentSettings };
    let current = updated;

    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    try {
      await setDoc(doc(db, 'settings', 'global'), updated);
      await logAction({
        action: 'Update Setting',
        module: 'Settings',
        details: `Updated ${path}`,
        status: 'success'
      });
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  saveAllSettings: async (newSettings: any) => {
    try {
      await setDoc(doc(db, 'settings', 'global'), newSettings);
      await logAction({
        action: 'Update All Settings',
        module: 'Settings',
        details: 'Batch update of global settings',
        status: 'success'
      });
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  }
}));
