import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { useMenu } from './hooks/useMenu';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { menu, loading, error } = useMenu();

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onCartClick={() => setIsCartOpen(true)} />

      <main>
        <Hero />
        <MenuSection
          menu={menu}
          loading={loading}
          error={error}
        />
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Dapur Rempoah
              </h3>
              <p className="text-slate-500">
                Masakan Rumahan, serasa makan masakan Ibu.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Navigasi</h4>
              <ul className="space-y-2 text-slate-500">
                <li><a href="#menu" className="hover:text-violet-600 transition-colors">Menu</a></li>
                <li><a href="#" className="hover:text-violet-600 transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-violet-600 transition-colors">Promo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Kontak</h4>
              <ul className="space-y-2 text-slate-500">
                <li>Babakan RT 09 / RW 02</li>
                <li>Purbalingga, Jawa Tengah</li>
                <li>WhatsApp: wa.me/628511705626</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100 text-center text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Dapur Rempoah - Babakan. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Overlays */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleOpenCheckout}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
}

export default App;
