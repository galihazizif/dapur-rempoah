import { create } from 'zustand';

export const useSettingsStore = create((set) => ({
  settings: {
    store_status: 'open',
    store_message: ''
  },
  loading: true,
  error: null,
  fetchSettings: async () => {
    try {
      set({ loading: true, error: null });
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';
      const res = await fetch(`${apiUrl}/settings`);
      const data = await res.json();
      set({ settings: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  }
}));
