import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Package, Clock, CreditCard, CheckCircle2, MessageCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { convertToDynamicQRIS } from '../lib/utils';
import { QRCode } from 'react-qr-code';

export function OrderDetail() {
  const { hash } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dynamicQris, setDynamicQris] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const staticQris = import.meta.env.VITE_QRIS_STATIC || null;
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';
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
    };

    fetchOrder();
  }, [hash]);

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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'unpaid': return 'bg-amber-100 text-amber-700';
      case 'confirmation': return 'bg-indigo-100 text-indigo-700';
      case 'paid': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link 
        to="/history" 
        className="inline-flex items-center text-slate-500 hover:text-violet-600 transition-colors mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Riwayat Pesanan
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Detail Pesanan</h1>
              <p className="text-slate-500 text-sm mt-1">ID: {order.id}</p>
            </div>
            <div className="flex gap-2">
              <span className={clsx("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", getStatusColor(order.status))}>
                {order.status}
              </span>
              <span className={clsx("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", getPaymentStatusColor(order.payment_status))}>
                {order.payment_status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Informasi Pelanggan</h3>
              <p className="font-bold text-slate-900">{order.customer_name}</p>
              <p className="text-slate-500 mt-1">{order.customer_phone}</p>
              <p className="text-slate-500 text-sm mt-2">{order.customer_address}</p>
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

        <div className="p-6 sm:p-8">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Item Pesanan</h3>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                    {item.quantity}x
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{item.product_name}</p>
                    <p className="text-slate-500 text-sm">Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                </div>
                <p className="font-bold text-slate-900 text-right">
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>

          {order.status === 'pending' && (
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

          {order.status == 'pending payment' && order.payment_status !== 'paid' && (
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

          {order.status !== 'pending' && order.payment_status !== 'paid' && (
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

          <div className="mt-8 pt-8 border-t border-slate-100 space-y-3">
            {(order.voucher_code || order.shipping_fee > 0 || order.additional_fee > 0) && (
              <div className="flex items-center justify-between text-slate-600 font-bold">
                <p>Subtotal Pesanan</p>
                <p>Rp {itemsSubtotal.toLocaleString('id-ID')}</p>
              </div>
            )}
            {order.voucher_code && (
              <div className="flex items-center justify-between text-emerald-600 font-bold">
                <p>Diskon Voucher ({order.voucher_code})</p>
                <p>- Rp {(order.discount_amount || 0).toLocaleString('id-ID')}</p>
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
    </div>
  );
}
