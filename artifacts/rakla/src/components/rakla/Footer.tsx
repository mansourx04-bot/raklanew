import { Link } from 'wouter';
import { Instagram, MessageCircle, GraduationCap, Apple } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import { BrandLogo } from './Logo';
import { NAV, useShopNav } from './Navbar';

function PayMark({ children, label }: { children: React.ReactNode; label: string }) {
  return <span aria-label={label} className="flex h-9 min-w-14 items-center justify-center gap-1 rounded-md border border-chalk/15 bg-chalk/5 px-3 font-display text-xs font-black text-chalk/80">{children}</span>;
}

export function Footer() {
  const { t } = useLang();
  const s = useStore();
  const go = useShopNav();
  return (
    <footer className="relative overflow-hidden bg-pitch text-chalk speed-cut-top">
      <svg className="pointer-events-none absolute -end-40 top-10 h-[520px] w-[520px] opacity-[.07]" viewBox="0 0 200 200" aria-hidden><circle cx="100" cy="100" r="90" fill="none" stroke="#F5F5F0" strokeWidth="1.5" /><circle cx="100" cy="100" r="2" fill="#F5F5F0" /><path d="M100 10v180" stroke="#F5F5F0" strokeWidth="1.5" /></svg>
      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-28 md:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <BrandLogo variant="light" className="h-10" />
            <p className="mt-4 font-display text-2xl font-black text-volt">{t('slogan')}</p>
            <p className="mt-2 max-w-xs text-sm text-chalk/60">{t('aud_d')}</p>
          </div>
          <div>
            <p className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-chalk/50">{t('ft_shop')}</p>
            <ul className="space-y-2 text-sm">
              {NAV.slice(1).map((n) => <li key={n.key}><button onClick={() => go(n.target)} className="text-chalk/80 transition hover:text-volt" data-testid={`link-footer-${n.target}`}>{t(n.key)}</button></li>)}
            </ul>
          </div>
          <div>
            <p className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-chalk/50">{t('ft_help')}</p>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => s.setGuideOpen(true)} className="text-chalk/80 hover:text-volt" data-testid="link-footer-sizeguide">{t('size_guide')}</button></li>
              <li><span className="text-chalk/80">{t('trust_same')}</span></li>
              <li><span className="text-chalk/80">{t('trust_ex')}</span></li>
              <li><Link href="/brand" className="inline-flex items-center gap-1.5 font-bold text-volt hover:underline" data-testid="link-footer-brand"><GraduationCap className="h-4 w-4" />{t('ft_teacher')}</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-chalk/50">{t('ft_follow')}</p>
            <a href="https://instagram.com/rakla.kw" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-chalk/80 hover:text-volt" data-testid="link-instagram"><Instagram className="h-4 w-4" /><span dir="ltr">@rakla.kw</span></a>
            <button onClick={() => s.setContactOpen(true)} className="mt-3 flex items-center gap-2 rounded-full bg-chalk/10 px-4 py-2 text-sm font-bold transition hover:bg-volt hover:text-ink" data-testid="button-whatsapp"><MessageCircle className="h-4 w-4" />{t('ft_whatsapp')}</button>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-chalk/10 pt-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-[11px] text-chalk/45">{t('ft_pay')}</p>
            <div className="flex flex-wrap gap-2" dir="ltr">
              <PayMark label="KNET">K<span className="text-volt">NET</span></PayMark>
              <PayMark label="Visa"><span className="italic tracking-tight">VISA</span></PayMark>
              <PayMark label="Apple Pay"><Apple className="h-3.5 w-3.5" />Pay</PayMark>
            </div>
          </div>
          <p className="text-xs text-chalk/50" data-testid="text-copyright">{t('ft_copy')}</p>
        </div>
      </div>
    </footer>
  );
}
