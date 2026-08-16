import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('customer_token') || null,
  customer: JSON.parse(localStorage.getItem('customer_profile')) || null,
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
