import React from 'react';
import { ShoppingCart, Menu as MenuIcon, X } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export const Navbar = ({ onCartClick }) => {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-pink-600 bg-clip-text text-transparent">
              Dapur Rempoah
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#" className="text-slate-700 hover:text-violet-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Menu</a>
              <a href="#" className="text-slate-700 hover:text-violet-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Tentang Kami</a>
              <a href="#" className="text-slate-700 hover:text-violet-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Kontak</a>
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
              <button className="p-2 text-slate-700">
                <MenuIcon size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
