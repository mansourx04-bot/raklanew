import { useEffect, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import { Toaster } from 'sonner';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LangProvider, useLang } from '@/lib/i18n';
import { StoreProvider } from '@/lib/store';
import { Navbar } from '@/components/rakla/Navbar';
import { Footer } from '@/components/rakla/Footer';
import { GlobalOverlays } from '@/components/rakla/Overlays';
import Home from '@/pages/Home';
import Brand from '@/pages/Brand';

const queryClient = new QueryClient();

function NotFound() {
  const { t } = useLang();
  return (
    <section className="grid min-h-[60dvh] place-items-center bg-pitch px-4 text-center text-chalk">
      <div>
        <p className="font-display text-8xl font-black text-volt">404</p>
        <p className="mt-2 font-display text-3xl font-black">{t('nf_t')}</p>
        <p className="mt-1 text-chalk/70">{t('nf_d')}</p>
        <Link href="/" className="mt-6 inline-block rounded-full bg-volt px-6 py-3 font-display font-bold text-ink" data-testid="link-404-home">{t('back_shop')}</Link>
      </div>
    </section>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/brand" component={Brand} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Shell() {
  const { dir } = useLang();
  const [loc] = useLocation();
  useEffect(() => { if (loc !== '/') window.scrollTo({ top: 0 }); }, [loc]);
  return (
    <div className="grain min-h-[100dvh] overflow-x-clip bg-background">
      <Navbar />
      <main><Router /></main>
      <Footer />
      <GlobalOverlays />
      <Toaster position={dir === 'rtl' ? 'bottom-left' : 'bottom-right'} dir={dir} richColors={false}
        toastOptions={{ classNames: { toast: '!bg-ink !text-chalk !border-volt/40 !rounded-2xl !font-sans', description: '!text-chalk/60', icon: '!text-volt' } }} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MotionConfig reducedMotion="user">
          <LangProvider>
            <StoreProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
                <Shell />
              </WouterRouter>
            </StoreProvider>
          </LangProvider>
        </MotionConfig>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
