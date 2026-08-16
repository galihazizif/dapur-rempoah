import { useState, useEffect } from 'react';
import { ChevronLeft, Save, Settings, Package, ShoppingBag, CreditCard, Ticket } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';

export function AdminSettings() {
  const [storeStatus, setStoreStatus] = useState('open');
  const [storeMessage, setStoreMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';
  const { adminToken, setShowLogin } = useOutletContext();

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/settings`);
      const data = await response.json();
      if (data.store_status) setStoreStatus(data.store_status);
      if (data.store_message) setStoreMessage(data.store_message);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchSettings();
    }
  }, [adminToken]);


  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`${apiUrl}/admin/settings`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ 
          store_status: storeStatus,
          store_message: storeMessage
        })
      });
      if (response.ok) {
        alert('Pengaturan berhasil disimpan!');
      } else {
        alert('Gagal menyimpan pengaturan.');
      }
    } catch (err) {
      alert('Gagal menyimpan pengaturan.');
    } finally {
      setSaving(false);
    }
  };


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
              <Settings size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pengaturan Toko</h1>
          </div>
        </div>
        <div className="flex gap-3" style={{overflowX: "auto"}}>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden max-w-2xl">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
           <h2 className="text-xl font-bold text-slate-900">Status Operasional</h2>
           <p className="text-sm text-slate-500 mt-1">Atur apakah toko menerima pesanan hari ini.</p>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-slate-500">Memuat pengaturan...</div>
        ) : (
          <form onSubmit={handleSave} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Status Toko</label>
              <div className="flex items-center gap-4">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="storeStatus" 
                      value="open"
                      checked={storeStatus === 'open'}
                      onChange={(e) => setStoreStatus(e.target.value)}
                      className="w-4 h-4 accent-lime-600"
                    />
                    <span className="font-semibold text-slate-900">Buka (Terima Pesanan)</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="storeStatus" 
                      value="closed"
                      checked={storeStatus === 'closed'}
                      onChange={(e) => setStoreStatus(e.target.value)}
                      className="w-4 h-4 accent-rose-600"
                    />
                    <span className="font-semibold text-slate-900">Tutup (Libur)</span>
                 </label>
              </div>
            </div>

            {storeStatus === 'closed' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Pesan Libur untuk Pelanggan</label>
                <textarea 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-medium text-slate-800 resize-none h-24"
                  placeholder="Contoh: Maaf, toko sedang libur Idul Fitri hingga tanggal 15 April."
                  value={storeMessage}
                  onChange={(e) => setStoreMessage(e.target.value)}
                />
              </div>
            )}

            <div className="pt-4 border-t border-slate-50">
              <button 
                disabled={saving}
                type="submit"
                className="w-full bg-lime-600 hover:bg-lime-700 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50"
              >
                <Save size={20} />
                {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
