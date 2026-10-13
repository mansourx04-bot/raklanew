import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight, BadgePercent, Banknote, CheckCircle2, Mail, MapPin, Quote, RefreshCcw, RotateCcw, Ruler, SearchX, Timer, Truck, Users, TrendingUp, ShieldCheck } from 'lucide-react';
import { formatKWD, useLang, type TKey } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import { BUNDLE, CATEGORIES, SURFACES, img, type Surface } from '@/lib/catalog';
import { ProductCard, Stars } from './ProductCard';
import { Countdown, matches } from './Overlays';
import { useShopNav } from './Navbar';
import { cn } from '@/lib/utils';

const Arrow = ({ className }: { className?: string }) => {
  const { dir } = useLang();
  const I = dir === 'rtl' ? ArrowLeft : ArrowRight;
  return <I className={className} />;
};

function SectionHead({ kicker, title, sub, light }: { kicker?: string; title: string; sub?: string; light?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5 }} className="mb-8 md:mb-12">
      {kicker && <p className="mb-2 flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[.2em] text-pitch"><span className="h-1 w-8 -skew-x-12 bg-volt" />{kicker}</p>}
      <h2 className={cn('font-display text-4xl font-black leading-[1.05] md:text-6xl', light ? 'text-chalk' : 'text-ink')}>{title}</h2>
      {sub && <p className={cn('mt-3 max-w-xl text-base', light ? 'text-chalk/70' : 'text-stone')}>{sub}</p>}
    </motion.div>
  );
}

