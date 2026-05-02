import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Phone, User, MapPin, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { Turnstile } from '@marsidev/react-turnstile';

export const OrderForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [turnstileToken, setTurnstileToken] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!turnstileToken) {
      setError('Mohon selesaikan verifikasi keamanan.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: formData,
          items: items,
          turnstileToken: turnstileToken
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengirim pesanan. Silakan coba lagi.');
      }

      const result = await response.json();
      console.log('Order submitted:', result);
      
      // Save to localStorage
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      orderHistory.push({
        hash: result.hash,
        date: new Date().toISOString(),
        total: result.total
      });
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
      
      setDone(true);
      setTimeout(() => {
        clearCart();
        onSuccess();
        navigate(`/orders/${result.hash}`);
      }, 2000);
    } catch (err) {
      console.error('Error submitting order:', err);
      setError(err.message);
      setTurnstileToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Pesanan Diterima!</h2>
        <p className="text-slate-500 max-w-xs mx-auto">
          Terima kasih telah memesan di Dapur Rempoah. Kami akan segera memproses pesanan Anda.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* ... (existing fields) ... */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Lengkap</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Budi Santoso"
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nomor WhatsApp</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              required
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Contoh: 08123456789"
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alamat Pengiriman</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
            <textarea
              required
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              placeholder="Masukkan alamat lengkap pengiriman..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* Turnstile Widget */}
      <div className="flex justify-center my-4">
        <Turnstile
          siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
          onSuccess={(token) => setTurnstileToken(token)}
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100 mt-8">
        <div className="flex justify-between items-center text-violet-900">
          <span className="font-semibold text-sm uppercase tracking-wider">Total Pesanan</span>
          <span className="text-xl font-bold">Rp {getTotal().toLocaleString('id-ID')}</span>
        </div>
      </div>

      <button
        disabled={loading}
        type="submit"
        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-violet-600 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Send size={18} />
            Konfirmasi Pesanan
          </>
        )}
      </button>
    </form>
  );
};
