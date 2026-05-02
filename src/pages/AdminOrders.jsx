import { useState, useEffect } from 'react';
import { ChevronLeft, Package, Search, Clock, Calendar, CheckCircle2, XCircle, ShoppingBag, User, MapPin, Phone, CreditCard } from 'lucide-react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';
  const [adminToken, setAdminToken] = useState(localStorage.getItem('admin_token') || '');
  const [showLogin, setShowLogin] = useState(!localStorage.getItem('admin_token'));
  const [password, setPassword] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/admin/orders`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (response.status === 401) {
        setShowLogin(true);
        return;
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError('Gagal memuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchOrders();
    }
  }, [adminToken]);

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('admin_token', password);
    setAdminToken(password);
    setShowLogin(false);
  };

  const handleUpdateOrder = async (id, status, payment_status) => {
    try {
      const response = await fetch(`${apiUrl}/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status, payment_status })
      });
      if (response.ok) fetchOrders();
    } catch (err) {
      alert('Gagal mengupdate pesanan');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer_phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 hover:bg-amber-200';
      case 'inprogress': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
      case 'complete': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200';
      case 'cancelled': return 'bg-rose-100 text-rose-700 hover:bg-rose-200';
      default: return 'bg-slate-100 text-slate-700 hover:bg-slate-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'unpaid': return 'bg-amber-100 text-amber-700 hover:bg-amber-200';
      case 'confirmation': return 'bg-violet-100 text-violet-700 hover:bg-violet-200';
      case 'paid': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200';
      default: return 'bg-slate-100 text-slate-700 hover:bg-slate-200';
    }
  };

  if (showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white mx-auto mb-4">
              <ShoppingBag size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Dapur Rempoah</h1>
            <p className="text-slate-500 mt-2">Masuk untuk mengelola pesanan.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Kata Sandi</label>
              <input 
                required
                type="password" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none transition-all font-bold text-slate-900 text-center"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
              <ShoppingBag size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kelola Pesanan</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/admin"
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-sm"
          >
            <Package size={20} />
            Produk
          </Link>
          <Link 
            to="/admin/payments"
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-sm"
          >
            <CreditCard size={20} />
            Konfirmasi Pembayaran
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center gap-2 bg-slate-50/50">
          <Search className="text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari ID, nama pelanggan, atau telepon..." 
            className="bg-transparent border-none outline-none w-full font-medium text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Pesanan</th>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status Pesanan</th>
                <th className="px-6 py-4">Pembayaran</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400">Memuat...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400">Tidak ada pesanan ditemukan.</td></tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 text-sm">#{order.id}</p>
                    <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1">
                      <Calendar size={10} /> {new Date(order.created_at).toLocaleString('id-ID')}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <p className="font-bold text-slate-900 text-sm flex items-center gap-1">
                        <User size={12} className="text-slate-400" /> {order.customer_name}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Phone size={10} className="text-slate-400" /> {order.customer_phone}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[200px] flex items-center gap-1">
                        <MapPin size={10} className="text-slate-400" /> {order.customer_address}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-black text-rose-600 text-sm">Rp {order.total_amount.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => handleUpdateOrder(order.id, e.target.value, order.payment_status)}
                      className={clsx(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest outline-none transition-all cursor-pointer",
                        getStatusColor(order.status)
                      )}
                    >
                      <option value="pending">Pending</option>
                      <option value="inprogress">Proses</option>
                      <option value="complete">Selesai</option>
                      <option value="cancelled">Batal</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                   <select 
                      value={order.payment_status}
                      onChange={(e) => handleUpdateOrder(order.id, order.status, e.target.value)}
                      className={clsx(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest outline-none transition-all cursor-pointer",
                        getPaymentStatusColor(order.payment_status)
                      )}
                    >
                      <option value="unpaid">Belum Bayar</option>
                      <option value="confirmation">Konfirmasi</option>
                      <option value="paid">Terbayar</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      to={`/orders/${order.hash}`}
                      target="_blank"
                      className="text-xs font-bold text-violet-600 hover:underline"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
