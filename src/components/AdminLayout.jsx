import { useState, useEffect } from 'react';
import { Package, CreditCard, ShoppingBag, Ticket, Settings, LogOut, ShieldCheck, ChevronRight, Menu, X, Users } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

export function AdminLayout() {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('admin_token') || '');
  const [showLogin, setShowLogin] = useState(!localStorage.getItem('admin_token'));
  const [password, setPassword] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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
    navigate('/');
  };

  if (showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100 animate-in fade-in zoom-in duration-300">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white mx-auto mb-4 shadow-md">
              <ShieldCheck size={32} />
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
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-bold text-slate-900 text-center tracking-widest"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-lime-600 hover:bg-lime-700 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-lime-200"
            >
              Masuk
            </button>
            <button 
              type="button"
              onClick={() => navigate('/')} 
              className="w-full block text-center text-sm font-bold text-slate-400 hover:text-slate-600 transition-all pt-2"
            >
              Kembali ke Beranda
            </button>
          </form>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Produk', path: '/admin', icon: <Package size={20} /> },
    { name: 'Pesanan', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Pelanggan', path: '/admin/customers', icon: <Users size={20} /> },
    { name: 'Konfirmasi Pembayaran', path: '/admin/payments', icon: <CreditCard size={20} /> },
    { name: 'Voucher', path: '/admin/vouchers', icon: <Ticket size={20} /> },
    { name: 'Pengaturan', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 fixed md:sticky top-0 h-screen shadow-sm z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-md">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Manage</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>
          <button 
            className="md:hidden text-slate-500 hover:text-slate-900 p-1"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Menu Utama</div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold transition-all ${
                    isActive
                      ? 'bg-lime-50 text-lime-700 shadow-sm'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
                {/* Visual indicator when active */}
                <span className="hidden group-[.active]:block">
                  <ChevronRight size={16} />
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-2xl font-bold transition-colors"
          >
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header (fallback) */}
        <div className="md:hidden flex items-center p-4 bg-white border-b border-slate-200 gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1 flex justify-between items-center">
            <h2 className="text-lg font-black text-slate-900">Admin Panel</h2>
            <button onClick={handleLogout} className="text-sm font-bold text-rose-500 p-2">
              Keluar
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto w-full">
          {/* We pass down the admin authentication props so pages can fetch data */}
          <Outlet context={{ adminToken, setAdminToken, setShowLogin }} />
        </div>
      </main>
    </div>
  );
}
