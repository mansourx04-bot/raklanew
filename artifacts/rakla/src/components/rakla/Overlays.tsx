import { useEffect, useMemo, useRef, useState } from 'react';
import * as D from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Apple, Banknote, Check, CheckCircle2, CreditCard, Heart, Info, Minus, PackageCheck, Plus, Ruler, Search, ShieldCheck, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import { formatKWD, useLang } from '@/lib/i18n';
import { useStore, useCountdown, type ResolvedLine } from '@/lib/store';
import { AREAS, BUNDLE, FREE_OVER, PRODUCTS, bundleFull, type Product } from '@/lib/catalog';
import { Drawer, Modal } from './Overlay';
import { FavButton, Price, Stars, useAddFlow } from './ProductCard';
import { cn } from '@/lib/utils';

function QtyStepper({ value, onChange, testId }: { value: number; onChange: (n: number) => void; testId: string }) {
  const { t } = useLang();
  return (
    <div className="inline-flex items-center rounded-full border border-ink/15 bg-chalk" dir="ltr">
      <button onClick={() => onChange(value - 1)} aria-label="-" data-testid={`button-dec-${testId}`} className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-ink/5"><Minus className="h-4 w-4" /></button>
      <span className="w-8 text-center font-display font-bold" aria-label={t('qty')} data-testid={`text-qty-${testId}`}>{value}</span>
      <button onClick={() => onChange(value + 1)} aria-label="+" data-testid={`button-inc-${testId}`} className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-ink/5"><Plus className="h-4 w-4" /></button>
    </div>
  );
}

function FreeProgress() {
  const { t, lang } = useLang();
  const { subtotal } = useStore();
  const pct = Math.min(100, (subtotal / FREE_OVER) * 100);
  const got = subtotal > FREE_OVER;
  const left = Math.max(0, FREE_OVER - subtotal + 0.001);
  return (
    <div className="space-y-2 bg-pitch/5 px-5 py-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-pitch" data-testid="text-free-progress">
        <Truck className="h-4 w-4" />
        {got ? t('free_got') : t('free_left', { x: formatKWD(left, lang) })}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ink/10">
        <motion.div className="h-full origin-left rounded-full bg-gradient-to-r from-pitch to-volt rtl:origin-right" initial={false} animate={{ scaleX: pct / 100 }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
      </div>
      <p className="text-xs text-stone">{t('free_rule')}</p>
    </div>
  );
}

function Line({ l }: { l: ResolvedLine }) {
  const { lang, t } = useLang();
  const { setQty, remove } = useStore();
  return (
    <motion.li layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40, height: 0 }} className="flex gap-3 border-b border-ink/8 px-5 py-4" data-testid={`row-cart-${l.key}`}>
      <img src={l.image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-sm font-bold text-ink">{l.name[lang]}</p>
          <button onClick={() => remove(l.key)} aria-label={t('remove')} data-testid={`button-remove-${l.key}`} className="text-stone transition hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
        </div>
        {l.size && <p className="text-xs text-stone">{t('size')}: <span dir="ltr">{l.size}</span></p>}
        <div className="mt-2 flex items-center justify-between">
          <QtyStepper value={l.qty} onChange={(n) => setQty(l.key, n)} testId={l.key} />
          <span className="font-display font-black">{formatKWD(l.price * l.qty, lang)}</span>
        </div>
      </div>
    </motion.li>
  );
}

function Totals() {
  const { t, lang } = useLang();
  const { subtotal, delivery, total } = useStore();
  return (
    <dl className="space-y-1.5 text-sm">
      <div className="flex justify-between"><dt className="text-stone">{t('subtotal')}</dt><dd className="font-display font-bold" data-testid="text-subtotal">{formatKWD(subtotal, lang)}</dd></div>
      <div className="flex justify-between"><dt className="text-stone">{t('delivery')}</dt><dd className="font-display font-bold" data-testid="text-delivery">{delivery === 0 ? t('free') : formatKWD(delivery, lang)}</dd></div>
      <div className="flex justify-between border-t border-ink/10 pt-2 text-base"><dt className="font-bold">{t('total')}</dt><dd className="font-display text-lg font-black" data-testid="text-total">{formatKWD(total, lang)}</dd></div>
    </dl>
  );
}

