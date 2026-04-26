import { useState, useEffect } from 'react';
import { ChevronLeft, CreditCard, CheckCircle2, XCircle, Search, Clock, Calendar, MessageSquare, AlertCircle, ShoppingBag, Package } from 'lucide-react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

export function AdminPaymentConfirmations() {
  const [confirmations, setConfirmations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';
  const [adminToken, setAdminToken] = useState(localStorage.getItem('admin_token') || '');
  const [showLogin, setShowLogin] = useState(!localStorage.getItem('admin_token'));
  const [password, setPassword] = useState('');

  const fetchConfirmations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/admin/payment-confirmations`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (response.status === 401) {
        setShowLogin(true);
        return;
      }
      const data = await response.json();
      setConfirmations(data);
    } catch (err) {
      setError('Gagal memuat konfirmasi pembayaran');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchConfirmations();
    }
  }, [adminToken]);

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('admin_token', password);
    setAdminToken(password);
    setShowLogin(false);
  };

  const handleUpdateStatus = async (id, status, validity) => {
    try {
      const response = await fetch(`${apiUrl}/admin/payment-confirmations/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status, validity })
      });
      if (response.ok) fetchConfirmations();
    } catch (err) {
      alert('Gagal mengupdate status');
    }
  };

  const filteredConfirmations = confirmations.filter(c => 
    c.order_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100 animate-in fade-in zoom-in duration-300">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white mx-auto mb-4">
              <CreditCard size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Dapur Rempoah</h1>
            <p className="text-slate-500 mt-2">Masuk untuk mengelola pembayaran.</p>
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
              <CreditCard size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Konfirmasi Pembayaran</h1>
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
            to="/admin/orders"
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-sm"
          >
            <ShoppingBag size={20} />
            Pesanan
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center gap-2 bg-slate-50/50">
          <Search className="text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari referensi atau catatan..." 
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
                <th className="px-6 py-4">Jumlah</th>
                <th className="px-6 py-4">Tgl Bayar</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Validitas</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400">Memuat...</td></tr>
              ) : filteredConfirmations.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400">Tidak ada konfirmasi ditemukan.</td></tr>
              ) : filteredConfirmations.map((conf) => (
                <tr key={conf.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{conf.order_reference}</p>
                    {conf.notes && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MessageSquare size={10} /> {conf.notes}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 font-black text-rose-600">Rp {conf.amount_paid.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(conf.payment_date).toLocaleDateString('id-ID')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleUpdateStatus(conf.id, conf.status === 1 ? 0 : 1, conf.validity)}
                      className={clsx(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center gap-1.5",
                        conf.status === 1 
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                          : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      )}
                    >
                      {conf.status === 1 ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {conf.status === 1 ? 'Diproses' : 'Pending'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5 flex-wrap">
                      <button 
                        onClick={() => handleUpdateStatus(conf.id, conf.status, 'valid')}
                        className={clsx(
                          "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight transition-all",
                          conf.validity === 'valid' ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        )}
                      >
                        Valid
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(conf.id, conf.status, 'invalid')}
                        className={clsx(
                          "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight transition-all",
                          conf.validity === 'invalid' ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        )}
                      >
                        Invalid
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-[10px] text-slate-400 font-medium">Masuk: {new Date(conf.created_at).toLocaleString('id-ID')}</p>
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
