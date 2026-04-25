import { useState, useEffect } from 'react';

export function useMenu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${apiUrl}/menu`);
        
        if (!response.ok) {
          throw new Error('Gagal mengambil data menu');
        }
        
        const data = await response.json();
        setMenu(data);
      } catch (err) {
        console.error('Error fetching menu:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  return { menu, loading, error };
}