function EmptyState({ icon: Icon, title, desc, onAction, action }: { icon: typeof Heart; title: string; desc: string; onAction: () => void; action: string }) {
  return (
    <div className="flex flex-col items-center px-8 py-16 text-center">
      <div className="relative mb-5 grid h-24 w-24 place-items-center rounded-full border-2 border-dashed border-pitch/25">
        <Icon className="h-9 w-9 text-pitch" />
        <span className="absolute -bottom-1 h-2 w-12 -skew-x-12 bg-volt" />
      </div>
      <p className="font-display text-xl font-extrabold">{title}</p>
      <p className="mt-1 text-sm text-stone">{desc}</p>
      <button onClick={onAction} className="mt-6 rounded-full bg-pitch px-6 py-3 font-display text-sm font-bold text-chalk transition hover:bg-ink" data-testid="button-empty-continue">{action}</button>
    </div>
  );
}

export function CartDrawer() {
  const { t } = useLang();
  const s = useStore();
  return (
    <Drawer open={s.cartOpen} onOpenChange={s.setCartOpen} title={<span className="flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-volt" />{t('cart_title')} ({s.count})</span>} testId="drawer-cart"
      footer={s.lines.length ? (
        <div className="space-y-4">
          <Totals />
          <button onClick={() => { s.setCartOpen(false); s.setCheckoutOpen(true); }} data-testid="button-checkout" className="w-full rounded-full bg-volt py-3.5 font-display font-extrabold text-ink transition hover:bg-[#d4ff4a] active:scale-[.98]">{t('checkout')}</button>
          <button onClick={() => s.setCartOpen(false)} className="w-full text-sm font-semibold text-pitch underline-offset-4 hover:underline" data-testid="button-continue">{t('continue')}</button>
        </div>
      ) : undefined}>
      {s.lines.length ? (
        <>
          <FreeProgress />
          <ul><AnimatePresence initial={false}>{s.lines.map((l) => <Line key={l.key} l={l} />)}</AnimatePresence></ul>
        </>
      ) : (
        <EmptyState icon={ShoppingBag} title={t('cart_empty')} desc={t('cart_empty_d')} action={t('continue')} onAction={() => s.setCartOpen(false)} />
      )}
    </Drawer>
  );
}

