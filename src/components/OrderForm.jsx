import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Phone, User, MapPin, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { Turnstile } from '@marsidev/react-turnstile';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function LocationMarker({ position, setPosition, onPositionSelected }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      if (onPositionSelected) {
        onPositionSelected(e.latlng);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

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

  const [mapPosition, setMapPosition] = useState(null);

  const handlePositionSelected = (latlng) => {
    setMapPosition(latlng);
    const coordString = `(Koordinat Peta: ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)})`;

    setFormData(prev => {
      const currentAddress = prev.address || '';
      if (currentAddress.includes('(Koordinat Peta:')) {
        return {
          ...prev,
          address: currentAddress.replace(/\(Koordinat Peta: [-\d.]+, [-\d.]+\)/, coordString)
        };
      } else {
        return {
          ...prev,
          address: currentAddress ? `${currentAddress}\n${coordString}` : coordString
        };
      }
    });
  };

  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState(null);
  const [validatingVoucher, setValidatingVoucher] = useState(false);

  const handleApplyVoucher = async () => {
    if (!voucherInput.trim()) return;
    setValidatingVoucher(true);
    setVoucherError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/vouchers/${voucherInput.trim().toUpperCase()}`);
      if (!res.ok) {
        let msg = "Voucher tidak valid";
        try {
          const errData = await res.json();
          if (errData.message) msg = errData.message;
        } catch (e) { }
        throw new Error(msg);
      }
      const data = await res.json();
      setAppliedVoucher(data.voucher);
    } catch (err) {
      setVoucherError(err.message);
      setAppliedVoucher(null);
    } finally {
      setValidatingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherInput('');
    setVoucherError(null);
  };

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
          customer: {
            ...formData,
            latitude: mapPosition ? mapPosition.lat : null,
            longitude: mapPosition ? mapPosition.lng : null
          },
          items: items,
          turnstileToken: turnstileToken,
          voucherCode: appliedVoucher ? appliedVoucher.code : undefined
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
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none transition-all"
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
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none transition-all"
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
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Titik Lokasi Pengiriman (Opsional)</label>
          <div className="h-64 w-full rounded-xl overflow-hidden border border-slate-200 relative z-0">
            <MapContainer
              center={[-7.394801, 109.344261]}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%", zIndex: 0 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker
                position={mapPosition}
                setPosition={setMapPosition}
                onPositionSelected={handlePositionSelected}
              />
            </MapContainer>
          </div>
          {mapPosition && (
            <p className="text-xs text-slate-500 mt-2">
              Koordinat terpilih: {mapPosition.lat.toFixed(6)}, {mapPosition.lng.toFixed(6)}
            </p>
          )}
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

      {/* Voucher Section */}
      <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
        <label className="block text-sm font-semibold text-slate-700">Kode Promo / Voucher</label>
        {!appliedVoucher ? (
          <div className="flex gap-2 flex-wrap md:flex-row">
            <input
              type="text"
              value={voucherInput}
              onChange={(e) => setVoucherInput(e.target.value)}
              placeholder="Masukkan kode..."
              className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none transition-all uppercase"
            />
            <button
              type="button"
              onClick={handleApplyVoucher}
              disabled={validatingVoucher || !voucherInput.trim()}
              className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold disabled:opacity-50"
            >
              {validatingVoucher ? 'Cek..' : 'Gunakan'}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 px-4 py-3 rounded-xl">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" size={18} />
              <div>
                <p className="text-sm font-bold text-emerald-700">{appliedVoucher.code}</p>
                <p className="text-xs text-emerald-600">Diskon Rp {appliedVoucher.amount.toLocaleString('id-ID')}</p>
              </div>
            </div>
            <button type="button" onClick={handleRemoveVoucher} className="text-rose-500 hover:text-rose-600 text-sm font-bold">Batal</button>
          </div>
        )}
        {voucherError && <p className="text-xs text-rose-500 font-medium">{voucherError}</p>}
      </div>

      <div className="p-4 bg-lime-50 rounded-2xl border border-lime-100 mt-8 space-y-2">
        {appliedVoucher && (
          <div className="flex justify-between items-center text-slate-600 text-sm border-b border-lime-100/50 pb-2">
            <span>Subtotal</span>
            <span>Rp {getTotal().toLocaleString('id-ID')}</span>
          </div>
        )}
        {appliedVoucher && (
          <div className="flex justify-between items-center text-emerald-600 text-sm border-b border-lime-100/50 pb-2">
            <span>Diskon Voucher</span>
            <span>- Rp {appliedVoucher.amount.toLocaleString('id-ID')}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-lime-900">
          <span className="font-semibold text-sm uppercase tracking-wider">Total Pesanan</span>
          <span className="text-xl font-bold">Rp {Math.max(0, getTotal() - (appliedVoucher?.amount || 0)).toLocaleString('id-ID')}</span>
        </div>
      </div>

      <button
        disabled={loading}
        type="submit"
        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-lime-600 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
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
