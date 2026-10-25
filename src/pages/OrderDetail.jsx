import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Package, Clock, CreditCard, CheckCircle2, MessageCircle, Ticket, XCircle, ShieldCheck, User, Printer, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { convertToDynamicQRIS } from '../lib/utils';
import { QRCode } from 'react-qr-code';

export function OrderDetail() {
  const { hash } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dynamicQris, setDynamicQris] = useState('');

  // Admin state
  const [adminToken] = useState(() => localStorage.getItem('admin_token') || '');
  const [editingFees, setEditingFees] = useState(null);
  const [editingItems, setEditingItems] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [saving, setSaving] = useState(false);

  // Print / receipt state
  const [printEndpoint, setPrintEndpoint] = useState(() => localStorage.getItem('print_endpoint') || '');
  const [showPrintConfig, setShowPrintConfig] = useState(false);
  const [printEndpointInput, setPrintEndpointInput] = useState('');
  const [printing, setPrinting] = useState(false);
  const [printError, setPrintError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';
  const staticQris = import.meta.env.VITE_QRIS_STATIC || null;

  const fetchOrder = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/orders/${hash}`);
      const data = await response.json();
      if (data.success) {
        setOrderData(data);
        setDynamicQris(convertToDynamicQRIS(staticQris, data.order.total_amount));
      } else {
        setError(data.message || 'Gagal memuat detail pesanan');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghubungi server');
    } finally {
      setLoading(false);
    }
  }, [hash, apiUrl, staticQris]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // --- Admin API handlers ---

  const handleUpdateOrder = async (updates) => {
    if (!adminToken) return;
    setSaving(true);
    try {
      const response = await fetch(`${apiUrl}/admin/orders/${orderData.order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        await fetchOrder();
      } else {
        const errData = await response.json();
        alert('Gagal mengupdate pesanan: ' + (errData.message || ''));
      }
    } catch (err) {
      alert('Gagal mengupdate pesanan');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenEditItems = async () => {
    setSaving(true);
    try {
      const productsRes = await fetch(`${apiUrl}/products`);
      const productsData = await productsRes.json();
      setAvailableProducts(productsData.filter(p => p.available));
      setEditingItems({ items: orderData.items.map(i => ({ ...i })) });
    } catch (err) {
      alert('Gagal memuat produk');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveItems = async () => {
    if (!editingItems) return;
    setSaving(true);
    try {
      const requestItems = editingItems.items.map(item => ({
        product_id: item.product_id,
        quantity: parseInt(item.quantity)
      }));
      const response = await fetch(`${apiUrl}/admin/orders/${orderData.order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ items: requestItems })
      });
      if (response.ok) {
        setEditingItems(null);
        await fetchOrder();
      } else {
        const errData = await response.json();
        alert('Gagal menyimpan item: ' + errData.message);
      }
    } catch (err) {
      alert('Gagal menyimpan item pesanan');
    } finally {
      setSaving(false);
    }
  };

  // --- Print / Receipt ---

  const buildPrintPayload = () => {
    const { order, items } = orderData;
    const itemsSubtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const fmt = (n) => n.toLocaleString('id-ID');

    const content = [
      { type: 'text', text: 'DAPUR REMPOAH', align: 'center', bold: true, size: 'large' },
      { type: 'text', text: 'Babakan, Purbalingga', align: 'center' },
      { type: 'text', text: '', align: 'center' },
      { type: 'divider' },
      { type: 'row', left: 'ORDER', right: `#${order.id}`, bold: false },
      { type: 'row', left: 'Jam', right: order.created_at },
      { type: 'divider' },
      ...items.map(item => ({
        type: 'row',
        left: `${item.product_name} x${item.quantity}`,
        right: item.price === 0 ? 'GRATIS' : fmt(item.price * item.quantity)
      })),
      { type: 'divider' },
      { type: 'row', left: 'Subtotal', right: fmt(itemsSubtotal) },
    ];

    if (order.voucher_code) {
      if ((order.discount_amount || 0) > 0) {
        content.push({ type: 'row', left: `Diskon (${order.voucher_code})`, right: `-${fmt(order.discount_amount || 0)}` });
      } else {
        content.push({ type: 'row', left: `Voucher (${order.voucher_code})`, right: 'Bonus Item' });
      }
    }
    if (order.shipping_fee > 0) {
      content.push({ type: 'row', left: 'Ongkir', right: fmt(order.shipping_fee) });
    }

    if (order.additional_fee) {
      content.push({ type: 'row', left: 'Biaya', right: fmt(order.additional_fee) });
    }

    content.push(
      { type: 'row', left: 'TOTAL', right: fmt(order.total_amount), bold: true },
      { type: 'text', text: 'Terima kasih!', align: 'center' },
    );

    return { cut: false, content };
  };

  const sendToPrinter = async () => {
    if (!printEndpoint) return;
    setPrinting(true);
    setPrintError(null);
    try {
      const response = await fetch(printEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPrintPayload()),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}`);
      }
      alert('Struk berhasil dikirim ke printer.');
    } catch (err) {
      setPrintError('Gagal mengirim struk: ' + err.message);
    } finally {
      setPrinting(false);
    }
  };

  const handlePrint = () => {
    if (!printEndpoint) {
      setPrintEndpointInput('');
      setShowPrintConfig(true);
      return;
    }
    sendToPrinter();
  };

  const handleSavePrintEndpoint = async () => {
    const endpoint = printEndpointInput.trim();
    if (!endpoint) return;
    localStorage.setItem('print_endpoint', endpoint);
    setPrintEndpoint(endpoint);
    setShowPrintConfig(false);
    setPrintError(null);
    sendToPrinter();
  };

  // --- Status helpers ---

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'pending payment': return 'bg-orange-100 text-orange-700';
      case 'inprogress': return 'bg-blue-100 text-blue-700';
      case 'complete': return 'bg-emerald-100 text-emerald-700';
      case 'cancelled': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusColorInteractive = (status) => {
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
      case 'unpaid': return 'bg-amber-100 text-amber-700';
      case 'confirmation': return 'bg-indigo-100 text-indigo-700';
      case 'paid': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPaymentStatusColorInteractive = (status) => {
    switch (status) {
      case 'unpaid': return 'bg-amber-100 text-amber-700 hover:bg-amber-200';
      case 'confirmation': return 'bg-lime-100 text-lime-700 hover:bg-lime-200';
      case 'paid': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200';
      default: return 'bg-slate-100 text-slate-700 hover:bg-slate-200';
    }
  };

  // --- Render guards ---

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl">
          <p className="text-lg font-medium">{error}</p>
          <Link to="/" className="inline-block mt-4 text-sm font-semibold hover:underline">
            Kembali ke Menu
          </Link>
        </div>
      </div>
    );
  }

  const { order, items } = orderData;
  const itemsSubtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const isEditable = order.status === 'pending' || order.status === 'pending payment';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back link */}
      {adminToken ? (
        <Link
          to="/admin/orders"
          className="inline-flex items-center text-slate-500 hover:text-lime-600 transition-colors mb-6 group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Kelola Pesanan
        </Link>
      ) : (
        <Link
          to="/history"
          className="inline-flex items-center text-slate-500 hover:text-violet-600 transition-colors mb-6 group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Riwayat Pesanan
        </Link>
      )}

      {/* Admin badge */}
      {adminToken && (
        <div className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl w-fit">
          <ShieldCheck size={14} className="text-lime-600" />
          Mode Admin — kontrol tersedia di bawah
        </div>
      )}

      {/* Print / receipt bar (admin only) */}
      {adminToken && orderData && (
        <div className="mb-4 flex flex-wrap items-center gap-3 bg-white border border-slate-100 rounded-2xl p-3">
          <button
            onClick={handlePrint}
            disabled={printing}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-lime-600 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Printer size={16} />
            {printing ? 'Mengirim...' : 'Cetak Struk'}
          </button>
          <button
            onClick={() => {
              setPrintEndpointInput(printEndpoint);
              setShowPrintConfig(true);
            }}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-2.5 rounded-xl transition-colors"
            title="Konfigurasi endpoint printer"
          >
            <Settings size={14} />
            {printEndpoint ? 'Ubah Endpoint' : 'Atur Endpoint'}
          </button>
          {printEndpoint && (
            <span className="text-xs text-slate-400 font-medium break-all max-w-full sm:max-w-xs">
              {printEndpoint}
            </span>
          )}
          {printError && <span className="text-xs font-bold text-rose-600">{printError}</span>}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Detail Pesanan</h1>
              <p className="text-slate-500 text-sm mt-1">ID: {order.id}</p>
            </div>

            {/* Status badges / admin dropdowns */}
            <div className="flex gap-2 flex-wrap">
              {adminToken ? (
                <>
                  <select
                    value={order.status}
                    disabled={saving}
                    onChange={(e) => handleUpdateOrder({ status: e.target.value, payment_status: order.payment_status })}
                    className={clsx(
                      "px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest outline-none transition-all cursor-pointer disabled:opacity-60",
                      getStatusColorInteractive(order.status)
                    )}
                  >
                    <option value="pending">Pending</option>
                    <option value="pending payment">Pending Payment</option>
                    <option value="inprogress">Proses</option>
                    <option value="complete">Selesai</option>
                    <option value="cancelled">Batal</option>
                  </select>
                  <select
                    value={order.payment_status}
                    disabled={saving}
                    onChange={(e) => handleUpdateOrder({ status: order.status, payment_status: e.target.value })}
                    className={clsx(
                      "px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest outline-none transition-all cursor-pointer disabled:opacity-60",
                      getPaymentStatusColorInteractive(order.payment_status)
                    )}
                  >
                    <option value="unpaid">Belum Bayar</option>
                    <option value="confirmation">Konfirmasi</option>
                    <option value="paid">Terbayar</option>
                  </select>
                </>
              ) : (
                <>
                  <span className={clsx("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", getStatusColor(order.status))}>
                    {order.status}
                  </span>
                  <span className={clsx("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", getPaymentStatusColor(order.payment_status))}>
                    {order.payment_status}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Informasi Pelanggan</h3>
              <p className="font-bold text-slate-900">{order.customer_name}</p>
              <p className="text-slate-500 mt-1">{order.customer_phone}</p>
              {(!order.order_type || order.order_type === 'delivery') && (
                <p className="text-slate-500 text-sm mt-2">{order.customer_address}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Tipe Pesanan</h3>
              <div className="flex items-center gap-2 text-slate-700">
                <Package className="w-4 h-4" />
                <span className="font-medium uppercase">
                  {order.order_type === 'pickup' ? 'Ambil Sendiri' : 'Pesan Antar'}
                </span>
              </div>
              {(order.pickup_delivery_date || order.pickup_delivery_time) && (
                <>
                  <p className="text-slate-500 text-sm mt-2">{order.order_type === 'pickup' ? 'Waktu Ambil:' : 'Waktu Kirim:'}</p>
                  <p className="text-slate-900 font-medium">{order.pickup_delivery_date} {order.pickup_delivery_time}</p>
                </>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Info Pembayaran</h3>
              <div className="flex items-center gap-2 text-slate-700">
                <CreditCard className="w-4 h-4" />
                <span className="font-medium uppercase">{order.payment_method}</span>
              </div>
              <p className="text-slate-500 text-sm mt-2">Dipesan pada:</p>
              <p className="text-slate-900 font-medium">{new Date(order.created_at.replace(' ', 'T') + 'Z').toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>

        {/* Registered customer section */}
        {order.customer_id && (
          <div className="px-6 sm:px-8 py-4 bg-lime-50/60 border-b border-lime-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lime-600 shadow-sm border border-lime-100">
                <User size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-lime-700 uppercase tracking-widest">Pelanggan Terdaftar</p>
                <p className="font-bold text-slate-900">{order.account_name || order.customer_name}</p>
                {order.customer_email && <p className="text-xs text-slate-500">{order.customer_email}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Admin action bar */}
        {adminToken && isEditable && (
          <div className="px-6 sm:px-8 py-4 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-3 items-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Aksi Admin:</p>
            <button
              onClick={() => setEditingFees({ shipping_fee: order.shipping_fee || 0, additional_fee: order.additional_fee || 0 })}
              disabled={saving}
              className="text-xs font-bold text-orange-600 bg-orange-50 px-4 py-2 rounded-xl hover:bg-orange-100 transition-colors border border-orange-100 disabled:opacity-50"
            >
              Sesuaikan Biaya
            </button>
            <button
              onClick={handleOpenEditItems}
              disabled={saving}
              className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100 disabled:opacity-50"
            >
              Edit Item
            </button>
            {saving && <span className="text-xs text-slate-400 font-medium">Menyimpan...</span>}
          </div>
        )}

        <div className="p-6 sm:p-8">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Item Pesanan</h3>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="flex gap-4 items-center">
                  <div className={clsx(
                    "w-10 h-10 rounded-lg flex items-center justify-center font-bold",
                    item.price === 0 ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"
                  )}>
                    {item.quantity}x
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{item.product_name}</span>
                      {item.price === 0 && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                          Bonus
                        </span>
                      )}
                    </p>
                    <p className="text-slate-500 text-sm">
                      {item.price === 0 ? 'Hadiah Promo' : `Rp ${item.price.toLocaleString('id-ID')}`}
                    </p>
                  </div>
                </div>
                <p className={clsx(
                  "font-bold text-right",
                  item.price === 0 ? "text-emerald-600 font-black text-xs uppercase" : "text-slate-900"
                )}>
                  {item.price === 0 ? 'Gratis' : `Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`}
                </p>
              </div>
            ))}
          </div>

          {/* Customer banners (hidden from admin to reduce noise) */}
          {!adminToken && order.status === 'pending' && (
            <>
              <div className="mt-8 p-6 bg-yellow-50 rounded-2xl border border-yellow-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-bold text-slate-900">Mohon tunggu konfirmasi ya</p>
                      <p className="text-sm text-slate-500">Kami perlu melakukan konfirmasi ketersediaan item dan kalkulasi ongkos kirim sebelum memproses lebih lanjut</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Hubungi Admin via Whatsapp</p>
                      <p className="text-sm text-slate-500">Untuk mempercepat konfirmasi ketersediaan item</p>
                    </div>
                  </div>
                  <a
                    href={`https://api.whatsapp.com/send/?phone=6285117054626&text=${encodeURIComponent(`Hi, order is created, please proceed ${window.location.href}`)}&type=phone_number&app_absent=0`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 text-center flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    Kirim Pesan WA
                  </a>
                </div>
              </div>
            </>
          )}

          {!adminToken && order.status === 'pending payment' && order.payment_status !== 'paid' && (
            <div className="mt-8 p-6 bg-red-50 rounded-2xl border border-red-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-bold text-slate-900">Silahkan lakukan pembayaran dengan QRIS</p>
                    <p className="text-sm text-center text-slate-500 mt-4">DAPUR REMPOAH BABAKAN</p>
                  </div>
                </div>
                <QRCode value={dynamicQris} />
              </div>
            </div>
          )}

          {!adminToken && order.status !== 'pending' && order.payment_status !== 'paid' && (
            <div className="mt-8 p-6 bg-violet-50 rounded-2xl border border-violet-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-violet-600 shadow-sm border border-violet-100">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Sudah melakukan pembayaran?</p>
                    <p className="text-sm text-slate-500">Konfirmasi agar pesanan segera diproses.</p>
                  </div>
                </div>
                <Link
                  to={`/confirm-payment/${hash}`}
                  className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 text-center"
                >
                  Konfirmasi Sekarang
                </Link>
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="mt-8 pt-8 border-t border-slate-100 space-y-3">
            {(order.voucher_code || order.shipping_fee > 0 || order.additional_fee > 0) && (
              <div className="flex items-center justify-between text-slate-600 font-bold">
                <p>Subtotal Pesanan</p>
                <p>Rp {itemsSubtotal.toLocaleString('id-ID')}</p>
              </div>
            )}
            {order.voucher_code && (
              <div className="flex items-center justify-between text-emerald-600 font-bold">
                <p>{(order.discount_amount || 0) > 0 ? `Diskon Voucher (${order.voucher_code})` : `Voucher Digunakan (${order.voucher_code})`}</p>
                <p>{(order.discount_amount || 0) > 0 ? `- Rp ${(order.discount_amount).toLocaleString('id-ID')}` : 'Gratis Item (Bonus)'}</p>
              </div>
            )}
            {order.shipping_fee > 0 && (
              <div className="flex items-center justify-between text-slate-600 font-bold">
                <p>Ongkos Kirim</p>
                <p>Rp {order.shipping_fee.toLocaleString('id-ID')}</p>
              </div>
            )}
            {order.additional_fee > 0 && (
              <div className="flex items-center justify-between text-slate-600 font-bold">
                <p>Biaya Tambahan</p>
                <p>Rp {order.additional_fee.toLocaleString('id-ID')}</p>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
              <p className="text-lg font-bold text-slate-900">Total Pembayaran</p>
              <p className="text-2xl font-black text-rose-600">
                Rp {order.total_amount.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fee adjust modal */}
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
                  handleUpdateOrder({
                    status: order.status,
                    payment_status: order.payment_status,
                    shipping_fee: Number(editingFees.shipping_fee) || 0,
                    additional_fee: Number(editingFees.additional_fee) || 0
                  });
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

      {/* Edit items modal */}
      {editingItems && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] flex flex-col">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2 flex-shrink-0">
              <Package className="text-lime-600" size={20} />
              Edit Item Pesanan #{order.id}
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
                    e.target.value = '';
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
                disabled={editingItems.items.length === 0 || saving}
                className="flex-1 px-4 py-3 bg-lime-600 text-white font-bold rounded-xl hover:bg-lime-700 transition-colors shadow-md disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan Items'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print endpoint config modal */}
      {showPrintConfig && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <Printer className="text-lime-600" size={20} />
              Konfigurasi Endpoint Printer
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Struk akan dikirim langsung dari browser ke endpoint REST printer ini. Disimpan di localStorage browser ini.
            </p>
            <label className="block text-xs font-bold text-slate-500 mb-1">Endpoint URL</label>
            <input
              type="url"
              value={printEndpointInput}
              onChange={(e) => setPrintEndpointInput(e.target.value)}
              placeholder="https://example.com/api/print"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-lime-500 outline-none font-bold text-slate-700"
            />
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowPrintConfig(false)}
                className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSavePrintEndpoint}
                disabled={!printEndpointInput.trim()}
                className="flex-1 px-4 py-3 bg-lime-600 text-white font-bold rounded-xl hover:bg-lime-700 transition-colors shadow-md disabled:opacity-50"
              >
                Simpan & Cetak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
