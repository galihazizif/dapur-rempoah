import { useState, useEffect } from 'react';
import { ChevronLeft, Package, Search, Clock, Calendar, CheckCircle2, XCircle, ShoppingBag, User, MapPin, Phone, CreditCard, Ticket, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { Link, useOutletContext } from 'react-router-dom';

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [filterRegistered, setFilterRegistered] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [editingFees, setEditingFees] = useState(null);
  const [editingItems, setEditingItems] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({ name: '', phone: '', address: '', order_type: 'delivery', items: [], shippingFee: '', additionalFee: '' });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';
  const { adminToken, setShowLogin } = useOutletContext();

  const fetchOrders = async (page = currentPage, search = searchTerm, status = filterStatus, payment = filterPayment, registered = filterRegistered) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        search: search.trim(),
        status: status,
        payment_status: payment,
        registered: registered
      });
      const response = await fetch(`${apiUrl}/admin/orders?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (response.status === 401) {
        setShowLogin(true);
        return;
      }
      const resData = await response.json();
      if (resData.pagination) {
        setOrders(resData.data || []);
        setTotalOrders(resData.pagination.total);
        setTotalPages(resData.pagination.totalPages || 1);
      } else {
        // Fallback for legacy response array
        const dataList = Array.isArray(resData) ? resData : (resData.data || []);
        setOrders(dataList);
        setTotalOrders(dataList.length);
        setTotalPages(Math.ceil(dataList.length / itemsPerPage) || 1);
      }
    } catch (err) {
      setError('Gagal memuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchOrders(currentPage, searchTerm, filterStatus, filterPayment, filterRegistered);
    }
  }, [adminToken, currentPage, searchTerm, filterStatus, filterPayment, filterRegistered]);

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

  const handleOpenEditItems = async (orderId, orderHash) => {
    try {
      setLoading(true);
      const [orderRes, productsRes] = await Promise.all([
        fetch(`${apiUrl}/orders/${orderHash}`),
        fetch(`${apiUrl}/products`)
      ]);
      const orderData = await orderRes.json();
      const productsData = await productsRes.json();
      if (orderData.success) {
        setAvailableProducts(productsData.filter(p => p.available));
        setEditingItems({ id: orderId, hash: orderHash, items: orderData.items });
      } else {
        alert('Gagal memuat pesanan: ' + orderData.message);
      }
    } catch (err) {
      alert('Gagal memuat detail item pesanan');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItems = async () => {
    try {
      const requestItems = editingItems.items.map(item => ({ product_id: item.product_id, quantity: parseInt(item.quantity) }));
      const response = await fetch(`${apiUrl}/admin/orders/${editingItems.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ items: requestItems })
      });
      if (response.ok) {
        setEditingItems(null);
        fetchOrders();
      } else {
        const errData = await response.json();
        alert('Gagal menyimpan item: ' + errData.message);
      }
    } catch (err) {
      alert('Gagal menyimpan item pesanan');
    }
  };

  const handleOpenCreateOrder = async () => {
    if (availableProducts.length === 0) {
      try {
        const res = await fetch(`${apiUrl}/products`);
        const data = await res.json();
        setAvailableProducts(data.filter(p => p.available));
      } catch (e) {
        console.error("Gagal memuat produk", e);
      }
    }
    setCreatingOrder(true);
  };

  const handleCreateOrder = async () => {
    if (!newOrderForm.name || !newOrderForm.phone || newOrderForm.items.length === 0) {
      alert("Pastikan nama, HP, dan setidaknya 1 item telah diisi.");
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/admin/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          customer: {
            name: newOrderForm.name,
            phone: newOrderForm.phone,
            address: newOrderForm.address,
            order_type: newOrderForm.order_type
          },
          items: newOrderForm.items,
          shippingFee: Number(newOrderForm.shippingFee) || 0,
          additionalFee: Number(newOrderForm.additionalFee) || 0
        })
      });
      if (response.ok) {
        setCreatingOrder(false);
        setNewOrderForm({ name: '', phone: '', address: '', order_type: 'delivery', items: [], shippingFee: '', additionalFee: '' });
        fetchOrders();
      } else {
        const errData = await response.json();
        alert('Gagal membuat pesanan: ' + errData.message);
      }
    } catch (err) {
      alert('Gagal membuat pesanan');
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterPayment, filterRegistered]);

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
        <div className="flex gap-3" style={{ overflowX: "auto" }}>
          <button
            onClick={handleOpenCreateOrder}
            className="flex items-center gap-2 bg-lime-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-lime-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus size={18} /> Buat Pesanan
          </button>
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
            <select
              value={filterRegistered}
              onChange={(e) => setFilterRegistered(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-lime-500 text-sm font-bold text-slate-700"
            >
              <option value="all">Semua Pelanggan</option>
              <option value="registered">Pelanggan Terdaftar</option>
              <option value="guest">Tamu</option>
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
              ) : orders.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400">Tidak ada pesanan ditemukan.</td></tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 text-sm">#{order.id}</p>
                    <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1">
                      <Calendar size={10} /> {new Date(order.created_at.replace(' ', 'T') + 'Z').toLocaleString('id-ID')}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <p className="font-bold text-slate-900 text-sm flex items-center gap-1">
                        <User size={12} className="text-slate-400" /> {order.customer_name}
                        {order.customer_id && (
                          <span className="text-[9px] font-black uppercase tracking-widest bg-lime-50 text-lime-700 border border-lime-100 px-1.5 py-0.5 rounded-md ml-1">
                            Terdaftar
                          </span>
                        )}
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
                      className="text-xs font-bold text-lime-600 hover:underline"
                    >
                      Detail
                    </Link>
                    {(order.status === 'pending' || order.status === 'pending payment') && (
                      <div className="flex flex-col gap-1 w-full mt-2">
                        <button
                          onClick={() => setEditingFees({ id: order.id, shipping_fee: order.shipping_fee || 0, additional_fee: order.additional_fee || 0 })}
                          className="w-full text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1.5 rounded-md hover:bg-orange-100 transition-colors border border-orange-100"
                        >
                          Sesuaikan Biaya
                        </button>
                        <button
                          onClick={() => handleOpenEditItems(order.id, order.hash)}
                          className="w-full text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1.5 rounded-md hover:bg-blue-100 transition-colors border border-blue-100"
                        >
                          Edit Item
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && totalOrders > 0 && (
          <div className="p-4 border-t border-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 bg-slate-50/30">
            <div>
              Menampilkan <span className="font-bold text-slate-700">{Math.min((currentPage - 1) * itemsPerPage + 1, totalOrders)}</span> hingga <span className="font-bold text-slate-700">{Math.min(currentPage * itemsPerPage, totalOrders)}</span> dari <span className="font-bold text-slate-700">{totalOrders}</span> pesanan
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
                disabled={currentPage >= totalPages || totalPages === 0}
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
                    onChange={e => setEditingFees({ ...editingFees, shipping_fee: e.target.value === '' ? '' : Number(e.target.value) })}
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
                    onChange={e => setEditingFees({ ...editingFees, additional_fee: e.target.value === '' ? '' : Number(e.target.value) })}
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

      {editingItems && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] flex flex-col">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2 flex-shrink-0">
              <Package className="text-lime-600" size={20} />
              Edit Item Pesanan #{editingItems.id}
            </h3>

            <div className="overflow-y-auto pr-2 space-y-4 flex-1">
              {editingItems.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex-1">
                    <p className="font-bold text-sm text-slate-700 truncate">{item.product_name}</p>
                    <p className="text-xs text-slate-500">Rp {(item.price || 0).toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <div className="relative w-16">
                      <input
                        type="number"
                        min="1"
                        className="w-full pl-2 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg outline-none text-center font-bold text-sm focus:ring-2 focus:ring-lime-500"
                        value={item.quantity}
                        onChange={(e) => {
                          const newItems = [...editingItems.items];
                          newItems[index].quantity = e.target.value;
                          setEditingItems({ ...editingItems, items: newItems });
                        }}
                      />
                    </div>
                    <button
                      onClick={() => {
                        const newItems = editingItems.items.filter((_, i) => i !== index);
                        setEditingItems({ ...editingItems, items: newItems });
                      }}
                      className="text-rose-400 p-1 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus Item"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-6 pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-500 mb-2">Tambah Item Baru</label>
                <select
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-slate-700 text-sm focus:ring-2 focus:ring-lime-500"
                  onChange={(e) => {
                    const productId = parseInt(e.target.value);
                    if (!productId) return;
                    const product = availableProducts.find(p => p.id === productId);
                    if (product) {
                      setEditingItems({
                        ...editingItems,
                        items: [
                          ...editingItems.items,
                          { product_id: product.id, product_name: product.name, price: product.price, quantity: 1 }
                        ]
                      });
                    }
                    e.target.value = "";
                  }}
                >
                  <option value="">-- Pilih Produk --</option>
                  {availableProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - Rp {p.price.toLocaleString('id-ID')}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100 flex-shrink-0">
              <button
                onClick={() => setEditingItems(null)}
                className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveItems}
                disabled={editingItems.items.length === 0}
                className="flex-1 px-4 py-3 bg-lime-600 text-white font-bold rounded-xl hover:bg-lime-700 transition-colors shadow-md disabled:opacity-50"
              >
                Simpan Items
              </button>
            </div>
          </div>
        </div>
      )}

      {creatingOrder && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-xl max-h-[90vh] flex flex-col">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2 flex-shrink-0 border-b border-slate-100 pb-4">
              <Plus className="text-lime-600" size={24} />
              Buat Pesanan Baru
            </h3>

            <div className="overflow-y-auto pr-2 flex-1 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nama Pelanggan *</label>
                  <input type="text" value={newOrderForm.name} onChange={e => setNewOrderForm({ ...newOrderForm, name: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-lime-500 text-sm font-bold text-slate-700" placeholder="Nama" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">No. HP / WhatsApp *</label>
                  <input type="text" value={newOrderForm.phone} onChange={e => setNewOrderForm({ ...newOrderForm, phone: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-lime-500 text-sm font-bold text-slate-700" placeholder="08..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Tipe Pesanan</label>
                  <select value={newOrderForm.order_type} onChange={e => setNewOrderForm({ ...newOrderForm, order_type: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-lime-500 text-sm font-bold text-slate-700">
                    <option value="delivery">Delivery</option>
                    <option value="pickup">Pickup</option>
                  </select>
                </div>
                {newOrderForm.order_type === 'delivery' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Alamat (Untuk Delivery)</label>
                    <textarea rows="2" value={newOrderForm.address} onChange={e => setNewOrderForm({ ...newOrderForm, address: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-lime-500 text-sm font-bold text-slate-700" placeholder="Alamat lengkap..."></textarea>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Ongkos Kirim</label>
                  <input type="number" value={newOrderForm.shippingFee} onChange={e => setNewOrderForm({ ...newOrderForm, shippingFee: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-lime-500 text-sm font-bold text-slate-700" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Biaya Tambahan</label>
                  <input type="number" value={newOrderForm.additionalFee} onChange={e => setNewOrderForm({ ...newOrderForm, additionalFee: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-lime-500 text-sm font-bold text-slate-700" placeholder="0" />
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-3 block pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span>Item Pesanan *</span>
                </h4>
                {newOrderForm.items.length === 0 ? (
                  <div className="bg-slate-50 rounded-xl p-4 text-center text-sm text-slate-500 mb-4 border-2 border-dashed border-slate-200">
                    Belum ada item ditambahkan.
                  </div>
                ) : (
                  <div className="space-y-3 mb-4">
                    {newOrderForm.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex-1">
                          <p className="font-bold text-sm text-slate-700 truncate">{item.name}</p>
                          <p className="text-xs text-slate-500">Rp {(item.price || 0).toLocaleString('id-ID')}</p>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <input
                            type="number"
                            min="1"
                            className="w-16 pl-2 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg outline-none text-center font-bold text-sm focus:ring-2 focus:ring-lime-500"
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = [...newOrderForm.items];
                              newItems[index].quantity = parseInt(e.target.value) || 1;
                              setNewOrderForm({ ...newOrderForm, items: newItems });
                            }}
                          />
                          <button
                            onClick={() => {
                              const newItems = newOrderForm.items.filter((_, i) => i !== index);
                              setNewOrderForm({ ...newOrderForm, items: newItems });
                            }}
                            className="text-rose-400 p-1 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <select
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-slate-700 text-sm focus:ring-2 focus:ring-lime-500"
                    onChange={(e) => {
                      const productId = parseInt(e.target.value);
                      if (!productId) return;
                      const product = availableProducts.find(p => p.id === productId);
                      if (product) {
                        setNewOrderForm({
                          ...newOrderForm,
                          items: [
                            ...newOrderForm.items,
                            { id: product.id, name: product.name, price: product.price, quantity: 1 }
                          ]
                        });
                      }
                      e.target.value = "";
                    }}
                  >
                    <option value="">-- Tambah Produk --</option>
                    {availableProducts.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - Rp {p.price.toLocaleString('id-ID')}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100 flex-shrink-0">
              <button
                onClick={() => setCreatingOrder(false)}
                className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleCreateOrder}
                disabled={newOrderForm.items.length === 0 || !newOrderForm.name || !newOrderForm.phone}
                className="flex-1 px-4 py-3 bg-lime-600 text-white font-bold rounded-xl hover:bg-lime-700 transition-colors shadow-md disabled:opacity-50"
              >
                Buat Pesanan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
