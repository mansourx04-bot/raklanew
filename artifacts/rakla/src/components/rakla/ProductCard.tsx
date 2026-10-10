import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Eye, Heart, Plus, Star } from 'lucide-react';
import { toast } from 'sonner';
import { formatKWD, useLang } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import type { Product } from '@/lib/catalog';
import { cn } from '@/lib/utils';

export function Stars({ rating, reviews, light }: { rating: number; reviews?: number; light?: boolean }) {
  const { t } = useLang();
  return (
    <div className={cn('flex items-center gap-1 text-xs', light ? 'text-chalk/70' : 'text-stone')} aria-label={`${rating} / 5`}>
      <div className="flex" dir="ltr">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className={cn('h-3.5 w-3.5', i <= Math.round(rating) ? 'fill-pitch text-pitch' : 'text-ink/20', light && i <= Math.round(rating) && 'fill-volt text-volt')} />
        ))}
      </div>
      <span className="font-display font-bold">{rating.toFixed(1)}</span>
      {reviews !== undefined && <span>({reviews} {t('reviews')})</span>}
    </div>
  );
}

export function Price({ price, old, big }: { price: number; old?: number; big?: boolean }) {
  const { lang } = useLang();
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className={cn('font-display font-black text-ink', big ? 'text-3xl' : 'text-lg')}>{formatKWD(price, lang)}</span>
      {old && <span className="font-display text-sm text-stone line-through">{formatKWD(old, lang)}</span>}
    </div>
  );
}

export function FavButton({ id, className }: { id: string; className?: string }) {
  const { favs, toggleFav } = useStore();
  const { t } = useLang();
  const on = favs.includes(id);
  return (
    <motion.button whileTap={{ scale: 0.8 }} onClick={(e) => { e.stopPropagation(); toggleFav(id); }} aria-pressed={on} aria-label={on ? t('fav_remove') : t('fav_add')} data-testid={`button-fav-${id}`}
      className={cn('grid h-10 w-10 place-items-center rounded-full bg-chalk/90 shadow-sm backdrop-blur transition hover:bg-chalk focus-visible:outline-2 focus-visible:outline-pitch', className)}>
      <motion.span key={String(on)} initial={{ scale: on ? 0.3 : 1 }} animate={{ scale: on ? [0.3, 1.35, 1] : 1 }} transition={{ duration: 0.4 }}>
        <Heart className={cn('h-5 w-5', on ? 'fill-pitch text-pitch' : 'text-ink')} />
      </motion.span>
    </motion.button>
  );
}

export function useAddFlow() {
  const s = useStore();
  const { t, lang } = useLang();
  return (p: { id: string; name: { ar: string; en: string } }, size: string, qty = 1) => {
    s.add(p.id, size, qty);
    toast.success(`${p.name[lang]} — ${t('added_toast')}`, { description: size ? `${t('size')}: ${size} · ${t('qty')}: ${qty}` : `${t('qty')}: ${qty}` });
    setTimeout(() => s.setCartOpen(true), 650);
  };
}

export function ProductCard({ p, index }: { p: Product; index: number }) {
  const { t, lang } = useLang();
  const s = useStore();
  const addFlow = useAddFlow();
  const [done, setDone] = useState(false);
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

  const quickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (p.sizes.length > 1) { s.setQuick(p); return; }
    setDone(true);
    setTimeout(() => setDone(false), 1400);
    addFlow(p, p.sizes[0] ?? '');
  };

  return (
    <motion.article layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04, layout: { type: 'spring', stiffness: 300, damping: 30 } }}
      data-testid={`card-product-${p.id}`}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-ink/8 bg-[#FBFBF7] transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-24px_rgba(11,61,46,.45)]"
      onClick={() => s.setQuick(p)} role="button" tabIndex={0} aria-label={`${t('view')} ${p.name[lang]}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); s.setQuick(p); } }}>
      <div className="relative aspect-square overflow-hidden bg-chalk">
        <img src={p.image} alt={p.name[lang]} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.14] group-hover:-rotate-2" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="absolute start-3 top-3 flex flex-col items-start gap-1.5">
          {p.tag && (
            <span className={cn('-skew-x-12 px-2.5 py-1 font-display text-[11px] font-extrabold uppercase', p.tag === 'new' ? 'bg-volt text-ink' : 'bg-pitch text-chalk')}>
              <span className="inline-block skew-x-12">{p.tag === 'new' ? t('tag_new') : t('tag_best')}</span>
            </span>
          )}
          {discount > 0 && <span className="rounded bg-ink px-2 py-0.5 font-display text-[11px] font-bold text-volt">-{discount}%</span>}
        </div>
        <FavButton id={p.id} className="absolute end-3 top-3" />
        {p.category === 'boots' && (
          <span className="absolute bottom-3 start-3 rounded-full bg-ink/80 px-2.5 py-1 font-display text-[11px] font-bold text-chalk backdrop-blur" data-testid={`text-surface-${p.id}`}>
            {p.surfaces[0]} · {t(p.surfaces[0])}
          </span>
        )}
        <button onClick={quickAdd} data-testid={`button-quickadd-${p.id}`}
          className="absolute inset-x-3 bottom-3 flex translate-y-0 items-center justify-center gap-2 rounded-full bg-volt py-2.5 font-display text-sm font-extrabold text-ink shadow-lg transition-all duration-300 hover:bg-[#d4ff4a] focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-ink md:translate-y-[140%] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
          {done ? <><Check className="h-4 w-4" />{t('added')}</> : p.sizes.length > 1 ? <><Eye className="h-4 w-4" />{t('choose_size')}</> : <><Plus className="h-4 w-4" />{t('quick_add')}</>}
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4 pt-3.5">
        <span className="font-display text-[11px] font-bold uppercase tracking-wider text-pitch/70">{t(`cat_${p.category}`)}</span>
        <h3 className="font-display text-[15px] font-bold leading-snug text-ink" data-testid={`text-name-${p.id}`}>{p.name[lang]}</h3>
        <Stars rating={p.rating} reviews={p.reviews} />
        <div className="mt-auto pt-1" data-testid={`text-price-${p.id}`}><Price price={p.price} old={p.oldPrice} /></div>
      </div>
    </motion.article>
  );
}
