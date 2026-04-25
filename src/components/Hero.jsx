import React from 'react';
import { ChevronRight } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 lg:w-full lg:max-w-2xl">
          <main className="mx-auto max-w-7xl px-4 sm:px-6 md:mt-16 lg:px-8 lg:mt-20">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Masakan Rumahan</span>{' '}
                <span className="block text-violet-600 xl:inline">Obat kangen rumah</span>
              </h1>
              <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Dapur Rempoah menghadirkan hidangan tradisional dengan sentuhan modern. Kami menggunakan bahan-bahan segar dan rempah pilihan untuk pengalaman kuliner yang tak terlupakan.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <a
                    href="#menu"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    Pesan Sekarang
                  </a>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a
                    href="#"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-violet-700 bg-violet-100 hover:bg-violet-200 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    Lihat Promo
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop"
          alt="Dapur Rempoah Food"
        />
      </div>
    </div>
  );
};
