import { useEffect } from 'react';
import { useLocation, useSearch } from 'wouter';
import { useLang, useMeta } from '@/lib/i18n';
import { BundleSection, CategoryTiles, Hero, Marquee, Newsletter, SurfaceAndShop, WhySection } from '@/components/rakla/Sections';
import { useStore } from '@/lib/store';

export default function Home() {
  const { lang } = useLang();
  const store = useStore();
  const [, setLocation] = useLocation();
  const search = useSearch();
  useMeta(
    lang === 'ar' ? 'ركلة RAKLA | جهّز نفسك قبل الصافرة — معدات كرة القدم في الكويت' : 'RAKLA ركلة | Gear up before the whistle — Football gear in Kuwait',
    lang === 'ar'
      ? 'أحذية FG وAG وTF وIN، كرات، قفازات حراس ومعدات تدريب. تسوّق حسب الملعب، توصيل نفس اليوم بالكويت. متجر تجريبي لمشروع مدرسي.'
      : 'FG, AG, TF and IN boots, balls, keeper gloves and training gear. Shop by pitch, same-day Kuwait delivery. Demo store for a school project.',
  );
  useEffect(() => {
    if (new URLSearchParams(search).get('checkout') === '1') {
      store.setCheckoutOpen(true);
      setLocation('/');
    }
  }, [search, store.setCheckoutOpen, setLocation]);
  return (
    <>
      <Hero />
      <Marquee />
      <CategoryTiles />
      <SurfaceAndShop />
      <BundleSection />
      <WhySection />
      <Newsletter />
    </>
  );
}