export function Hero() {
  const { t, lang } = useLang();
  const go = useShopNav();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 90]);
  const rot = useTransform(scrollY, [0, 600], [0, -6]);
  const words = [t('hero_h1a'), t('hero_h1b')];
  return (
    <section id="top" className="relative overflow-hidden bg-pitch text-chalk speed-cut">
      <div className="pitch-lines absolute inset-0" />
      <svg className="pointer-events-none absolute -start-32 top-1/2 h-[640px] w-[640px] -translate-y-1/2 opacity-[.09]" viewBox="0 0 200 200" aria-hidden>
        <circle cx="100" cy="100" r="60" fill="none" stroke="#F5F5F0" strokeWidth="1" /><path d="M100 0v200" stroke="#F5F5F0" /><circle cx="100" cy="100" r="2" fill="#F5F5F0" />
      </svg>
      <svg className="pointer-events-none absolute bottom-10 end-0 h-48 w-[60%] opacity-[.08]" viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden><path d="M0 100V20h400v80M120 100V60h160v40" fill="none" stroke="#F5F5F0" strokeWidth="1.5" /></svg>
      <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 pb-28 pt-10 md:grid-cols-[1.05fr_1fr] md:px-6 md:pb-36 md:pt-16">
        <div className="relative z-10">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-volt/40 px-3 py-1 font-display text-xs font-bold text-volt">
            <span className="h-2 w-2 animate-pulse rounded-full bg-volt" />{t('hero_kicker')}
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="font-display text-lg font-bold text-chalk/70 md:text-xl" data-testid="text-slogan">{t('slogan')}</motion.p>
          <h1 className="mt-2 font-display text-[3.2rem] font-black leading-[0.98] tracking-tight sm:text-5xl lg:text-[4rem]">
            {words.map((w, i) => (
              <span key={w} className="block pb-1">
                <motion.span initial={{ y: 12, opacity: 0.8 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }} className={cn('block', i === 1 && 'text-volt')}>{w}</motion.span>
              </span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mt-5 max-w-md text-base leading-relaxed text-chalk/75 md:text-lg">{t('hero_sub')}</motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => go('shop')} data-testid="button-shop-now" className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-volt px-7 py-4 font-display font-extrabold text-ink transition active:scale-95">
              <span className="slash-run absolute inset-y-0 start-0 w-10 bg-white/50" />
              <span className="relative">{t('shop_now')}</span><Arrow className="relative h-5 w-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </button>
            <button onClick={() => go('surfaces')} data-testid="button-shop-pitch" className="flex items-center gap-2 rounded-full border-2 border-chalk/30 px-6 py-4 font-display font-bold text-chalk transition hover:border-chalk hover:bg-chalk/5">
              <MapPin className="h-5 w-5" />{t('shop_pitch')}
            </button>
          </motion.div>
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-10 grid max-w-lg grid-cols-3 gap-2">
            {([[Truck, 'trust_same'], [Banknote, 'trust_cod'], [RefreshCcw, 'trust_ex']] as const).map(([I, k]) => (
              <li key={k} className="flex flex-col gap-1.5 rounded-xl border border-chalk/10 bg-chalk/5 p-3 text-xs font-semibold leading-tight text-chalk/85 sm:flex-row sm:items-center" data-testid={`badge-${k}`}>
                <I className="h-5 w-5 shrink-0 text-volt" />{t(k)}
              </li>
            ))}
          </motion.ul>
        </div>
        <motion.div style={{ y, rotate: rot }} className="relative -mx-4 md:mx-0">
          <motion.div initial={{ opacity: 0, scale: 0.85, x: 80 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }} className="relative">
            <div className="absolute inset-[8%] -skew-x-12 rounded-3xl bg-volt/15 blur-2xl" />
            <img src={img('hero-boot.jpg')} alt="RAKLA boot" className="relative aspect-[4/3] w-full rounded-[28px] object-cover shadow-[0_40px_80px_-30px_rgba(0,0,0,.7)] md:aspect-[5/4]" data-testid="img-hero" />
            <div className="absolute -bottom-4 start-4 -skew-x-12 bg-volt px-4 py-2 font-display text-sm font-black text-ink shadow-lg md:start-8">
              <span className="inline-block skew-x-12">RAKLA Strike FG · {formatKWD(24.5, lang)}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function Marquee() {
  const { t } = useLang();
  const items = [t('slogan'), 'FG · AG · TF · IN', t('trust_same'), t('trust_cod'), t('trust_ex')];
  const row = [...items, ...items];
  return (
    <div className="relative -mt-10 overflow-hidden py-4" aria-hidden>
      <div className="-rotate-2 bg-volt py-3">
        <div className="marquee flex w-max gap-10 whitespace-nowrap font-display text-lg font-black uppercase text-ink" dir="ltr">
          {[...row, ...row].map((x, i) => <span key={i} className="flex items-center gap-10">{x}<span className="h-2 w-6 -skew-x-12 bg-pitch" /></span>)}
        </div>
      </div>
    </div>
  );
}

export function CategoryTiles() {
  const { t } = useLang();
  const go = useShopNav();
  const { products } = useStore();
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <SectionHead kicker="01" title={t('cats_title')} sub={t('cats_sub')} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-6">
        {CATEGORIES.map((c, i) => (
          <motion.button key={c.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            onClick={() => go(c.id)} data-testid={`tile-category-${c.id}`}
            className={cn('group relative aspect-[3/4] overflow-hidden rounded-2xl bg-ink text-start', i === 0 && 'lg:col-span-2 lg:aspect-auto')}>
            <img src={c.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="font-display text-xs font-bold text-volt">{products.filter((p) => p.category === c.id).length} {t('items')}</p>
              <p className="font-display text-xl font-black text-chalk md:text-2xl">{t(`cat_${c.id}`)}</p>
              <span className="mt-2 block h-1 w-8 origin-left -skew-x-12 bg-volt transition-transform duration-300 group-hover:scale-x-[2.5] rtl:origin-right" />
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

function SurfaceGlyph({ s }: { s: Surface }) {
  const map: Record<Surface, React.ReactNode> = {
    FG: <g>{[10, 24, 38, 52].map((x) => <path key={x} d={`M${x} 22 l3 10 h-6z`} />)}</g>,
    AG: <g>{[8, 16, 24, 32, 40, 48, 56].map((x) => <rect key={x} x={x - 2} y="24" width="4" height="6" rx="2" />)}</g>,
    TF: <g>{Array.from({ length: 12 }, (_, i) => <circle key={i} cx={6 + i * 5} cy="27" r="1.8" />)}</g>,
    IN: <rect x="4" y="25" width="56" height="4" rx="2" />,
  };
  return <svg viewBox="0 0 64 36" className="h-8 w-14" fill="currentColor" aria-hidden><rect x="2" y="16" width="60" height="6" rx="3" opacity=".35" />{map[s]}</svg>;
}

export function SurfaceAndShop() {
  const { t, lang } = useLang();
  const { filters, setFilters, products, productsLoading, productsUnavailable } = useStore();
  const list = useMemo(() => {
    let l = products.filter((p) => (filters.category === 'all' || p.category === filters.category) && (filters.surface === 'all' || p.surfaces.includes(filters.surface)) && matches(p, filters.q));
    if (filters.sort === 'low') l = [...l].sort((a, b) => a.price - b.price);
    if (filters.sort === 'high') l = [...l].sort((a, b) => b.price - a.price);
    if (filters.sort === 'rating') l = [...l].sort((a, b) => b.rating - a.rating);
    return l;
  }, [filters, products]);
  const dirty = filters.category !== 'all' || filters.surface !== 'all' || filters.q !== '' || filters.sort !== 'feat';
  const reset = () => setFilters({ category: 'all', surface: 'all', q: '', sort: 'feat' });
  const cats = ['all', ...CATEGORIES.map((c) => c.id)] as const;

  return (
    <>
      <section id="surfaces" className="scroll-mt-20 bg-ink py-20 text-chalk">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHead title={t('surf_title')} sub={t('surf_sub')} light />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SURFACES.map((s) => {
              const on = filters.surface === s;
              return (
                <button key={s} onClick={() => { setFilters({ surface: on ? 'all' : s, category: on ? filters.category : 'all' }); if (!on) setTimeout(() => document.getElementById('shop')?.scrollIntoView(), 120); }} aria-pressed={on} data-testid={`chip-surface-${s}`}
                  className={cn('group relative overflow-hidden rounded-2xl border p-5 text-start transition-all duration-300', on ? 'border-volt bg-volt text-ink' : 'border-chalk/15 bg-chalk/[.03] hover:-translate-y-1 hover:border-chalk/40')}>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-4xl font-black italic">{s}</span>
                    <SurfaceGlyph s={s} />
                  </div>
                  <p className="mt-3 font-display text-lg font-bold">{t(s)}</p>
                  <p className={cn('mt-1 text-sm leading-relaxed', on ? 'text-ink/75' : 'text-chalk/60')}>{t(`${s}_d` as TKey)}</p>
                  {on && <CheckCircle2 className="absolute bottom-4 end-4 h-5 w-5" />}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 md:px-6">
        <SectionHead kicker="02" title={t('shop_title')} sub={t('shop_sub')} />
        <div className="sticky top-16 z-20 -mx-4 mb-8 border-y border-ink/8 bg-background/90 px-4 py-3 backdrop-blur md:top-[72px] md:mx-0 md:rounded-2xl md:border">
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
            {cats.map((c) => (
              <button key={c} onClick={() => setFilters({ category: c })} aria-pressed={filters.category === c} data-testid={`filter-category-${c}`}
                className={cn('shrink-0 rounded-full px-4 py-2 font-display text-sm font-bold transition', filters.category === c ? 'bg-pitch text-chalk' : 'bg-ink/5 text-ink hover:bg-ink/10')}>
                {c === 'all' ? t('cat_all') : t(`cat_${c}`)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select value={filters.surface} onChange={(e) => setFilters({ surface: e.target.value as Surface | 'all' })} aria-label={t('surface')} data-testid="select-surface" className="rounded-full border border-ink/15 bg-chalk px-3 py-2 text-sm font-semibold">
              <option value="all">{t('surf_all')}</option>
              {SURFACES.map((s) => <option key={s} value={s}>{s} · {t(s)}</option>)}
            </select>
            <select value={filters.sort} onChange={(e) => setFilters({ sort: e.target.value as typeof filters.sort })} aria-label={t('sort')} data-testid="select-sort" className="rounded-full border border-ink/15 bg-chalk px-3 py-2 text-sm font-semibold">
              <option value="feat">{t('sort_feat')}</option><option value="low">{t('sort_low')}</option><option value="high">{t('sort_high')}</option><option value="rating">{t('sort_rating')}</option>
            </select>
            <input value={filters.q} onChange={(e) => setFilters({ q: e.target.value })} placeholder={t('filter_search')} data-testid="input-filter-search" className="min-w-0 flex-1 rounded-full border border-ink/15 bg-chalk px-4 py-2 text-sm outline-none focus:border-pitch sm:max-w-xs" />
            <span className="ms-auto font-display text-sm font-bold text-stone" data-testid="text-result-count">{list.length} {t('items')}</span>
            {dirty && <button onClick={reset} className="flex items-center gap-1 rounded-full bg-volt px-3 py-2 font-display text-xs font-bold text-ink" data-testid="button-reset-filters"><RotateCcw className="h-3.5 w-3.5" />{t('reset')}</button>}
          </div>
        </div>
        <motion.div layout className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
          </AnimatePresence>
        </motion.div>
        {productsLoading && (
          <p className="py-10 text-center font-semibold text-stone" role="status" data-testid="status-products-loading">{t('products_loading')}</p>
        )}
        {productsUnavailable && (
          <p className="mt-6 rounded-2xl border border-ink/10 bg-ink/5 px-5 py-4 text-center text-sm font-semibold text-stone" role="alert" data-testid="status-products-error">{t('products_error')}</p>
        )}
        {list.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center rounded-3xl border-2 border-dashed border-pitch/20 px-6 py-16 text-center" data-testid="state-empty-grid">
            <SearchX className="h-12 w-12 text-pitch" />
            <p className="mt-4 font-display text-2xl font-black">{t('empty_t')}</p>
            <p className="mt-1 text-stone">{t('empty_d')}</p>
            <button onClick={reset} className="mt-6 rounded-full bg-pitch px-6 py-3 font-display font-bold text-chalk" data-testid="button-empty-reset">{t('reset')}</button>
          </motion.div>
        )}
        <p className="sr-only" aria-live="polite">{list.length} {t('items')} {lang}</p>
      </section>
    </>
  );
}

export function BundleSection() {
  const { t, lang } = useLang();
  const s = useStore();
  const parts = BUNDLE.parts.map((id) => s.products.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const pct = s.bundleFull ? Math.round((1 - BUNDLE.price / s.bundleFull) * 100) : 0;
  return (
    <section id="bundle" className="scroll-mt-16 px-4 py-10 md:px-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-pitch text-chalk">
        <div className="pitch-lines absolute inset-0" />
        <div className="absolute -end-20 -top-20 h-80 w-80 rounded-full border-[3px] border-chalk/10" />
        <div className="relative grid gap-8 p-6 md:grid-cols-2 md:p-12">
          <div>
            <p className="inline-flex -skew-x-12 items-center gap-2 bg-volt px-3 py-1 font-display text-xs font-black text-ink"><span className="flex skew-x-12 items-center gap-1.5"><BadgePercent className="h-4 w-4" />{t('bundle_kicker')} · -{pct}%</span></p>
            <h2 className="mt-4 font-display text-4xl font-black leading-tight md:text-5xl">{t('bundle_title')}</h2>
            <p className="mt-3 text-chalk/70">{t('bundle_sub')}</p>
            <div className="mt-6">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-chalk/70"><Timer className="h-4 w-4 text-volt" />{t('bundle_ends')}</p>
              <Countdown dark />
              <p className="mt-2 text-xs text-chalk/50" data-testid="text-bundle-demo">{t('bundle_demo')}</p>
            </div>
            <div className="mt-6 flex flex-wrap items-end gap-4">
              <div>
                <p className="text-xs text-chalk/60">{t('separately')}: <span className="line-through">{formatKWD(s.bundleFull, lang)}</span></p>
                <p className="font-display text-4xl font-black text-volt" data-testid="text-bundle-price">{formatKWD(BUNDLE.price, lang)}</p>
              </div>
              <button onClick={() => s.setBundleOpen(true)} className="group flex items-center gap-2 rounded-full bg-volt px-6 py-4 font-display font-extrabold text-ink transition hover:bg-[#d4ff4a] active:scale-95" data-testid="button-bundle-open">
                {t('bundle_cta')}<Arrow className="h-5 w-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </button>
            </div>
          </div>
          <div>
            <p className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-chalk/50">{t('bundle_includes')}</p>
            <ul className="space-y-3">
              {parts.map((p, i) => (
                <motion.li key={p.id} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 rounded-2xl bg-chalk p-3 text-ink" data-testid={`bundle-item-${p.id}`}>
                  <img src={p.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
                  <div className="flex-1"><p className="font-display font-bold">{p.name[lang]}</p><Stars rating={p.rating} /></div>
                  <span className="font-display font-bold">{formatKWD(p.price, lang)}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WhySection() {
  const { t } = useLang();
  const benefits = [[MapPin, 'why1', 'why1d'], [Ruler, 'why2', 'why2d'], [Truck, 'why3', 'why3d'], [BadgePercent, 'why4', 'why4d']] as const;
  const reviews = [['rev1', 'rev1n', 4.8], ['rev2', 'rev2n', 4.9], ['rev3', 'rev3n', 4.7]] as const;
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <SectionHead kicker="03" title={t('why_title')} />
      <div className="grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(([I, a, b], i) => (
          <motion.div key={a} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="group bg-chalk p-6 transition hover:bg-[#FBFBF7]">
            <div className="mb-5 grid h-12 w-12 -skew-x-6 place-items-center rounded-xl bg-pitch text-volt transition-transform group-hover:-rotate-6"><I className="h-6 w-6" /></div>
            <p className="font-display text-xl font-extrabold">{t(a)}</p>
            <p className="mt-2 text-sm leading-relaxed text-stone">{t(b)}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {([[Users, 'aud_title', 'aud_d'], [TrendingUp, 'sells_title', 'sells_d'], [ShieldCheck, 'whyus_title', 'whyus_d']] as const).map(([I, a, b]) => (
          <div key={a} className="border-s-4 border-volt ps-5">
            <p className="flex items-center gap-2 font-display text-lg font-black text-pitch"><I className="h-5 w-5" />{t(a)}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">{t(b)}</p>
          </div>
        ))}
      </div>
      <div className="mt-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <h3 className="font-display text-3xl font-black">{t('rev_title')}</h3>
          <p className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-stone" data-testid="text-reviews-note">{t('rev_note')}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map(([q, n, r], i) => (
            <motion.figure key={q} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={cn('relative rounded-3xl p-6', i === 1 ? 'bg-pitch text-chalk md:-translate-y-4' : 'bg-[#FBFBF7] border border-ink/8')}>
              <Quote className={cn('h-8 w-8', i === 1 ? 'text-volt' : 'text-pitch/30')} />
              <blockquote className="mt-3 font-display text-lg font-semibold leading-snug">{t(q)}</blockquote>
              <figcaption className="mt-4 flex items-center justify-between gap-2">
                <span className={cn('text-sm', i === 1 ? 'text-chalk/70' : 'text-stone')}>{t(n)}</span>
                <Stars rating={r} light={i === 1} />
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Newsletter() {
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const [err, setErr] = useState(false);
  const [ok, setOk] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setErr(true); return; }
    setErr(false); setOk(true); setEmail('');
  };
  return (
    <section className="px-4 pb-24 md:px-6">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[32px] bg-volt p-8 text-ink md:p-14">
        <svg className="pointer-events-none absolute -bottom-10 -end-10 h-64 w-64 opacity-20" viewBox="0 0 100 100" aria-hidden><circle cx="50" cy="50" r="45" fill="none" stroke="#0B3D2E" strokeWidth="3" /><path d="M5 50h90" stroke="#0B3D2E" strokeWidth="3" /></svg>
        <div className="relative grid items-center gap-6 md:grid-cols-2">
          <div>
            <Mail className="h-8 w-8 text-pitch" />
            <h2 className="mt-3 font-display text-4xl font-black leading-tight">{t('nl_title')}</h2>
            <p className="mt-2 text-ink/70">{t('nl_sub')}</p>
          </div>
          <AnimatePresence mode="wait">
            {ok ? (
              <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl bg-pitch p-6 text-chalk" role="status" data-testid="text-newsletter-success">
                <CheckCircle2 className="h-8 w-8 text-volt" />
                <p className="mt-2 font-display text-xl font-black">{t('nl_ok')}</p>
                <p className="mt-1 text-sm text-chalk/70">{t('nl_ok_d')}</p>
              </motion.div>
            ) : (
              <motion.form key="f" exit={{ opacity: 0 }} onSubmit={submit} noValidate>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <label htmlFor="nl-email" className="sr-only">{t('nl_ph')}</label>
                  <input id="nl-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); if (err) setErr(false); }} placeholder={t('nl_ph')} aria-invalid={err} dir="ltr" data-testid="input-newsletter"
                    className={cn('min-w-0 flex-1 rounded-full border-2 bg-chalk px-5 py-3.5 outline-none transition placeholder:text-start', err ? 'border-destructive' : 'border-transparent focus:border-pitch')} />
                  <button type="submit" className="rounded-full bg-pitch px-7 py-3.5 font-display font-extrabold text-chalk transition hover:bg-ink active:scale-95" data-testid="button-newsletter">{t('nl_btn')}</button>
                </div>
                {err && <motion.p initial={{ x: -6 }} animate={{ x: [6, -4, 0] }} role="alert" className="mt-2 text-sm font-bold text-destructive" data-testid="error-newsletter">{t('nl_err')}</motion.p>}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
