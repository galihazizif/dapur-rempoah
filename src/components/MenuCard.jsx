import React from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { cn } from '../lib/utils';

export const MenuCard = ({ item }) => {
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const storeStatus = useSettingsStore((state) => state.settings?.store_status);
  const cartItem = items.find((i) => i.id === item.id);
  const isAvailable = item.available && storeStatus === 'open';

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';
  
  const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/400x300?text=Menu';
    if (url.startsWith('http')) return url;
    return `${apiUrl}${url}`;
  };

  return (
    <div className={cn(
      "group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100",
      !isAvailable && "opacity-60 grayscale"
    )}>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={getImageUrl(item.image_url)} 
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
            <span className="text-white font-bold px-4 py-2 border-2 border-white rounded-full">
              {!item.available ? 'Habis' : 'Tutup'}
            </span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-slate-900 shadow-sm">
          Rp {item.price.toLocaleString('id-ID')}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-lime-600 transition-colors">
            {item.name}
          </h3>
          <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded-md uppercase tracking-wider">
            {item.category}
          </span>
        </div>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4 h-10">
          {item.description}
        </p>
        
        <button
          disabled={!isAvailable}
          onClick={() => addItem(item)}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition-all duration-200",
            isAvailable 
              ? "bg-slate-900 text-white hover:bg-lime-600 active:scale-95" 
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          )}
        >
          <ShoppingCart size={18} />
          {cartItem ? `Tambah Lagi (${cartItem.quantity})` : 'Tambah ke Keranjang'}
        </button>
      </div>
    </div>
  );
};
