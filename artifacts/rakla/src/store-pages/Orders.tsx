import { useEffect } from 'react';
import { Link, useLocation, useSearch } from 'wouter';
import { ArrowLeft, ArrowRight, ChevronDown, Clock3, MapPin, PackageCheck, RefreshCw, ShoppingBag } from 'lucide-react';
import { getGetMyOrdersQueryKey, getGetOrderQueryKey, useGetMyOrders, useGetOrder } from '@workspace/api-client-react';
import type { Order } from '@workspace/api-client-react';
import { useAuth } from '@/lib/auth';
import { formatKWD, useLang, useMeta } from '@/lib/i18n';
import { AREAS } from '@/lib/catalog';

export default function Orders() {
  const { lang, dir } = useLang();
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const isAr = lang === 'ar';
  const t = (ar: string, en: string) => isAr ? ar : en;
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const selectedFromQuery = new URLSearchParams(search).get('order') ?? '';
  const ordersQuery = useGetMyOrders({ query: { queryKey: getGetMyOrdersQueryKey(), enabled: !!user } });
  const orders = ordersQuery.data;
  const selectedId = selectedFromQuery || orders?.[0]?.id || '';
  const orderQuery = useGetOrder(selectedId, {
    query: { enabled: !!selectedId && !!user, queryKey: getGetOrderQueryKey(selectedId) },
  });
  const order = orderQuery.data;

  useMeta(t('طلباتي | ركلة', 'My orders | RAKLA'), t('تابع مشترياتك ومواعيد وصول معداتك.', 'Track your gear purchases and delivery details.'));

  useEffect(() => {
    if (!authLoading && !user) setLocation('/login?redirect=/orders');
  }, [authLoading, user, setLocation]);

  function selectOrder(id: string) {
    setLocation(`/orders?order=${encodeURIComponent(id)}`);
  }

  function dateLabel(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(isAr ? 'ar-KW' : 'en-KW', { dateStyle: 'medium' }).format(date);
  }

  const statusText = (status: Order['status']) => status === 'pending'
    ? t('قيد التجهيز', 'Being prepared')
    : status;

  return (
    <main dir={dir} className="min-h-[75dvh] bg-[#eeefe8] px-4 pb-16 pt-8 md:px-8 md:pt-12">
      <div className="mx-auto max-w-7xl">
        <header className="relative overflow-hidden rounded-[1.8rem] bg-pitch px-6 py-8 text-chalk md:px-10 md:py-10">
          <div className="pitch-lines absolute inset-0" />
          <div className="absolute -end-14 -top-28 h-72 w-72 rounded-full border border-chalk/10" />
          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-display text-xs font-bold uppercase tracking-[.22em] text-volt">{t('مساحة اللاعب', 'PLAYER DESK')}</p>
              <h1 className="mt-3 font-display text-4xl font-black md:text-5xl">{t('طلباتك', 'Your orders')}</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-chalk/70 md:text-base">{t('كل تجهيزاتك القادمة في مكان واحد. اختر طلباً وشوف تفاصيله.', 'Every bit of your upcoming kit, in one place. Select an order to see the details.')}</p>
            </div>
            <div className="relative flex items-center gap-3 self-start rounded-2xl border border-chalk/15 bg-chalk/5 px-4 py-3 md:self-auto">
              <PackageCheck className="h-5 w-5 text-volt" />
              <span className="text-sm font-semibold">{orders?.length ?? '—'} {t('طلبات', 'orders')}</span>
            </div>
          </div>
        </header>

        {authLoading || (user && ordersQuery.isLoading) ? (
          <div className="mt-7 grid gap-6 lg:grid-cols-[.78fr_1.22fr]" aria-label={t('جار تحميل الطلبات', 'Loading orders')} data-testid="loading-orders">
            <div className="h-[420px] animate-pulse rounded-3xl bg-[#dfe2d8]" />
            <div className="h-[420px] animate-pulse rounded-3xl bg-[#dfe2d8]" />
          </div>
        ) : user && ordersQuery.isError ? (
          <section className="mt-7 rounded-3xl border border-ink/10 bg-[#fbfbf7] px-6 py-14 text-center" data-testid="error-orders">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-pitch/8 text-pitch"><RefreshCw className="h-6 w-6" /></div>
            <h2 className="mt-5 font-display text-2xl font-black">{t('ما قدرنا نحمّل طلباتك', 'We could not load your orders')}</h2>
            <p className="mt-2 text-sm text-stone">{t('تأكد من اتصالك وحاول مرة ثانية.', 'Check your connection and try again.')}</p>
            <button type="button" onClick={() => ordersQuery.refetch()} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-pitch px-5 py-3 font-display text-sm font-bold text-chalk hover:bg-pitch-2" data-testid="button-retry-orders">
              <RefreshCw className="h-4 w-4" />{t('إعادة المحاولة', 'Try again')}
            </button>
          </section>
        ) : user && orders?.length === 0 ? (
          <section className="mt-7 overflow-hidden rounded-3xl border border-ink/10 bg-[#fbfbf7] px-6 py-16 text-center" data-testid="empty-orders">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-volt/30 text-pitch"><ShoppingBag className="h-7 w-7" /></div>
            <p className="mt-6 font-display text-xs font-extrabold uppercase tracking-[.2em] text-pitch">{t('مساحتك جاهزة', 'YOUR DESK IS READY')}</p>
            <h2 className="mt-2 font-display text-3xl font-black">{t('ما عندك طلبات للحين', 'No orders just yet')}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-stone">{t('أول طلب لك بيظهر هنا مع الحالة والتفاصيل. ابدأ باختيار عدّتك للمباراة القادمة.', 'Your first order will show up here with its status and full details. Start picking your kit for the next match.')}</p>
            <Link href="/" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-pitch px-6 py-3 font-display font-extrabold text-chalk hover:bg-pitch-2" data-testid="link-shop-from-empty">
              {t('تصفح المتجر', 'Browse the shop')}<Arrow className="h-4 w-4" />
            </Link>
          </section>
        ) : user ? (
          <div className="mt-7 grid items-start gap-6 lg:grid-cols-[.78fr_1.22fr]">
            <section className="overflow-hidden rounded-3xl border border-ink/10 bg-[#fbfbf7]" aria-label={t('قائمة الطلبات', 'Order list')}>
              <div className="flex items-center justify-between border-b border-ink/8 px-5 py-5 md:px-6">
                <div>
                  <h2 className="font-display text-lg font-black">{t('سجل الطلبات', 'Order history')}</h2>
                  <p className="mt-1 text-xs text-stone">{t('اختر طلباً لعرض تفاصيله', 'Choose an order to view its details')}</p>
                </div>
                <span className="rounded-full bg-pitch/7 px-3 py-1 font-mono text-xs font-bold text-pitch" data-testid="text-order-count">{orders?.length ?? 0}</span>
              </div>
              <div className="divide-y divide-ink/8">
                {orders?.map((entry) => (
                  <button type="button" key={entry.id} onClick={() => selectOrder(entry.id)} className={`w-full px-5 py-5 text-start transition hover:bg-pitch/[.035] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-pitch md:px-6 ${selectedId === entry.id ? 'bg-pitch/[.055]' : ''}`} data-testid={`button-order-${entry.id}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display font-extrabold text-ink" data-testid={`text-order-number-${entry.id}`}>#{entry.orderNumber}</p>
                        <p className="mt-1 text-xs text-stone">{dateLabel(entry.createdAt)}</p>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-volt/35 px-2.5 py-1 text-[11px] font-bold text-pitch" data-testid={`status-order-${entry.id}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-pitch" />{statusText(entry.status)}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-stone">{entry.items.length} {t('منتجات', 'items')}</span>
                      <span className="font-display text-sm font-extrabold text-ink" data-testid={`text-total-${entry.id}`}>{formatKWD(entry.total, lang)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="min-h-[420px] overflow-hidden rounded-3xl border border-ink/10 bg-[#fbfbf7]" aria-label={t('تفاصيل الطلب', 'Order details')}>
              {orderQuery.isLoading ? (
                <div className="space-y-5 p-6 md:p-8" aria-label={t('جار تحميل التفاصيل', 'Loading details')} data-testid="loading-order-detail">
                  <div className="h-8 w-48 animate-pulse rounded-lg bg-[#dfe2d8]" />
                  <div className="h-20 animate-pulse rounded-2xl bg-[#dfe2d8]" />
                  <div className="h-28 animate-pulse rounded-2xl bg-[#dfe2d8]" />
                </div>
              ) : orderQuery.isError ? (
                <div className="grid min-h-[420px] place-items-center p-6 text-center" data-testid="error-order-detail">
                  <div>
                    <p className="font-display text-xl font-black">{t('تعذر فتح تفاصيل الطلب', 'Could not open this order')}</p>
                    <button type="button" onClick={() => orderQuery.refetch()} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-pitch px-4 py-2.5 text-sm font-bold text-chalk" data-testid="button-retry-order-detail">
                      <RefreshCw className="h-4 w-4" />{t('حاول مرة ثانية', 'Try again')}
                    </button>
                  </div>
                </div>
              ) : order ? (
                <>
                  <div className="border-b border-ink/8 p-5 md:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-display text-xs font-bold uppercase tracking-[.16em] text-stone">{t('رقم الطلب', 'ORDER NUMBER')}</p>
                        <h2 className="mt-1 font-display text-2xl font-black" data-testid="text-selected-order-number">#{order.orderNumber}</h2>
                      </div>
                      <div className="rounded-xl bg-volt/30 px-3 py-2 text-sm font-bold text-pitch" data-testid="status-selected-order">{statusText(order.status)}</div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-stone">
                      <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-pitch" />{dateLabel(order.createdAt)}</span>
                       <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-pitch" />{AREAS.find((area) => area.en === order.area)?.[lang] ?? order.area}</span>
                    </div>
                  </div>
                  <div className="p-5 md:p-7">
                    <h3 className="font-display text-lg font-black">{t('محتويات الطلب', 'In the bag')}</h3>
                    <div className="mt-4 divide-y divide-ink/8">
                      {order.items.map((item, index) => (
                        <article key={`${item.productId}-${item.size}-${index}`} className="flex items-center justify-between gap-4 py-4" data-testid={`row-order-item-${item.productId}-${index}`}>
                          <div className="min-w-0">
                            <p className="truncate font-display font-bold text-ink" data-testid={`text-item-name-${index}`}>{item.name[lang]}</p>
                            <p className="mt-1 text-xs text-stone">{t('المقاس', 'Size')} <b className="text-ink">{item.size || t('مقاس واحد', 'One size')}</b><span className="mx-2 text-ink/20">/</span>{t('الكمية', 'Qty')} <b className="text-ink">{item.quantity}</b></p>
                          </div>
                          <p className="shrink-0 text-sm font-bold text-ink" data-testid={`text-item-price-${index}`}>{formatKWD(item.price * item.quantity, lang)}</p>
                        </article>
                      ))}
                    </div>
                    <div className="mt-3 space-y-3 rounded-2xl bg-[#f1f2ec] p-4 md:p-5">
                      <div className="flex justify-between text-sm text-stone"><span>{t('المجموع الفرعي', 'Subtotal')}</span><span className="font-semibold text-ink">{formatKWD(order.subtotal, lang)}</span></div>
                      <div className="flex justify-between text-sm text-stone"><span>{t('التوصيل', 'Delivery')}</span><span className="font-semibold text-ink">{formatKWD(order.delivery, lang)}</span></div>
                      <div className="flex justify-between border-t border-ink/10 pt-3 font-display text-lg font-black"><span>{t('الإجمالي', 'Total')}</span><span data-testid="text-selected-order-total">{formatKWD(order.total, lang)}</span></div>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink/8 pt-5 text-sm">
                      <div><p className="text-xs text-stone">{t('طريقة الدفع', 'Payment method')}</p><p className="mt-1 font-semibold capitalize text-ink">{order.paymentMethod}</p></div>
                      <div className="text-end"><p className="text-xs text-stone">{t('الاستلام باسم', 'Deliver to')}</p><p className="mt-1 font-semibold text-ink">{order.customerName}</p></div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid min-h-[420px] place-items-center text-sm text-stone"><span>{t('اختر طلباً لعرض التفاصيل', 'Select an order to see details')}</span></div>
              )}
            </section>
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-ink/8 bg-[#fbfbf7]/70 px-5 py-4">
          <p className="text-xs leading-5 text-stone">{t('تحتاج مساعدة؟ تفاصيل الطلب تساعد فريقنا يوصلك للحل أسرع.', 'Need a hand? Your order details help our team get you sorted faster.')}</p>
          <ChevronDown className="h-4 w-4 shrink-0 rotate-[-90deg] text-pitch rtl:rotate-90" />
        </div>
      </div>
    </main>
  );
}
