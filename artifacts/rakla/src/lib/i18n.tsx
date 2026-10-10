import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'ar' | 'en';

const dict = {
  nav_home: ['الرئيسية', 'Home'],
  nav_boots: ['الأحذية', 'Boots'],
  nav_balls: ['الكرات', 'Balls'],
  nav_gk: ['الحراس', 'Goalkeeper'],
  nav_wear: ['الملابس', 'Wear'],
  nav_offers: ['العروض', 'Offers'],
  nav_brand: ['عن المشروع', 'About project'],
  search: ['بحث', 'Search'],
  search_ph: ['ابحث عن حذاء، كرة، قفازات…', 'Search boots, balls, gloves…'],
  search_hint: ['اكتب للبحث في كل المنتجات', 'Type to search the full catalog'],
  search_none: ['ما لقينا شي يطابق', 'Nothing matches'],
  search_try: ['جرّب:', 'Try:'],
  results: ['نتيجة', 'results'],
  favorites: ['المفضلة', 'Favorites'],
  cart: ['السلة', 'Cart'],
  menu: ['القائمة', 'Menu'],
  close: ['إغلاق', 'Close'],
  lang_switch: ['English', 'العربية'],
  slogan: ['جهّز نفسك قبل الصافرة', 'Gear up before the whistle'],
  hero_kicker: ['موسم 2026/27 · الكويت', 'Season 2026/27 · Kuwait'],
  hero_h1a: ['العب أسرع.', 'Play faster.'],
  hero_h1b: ['اضرب أقوى.', 'Strike harder.'],
  hero_sub: ['أحذية وكرات ومعدات حراس وتدريب لكل ملعب — من عشب الأكاديمية إلى صالة الفوتسال ودوري الديوانية.', 'Boots, balls, keeper and training gear for every pitch — from academy grass to futsal halls and diwaniya league nights.'],
  shop_now: ['تسوّق الآن', 'Shop now'],
  shop_pitch: ['تسوّق حسب الملعب', 'Shop by pitch'],
  trust_same: ['توصيل نفس اليوم', 'Same-day delivery'],
  trust_cod: ['الدفع عند الاستلام', 'Cash on delivery'],
  trust_ex: ['استبدال خلال ١٤ يوم', '14-day exchange'],
  cats_title: ['اختر ساحتك', 'Pick your arena'],
  cats_sub: ['ست فئات. كل شي تحتاجه قبل المباراة.', 'Six categories. Everything before kick-off.'],
  cat_all: ['الكل', 'All'],
  cat_boots: ['الأحذية', 'Boots'],
  cat_balls: ['الكرات', 'Balls'],
  cat_gk: ['الحراس', 'Goalkeeper'],
  cat_wear: ['الملابس', 'Wear'],
  cat_accessories: ['الإكسسوارات', 'Accessories'],
  cat_training: ['التدريب', 'Training'],
  items: ['منتج', 'items'],
  surf_title: ['وين تلعب؟', 'Where do you play?'],
  surf_sub: ['كل أرضية تحتاج نعل مختلف. اختر ملعبك ونصفّي لك المنتجات.', 'Every surface needs a different sole. Pick yours and we filter the gear.'],
  surf_all: ['كل الملاعب', 'All pitches'],
  FG: ['عشب طبيعي', 'Natural grass'],
  AG: ['عشب صناعي', 'Artificial grass'],
  TF: ['ترف', 'Turf'],
  IN: ['صالات وفوتسال', 'Indoor / futsal'],
  FG_d: ['مسامير مخروطية تثبّتك على العشب الطبيعي في ملاعب الأكاديميات والأندية.', 'Conical studs that bite into real grass at academy and club pitches.'],
  AG_d: ['مسامير قصيرة كثيرة توزّع الضغط وتحمي الركبة على العشب الصناعي الشائع بالكويت.', 'Many short studs spread pressure and protect knees on Kuwait’s common artificial pitches.'],
  TF_d: ['نعل مطاطي بنتوءات صغيرة للملاعب الخماسية والأسطح القاسية والتمارين.', 'Rubber nub outsole for 5-a-side cages, hard surfaces and training.'],
  IN_d: ['نعل مسطح لا يترك أثر، قبضة قوية على أرضيات الصالات والفوتسال.', 'Flat non-marking sole with sharp grip on hall and futsal floors.'],
  shop_title: ['المتجر', 'The shop'],
  shop_sub: ['منتجات أصلية من تصميم ركلة. أسعار بالدينار الكويتي.', 'Original RAKLA-designed gear. Prices in Kuwaiti dinar.'],
  sort: ['الترتيب', 'Sort'],
  sort_feat: ['المميز', 'Featured'],
  sort_low: ['السعر: من الأقل', 'Price: low to high'],
  sort_high: ['السعر: من الأعلى', 'Price: high to low'],
  sort_rating: ['الأعلى تقييماً', 'Top rated'],
  filter_search: ['تصفية بالاسم…', 'Filter by name…'],
  reset: ['إعادة الضبط', 'Reset'],
  empty_t: ['ولا منتج طابق الفلاتر', 'No gear matches these filters'],
  empty_d: ['جرّب ملعب ثاني أو فئة أوسع.', 'Try another pitch or a wider category.'],
  tag_new: ['جديد', 'New'],
  tag_best: ['الأكثر مبيعاً', 'Bestseller'],
  quick_add: ['إضافة سريعة', 'Quick add'],
  choose_size: ['اختر المقاس', 'Choose size'],
  add_cart: ['أضف إلى السلة', 'Add to cart'],
  added: ['تمت الإضافة', 'Added'],
  added_toast: ['انضاف للسلة', 'added to cart'],
  size: ['المقاس', 'Size'],
  qty: ['الكمية', 'Qty'],
  size_guide: ['دليل المقاسات المجاني', 'Free size guide'],
  size_required: ['اختر مقاس أول', 'Please pick a size first'],
  fav_add: ['أضف للمفضلة', 'Add to favorites'],
  fav_remove: ['إزالة من المفضلة', 'Remove from favorites'],
  reviews: ['تقييم', 'reviews'],
  surface: ['الأرضية', 'Surface'],
  one_size: ['مقاس واحد', 'One size'],
  view: ['عرض', 'View'],
  save: ['وفّر', 'Save'],
  cart_title: ['سلتك', 'Your cart'],
  cart_empty: ['السلة فاضية', 'Your cart is empty'],
  cart_empty_d: ['الصافرة قربت. اختر عدّتك.', 'The whistle is close. Pick your kit.'],
  fav_empty: ['ما عندك مفضلات بعد', 'No favorites yet'],
  fav_empty_d: ['اضغط القلب على أي منتج لحفظه هنا.', 'Tap the heart on any product to keep it here.'],
  remove: ['إزالة', 'Remove'],
  subtotal: ['المجموع الفرعي', 'Subtotal'],
  delivery: ['التوصيل', 'Delivery'],
  free: ['مجاني', 'Free'],
  total: ['الإجمالي', 'Total'],
  checkout: ['إتمام الطلب', 'Checkout'],
  continue: ['كمّل التسوق', 'Continue shopping'],
  free_left: ['باقي {x} للتوصيل المجاني', '{x} away from free delivery'],
  free_got: ['مبروك! التوصيل مجاني', 'Nice! Delivery is free'],
  free_rule: ['توصيل مجاني للطلبات فوق ١٥ د.ك', 'Free delivery on orders over 15 KWD'],
  bundle_kicker: ['عرض يوم المباراة', 'Match-day bundle'],
  bundle_title: ['حذاء + جوارب + واقي ساق', 'Boots + socks + shin guards'],
  bundle_sub: ['الطقم الكامل لصافرة البداية بسعر واحد أقل.', 'The full kick-off kit, one lower price.'],
  bundle_demo: ['عرض تجريبي لأغراض المشروع — العدّاد توضيحي', 'Demo offer for this school project — countdown is illustrative'],
  bundle_ends: ['ينتهي العرض خلال', 'Offer ends in'],
  bundle_cta: ['اختر المقاسات وأضف الطقم', 'Choose sizes & add bundle'],
  bundle_name: ['طقم يوم المباراة', 'Match-Day Bundle'],
  bundle_includes: ['يشمل', 'Includes'],
  separately: ['منفصلة', 'Separately'],
  bundle_price: ['سعر الطقم', 'Bundle price'],
  boot_size: ['مقاس الحذاء', 'Boot size'],
  sock_size: ['مقاس الجوارب', 'Sock size'],
  shin_size: ['مقاس الواقي', 'Shin guard size'],
  d: ['يوم', 'd'], h: ['ساعة', 'h'], m: ['دقيقة', 'm'], s: ['ثانية', 's'],
  why_title: ['ليش ركلة؟', 'Why RAKLA?'],
  why1: ['تسوّق حسب الملعب', 'Shop by surface'],
  why1d: ['FG وAG وTF وIN — نوضح لك الفرق عشان تشتري النعل الصح من أول مرة.', 'FG, AG, TF, IN — explained so you buy the right sole the first time.'],
  why2: ['دليل مقاسات مجاني', 'Free size guide'],
  why2d: ['جدول EU وطول القدم بالسنتيمتر لكل حذاء وقفاز.', 'EU sizes and foot length in cm for every boot and glove.'],
  why3: ['توصيل نفس اليوم بالكويت', 'Same-day Kuwait delivery'],
  why3d: ['اطلب قبل الظهر واستلم قبل تمرين الليل.', 'Order before noon, gear up before tonight’s session.'],
  why4: ['أطقم جاهزة بخصم', 'Ready discounted bundles'],
  why4d: ['أطقم مختارة للمباراة توفّر عليك وقت وفلوس.', 'Curated match kits that save time and money.'],
  aud_title: ['لمن نصمّم؟', 'Who we build for'],
  aud_d: ['لاعبي الأكاديميات، فرق المدارس، فرق الديوانية في نهاية الأسبوع، ولاعبي الفوتسال من ١٤ إلى ٣٥ سنة.', 'Academy players, school teams, weekend diwaniya squads and futsal players aged 14–35.'],
  sells_title: ['شنو ينباع؟', 'What sells'],
  sells_d: ['أحذية AG وTF لأن أغلب ملاعب الكويت صناعية، كرات الفوتسال، وقفازات الحراس.', 'AG and TF boots — most Kuwaiti pitches are artificial — futsal balls and keeper gloves.'],
  whyus_title: ['ليش يثقون فينا', 'Why they trust us'],
  whyus_d: ['أسعار واضحة بالدينار، استبدال سهل، ونصيحة صادقة حسب الملعب.', 'Clear KWD prices, easy exchanges and honest pitch-based advice.'],
  rev_title: ['من الملعب', 'From the pitch'],
  rev_note: ['آراء توضيحية لأغراض المشروع المدرسي', 'Illustrative reviews for this school project'],
  rev1: ['أخذت Velocity AG لدوري الديوانية، ثبات ممتاز على العشب الصناعي.', 'Got the Velocity AG for our diwaniya league — great stability on turf.'],
  rev2: ['قفازات Wall Pro مسكتها قوية حتى مع الرطوبة.', 'Wall Pro gloves keep their grip even in humid nights.'],
  rev3: ['طقم يوم المباراة وفّر عليّ، والتوصيل وصل نفس اليوم.', 'The match-day bundle saved me money and arrived the same day.'],
  rev1n: ['يوسف · السالمية', 'Yousef · Salmiya'],
  rev2n: ['حمد · الجهراء', 'Hamad · Jahra'],
  rev3n: ['سارة · مشرف', 'Sara · Mishref'],
  nl_title: ['خلك أول من يعرف', 'Be first on the pitch'],
  nl_sub: ['إصدارات جديدة وعروض الأطقم — مرة بالأسبوع، بدون إزعاج.', 'New drops and bundle deals — once a week, no spam.'],
  nl_ph: ['بريدك الإلكتروني', 'Your email'],
  nl_btn: ['اشترك', 'Subscribe'],
  nl_err: ['اكتب بريد إلكتروني صحيح', 'Enter a valid email address'],
  nl_ok: ['تم التسجيل (تجريبياً)', 'Signed up (demo)'],
  nl_ok_d: ['هذا إشعار تجريبي فقط — لم يتم إرسال أو حفظ بريدك في أي مكان.', 'Demo acknowledgement only — your email was not sent or stored anywhere.'],
  ft_shop: ['المتجر', 'Shop'],
  ft_help: ['المساعدة', 'Help'],
  ft_follow: ['تابعنا', 'Follow'],
  ft_whatsapp: ['تواصل واتساب', 'WhatsApp us'],
  ft_pay: ['طرق الدفع (شعارات توضيحية غير فعّالة)', 'Payment marks (decorative, not live)'],
  ft_copy: ['© ٢٠٢٥ ركلة. مشروع مدرسي — متجر تجريبي.', '© 2025 RAKLA. School project — demo store.'],
  ft_teacher: ['لوحة الهوية للمعلّم', 'Teacher brand board'],
  contact_title: ['التواصل غير متاح', 'Contact unavailable'],
  contact_d: ['ركلة متجر تجريبي لمشروع مدرسي، لذلك لا يوجد رقم واتساب حقيقي. في متجر حقيقي هذا الزر يفتح محادثة مباشرة مع فريق المبيعات.', 'RAKLA is a demo store for a school project, so there is no real WhatsApp number. In a live store this button would open a chat with the sales team.'],
  ok: ['تمام', 'Got it'],
  co_title: ['إتمام الطلب', 'Checkout'],
  co_demo: ['متجر تجريبي — لن يتم تحصيل أي مبلغ ولن يُرسل أي طلب حقيقي.', 'Demo store — no money is collected and no real order is sent.'],
  co_summary: ['ملخص الطلب', 'Order summary'],
  co_name: ['الاسم الكامل', 'Full name'],
  co_phone: ['رقم الهاتف', 'Phone number'],
  co_area: ['المنطقة', 'Area'],
  co_area_ph: ['اختر منطقتك', 'Choose your area'],
  co_pay: ['طريقة الدفع', 'Payment method'],
  pay_cod: ['الدفع عند الاستلام', 'Cash on delivery'],
  pay_cod_d: ['تجريبي — لا يوجد مندوب حقيقي', 'Demo — no real courier'],
  pay_knet: ['كي نت', 'KNET'],
  pay_card: ['بطاقة Visa', 'Visa card'],
  pay_apple: ['Apple Pay', 'Apple Pay'],
  pay_live_d: ['تجريبي — غير متصل ببوابة دفع', 'Demo — not connected to a gateway'],
  co_place: ['تأكيد الطلب التجريبي', 'Place demo order'],
  err_name: ['اكتب اسمك (حرفين على الأقل)', 'Enter your name (at least 2 letters)'],
  err_phone: ['رقم كويتي من ٨ أرقام يبدأ بـ ٤ أو ٥ أو ٦ أو ٩', 'Kuwaiti number: 8 digits starting with 4, 5, 6 or 9'],
  err_area: ['اختر المنطقة', 'Choose an area'],
  err_pay: ['اختر طريقة الدفع', 'Choose a payment method'],
  ok_title: ['تم استلام طلبك', 'Order received'],
  ok_d: ['هذا تأكيد تجريبي داخل المتصفح فقط — لم يتم شحن أو تحصيل أي شيء.', 'This is an in-browser demo confirmation only — nothing will ship and nothing was charged.'],
  order_no: ['رقم الطلب', 'Order number'],
  back_shop: ['رجوع للمتجر', 'Back to the shop'],
  sg_title: ['دليل المقاسات', 'Size guide'],
  sg_d: ['قس طول قدمك من الكعب لأطول إصبع وقت المساء، وأضف ٠.٥ سم للراحة.', 'Measure heel to longest toe in the evening and add 0.5 cm for comfort.'],
  sg_foot: ['طول القدم (سم)', 'Foot length (cm)'],
  sg_wear: ['الملابس — محيط الصدر (سم)', 'Wear — chest (cm)'],
  sg_glove: ['القفازات — محيط الكف (سم)', 'Gloves — palm circumference (cm)'],
  nf_t: ['تسلل!', 'Offside!'],
  nf_d: ['هذي الصفحة مو موجودة.', 'This page doesn’t exist.'],
};

