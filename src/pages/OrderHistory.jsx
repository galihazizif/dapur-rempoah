import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, ChevronRight, Calendar, ShoppingBag } from 'lucide-react';

export function OrderHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('orderHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory).sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600">
          <History className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Riwayat Pesanan</h1>
          <p className="text-slate-500 text-sm">Pesanan terakhir Anda di Dapur Rempoah</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Belum ada pesanan</h3>
          <p className="text-slate-500 mb-6">Anda belum pernah memesan apa pun sebelumnya.</p>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 rounded-full bg-violet-600 text-white font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200"
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
              className="block bg-white p-5 rounded-3xl border border-slate-100 hover:border-violet-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Pesanan {new Date(order.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="text-slate-500 text-sm">{new Date(order.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} • Rp {order.total.toLocaleString('id-ID')}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-violet-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
