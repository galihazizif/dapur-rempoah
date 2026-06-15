import React, { useState } from 'react';
import { MenuCard } from './MenuCard';

export const MenuSection = ({ menu = [], loading, error }) => {
  const [filter, setFilter] = useState('all');
  
  const categories = ['all', 'makanan', 'minuman', 'camilan'];
  
  const filteredMenu = filter === 'all' 
    ? menu 
    : menu.filter(item => item.category === filter);

  return (
    <section id="menu" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Menu Kami
          </h2>
          <p className="mt-4 text-xl text-slate-500">
            Pilih hidangan favoritmu dari dapur kami.
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-200 ${
                filter === cat
                  ? 'bg-lime-600 text-white shadow-lg shadow-lime-200'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMenu.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
            {filteredMenu.length === 0 && (
              <div className="col-span-full text-center py-20 text-slate-500">
                Tidak ada menu untuk kategori ini.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
