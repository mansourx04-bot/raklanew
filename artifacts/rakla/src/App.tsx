'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import { Toaster } from 'sonner';
import { Link, Route, Switch, useLocation, useRoute, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LangProvider, useLang } from '@/lib/i18n';
import { StoreProvider, useStore } from '@/lib/store';
import { AuthProvider } from '@/lib/auth';
import { Navbar } from '@/components/rakla/Navbar';
import { Footer } from '@/components/rakla/Footer';
import { GlobalOverlays } from '@/components/rakla/Overlays';
import Home from '@/store-pages/Home';
import Products from '@/store-pages/Products';
import Brand from '@/store-pages/Brand';
import { useIsMobile } from '@/hooks/use-mobile';
import { LoginPage, SignupPage } from '@/store-pages/AuthPages';
import Orders from '@/store-pages/Orders';

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
        <Route path="/products" component={Products} />
        <Route path="/products/:productId" component={ProductDetailRoute} />
        <Route path="/cart" component={CartRoute} />
        <Route path="/brand" component={Brand} />
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/orders" component={Orders} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function ProductDetailRoute() {
  const [, params] = useRoute('/products/:productId');
  const store = useStore();
  useEffect(() => {
    const product = store.products.find((item) => item.id === params?.productId);
    if (product) store.setQuick(product);
  }, [params?.productId, store.products, store.setQuick]);
  return <Home />;
}

function CartRoute() {
  const store = useStore();
  useEffect(() => { store.setCartOpen(true); }, [store.setCartOpen]);
  return <Home />;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Shell() {
  const { dir } = useLang();
  const isMobile = useIsMobile();
  const [loc] = useLocation();
  useEffect(() => { if (loc !== '/') window.scrollTo({ top: 0 }); }, [loc]);
  return (
    <div className="grain min-h-[100dvh] overflow-x-clip bg-background">
      <Navbar />
      <main><Router /></main>
      <Footer />
      <GlobalOverlays />
      <Toaster position={isMobile ? 'top-center' : dir === 'rtl' ? 'bottom-left' : 'bottom-right'} mobileOffset={{ top: 'calc(env(safe-area-inset-top) + 80px)', left: 16, right: 16 }} dir={dir} richColors={false}
        toastOptions={{ classNames: { toast: '!bg-ink !text-chalk !border-volt/40 !rounded-2xl !font-sans', description: '!text-chalk/60', icon: '!text-volt' } }} />
    </div>
  );
}

function App({ initialPath = '/' }: { initialPath?: string }) {
  const [queryClient] = useState(() => new QueryClient());
  const routerBase = initialPath === '/rakla' || initialPath.startsWith('/rakla/') ? '/rakla' : '';

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MotionConfig reducedMotion="user">
          <LangProvider>
            <AuthProvider>
              <StoreProvider>
                <WouterRouter ssrPath={initialPath} base={routerBase}>
                  <Shell />
                </WouterRouter>
              </StoreProvider>
            </AuthProvider>
          </LangProvider>
        </MotionConfig>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
