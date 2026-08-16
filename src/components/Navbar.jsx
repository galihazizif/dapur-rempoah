import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu as MenuIcon, X } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { GoogleLogin } from '@react-oauth/google';

export const Navbar = ({ onCartClick }) => {
  const itemCount = useCartStore((state) => state.getItemCount());
  const { token, customer, setAuth, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await fetch(`${apiUrl}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      });
      const data = await res.json();
      if (data.success) {
        setAuth(data.token, data.customer);
      } else {
        alert("Gagal login dengan Google");
      }
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-green">
              Dapur Rempoah
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-slate-700 hover:text-lime-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Menu</Link>
              <a href="#" className="text-slate-700 hover:text-lime-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Tentang Kami</a>
              <Link to="/history" className="text-slate-700 hover:text-lime-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Riwayat</Link>
              
              {!token ? (
                <div className="ml-4 transform scale-90 inline-block align-middle origin-left">
                  <GoogleLogin 
                    onSuccess={handleGoogleSuccess}
                    onError={() => console.log('Login failed')}
                    useOneTap
                    shape="pill"
                  />
                </div>
              ) : (
                <div className="relative group inline-flex items-center ml-4 cursor-pointer">
                  <img src={customer?.picture || '/default-avatar.png'} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 transform origin-top translate-y-1 group-hover:translate-y-0 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-sm font-bold text-slate-800 truncate">{customer?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{customer?.email}</p>
                    </div>
                    <button 
                      onClick={logout}
                      className="w-full text-left px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 font-bold transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onCartClick}
              className="relative p-2 text-slate-700 hover:text-lime-600 transition-colors"
            >
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-pink-600 rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-700 hover:text-lime-600 transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64 border-t border-slate-100 bg-white' : 'max-h-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-2 shadow-inner">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="block px-4 py-3 rounded-2xl text-slate-700 hover:bg-lime-50 hover:text-lime-600 font-medium transition-all"
          >
            Menu
          </Link>
          <a
            href="#"
            onClick={() => setIsMenuOpen(false)}
            className="block px-4 py-3 rounded-2xl text-slate-700 hover:bg-lime-50 hover:text-lime-600 font-medium transition-all"
          >
            Tentang Kami
          </a>
            <Link
            to="/history"
            onClick={() => setIsMenuOpen(false)}
            className="block px-4 py-3 rounded-2xl text-slate-700 hover:bg-lime-50 hover:text-lime-600 font-medium transition-all"
          >
            Riwayat Pesanan
          </Link>
          
          {/* Mobile Auth */}
          <div className="pt-2 mt-2 border-t border-slate-100">
            {!token ? (
              <div className="px-4 py-2">
                <GoogleLogin 
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.log('Login failed')}
                  width="100%"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <img src={customer?.picture || '/default-avatar.png'} alt="Profile" className="w-10 h-10 rounded-full border border-slate-200" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{customer?.name}</p>
                    <p className="text-xs text-slate-500">{customer?.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
