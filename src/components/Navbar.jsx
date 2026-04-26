import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu as MenuIcon, X } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export const Navbar = ({ onCartClick }) => {
  const itemCount = useCartStore((state) => state.getItemCount());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              <Link to="/" className="text-slate-700 hover:text-violet-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Menu</Link>
              <a href="#" className="text-slate-700 hover:text-violet-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Tentang Kami</a>
              <Link to="/history" className="text-slate-700 hover:text-violet-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Riwayat</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onCartClick}
              className="relative p-2 text-slate-700 hover:text-violet-600 transition-colors"
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
                className="p-2 text-slate-700 hover:text-violet-600 transition-colors"
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
            className="block px-4 py-3 rounded-2xl text-slate-700 hover:bg-violet-50 hover:text-violet-600 font-medium transition-all"
          >
            Menu
          </Link>
          <a
            href="#"
            onClick={() => setIsMenuOpen(false)}
            className="block px-4 py-3 rounded-2xl text-slate-700 hover:bg-violet-50 hover:text-violet-600 font-medium transition-all"
          >
            Tentang Kami
          </a>
          <Link
            to="/history"
            onClick={() => setIsMenuOpen(false)}
            className="block px-4 py-3 rounded-2xl text-slate-700 hover:bg-violet-50 hover:text-violet-600 font-medium transition-all"
          >
            Riwayat Pesanan
          </Link>
        </div>
      </div>
    </nav>
  );
};
