import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Heart, Languages, LogOut, Menu, Search, ShoppingBag, UserRound } from 'lucide-react';
import { useLang, type TKey } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import type { Category } from '@/lib/catalog';
import { BrandLogo, BrandIcon } from './Logo';
import { Drawer } from './Overlay';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

type Target = 'top' | 'offers' | Category | 'shop' | 'surfaces';
export const NAV: { key: TKey; target: Target }[] = [
  { key: 'nav_home', target: 'top' },
  { key: 'nav_boots', target: 'boots' },
  { key: 'nav_balls', target: 'balls' },
  { key: 'nav_gk', target: 'gk' },
  { key: 'nav_wear', target: 'wear' },
  { key: 'nav_offers', target: 'offers' },
];

export function useShopNav() {
  const [loc, setLoc] = useLocation();
  const { setFilters } = useStore();
  return (target: Target) => {
    const id = target === 'top' ? 'top' : target === 'offers' ? 'bundle' : target === 'surfaces' ? 'surfaces' : 'shop';
    if (target !== 'top' && target !== 'offers' && target !== 'shop' && target !== 'surfaces') setFilters({ category: target, surface: 'all', q: '' });
    const go = () => {
      if (id === 'top') window.scrollTo({ top: 0 });
      else document.getElementById(id)?.scrollIntoView({ block: 'start' });
    };
    if (loc !== '/') { setLoc('/'); setTimeout(go, 80); } else go();
  };
}

function CountBadge({ n, testId }: { n: number; testId: string }) {
  if (!n) return null;
  return (
    <motion.span key={n} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 600, damping: 15 }} data-testid={testId}
      className="absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-volt px-1 font-display text-[11px] font-black text-ink">
      {n}
    </motion.span>
  );
}

