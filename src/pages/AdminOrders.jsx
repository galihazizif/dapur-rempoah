import { useState, useEffect } from 'react';
import { ChevronLeft, Package, Search, Clock, Calendar, CheckCircle2, XCircle, ShoppingBag, User, MapPin, Phone, CreditCard, Ticket } from 'lucide-react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [editingFees, setEditingFees] = useState(null);
  
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

  const handleUpdateOrder = async (id, status, payment_status, shipping_fee, additional_fee) => {
    try {
      const body = { status, payment_status };
      if (shipping_fee !== undefined) body.shipping_fee = shipping_fee;
      if (additional_fee !== undefined) body.additional_fee = additional_fee;

      const response = await fetch(`${apiUrl}/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(body)
      });
      if (response.ok) fetchOrders();
    } catch (err) {
      alert('Gagal mengupdate pesanan');
    }
  };

  const filteredOrders = orders.filter(o => 
    (o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer_phone.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === 'all' || o.status === filterStatus) &&
    (filterPayment === 'all' || o.payment_status === filterPayment)
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterPayment]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 hover:bg-amber-200';
      case 'pending payment': return 'bg-orange-100 text-orange-700 hover:bg-orange-200';
      case 'inprogress': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
      case 'complete': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200';
      case 'cancelled': return 'bg-rose-100 text-rose-700 hover:bg-rose-200';
      default: return 'bg-slate-100 text-slate-700 hover:bg-slate-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'unpaid': return 'bg-amber-100 text-amber-700 hover:bg-amber-200';
      case 'confirmation': return 'bg-lime-100 text-lime-700 hover:bg-lime-200';
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
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-bold text-slate-900 text-center"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-lime-600 hover:bg-lime-700 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg"
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
          <Link 
            to="/admin/vouchers"
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-sm"
          >
            <Ticket size={20} />
            Voucher
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
            <Search className="text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari ID, nama pelanggan, atau telepon..." 
              className="bg-transparent border-none outline-none w-full font-medium text-slate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-lime-500 text-sm font-bold text-slate-700"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="pending payment">Pending Payment</option>
              <option value="inprogress">Proses</option>
              <option value="complete">Selesai</option>
              <option value="cancelled">Batal</option>
            </select>
            <select 
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-lime-500 text-sm font-bold text-slate-700"
            >
              <option value="all">Semua Pembayaran</option>
              <option value="unpaid">Belum Bayar</option>
              <option value="confirmation">Konfirmasi</option>
              <option value="paid">Terbayar</option>
            </select>
          </div>
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
              ) : currentOrders.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400">Tidak ada pesanan ditemukan.</td></tr>
              ) : currentOrders.map((order) => (
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
                  <td className="px-6 py-4">
                    <p className="font-black text-rose-600 text-sm">Rp {order.total_amount.toLocaleString('id-ID')}</p>
                    {order.voucher_code && (
                      <p className="text-[10px] text-lime-600 font-bold bg-lime-50 px-2 py-0.5 rounded-md inline-block mt-1">
                        Voucher: {order.voucher_code}
                      </p>
                    )}
                  </td>
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
                      <option value="pending payment">Pending Payment</option>
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
                  <td className="px-6 py-4 text-right flex flex-col gap-2 items-end justify-center h-full min-h-[5rem]">
                    <Link 
                      to={`/orders/${order.hash}`}
                      target="_blank"
                      className="text-xs font-bold text-lime-600 hover:underline"
                    >
                      Detail
                    </Link>
                    {(order.status === 'pending' || order.status === 'pending payment') && (
                      <button
                        onClick={() => setEditingFees({ id: order.id, shipping_fee: order.shipping_fee || 0, additional_fee: order.additional_fee || 0 })}
                        className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md hover:bg-orange-100 transition-colors border border-orange-100"
                      >
                        Sesuaikan Biaya
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {!loading && filteredOrders.length > 0 && (
          <div className="p-4 border-t border-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 bg-slate-50/30">
            <div>
              Menampilkan <span className="font-bold text-slate-700">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredOrders.length)}</span> hingga <span className="font-bold text-slate-700">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> dari <span className="font-bold text-slate-700">{filteredOrders.length}</span> pesanan
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white font-semibold transition-all shadow-sm"
              >
                Sebelumnya
              </button>
              <div className="flex items-center px-4 font-bold text-slate-700">
                Hal {currentPage} dari {totalPages || 1}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white font-semibold transition-all shadow-sm"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {editingFees && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <Ticket className="text-lime-600" size={20} />
              Sesuaikan Biaya Pesanan
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Ongkos Kirim</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                  <input 
                    type="number" 
                    value={editingFees.shipping_fee}
                    onChange={e => setEditingFees({...editingFees, shipping_fee: e.target.value === '' ? '' : Number(e.target.value)})}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-lime-500 outline-none font-bold text-slate-700"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Biaya Tambahan</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                  <input 
                    type="number" 
                    value={editingFees.additional_fee}
                    onChange={e => setEditingFees({...editingFees, additional_fee: e.target.value === '' ? '' : Number(e.target.value)})}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-lime-500 outline-none font-bold text-slate-700"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setEditingFees(null)}
                className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  const order = orders.find(o => o.id === editingFees.id);
                  handleUpdateOrder(editingFees.id, order.status, order.payment_status, Number(editingFees.shipping_fee) || 0, Number(editingFees.additional_fee) || 0);
                  setEditingFees(null);
                }}
                className="flex-1 px-4 py-3 bg-lime-600 text-white font-bold rounded-xl hover:bg-lime-700 transition-colors shadow-md"
              >
                Simpan Biaya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
