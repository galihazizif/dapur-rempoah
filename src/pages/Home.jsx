import { Hero } from '../components/Hero';
import { MenuSection } from '../components/MenuSection';

export function Home({ menu, loading, error }) {
  return (
    <main>
      <Hero />
      <MenuSection
        menu={menu}
        loading={loading}
        error={error}
      />
    </main>
  );
}