export function Navbar() {
  const { t, toggle } = useLang();
  const s = useStore();
  const auth = useAuth();
  const go = useShopNav();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24);
    f(); window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);

  const iconBtn = 'relative grid h-9 w-9 place-items-center rounded-full text-chalk transition hover:bg-chalk/10 focus-visible:outline-2 focus-visible:outline-volt sm:h-10 sm:w-10';

  return (
    <header className={cn('sticky top-0 z-40 transition-colors duration-300', scrolled ? 'bg-ink/92 backdrop-blur-md shadow-[0_8px_30px_-12px_rgba(0,0,0,.5)]' : 'bg-pitch')}>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-1.5 px-4 sm:gap-3 md:h-[72px] md:px-6">
        <button className={cn(iconBtn, 'lg:hidden')} onClick={() => setMenu(true)} aria-label={t('menu')} data-testid="button-menu"><Menu className="h-5 w-5" /></button>
        <Link href="/" className="flex shrink-0 items-center" aria-label="RAKLA ركلة" data-testid="link-logo">
          <BrandIcon className="h-7 w-7 sm:hidden" />
          <BrandLogo variant="light" className="ms-1 h-6 sm:hidden" />
          <BrandLogo variant="light" className="hidden h-10 sm:block" />
        </Link>
        <nav className="ms-6 hidden items-center gap-1 lg:flex" aria-label="primary">
          {NAV.map((n) => (
            <button key={n.key} onClick={() => go(n.target)} data-testid={`link-nav-${n.target}`}
              className={cn('group relative px-3 py-2 font-display text-sm font-semibold text-chalk/80 transition hover:text-chalk', n.target === 'offers' && 'text-volt hover:text-volt')}>
              {t(n.key)}
              <span className="absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 -skew-x-12 bg-volt transition-transform duration-300 group-hover:scale-x-100 rtl:origin-right" />
            </button>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-0.5 sm:gap-1">
          <button className={iconBtn} onClick={() => s.setSearchOpen(true)} aria-label={t('search')} data-testid="button-search"><Search className="h-5 w-5" /></button>
          <button className={iconBtn} onClick={() => s.setFavOpen(true)} aria-label={t('favorites')} data-testid="button-favorites">
            <Heart className="h-5 w-5" /><CountBadge n={s.favs.length} testId="text-fav-count" />
          </button>
          <motion.button key={s.bump} animate={s.bump ? { y: [0, -8, 0, -3, 0], rotate: [0, -8, 6, 0] } : {}} transition={{ duration: 0.6 }}
            className={iconBtn} onClick={() => s.setCartOpen(true)} aria-label={t('cart')} data-testid="button-cart">
            <ShoppingBag className="h-5 w-5" /><CountBadge n={s.count} testId="text-cart-count" />
          </motion.button>
          <Link href={auth.user ? '/orders' : '/login'} className={cn(iconBtn, 'xl:inline-flex xl:h-10 xl:w-auto xl:gap-2 xl:px-2')} aria-label={auth.user ? t('nav_account') : t('nav_login')} title={auth.user ? t('nav_account') : t('nav_login')} data-testid="link-account">
            <UserRound className="h-5 w-5 shrink-0" /><span className="hidden whitespace-nowrap xl:inline">{auth.user ? t('nav_account') : t('nav_login')}</span>
          </Link>
          {auth.user && <button onClick={auth.logout} className={cn(iconBtn, 'hidden lg:grid')} aria-label={t('nav_logout')} title={t('nav_logout')} data-testid="button-logout"><LogOut className="h-4 w-4" /></button>}
          <button onClick={toggle} data-testid="button-lang"
            className="ms-1 hidden items-center gap-1.5 rounded-full border border-chalk/25 px-3 py-1.5 font-display text-xs font-bold text-chalk transition hover:border-volt hover:text-volt sm:flex">
            <Languages className="h-4 w-4" />{t('lang_switch')}
          </button>
          <button onClick={toggle} className={cn(iconBtn, 'sm:hidden')} aria-label={t('lang_switch')} data-testid="button-lang-mobile">
            <span className="font-display text-xs font-black">{t('lang_switch') === 'English' ? 'EN' : 'ع'}</span>
          </button>
        </div>
      </div>
      <Drawer open={menu} onOpenChange={setMenu} side="start" title={<span className="flex items-center gap-3"><BrandLogo variant="light" className="h-8" /><span>{t('menu')}</span></span>} testId="drawer-menu">
        <nav className="flex flex-col p-3">
          {NAV.map((n, i) => (
            <motion.button key={n.key} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
              onClick={() => { setMenu(false); setTimeout(() => go(n.target), 220); }} data-testid={`link-mobile-${n.target}`}
              className="flex items-center justify-between border-b border-ink/10 px-3 py-4 text-start font-display text-2xl font-extrabold text-ink transition hover:text-pitch">
              {t(n.key)}<span className="h-1.5 w-6 -skew-x-12 bg-volt" />
            </motion.button>
          ))}
          <Link href="/brand" onClick={() => setMenu(false)} data-testid="link-mobile-brand" className="px-3 py-4 font-display text-lg font-bold text-pitch underline-offset-4 hover:underline">{t('nav_brand')}</Link>
          <Link href={auth.user ? '/orders' : '/login'} onClick={() => setMenu(false)} data-testid="link-mobile-account" className="flex items-center gap-2 px-3 py-4 font-display text-lg font-bold text-pitch">
            <UserRound className="h-5 w-5" />{auth.user ? t('nav_orders') : t('nav_login')}
          </Link>
          {!auth.user && <Link href="/signup" onClick={() => setMenu(false)} data-testid="link-mobile-signup" className="px-3 py-3 text-sm font-semibold text-pitch">{t('nav_signup')}</Link>}
          {auth.user && <button onClick={() => { auth.logout(); setMenu(false); }} data-testid="button-mobile-logout" className="flex items-center gap-2 px-3 py-4 text-start font-display text-lg font-bold text-pitch"><LogOut className="h-5 w-5" />{t('nav_logout')}</button>}
          <button onClick={toggle} data-testid="button-lang-menu" className="mx-3 mt-4 flex items-center justify-center gap-2 rounded-full bg-pitch py-3 font-display font-bold text-chalk">
            <Languages className="h-4 w-4" />{t('lang_switch')}
          </button>
        </nav>
      </Drawer>
    </header>
  );
}
