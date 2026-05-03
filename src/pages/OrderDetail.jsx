import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Package, Clock, CreditCard, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

export function OrderDetail() {
  const { hash } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';
        const response = await fetch(`${apiUrl}/orders/${hash}`);
        const data = await response.json();
        
        if (data.success) {
          setOrderData(data);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
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
              <p className="text-slate-900 font-medium">{new Date(order.created_at).toLocaleString('id-ID')}</p>
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

          {order.payment_status !== 'paid' && (
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
            {order.voucher_code && (
              <div className="flex items-center justify-between text-slate-600">
                <p>Subtotal</p>
                <p>Rp {(order.total_amount + (order.discount_amount || 0)).toLocaleString('id-ID')}</p>
              </div>
            )}
            {order.voucher_code && (
              <div className="flex items-center justify-between text-emerald-600">
                <p>Diskon Voucher ({order.voucher_code})</p>
                <p>- Rp {(order.discount_amount || 0).toLocaleString('id-ID')}</p>
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
