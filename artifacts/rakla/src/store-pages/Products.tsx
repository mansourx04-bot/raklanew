import { useLang, useMeta } from '@/lib/i18n';
import { SurfaceAndShop } from '@/components/rakla/Sections';

export default function Products() {
  const { lang } = useLang();

  useMeta(
    lang === 'ar' ? 'منتجات ركلة | معدات كرة القدم في الكويت' : 'RAKLA Products | Football gear in Kuwait',
    lang === 'ar' ? 'تصفّح معدات ركلة لكرة القدم واختر حسب أرضية الملعب.' : 'Browse RAKLA football gear and filter by playing surface.',
  );

  return <SurfaceAndShop />;
}
