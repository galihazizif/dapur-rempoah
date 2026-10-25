import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, ChevronLeft, Ticket, Search, Gift, Percent } from 'lucide-react';
import { clsx } from 'clsx';
import { Link, useOutletContext } from 'react-router-dom';

export function AdminVouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'discount',
    amount: 0,
    reward_item_name: '',
    is_active: true,
    is_used: false
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';
  const { adminToken, setShowLogin } = useOutletContext();

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/admin/vouchers`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (response.status === 401) {
        setShowLogin(true);
        return;
      }
      const data = await response.json();
      setVouchers(data || []);
    } catch (err) {
      setError('Gagal memuat voucher');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchVouchers();
    }
  }, [adminToken]);


  const handleToggleActive = async (voucher) => {
    try {
      const response = await fetch(`${apiUrl}/admin/vouchers/${voucher.code}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ is_active: !voucher.is_active })
      });
      if (response.ok) fetchVouchers();
    } catch (err) {
      alert('Gagal mengupdate status');
    }
  };

  const handleDelete = async (code) => {
    if (!confirm('Apakah Anda yakin ingin menghapus voucher ini?')) return;
    try {
      const response = await fetch(`${apiUrl}/admin/vouchers/${code}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (response.ok) fetchVouchers();
    } catch (err) {
      alert('Gagal menghapus voucher');
    }
  };

  const handleOpenModal = (voucher = null) => {
    if (voucher) {
      setEditingVoucher(voucher);
      setFormData({
        code: voucher.code,
        type: voucher.type || (voucher.reward_item_name ? 'free_item' : 'discount'),
        amount: voucher.amount || 0,
        reward_item_name: voucher.reward_item_name || '',
        is_active: voucher.is_active ? true : false,
        is_used: voucher.is_used ? true : false,
      });
    } else {
      setEditingVoucher(null);
      setFormData({
        code: '',
        type: 'discount',
        amount: 0,
        reward_item_name: '',
        is_active: true,
        is_used: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.type === 'discount' && (!formData.amount || formData.amount <= 0)) {
      alert('Nominal potongan harga harus lebih dari 0');
      return;
    }
    if (formData.type === 'free_item' && !formData.reward_item_name.trim()) {
      alert('Nama item gratis wajib diisi');
      return;
    }

    const method = editingVoucher ? 'PUT' : 'POST';
    const url = editingVoucher ? `${apiUrl}/admin/vouchers/${editingVoucher.code}` : `${apiUrl}/admin/vouchers`;

    try {
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          ...formData,
          amount: formData.type === 'free_item' ? 0 : formData.amount,
          reward_item_name: formData.type === 'free_item' ? formData.reward_item_name.trim() : null
        })
      });
      if (response.ok) {
        setIsModalOpen(false);
        fetchVouchers();
      } else {
        const data = await response.json();
        alert(data.message || 'Gagal menyimpan voucher');
      }
    } catch (err) {
      alert('Gagal menyimpan voucher');
    }
  };

  const filteredVouchers = vouchers.filter(v => 
    v.code.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link to="/" className="text-sm text-slate-500 hover:text-lime-600 flex items-center gap-1">
              <ChevronLeft size={16} /> Kembali
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
              <Ticket size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kelola Voucher</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleOpenModal()}
            className="bg-lime-600 hover:bg-lime-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-lime-200"
          >
            <Plus size={20} />
            Tambah Voucher
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center gap-2 bg-slate-50/50">
          <Search className="text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari kode voucher..." 
            className="bg-transparent border-none outline-none w-full font-medium text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Kode Voucher</th>
                <th className="px-6 py-4">Tipe / Manfaat</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Digunakan?</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400">Memuat...</td></tr>
              ) : filteredVouchers.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400">Tidak ada voucher ditemukan.</td></tr>
              ) : filteredVouchers.map((v) => (
                <tr key={v.code} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="inline-block px-3 py-1.5 bg-slate-100 rounded-lg text-slate-900 font-mono font-bold text-sm border border-slate-200">
                      {v.code}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {v.type === 'free_item' || v.reward_item_name ? (
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl w-fit text-xs">
                        <Gift size={14} className="text-emerald-500 shrink-0" />
                        <span>Gratis: {v.reward_item_name || 'Item'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 font-black text-lime-600 text-sm">
                        <Percent size={14} className="text-lime-500 shrink-0" />
                        <span>Rp {(v.amount || 0).toLocaleString('id-ID')}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggleActive(v)}
                      className={clsx(
                        "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all w-fit",
                        v.is_active 
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      )}
                    >
                      {v.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {v.is_active ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    {v.is_used ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-100 w-fit">
                        Ya
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 w-fit">
                        Belum
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(v)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(v.code)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {editingVoucher ? 'Edit Voucher' : 'Tambah Voucher'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Kode Voucher</label>
                <input 
                  required
                  disabled={editingVoucher !== null}
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-bold text-slate-900 uppercase font-mono disabled:opacity-50"
                  placeholder="Contoh: DISKON50"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase().trim()})}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Tipe Manfaat</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'discount' })}
                    className={clsx(
                      "p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                      formData.type === 'discount' 
                        ? "bg-lime-50 border-lime-500 text-lime-800 shadow-sm" 
                        : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    <Percent size={14} /> Diskon (Rp)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'free_item', amount: 0 })}
                    className={clsx(
                      "p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                      formData.type === 'free_item' 
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm" 
                        : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    <Gift size={14} /> Gratis Item
                  </button>
                </div>
              </div>

              {formData.type === 'discount' ? (
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nilai Potongan (Rp)</label>
                  <input 
                    required
                    type="number" 
                    min="1"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-bold text-slate-900"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value) || 0})}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nama Item Gratis</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Contoh: Es Jeruk, 1 Porsi Mendoan"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-bold text-slate-900"
                    value={formData.reward_item_name}
                    onChange={(e) => setFormData({...formData, reward_item_name: e.target.value})}
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5 ml-1">Item ini akan otomatis masuk ke struk pesanan & dapur sebagai item bonus gratis (Rp 0).</p>
                </div>
              )}

              <div className="flex items-center gap-2 py-2">
                <input 
                  type="checkbox" 
                  id="vp_active"
                  className="w-5 h-5 accent-lime-600 rounded"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                />
                <label htmlFor="vp_active" className="text-sm font-bold text-slate-700">Aktif (bisa digunakan)</label>
              </div>

              {editingVoucher && (
                <div className="flex items-center gap-2 py-2">
                  <input 
                    type="checkbox" 
                    id="vp_used"
                    className="w-5 h-5 accent-lime-600 rounded"
                    checked={formData.is_used}
                    onChange={(e) => setFormData({...formData, is_used: e.target.checked})}
                  />
                  <label htmlFor="vp_used" className="text-sm font-bold text-slate-700 line-through decoration-rose-500">Sudah Digunakan</label>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-[2] px-6 py-4 rounded-2xl font-bold bg-slate-900 text-white hover:bg-lime-600 transition-all shadow-lg shadow-slate-200 cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