export function FavDrawer() {
  const { t, lang } = useLang();
  const s = useStore();
  const items = PRODUCTS.filter((p) => s.favs.includes(p.id));
  return (
    <Drawer open={s.favOpen} onOpenChange={s.setFavOpen} title={<span className="flex items-center gap-2"><Heart className="h-5 w-5 fill-volt text-volt" />{t('favorites')} ({items.length})</span>} testId="drawer-favorites">
      {items.length ? (
        <ul>
          <AnimatePresence initial={false}>
            {items.map((p) => (
              <motion.li layout key={p.id} exit={{ opacity: 0, x: -40 }} className="flex items-center gap-3 border-b border-ink/8 px-5 py-4" data-testid={`row-fav-${p.id}`}>
                <img src={p.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-bold">{p.name[lang]}</p>
                  <Price price={p.price} old={p.oldPrice} />
                  <button onClick={() => { s.setFavOpen(false); s.setQuick(p); }} className="mt-1 text-xs font-bold text-pitch underline-offset-4 hover:underline" data-testid={`button-fav-view-${p.id}`}>{t('view')}</button>
                </div>
                <FavButton id={p.id} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        <EmptyState icon={Heart} title={t('fav_empty')} desc={t('fav_empty_d')} action={t('continue')} onAction={() => s.setFavOpen(false)} />
      )}
    </Drawer>
  );
}

function Highlight({ text, q }: { text: string; q: string }) {
  if (!q.trim()) return <>{text}</>;
  const esc = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${esc})`, 'ig'));
  return <>{parts.map((p, i) => (p.toLowerCase() === q.trim().toLowerCase() ? <mark key={i} className="mark">{p}</mark> : <span key={i}>{p}</span>))}</>;
}

export function matches(p: Product, q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  return [p.name.ar, p.name.en, p.desc.ar, p.desc.en, p.category, ...p.surfaces].some((x) => x.toLowerCase().includes(s));
}

export function SearchOverlay() {
  const { t, lang, dir } = useLang();
  const s = useStore();
  const [q, setQ] = useState('');
  const results = useMemo(() => (q.trim() ? PRODUCTS.filter((p) => matches(p, q)) : []), [q]);
  const suggestions = lang === 'ar' ? ['حذاء', 'كرة', 'قفازات', 'AG', 'جوارب'] : ['Boots', 'Ball', 'Gloves', 'AG', 'Socks'];
  useEffect(() => { if (!s.searchOpen) setQ(''); }, [s.searchOpen]);
  return (
    <D.Root open={s.searchOpen} onOpenChange={s.setSearchOpen}>
      <D.Portal>
        <D.Overlay className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-md data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <D.Content dir={dir} data-testid="overlay-search" className="fixed inset-x-0 top-0 z-50 max-h-[90dvh] overflow-y-auto bg-pitch pb-6 shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-top">
          <D.Title className="sr-only">{t('search')}</D.Title>
          <D.Description className="sr-only">{t('search_hint')}</D.Description>
          <div className="mx-auto max-w-3xl px-4 pt-5">
            <div className="flex items-center gap-3 border-b-2 border-volt pb-3">
              <Search className="h-6 w-6 shrink-0 text-volt" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search_ph')} data-testid="input-search"
                className="min-w-0 flex-1 bg-transparent font-display text-xl font-bold text-chalk placeholder:text-chalk/40 focus:outline-none md:text-3xl" />
              <D.Close aria-label={t('close')} data-testid="button-close-search" className="grid h-10 w-10 place-items-center rounded-full bg-chalk/10 text-chalk hover:bg-volt hover:text-ink"><X className="h-5 w-5" /></D.Close>
            </div>
            {!q.trim() && <p className="mt-4 text-sm text-chalk/60">{t('search_hint')}</p>}
            {q.trim() && results.length > 0 && <p className="mt-4 text-xs font-bold uppercase tracking-wider text-volt" data-testid="text-search-count">{results.length} {t('results')}</p>}
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {results.map((p, i) => (
                <motion.li key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <button onClick={() => { s.setSearchOpen(false); s.setQuick(p); }} data-testid={`button-search-result-${p.id}`}
                    className="flex w-full items-center gap-3 rounded-xl bg-chalk/5 p-2 text-start text-chalk transition hover:bg-chalk/12 focus-visible:outline-2 focus-visible:outline-volt">
                    <img src={p.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-sm font-bold"><Highlight text={p.name[lang]} q={q} /></span>
                      <span className="text-xs text-chalk/60">{t(`cat_${p.category}`)} · {formatKWD(p.price, lang)}</span>
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>
            {(!q.trim() || results.length === 0) && (
              <div className="mt-5" data-testid="text-search-empty">
                {q.trim() && <p className="mb-3 font-display text-lg font-bold text-chalk">{t('search_none')} “{q}”</p>}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-chalk/60">{t('search_try')}</span>
                  {suggestions.map((x) => (
                    <button key={x} onClick={() => setQ(x)} data-testid={`button-suggest-${x}`} className="rounded-full border border-chalk/20 px-3 py-1.5 text-sm text-chalk transition hover:border-volt hover:text-volt">{x}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}

function SizePicker({ sizes, value, onChange, label, testId }: { sizes: string[]; value: string; onChange: (s: string) => void; label: string; testId: string }) {
  return (
    <div role="radiogroup" aria-label={label}>
      <p className="mb-2 font-display text-sm font-bold">{label}</p>
      <div className="flex flex-wrap gap-2" dir="ltr">
        {sizes.map((sz) => (
          <button key={sz} role="radio" aria-checked={value === sz} onClick={() => onChange(sz)} data-testid={`button-size-${testId}-${sz}`}
            className={cn('min-w-11 rounded-lg border px-3 py-2 font-display text-sm font-bold transition', value === sz ? 'border-pitch bg-pitch text-chalk' : 'border-ink/15 bg-chalk hover:border-pitch')}>
            {sz}
          </button>
        ))}
      </div>
    </div>
  );
}

export function QuickView() {
  const { t, lang } = useLang();
  const s = useStore();
  const p = s.quick;
  const addFlow = useAddFlow();
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState(false);
  const [done, setDone] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const [zoom, setZoom] = useState(false);
  useEffect(() => { setSize(p && p.sizes.length === 1 ? p.sizes[0] : ''); setQty(1); setErr(false); setDone(false); }, [p]);
  if (!p) return null;
  const needsSize = p.sizes.length > 1;
  const add = () => {
    if (needsSize && !size) { setErr(true); return; }
    setDone(true);
    addFlow(p, size, qty);
    setTimeout(() => s.setQuick(null), 550);
  };
  return (
    <Modal open={!!p} onOpenChange={(b) => !b && s.setQuick(null)} title={p.name[lang]} hideTitle className="max-w-4xl" testId="modal-quickview">
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden bg-chalk md:aspect-auto md:min-h-[520px]"
          onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`); }}
          onMouseEnter={() => setZoom(true)} onMouseLeave={() => setZoom(false)}>
          <img src={p.image} alt={p.name[lang]} className="h-full w-full object-cover transition-transform duration-300" style={{ transformOrigin: origin, transform: zoom ? 'scale(1.8)' : 'scale(1)' }} />
          <FavButton id={p.id} className="absolute start-3 top-3" />
        </div>
        <div className="flex flex-col gap-4 p-6 md:p-8">
          <span className="font-display text-xs font-bold uppercase tracking-wider text-pitch/70">{t(`cat_${p.category}`)}</span>
          <h2 className="-mt-2 font-display text-2xl font-black leading-tight md:text-3xl" data-testid="text-quick-name">{p.name[lang]}</h2>
          <Stars rating={p.rating} reviews={p.reviews} />
          <Price price={p.price} old={p.oldPrice} big />
          <p className="text-sm leading-relaxed text-ink/75">{p.desc[lang]}</p>
          <p className="text-xs text-stone" lang={lang === 'ar' ? 'en' : 'ar'} dir={lang === 'ar' ? 'ltr' : 'rtl'}>{p.desc[lang === 'ar' ? 'en' : 'ar']}</p>
          <div className="flex flex-wrap gap-1.5">
            {p.surfaces.map((x) => <span key={x} className="rounded-full bg-pitch/8 px-2.5 py-1 font-display text-[11px] font-bold text-pitch">{x} · {t(x)}</span>)}
          </div>
          {needsSize ? (
            <div>
              <SizePicker sizes={p.sizes} value={size} onChange={(v) => { setSize(v); setErr(false); }} label={t('choose_size') + (p.category === 'boots' ? ' (EU)' : '')} testId={p.id} />
              <AnimatePresence>{err && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="mt-2 text-sm font-semibold text-destructive" data-testid="text-size-error">{t('size_required')}</motion.p>}</AnimatePresence>
            </div>
          ) : (
            <p className="text-sm text-stone">{t('size')}: {p.sizes[0] ?? t('one_size')}</p>
          )}
          <button onClick={() => s.setGuideOpen(true)} className="flex w-fit items-center gap-1.5 text-sm font-bold text-pitch underline-offset-4 hover:underline" data-testid="button-size-guide"><Ruler className="h-4 w-4" />{t('size_guide')}</button>
          <div className="mt-auto flex items-center gap-3 pt-2">
            <QtyStepper value={qty} onChange={(n) => setQty(Math.max(1, Math.min(20, n)))} testId="quick" />
            <motion.button whileTap={{ scale: 0.96 }} onClick={add} data-testid="button-add-to-cart"
              className={cn('flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 font-display font-extrabold transition-colors', done ? 'bg-pitch text-chalk' : 'bg-volt text-ink hover:bg-[#d4ff4a]')}>
              <AnimatePresence mode="wait" initial={false}>
                {done ? (
                  <motion.span key="d" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} className="flex items-center gap-2"><Check className="h-5 w-5" />{t('added')}</motion.span>
                ) : (
                  <motion.span key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2"><ShoppingBag className="h-5 w-5" />{t('add_cart')}</motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function SizeGuide() {
  const { t } = useLang();
  const s = useStore();
  const boots = [['38', '24.0'], ['39', '24.6'], ['40', '25.3'], ['41', '26.0'], ['42', '26.6'], ['43', '27.3'], ['44', '28.0'], ['45', '28.6'], ['46', '29.3']];
  const wear = [['S', '88–96'], ['M', '96–104'], ['L', '104–112'], ['XL', '112–120']];
  const gloves = [['7', '17–18'], ['8', '19–20'], ['9', '21–22'], ['10', '23–24'], ['11', '25–26']];
  const Table = ({ head, rows }: { head: string; rows: string[][] }) => (
    <table className="w-full text-sm">
      <thead><tr className="bg-pitch text-chalk"><th className="px-3 py-2 text-start font-display">{t('size')}</th><th className="px-3 py-2 text-start font-display">{head}</th></tr></thead>
      <tbody>{rows.map(([a, b]) => <tr key={a} className="border-b border-ink/8 odd:bg-ink/[.03]"><td className="px-3 py-1.5 font-display font-bold" dir="ltr">{a}</td><td className="px-3 py-1.5" dir="ltr">{b}</td></tr>)}</tbody>
    </table>
  );
  return (
    <Modal open={s.guideOpen} onOpenChange={s.setGuideOpen} title={t('sg_title')} testId="modal-size-guide">
      <div className="space-y-5 p-6">
        <p className="flex gap-2 rounded-xl bg-volt/30 p-3 text-sm"><Ruler className="h-5 w-5 shrink-0 text-pitch" />{t('sg_d')}</p>
        <div><p className="mb-2 font-display font-bold">EU — {t('sg_foot')}</p><Table head={t('sg_foot')} rows={boots} /></div>
        <div><p className="mb-2 font-display font-bold">{t('sg_wear')}</p><Table head="cm" rows={wear} /></div>
        <div><p className="mb-2 font-display font-bold">{t('sg_glove')}</p><Table head="cm" rows={gloves} /></div>
      </div>
    </Modal>
  );
}

export function ContactDialog() {
  const { t } = useLang();
  const s = useStore();
  return (
    <Modal open={s.contactOpen} onOpenChange={s.setContactOpen} title={t('contact_title')} testId="modal-contact">
      <div className="p-6 pt-3">
        <div className="flex gap-3 rounded-xl bg-pitch/5 p-4"><Info className="h-5 w-5 shrink-0 text-pitch" /><p className="text-sm leading-relaxed">{t('contact_d')}</p></div>
        <button onClick={() => s.setContactOpen(false)} className="mt-5 w-full rounded-full bg-pitch py-3 font-display font-bold text-chalk" data-testid="button-contact-ok">{t('ok')}</button>
      </div>
    </Modal>
  );
}

export function BundleDialog() {
  const { t, lang } = useLang();
  const s = useStore();
  const addFlow = useAddFlow();
  const [boot, setBoot] = useState('');
  const [sock, setSock] = useState('');
  const [shin, setShin] = useState('');
  const [err, setErr] = useState(false);
  useEffect(() => { if (!s.bundleOpen) { setErr(false); } }, [s.bundleOpen]);
  const parts = BUNDLE.parts.map((id) => PRODUCTS.find((p) => p.id === id)!);
  const add = () => {
    if (!boot || !sock || !shin) { setErr(true); return; }
    addFlow({ id: BUNDLE.id, name: { ar: 'طقم يوم المباراة', en: 'Match-Day Bundle' } }, `${boot} / ${sock} / ${shin}`);
    s.setBundleOpen(false);
  };
  return (
    <Modal open={s.bundleOpen} onOpenChange={s.setBundleOpen} title={t('bundle_name')} testId="modal-bundle">
      <div className="space-y-5 p-6 pt-3">
        <ul className="space-y-2">
          {parts.map((p) => (
            <li key={p.id} className="flex items-center gap-3"><img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" /><span className="flex-1 text-sm font-semibold">{p.name[lang]}</span><span className="font-display text-sm text-stone line-through">{formatKWD(p.price, lang)}</span></li>
          ))}
        </ul>
        <SizePicker sizes={parts[0].sizes} value={boot} onChange={setBoot} label={`${t('boot_size')} (EU)`} testId="bundle-boot" />
        <SizePicker sizes={parts[1].sizes} value={sock} onChange={setSock} label={t('sock_size')} testId="bundle-sock" />
        <SizePicker sizes={parts[2].sizes} value={shin} onChange={setShin} label={t('shin_size')} testId="bundle-shin" />
        {err && <p role="alert" className="text-sm font-semibold text-destructive" data-testid="text-bundle-error">{t('size_required')}</p>}
        <div className="flex items-center justify-between rounded-xl bg-pitch p-4 text-chalk">
          <span className="text-sm">{t('bundle_price')}<span className="ms-2 text-chalk/50 line-through">{formatKWD(bundleFull, lang)}</span></span>
          <span className="font-display text-2xl font-black text-volt">{formatKWD(BUNDLE.price, lang)}</span>
        </div>
        <button onClick={add} className="w-full rounded-full bg-volt py-3.5 font-display font-extrabold text-ink hover:bg-[#d4ff4a]" data-testid="button-bundle-add">{t('add_cart')}</button>
        <p className="text-center text-xs text-stone">{t('bundle_demo')}</p>
      </div>
    </Modal>
  );
}

export function Countdown({ dark }: { dark?: boolean }) {
  const { t } = useLang();
  const c = useCountdown();
  const cells: [number, 'd' | 'h' | 'm' | 's'][] = [[c.d, 'd'], [c.h, 'h'], [c.m, 'm'], [c.s, 's']];
  return (
    <div className="flex gap-2" dir="ltr" data-testid="text-countdown" aria-live="off">
      {cells.map(([v, k]) => (
        <div key={k} className={cn('w-16 rounded-xl py-2 text-center', dark ? 'bg-ink/60' : 'bg-chalk/10')}>
          <div className="font-display text-2xl font-black tabular-nums text-chalk">{String(v).padStart(2, '0')}</div>
          <div className="text-[10px] font-bold uppercase text-chalk/60">{t(k)}</div>
        </div>
      ))}
    </div>
  );
}

type Order = { no: string; lines: ResolvedLine[]; subtotal: number; delivery: number; total: number; name: string; area: string; pay: string };

export function CheckoutDialog() {
  const { t, lang } = useLang();
  const s = useStore();
  const [order, setOrder] = useState<Order | null>(null);
  const schema = useMemo(() => z.object({
    name: z.string().trim().min(2, t('err_name')),
    phone: z.string().trim().regex(/^[4569]\d{7}$/, t('err_phone')),
    area: z.string().min(1, t('err_area')),
    pay: z.enum(['cod', 'knet', 'card', 'apple'], { errorMap: () => ({ message: t('err_pay') }) }),
  }), [t]);
  type F = z.infer<typeof schema>;
  const form = useForm<F>({ resolver: zodResolver(schema), defaultValues: { name: '', phone: '', area: '', pay: undefined as unknown as F['pay'] } });
  const tRef = useRef(form.trigger);
  tRef.current = form.trigger;
  useEffect(() => { if (form.formState.isSubmitted) void tRef.current(); }, [lang, form.formState.isSubmitted]);
  useEffect(() => { if (!s.checkoutOpen) { setOrder(null); form.reset(); } }, [s.checkoutOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = (v: F) => {
    const no = `RK-${Date.now().toString().slice(-6)}`;
    setOrder({ no, lines: s.lines, subtotal: s.subtotal, delivery: s.delivery, total: s.total, name: v.name, area: v.area, pay: v.pay });
    s.clear();
  };
  const pays = [
    { id: 'cod', icon: Banknote, label: t('pay_cod'), d: t('pay_cod_d') },
    { id: 'knet', icon: ShieldCheck, label: t('pay_knet'), d: t('pay_live_d') },
    { id: 'card', icon: CreditCard, label: t('pay_card'), d: t('pay_live_d') },
    { id: 'apple', icon: Apple, label: t('pay_apple'), d: t('pay_live_d') },
  ] as const;
  const errs = form.formState.errors;
  const payVal = form.watch('pay');
  const input = 'w-full rounded-xl border border-ink/15 bg-white/60 px-4 py-3 text-ink outline-none transition focus:border-pitch focus:ring-2 focus:ring-pitch/20';
  const summaryLines = order ? order.lines : s.lines;

  return (
    <Modal open={s.checkoutOpen} onOpenChange={s.setCheckoutOpen} title={order ? t('ok_title') : t('co_title')} className="max-w-2xl" testId="modal-checkout">
      <div className="p-6 pt-3">
        <p className="mb-4 flex items-center gap-2 rounded-lg bg-volt/35 px-3 py-2 text-xs font-semibold text-ink" data-testid="text-demo-disclaimer"><Info className="h-4 w-4 shrink-0" />{t('co_demo')}</p>
        {order && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-5 rounded-2xl bg-pitch p-6 text-center text-chalk">
            <motion.div initial={{ scale: 0, rotate: -120 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }} className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-volt text-ink">
              <CheckCircle2 className="h-9 w-9" />
            </motion.div>
            <p className="font-display text-2xl font-black" data-testid="text-order-success">{t('ok_title')}</p>
            <p className="mt-1 text-sm text-chalk/70">{t('order_no')}: <span className="font-display font-bold text-volt" dir="ltr" data-testid="text-order-number">{order.no}</span></p>
            <p className="mt-3 text-xs text-chalk/60">{t('ok_d')}</p>
          </motion.div>
        )}
        <div className="mb-5 rounded-2xl border border-ink/10 p-4">
          <p className="mb-2 flex items-center gap-2 font-display font-bold"><PackageCheck className="h-4 w-4 text-pitch" />{t('co_summary')}</p>
          <ul className="space-y-1.5 text-sm">
            {summaryLines.map((l) => (
              <li key={l.key} className="flex justify-between gap-2"><span className="min-w-0 truncate">{l.qty} × {l.name[lang]} {l.size && <span className="text-stone" dir="ltr">({l.size})</span>}</span><span className="shrink-0 font-display font-bold">{formatKWD(l.price * l.qty, lang)}</span></li>
            ))}
          </ul>
          {order ? (
            <dl className="mt-3 space-y-1 border-t border-ink/10 pt-2 text-sm">
              <div className="flex justify-between"><dt className="text-stone">{t('subtotal')}</dt><dd className="font-display font-bold">{formatKWD(order.subtotal, lang)}</dd></div>
              <div className="flex justify-between"><dt className="text-stone">{t('delivery')}</dt><dd className="font-display font-bold">{order.delivery === 0 ? t('free') : formatKWD(order.delivery, lang)}</dd></div>
              <div className="flex justify-between"><dt className="font-bold">{t('total')}</dt><dd className="font-display font-black">{formatKWD(order.total, lang)}</dd></div>
              <div className="flex justify-between pt-1"><dt className="text-stone">{t('co_name')}</dt><dd>{order.name}</dd></div>
              <div className="flex justify-between"><dt className="text-stone">{t('co_area')}</dt><dd>{AREAS.find((a) => a.en === order.area)?.[lang]}</dd></div>
              <div className="flex justify-between"><dt className="text-stone">{t('co_pay')}</dt><dd>{pays.find((p) => p.id === order.pay)?.label}</dd></div>
            </dl>
          ) : <div className="mt-3 border-t border-ink/10 pt-3"><Totals /></div>}
        </div>
        {order ? (
          <button onClick={() => s.setCheckoutOpen(false)} className="w-full rounded-full bg-volt py-3.5 font-display font-extrabold text-ink" data-testid="button-back-shop">{t('back_shop')}</button>
        ) : s.lines.length === 0 ? (
          <button onClick={() => s.setCheckoutOpen(false)} className="w-full rounded-full bg-pitch py-3.5 font-display font-bold text-chalk" data-testid="button-checkout-empty">{t('cart_empty')} — {t('continue')}</button>
        ) : (
          <form onSubmit={form.handleSubmit(submit)} noValidate className="space-y-4">
            <div>
              <label htmlFor="co-name" className="mb-1 block text-sm font-bold">{t('co_name')}</label>
              <input id="co-name" {...form.register('name')} className={input} autoComplete="name" aria-invalid={!!errs.name} data-testid="input-name" />
              {errs.name && <p role="alert" className="mt-1 text-xs font-semibold text-destructive" data-testid="error-name">{errs.name.message}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="co-phone" className="mb-1 block text-sm font-bold">{t('co_phone')}</label>
                <div className="flex" dir="ltr">
                  <span className="grid place-items-center rounded-s-xl border border-e-0 border-ink/15 bg-ink/5 px-3 font-display text-sm font-bold">+965</span>
                  <input id="co-phone" {...form.register('phone')} inputMode="numeric" maxLength={8} placeholder="5XXXXXXX" className={cn(input, 'rounded-s-none')} aria-invalid={!!errs.phone} data-testid="input-phone" />
                </div>
                {errs.phone && <p role="alert" className="mt-1 text-xs font-semibold text-destructive" data-testid="error-phone">{errs.phone.message}</p>}
              </div>
              <div>
                <label htmlFor="co-area" className="mb-1 block text-sm font-bold">{t('co_area')}</label>
                <select id="co-area" {...form.register('area')} className={input} aria-invalid={!!errs.area} data-testid="select-area">
                  <option value="">{t('co_area_ph')}</option>
                  {AREAS.map((a) => <option key={a.en} value={a.en}>{a[lang]}</option>)}
                </select>
                {errs.area && <p role="alert" className="mt-1 text-xs font-semibold text-destructive" data-testid="error-area">{errs.area.message}</p>}
              </div>
            </div>
            <fieldset>
              <legend className="mb-2 text-sm font-bold">{t('co_pay')}</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {pays.map((p) => (
                  <label key={p.id} className={cn('flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition', payVal === p.id ? 'border-pitch bg-pitch/5 ring-2 ring-pitch/20' : 'border-ink/15 hover:border-pitch/50')} data-testid={`radio-pay-${p.id}`}>
                    <input type="radio" value={p.id} {...form.register('pay')} className="sr-only" />
                    <p.icon className="h-5 w-5 text-pitch" />
                    <span className="flex-1"><span className="block text-sm font-bold">{p.label}</span><span className="block text-[11px] text-stone">{p.d}</span></span>
                    <span className={cn('grid h-5 w-5 place-items-center rounded-full border-2', payVal === p.id ? 'border-pitch bg-pitch' : 'border-ink/25')}>{payVal === p.id && <Check className="h-3 w-3 text-chalk" />}</span>
                  </label>
                ))}
              </div>
              {errs.pay && <p role="alert" className="mt-1 text-xs font-semibold text-destructive" data-testid="error-pay">{errs.pay.message}</p>}
            </fieldset>
            <button type="submit" className="w-full rounded-full bg-volt py-3.5 font-display font-extrabold text-ink transition hover:bg-[#d4ff4a] active:scale-[.98]" data-testid="button-place-order">{t('co_place')} · {formatKWD(s.total, lang)}</button>
          </form>
        )}
      </div>
    </Modal>
  );
}

export function GlobalOverlays() {
  return (
    <>
      <CartDrawer /><FavDrawer /><SearchOverlay /><QuickView /><SizeGuide /><ContactDialog /><BundleDialog /><CheckoutDialog />
    </>
  );
}
