import { Hero } from '../components/Hero';
import { MenuSection } from '../components/MenuSection';
import { useSettingsStore } from '../store/useSettingsStore';

export function Home({ menu, loading, error }) {
  const { settings } = useSettingsStore();

  return (
    <main>
      {settings?.store_status === 'closed' && (
        <div className="bg-rose-50 border-b border-rose-200 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center text-rose-700 text-sm font-bold text-center gap-2">
            <span>⛔</span> {settings.store_message || "Maaf, toko sedang libur. Anda tidak dapat memesan saat ini."}
          </div>
        </div>
      )}
      <Hero />
      <MenuSection
        menu={menu}
        loading={loading}
        error={error}
      />
    </main>
  );
}
