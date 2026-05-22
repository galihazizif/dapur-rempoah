import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, ChevronLeft, Package, Search, CreditCard, ShoppingBag, Ticket } from 'lucide-react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'makanan',
    price: 0,
    description: '',
    image_url: '',
    available: true
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';
  const [adminToken, setAdminToken] = useState(localStorage.getItem('admin_token') || '');
  const [showLogin, setShowLogin] = useState(!localStorage.getItem('admin_token'));
  const [password, setPassword] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/products`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (response.status === 401) {
        setShowLogin(true);
        return;
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchProducts();
    }
  }, [adminToken]);

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('admin_token', password);
    setAdminToken(password);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setAdminToken('');
    setShowLogin(true);
  };

  const handleToggleAvailable = async (product) => {
    try {
      const response = await fetch(`${apiUrl}/products/${product.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ available: !product.available })
      });
      if (response.ok) fetchProducts();
    } catch (err) {
      alert('Gagal mengupdate status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    try {
      const response = await fetch(`${apiUrl}/products/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (response.ok) fetchProducts();
    } catch (err) {
      alert('Gagal menghapus produk');
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description || '',
        image_url: product.image_url || '',
        available: product.available ? true : false
      });
      setImageFile(null);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: 'makanan',
        price: 0,
        description: '',
        image_url: '',
        available: true
      });
      setImageFile(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct ? `${apiUrl}/products/${editingProduct.id}` : `${apiUrl}/products`;

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("category", formData.category);
      payload.append("price", formData.price.toString());
      payload.append("description", formData.description);
      payload.append("available", formData.available);
      
      if (imageFile) {
        payload.append("image", imageFile);
      } else if (formData.image_url) {
        payload.append("image_url", formData.image_url);
      }

      const response = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${adminToken}`
        },
        body: payload
      });
      if (response.ok) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        alert('Gagal menyimpan produk: ' + await response.text());
      }
    } catch (err) {
      alert('Gagal menyimpan produk');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100 animate-in fade-in zoom-in duration-300">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white mx-auto mb-4">
              <Package size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Dapur Rempoah</h1>
            <p className="text-slate-500 mt-2">Silakan masukkan kata sandi admin untuk melanjutkan.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Kata Sandi</label>
              <input 
                required
                type="password" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none transition-all font-bold text-slate-900 text-center tracking-widest"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-violet-200"
            >
              Masuk
            </button>
            <Link to="/" className="block text-center text-sm font-bold text-slate-400 hover:text-slate-600 transition-all pt-2">
              Kembali ke Beranda
            </Link>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link to="/" className="text-sm text-slate-500 hover:text-violet-600 flex items-center gap-1">
              <ChevronLeft size={16} /> Kembali
            </Link>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <button onClick={handleLogout} className="text-sm text-rose-500 font-bold hover:text-rose-600">Logout</button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
              <Package size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kelola Produk</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/admin/orders"
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-sm"
          >
            <ShoppingBag size={20} />
            Pesanan
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
          <button 
            onClick={() => handleOpenModal()}
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-violet-200"
          >
            <Plus size={20} />
            Tambah Produk
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center gap-2 bg-slate-50/50">
          <Search className="text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari produk..." 
            className="bg-transparent border-none outline-none w-full font-medium text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Produk</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Harga</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400">Memuat...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400">Tidak ada produk ditemukan.</td></tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={product.image_url ? (product.image_url.startsWith('http') ? product.image_url : `${apiUrl}${product.image_url}`) : 'https://via.placeholder.com/100'} 
                        alt={product.name} 
                        className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize text-slate-600 font-medium">{product.category}</td>
                  <td className="px-6 py-4 font-black text-rose-600">Rp {product.price.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggleAvailable(product)}
                      className={clsx(
                        "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                        product.available 
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                          : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                      )}
                    >
                      {product.available ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {product.available ? 'Tersedia' : 'Habis'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
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
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h2>
              <p className="text-slate-500 text-sm mt-1">Lengkapi detail informasi produk di bawah ini.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nama Produk</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none transition-all font-bold text-slate-900"
                    placeholder="Contoh: Burger Rempoah"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Kategori</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none transition-all font-bold text-slate-900"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="makanan">Makanan</option>
                    <option value="minuman">Minuman</option>
                    <option value="camilan">Camilan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Harga (Rp)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none transition-all font-bold text-slate-900"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Deskripsi</label>
                <textarea 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none transition-all font-medium text-slate-700 resize-none"
                  rows="3"
                  placeholder="Ceritakan sedikit tentang produk ini..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Gambar Produk</label>
                <div className="flex items-center gap-4">
                  {editingProduct && formData.image_url && !imageFile && (
                    <img src={formData.image_url.startsWith('http') ? formData.image_url : `${apiUrl}${formData.image_url}`} alt="Current" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none transition-all font-medium text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-2">
                <input 
                  type="checkbox" 
                  id="available"
                  className="w-5 h-5 accent-violet-600 rounded"
                  checked={formData.available}
                  onChange={(e) => setFormData({...formData, available: e.target.checked})}
                />
                <label htmlFor="available" className="text-sm font-bold text-slate-700">Tersedia untuk dipesan</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-[2] px-6 py-4 rounded-2xl font-bold bg-slate-900 text-white hover:bg-violet-600 transition-all shadow-lg shadow-slate-200"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
