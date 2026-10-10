import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { BUNDLE, DELIVERY_FEE, FREE_OVER, PRODUCTS, bundleFull, type Bi, type Category, type Product, type Surface } from './catalog';

export type CartLine = { key: string; id: string; size: string; qty: number };
export type ResolvedLine = CartLine & { name: Bi; price: number; image: string; isBundle: boolean };

function safeRead<T>(key: string, valid: (v: unknown) => v is T, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const v = JSON.parse(raw);
    return valid(v) ? v : fallback;
  } catch {
    return fallback;
  }
}
const isLines = (v: unknown): v is CartLine[] =>
  Array.isArray(v) && v.every((l) => l && typeof l.key === 'string' && typeof l.id === 'string' && typeof l.size === 'string' && Number.isFinite(l.qty) && l.qty > 0);
const isIds = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string');

export function resolveLine(l: CartLine): ResolvedLine | null {
  if (l.id === BUNDLE.id) return { ...l, name: { ar: 'طقم يوم المباراة', en: 'Match-Day Bundle' }, price: BUNDLE.price, image: BUNDLE.image, isBundle: true };
  const p = PRODUCTS.find((x) => x.id === l.id);
  return p ? { ...l, name: p.name, price: p.price, image: p.image, isBundle: false } : null;
}

export type Filters = { category: Category | 'all'; surface: Surface | 'all'; sort: 'feat' | 'low' | 'high' | 'rating'; q: string };
export const DEFAULT_FILTERS: Filters = { category: 'all', surface: 'all', sort: 'feat', q: '' };

type Ctx = {
  lines: ResolvedLine[];
  count: number;
  subtotal: number;
  delivery: number;
  total: number;
  add: (id: string, size: string, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  favs: string[];
  toggleFav: (id: string) => void;
  bump: number;
  cartOpen: boolean; setCartOpen: (b: boolean) => void;
  favOpen: boolean; setFavOpen: (b: boolean) => void;
  searchOpen: boolean; setSearchOpen: (b: boolean) => void;
  quick: Product | null; setQuick: (p: Product | null) => void;
  checkoutOpen: boolean; setCheckoutOpen: (b: boolean) => void;
  contactOpen: boolean; setContactOpen: (b: boolean) => void;
  guideOpen: boolean; setGuideOpen: (b: boolean) => void;
  bundleOpen: boolean; setBundleOpen: (b: boolean) => void;
  filters: Filters; setFilters: (f: Partial<Filters>) => void;
};

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>(() => safeRead('rakla:cart', isLines, []));
  const [favs, setFavs] = useState<string[]>(() => safeRead('rakla:favs', isIds, []).filter((id) => PRODUCTS.some((p) => p.id === id)));
  const [bump, setBump] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quick, setQuick] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [bundleOpen, setBundleOpen] = useState(false);
  const [filters, setF] = useState<Filters>(DEFAULT_FILTERS);

  useEffect(() => { try { localStorage.setItem('rakla:cart', JSON.stringify(raw)); } catch { /* ignore */ } }, [raw]);
  useEffect(() => { try { localStorage.setItem('rakla:favs', JSON.stringify(favs)); } catch { /* ignore */ } }, [favs]);

  const lines = useMemo(() => raw.map(resolveLine).filter((x): x is ResolvedLine => !!x), [raw]);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = Math.round(lines.reduce((s, l) => s + l.qty * l.price, 0) * 1000) / 1000;
  const delivery = subtotal === 0 || subtotal > FREE_OVER ? 0 : DELIVERY_FEE;

  const add = useCallback((id: string, size: string, qty = 1) => {
    const key = `${id}|${size}`;
    setRaw((r) => {
      const ex = r.find((l) => l.key === key);
      return ex ? r.map((l) => (l.key === key ? { ...l, qty: Math.min(20, l.qty + qty) } : l)) : [...r, { key, id, size, qty }];
    });
    setBump((b) => b + 1);
  }, []);
  const setQty = useCallback((key: string, qty: number) => setRaw((r) => (qty <= 0 ? r.filter((l) => l.key !== key) : r.map((l) => (l.key === key ? { ...l, qty: Math.min(20, qty) } : l)))), []);
  const remove = useCallback((key: string) => setRaw((r) => r.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setRaw([]), []);
  const toggleFav = useCallback((id: string) => setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])), []);
  const setFilters = useCallback((f: Partial<Filters>) => setF((o) => ({ ...o, ...f })), []);

  const value: Ctx = {
    lines, count, subtotal, delivery, total: subtotal + delivery, add, setQty, remove, clear, favs, toggleFav, bump,
    cartOpen, setCartOpen, favOpen, setFavOpen, searchOpen, setSearchOpen, quick, setQuick, checkoutOpen, setCheckoutOpen,
    contactOpen, setContactOpen, guideOpen, setGuideOpen, bundleOpen, setBundleOpen, filters, setFilters,
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error('useStore outside provider');
  return c;
}

export { bundleFull };

export function useCountdown() {
  const [end] = useState(() => {
    const HOURS = 47 * 3600 * 1000 + 23 * 60 * 1000;
    const now = Date.now();
    let e = Number(safeRead<number>('rakla:bundleEnd', (v): v is number => typeof v === 'number', 0));
    if (!e || e < now || e - now > HOURS + 1000) {
      e = now + HOURS;
      try { localStorage.setItem('rakla:bundleEnd', JSON.stringify(e)); } catch { /* ignore */ }
    }
    return e;
  });
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []);
  const left = Math.max(0, end - now);
  return { d: Math.floor(left / 864e5), h: Math.floor((left / 36e5) % 24), m: Math.floor((left / 6e4) % 60), s: Math.floor((left / 1e3) % 60) };
}
