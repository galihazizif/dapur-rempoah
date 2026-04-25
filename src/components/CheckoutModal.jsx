import React from 'react';
import { X } from 'lucide-react';
import { OrderForm } from './OrderForm';
import { cn } from '../lib/utils';

export const CheckoutModal = ({ isOpen, onClose }) => {
  return (
    <div className={cn(
      "fixed inset-0 z-[110] transition-opacity duration-300",
      isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className={cn(
        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl transition-all duration-300 p-8",
        isOpen ? "scale-100 translate-y-[-50%]" : "scale-95 translate-y-[-45%]"
      )}>
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">Informasi Pengiriman</h2>
        <p className="text-slate-500 mb-8">Silakan lengkapi data di bawah ini untuk memproses pesanan Anda.</p>
        
        <OrderForm onSuccess={onClose} />
      </div>
    </div>
  );
};