export type TKey = keyof typeof dict;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; toggle: () => void; t: (k: TKey, vars?: Record<string, string>) => string; dir: 'rtl' | 'ltr' };
const LangCtx = createContext<Ctx | null>(null);

function readLang(): Lang {
  try {
    const v = localStorage.getItem('rakla:lang');
    return v === 'en' ? 'en' : 'ar';
  } catch {
    return 'ar';
  }
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem('rakla:lang', lang); } catch { /* ignore */ }
  }, [lang]);
  const t = useCallback((k: TKey, vars?: Record<string, string>) => {
    let s = dict[k]?.[lang === 'ar' ? 0 : 1] ?? k;
    if (vars) for (const [a, b] of Object.entries(vars)) s = s.replace(`{${a}}`, b);
    return s;
  }, [lang]);
  const value: Ctx = { lang, setLang: setLangState, toggle: () => setLangState((l) => (l === 'ar' ? 'en' : 'ar')), t, dir: lang === 'ar' ? 'rtl' : 'ltr' };
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const c = useContext(LangCtx);
  if (!c) throw new Error('useLang outside provider');
  return c;
}

export function formatKWD(n: number, lang: Lang) {
  return lang === 'ar' ? `${n.toFixed(3)} د.ك` : `KWD ${n.toFixed(3)}`;
}

export function useMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    const set = (sel: string, attr: string, val: string) => {
      let el = document.head.querySelector(sel) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        const [k, v] = attr.split('=');
        el.setAttribute(k, v);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    };
    set('meta[name="description"]', 'name=description', description);
    set('meta[property="og:title"]', 'property=og:title', title);
    set('meta[property="og:description"]', 'property=og:description', description);
    set('meta[name="twitter:title"]', 'name=twitter:title', title);
    set('meta[name="twitter:description"]', 'name=twitter:description', description);
  }, [title, description]);
}
