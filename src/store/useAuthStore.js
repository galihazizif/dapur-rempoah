import { create } from 'zustand'

function readLocal(key) {
  try {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export const useAuthStore = create((set) => ({
  token: readLocal('customer_token'),
  customer: JSON.parse(readLocal('customer_profile')) || null,
  setAuth: (token, customer) => {
    localStorage.setItem('customer_token', token);
    localStorage.setItem('customer_profile', JSON.stringify(customer));
    set({ token, customer });
  },
  logout: () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_profile');
    set({ token: null, customer: null });
  }
}))
