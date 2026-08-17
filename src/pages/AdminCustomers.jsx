import { useState, useEffect } from 'react';
import { Search, Users, Mail, Calendar, ShoppingBag } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';
  const { adminToken, setShowLogin } = useOutletContext();

  const fetchCustomers = async (page = currentPage, search = searchTerm) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        search: search.trim()
      });
      const response = await fetch(`${apiUrl}/admin/customers?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (response.status === 401) {
        setShowLogin(true);
        return;
      }
      const resData = await response.json();
      setCustomers(resData.data || []);
      setTotalCustomers(resData.pagination?.total || 0);
      setTotalPages(resData.pagination?.totalPages || 1);
    } catch (err) {
      setError('Gagal memuat daftar pelanggan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchCustomers(currentPage, searchTerm);
    }
  }, [adminToken, currentPage, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
              <Users size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kelola Pelanggan</h1>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center gap-2 bg-slate-50/50">
          <Search className="text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Cari nama, email, atau ID pelanggan..."
            className="bg-transparent border-none outline-none w-full font-medium text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Total Pesanan</th>
                <th className="px-6 py-4">Terdaftar Sejak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400">Memuat...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400">Tidak ada pelanggan ditemukan.</td></tr>
              ) : customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={customer.picture || '/default-avatar.png'}
                        alt={customer.name}
                        className="w-10 h-10 rounded-full border border-slate-200 shadow-sm"
                      />
                      <p className="font-bold text-slate-900 text-sm">{customer.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-slate-100 rounded-lg text-slate-700 font-mono font-bold text-xs border border-slate-200">
                      {customer.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 flex items-center gap-1.5">
                      <Mail size={12} className="text-slate-400" /> {customer.email}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-700 w-fit px-3 py-1 rounded-full bg-lime-50 text-lime-700 border border-lime-100">
                      <ShoppingBag size={12} /> {customer.order_count || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-500 flex items-center gap-1.5">
                      <Calendar size={12} className="text-slate-400" />
                      {customer.created_at ? new Date(customer.created_at.replace(' ', 'T') + 'Z').toLocaleDateString('id-ID') : '-'}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && totalCustomers > 0 && (
          <div className="p-4 border-t border-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 bg-slate-50/30">
            <div>
              Menampilkan <span className="font-bold text-slate-700">{Math.min((currentPage - 1) * itemsPerPage + 1, totalCustomers)}</span> hingga <span className="font-bold text-slate-700">{Math.min(currentPage * itemsPerPage, totalCustomers)}</span> dari <span className="font-bold text-slate-700">{totalCustomers}</span> pelanggan
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

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
