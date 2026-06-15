import { useState, useEffect } from 'react';
import staticMenu from '../data/menu.json';

export function useMenu() {
  const [menu, setMenu] = useState(staticMenu);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMenu() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${apiUrl}/menu`);

        if (!response.ok) {
          throw new Error('Gagal mengambil data menu');
        }

        const data = await response.json();
        if (!cancelled) {
          setMenu(data);
        }
      } catch (err) {
        console.error('Error refreshing menu:', err);
      }
    }

    fetchMenu();
    return () => { cancelled = true; };
  }, []);

  return { menu, loading, error };
}
