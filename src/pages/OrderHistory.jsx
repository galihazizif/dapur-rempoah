import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { History, ChevronRight, Calendar, ShoppingBag, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const ITEMS_PER_PAGE = 10;

const toDate = (value) => {
  if (!value) return null;
  if (typeof value === 'string' && value.includes(' ') && !value.endsWith('Z')) {
    return new Date(value.replace(' ', 'T') + 'Z');
  }
  return new Date(value);
};

const normalizeOrder = (o) => ({
  hash: o.hash,
  date: toDate(o.date || o.created_at),
  total: o.total ?? o.total_amount ?? 0,
});

export function OrderHistory() {
  const { token } = useAuthStore();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const apiUrl = import.meta.env.VITE_API_URL || '';

  const loadHistory = useCallback(async (page) => {
    if (!token) {
      const savedHistory = localStorage.getItem('orderHistory');
      const parsed = savedHistory
        ? JSON.parse(savedHistory).map(normalizeOrder).sort((a, b) => (b.date - a.date))
        : [];
      setHistory(parsed);
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });
      const response = await fetch(`${apiUrl}/my/orders?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        const orders = (data.data || []).map(normalizeOrder).sort((a, b) => (b.date - a.date));
        setHistory(orders);
        setTotalOrders(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        setError(data.message || 'Gagal memuat riwayat pesanan');
        setHistory([]);
      }
    } catch {
      setError('Terjadi kesalahan saat menghubungi server');
    } finally {
      setLoading(false);
    }
  }, [token, apiUrl]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    loadHistory(currentPage);
  }, [currentPage, loadHistory]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-lime-100 flex items-center justify-center text-lime-600">
          <History className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Riwayat Pesanan</h1>
          <p className="text-slate-500 text-sm">Pesanan terakhir Anda di Dapur Rempoah</p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
          <div className="w-8 h-8 border-4 border-lime-200 border-t-lime-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Memuat riwayat pesanan...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Gagal memuat riwayat pesanan</h3>
          <p className="text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => setCurrentPage(1)}
            className="inline-flex items-center px-6 py-3 rounded-full bg-lime-600 text-white font-bold hover:bg-lime-700 transition-all shadow-lg shadow-lime-200"
          >
            Coba Lagi
          </button>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Belum ada pesanan</h3>
          <p className="text-slate-500 mb-6">Anda belum pernah memesan apa pun sebelumnya.</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 rounded-full bg-lime-600 text-white font-bold hover:bg-lime-700 transition-all shadow-lg shadow-lime-200"
          >
            Pesan Sekarang
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((order, index) => (
            <Link
              key={order.hash || index}
              to={`/orders/${order.hash}`}
              className="block bg-white p-5 rounded-3xl border border-slate-100 hover:border-lime-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Pesanan {order.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="text-slate-500 text-sm">{order.date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} • Rp {order.total.toLocaleString('id-ID')}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-lime-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {token && !loading && totalOrders > 0 && (
        <div className="mt-6 bg-white rounded-3xl border border-slate-100 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div>
            Menampilkan <span className="font-bold text-slate-700">{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalOrders)}</span> hingga <span className="font-bold text-slate-700">{Math.min(currentPage * ITEMS_PER_PAGE, totalOrders)}</span> dari <span className="font-bold text-slate-700">{totalOrders}</span> pesanan
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white font-semibold transition-all shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" /> Sebelumnya
            </button>
            <div className="flex items-center px-4 font-bold text-slate-700">
              Hal {currentPage} dari {totalPages || 1}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages || totalPages === 0}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white font-semibold transition-all shadow-sm"
            >
              Selanjutnya <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
