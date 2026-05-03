import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { cn } from '../lib/utils';

export const CartDrawer = ({ isOpen, onClose, onCheckout }) => {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const storeStatus = useSettingsStore((state) => state.settings?.store_status);
  const isClosed = storeStatus === 'closed';

  return (
    <div className={cn(
      "fixed inset-0 z-[100] transition-opacity duration-300",
      isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={cn(
        "absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag size={24} className="text-violet-600" />
              Keranjang Belanja
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-6 bg-slate-50 rounded-full text-slate-300">
                  <ShoppingBag size={64} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Wah, keranjang kosong!</h3>
                  <p className="text-slate-500">Yuk, pilih menu lezat kami untuk mengisinya.</p>
                </div>
                <button 
                  onClick={onClose}
                  className="px-6 py-2 bg-violet-600 text-white rounded-xl font-medium"
                >
                  Mulai Pesan
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate">{item.name}</h4>
                    <p className="text-violet-600 font-semibold text-sm">
                      Rp {item.price.toLocaleString('id-ID')}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-50 text-slate-500"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-50 text-slate-500"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-pink-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-500 font-medium">Total Pembayaran</span>
                <span className="text-2xl font-bold text-slate-900">
                  Rp {getTotal().toLocaleString('id-ID')}
                </span>
              </div>
              <button 
                onClick={onCheckout}
                disabled={isClosed}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all",
                  isClosed
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-slate-900 text-white hover:bg-violet-600 active:scale-[0.98]"
                )}
              >
                {isClosed ? 'Toko Tutup' : 'Lanjut ke Checkout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
